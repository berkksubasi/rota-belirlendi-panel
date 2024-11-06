'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tour } from '../../../types/Tour';
import { fetchTours } from '../../../utils/api';

const Panel: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);

  useEffect(() => {
    fetchTours()
      .then((response) => setTours(response.data))
      .catch((error) => console.error('Error fetching tours:', error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Tur Yönetim Paneli</h1>
      <Link href="/tours/new" className="bg-blue-600 dark:bg-blue-500 text-white py-2 px-4 rounded-lg transition duration-300 hover:bg-blue-700 dark:hover:bg-blue-600">Yeni Tur Ekle</Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {tours.map((tour) => (
          <div key={tour._id} className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md p-4 transition-transform transform hover:scale-105">
            <Image src={tour.img || '/default-image.jpg'} alt={tour.name} width={400} height={250} className="rounded-md mb-4" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{tour.name}</h2>
            <p className="text-gray-600 dark:text-gray-300">{tour.details}</p>
            <Link href={`/tours/${tour._id}`} className="text-blue-600 dark:text-blue-400">Detayları Gör</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Panel;
