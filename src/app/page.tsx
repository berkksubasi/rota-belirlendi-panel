'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tour } from '../../types/Tour';
import { fetchTours } from '../../utils/api';

const Home: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null); // Hata durumunu sıfırla
      try {
        const response = await fetchTours();
        if (response.data && Array.isArray(response.data)) {
          setTours(response.data);
        } else {
          console.error('Beklenmeyen veri formatı:', response.data);
          setError('Geçersiz veri formatı alındı.');
          setTours([]);
        }
      } catch (error) {
        console.error('Error fetching tours:', error);
        setError('Turlar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600">Yükleniyor...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!tours || tours.length === 0) {
    return <p className="text-center text-gray-500">Gösterilecek tur bulunamadı.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-8">Tur Yönetim Paneli</h1>
        <div className="flex justify-end mb-8">
          <Link href="/tours/new">
            <i className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold shadow-lg transition duration-300 transform hover:scale-105">
              + Yeni Tur Ekle
            </i>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <div key={tour._id} className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow hover:shadow-xl p-6 transition-transform transform hover:scale-105">
              <Link href={`/tours/${tour._id}`}>
                <i>
                  <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">{tour.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{tour.details}</p>
                  <span className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">Detayları Gör</span>
                </i>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
