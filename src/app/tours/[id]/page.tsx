'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Tour } from '../../../../types/Tour';
import { fetchTour, updateTour, deleteTour } from '../../../../utils/api';
import TourForm from '../../../../components/TourForm';
import Image from 'next/image';

const TourDetailPage: React.FC = () => {
  const [tour, setTour] = useState<Tour | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const router = useRouter();
  const params = useParams();

  // Type check for params.id
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (!id || typeof id !== 'string') {
      setError("Hata: 'id' parametresi geçersiz veya bulunamadı.");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetchTour(id);

        if (!response || typeof response !== 'object' || !response.data) {
          throw new Error('Geçersiz yanıt formatı veya veri eksik.');
        }

        const tourData = Array.isArray(response.data) ? response.data[0] : response.data;

        if (!tourData) {
          throw new Error('Tur verisi alınamadı.');
        }

        setTour({
          _id: tourData._id?.$oid || tourData._id || 'Bilinmiyor',
          name: tourData.name || 'Adı belirtilmemiş',
          details: tourData.details || 'Detaylar belirtilmemiş',
          date: {
            start: tourData.date?.start ? new Date(tourData.date.start).toISOString() : '',
            end: tourData.date?.end ? new Date(tourData.date.end).toISOString() : '',
          },
          price: tourData.price || 0,
          img: tourData.img || '',
          includes: Array.isArray(tourData.includes) ? tourData.includes : [],
          excludes: Array.isArray(tourData.excludes) ? tourData.excludes : [],
          itinerary: tourData.itinerary || [],
          status: tourData.status || 'available',
        });
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err instanceof Error ? err.message : err);
        setError('Tur verileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!id || typeof id !== 'string') {
      setError("Hata: Silme için geçersiz 'id' parametresi!");
      return;
    }

    const confirmDelete = window.confirm("Bu turu silmek istediğinize emin misiniz?");
    if (!confirmDelete) return;

    try {
      await deleteTour(id);
      router.push('/');
    } catch (err) {
      console.error(`Hata: ID ${id} ile tur silinemedi. Detaylar:`, err instanceof Error ? err.message : err);
      setError('Tur silme işlemi başarısız oldu. Lütfen tekrar deneyin.');
    }
  };

  const handleUpdate = async (updatedTour: Tour) => {
    if (!id || typeof id !== 'string') {
      setError("Hata: Güncelleme için geçersiz 'id' parametresi!");
      return;
    }

    try {
      await updateTour(id, updatedTour);
      setEditMode(false);
      const updatedTourData = await fetchTour(id);

      if (!updatedTourData || typeof updatedTourData !== 'object' || !updatedTourData.data) {
        throw new Error('Güncellenmiş tur bilgisi alınamadı');
      }

      const tourData = Array.isArray(updatedTourData.data) ? updatedTourData.data[0] : updatedTourData.data;

      setTour({
        _id: tourData._id?.$oid || tourData._id || 'Bilinmiyor',
        name: tourData.name || 'Adı belirtilmemiş',
        details: tourData.details || 'Detaylar belirtilmemiş',
        date: {
          start: tourData.date?.start ? new Date(tourData.date.start).toLocaleDateString() : '',
          end: tourData.date?.end ? new Date(tourData.date.end).toLocaleDateString() : '',
        },
        price: tourData.price || 0,
        img: tourData.img || '',
        includes: Array.isArray(tourData.includes) ? tourData.includes : [],
        excludes: Array.isArray(tourData.excludes) ? tourData.excludes : [],
        itinerary: tourData.itinerary || [],
        status: tourData.status || 'available',
      });
    } catch (err) {
      console.error(`Hata: ID ${id} ile tur güncellenemedi. Detaylar:`, err instanceof Error ? err.message : err);
      setError('Tur güncelleme işlemi başarısız oldu. Lütfen tekrar deneyin.');
    }
  };

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!tour) {
    return <p className="text-center text-gray-600 dark:text-gray-300">Yükleniyor...</p>;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        {editMode ? (
          <TourForm initialData={tour} onSubmit={handleUpdate} />
        ) : (
          <div>
            <h1 className="text-3xl font-bold mb-4">{tour.name}</h1>
            {tour.img ? (
              <Image src={tour.img} alt={tour.name} className="w-full h-auto mb-4 rounded" />
            ) : (
              <p className="mb-4 text-gray-500">Görsel mevcut değil.</p>
            )}
            <p className="mb-4"><strong>Detaylar:</strong> {tour.details}</p>
            <p className="mb-4"><strong>Çıkış Tarihi:</strong> {tour.date.start} - {tour.date.end}</p>
            <p className="mb-4"><strong>Fiyat:</strong> {tour.price ? `${tour.price}₺` : 'Fiyat belirtilmemiş'}</p>
            {tour.includes && tour.includes.length > 0 && (
              <div className="mb-4">
                <strong>Dahil Olanlar:</strong>
                <ul className="list-disc ml-6">
                  {tour.includes.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {tour.excludes && tour.excludes.length > 0 && (
              <div className="mb-4">
                <strong>Dahil Olmayanlar:</strong>
                <ul className="list-disc ml-6">
                  {tour.excludes.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-500 dark:bg-blue-400 hover:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-md px-4 py-2 transition duration-300"
              >
                Güncelle
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 dark:bg-red-400 hover:bg-red-600 dark:hover:bg-red-500 text-white rounded-md px-4 py-2 transition duration-300"
              >
                Sil
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourDetailPage;
