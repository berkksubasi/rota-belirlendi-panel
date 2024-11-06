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

  const id = params.id && Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (!id) {
      setError("Hata: 'id' parametresi geçersiz veya bulunamadı.");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetchTour(id);
        if (!response || !response.data) {
          throw new Error('Geçersiz yanıt formatı');
        }

        // Veriyi güvenli bir şekilde işleyin, örneğin null/undefined kontrolleriyle
        const tourData = Array.isArray(response.data) ? response.data[0] : response.data;
        setTour({
          _id: tourData._id?.$oid || tourData._id || 'Bilinmiyor',
          name: tourData.name || 'Adı belirtilmemiş',
          details: tourData.details || 'Detaylar belirtilmemiş',
          date: tourData.date?.$date
            ? new Date(tourData.date.$date).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : tourData.date
            ? new Date(tourData.date).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : 'Tarih belirtilmemiş',
          price: tourData.price || 0,
          img: tourData.img || '',
          includes: Array.isArray(tourData.includes) ? tourData.includes : [],
          excludes: Array.isArray(tourData.excludes) ? tourData.excludes : [],
        });
        setError(null);
      } catch (error: any) {
        console.error('Fetch error:', error);
        const errorMessage = error.response?.status === 404
          ? "Bu ID ile ilgili bir tur bulunamadı."
          : `ID ${id} ile tur yüklenemedi. Detaylar: ${error.message || 'Bilinmeyen hata'}`;
        setError(errorMessage);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!id) {
      setError("Hata: Silme için geçersiz 'id' parametresi!");
      return;
    }

    const confirmDelete = window.confirm("Bu turu silmek istediğinize emin misiniz?");
    if (!confirmDelete) return;

    try {
      await deleteTour(id);
      router.push('/');
    } catch (error) {
      console.error(`Hata: ID ${id} ile tur silinemedi. Detaylar:`, error);
      setError('Tur silme işlemi başarısız oldu. Lütfen tekrar deneyin.');
    }
  };

  const handleUpdate = async (updatedTour: Tour) => {
    if (!id) {
      setError("Hata: Güncelleme için geçersiz 'id' parametresi!");
      return;
    }

    try {
      await updateTour(id, updatedTour);
      setEditMode(false);
      const updatedTourData = await fetchTour(id);
      if (!updatedTourData || !updatedTourData.data) {
        throw new Error('Güncellenmiş tur bilgisi alınamadı');
      }
      const tourData = Array.isArray(updatedTourData.data) ? updatedTourData.data[0] : updatedTourData.data;

      setTour({
        _id: tourData._id?.$oid || tourData._id || 'Bilinmiyor',
        name: tourData.name || 'Adı belirtilmemiş',
        details: tourData.details || 'Detaylar belirtilmemiş',
        date: tourData.date?.$date
          ? new Date(tourData.date.$date).toLocaleDateString('tr-TR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : tourData.date
          ? new Date(tourData.date).toLocaleDateString('tr-TR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : 'Tarih belirtilmemiş',
        price: tourData.price || 0,
        img: tourData.img || '',
        includes: Array.isArray(tourData.includes) ? tourData.includes : [],
        excludes: Array.isArray(tourData.excludes) ? tourData.excludes : [],
      });
    } catch (error) {
      console.error(`Hata: ID ${id} ile tur güncellenemedi. Detaylar:`, error);
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
            <p className="mb-4"><strong>Çıkış Tarihi:</strong> {tour.date}</p>
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
