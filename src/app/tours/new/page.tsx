'use client';

export const dynamic = "force-dynamic";

import React from 'react';
import TourForm from '../../../../components/TourForm';
import { useRouter } from 'next/navigation';
import { createTour } from '../../../../utils/api';
import { Tour } from '../../../../types/Tour';

const NewTourPage: React.FC = () => {
  const router = useRouter();

  const handleCreate = async (tourData: Tour) => {
    console.log('Submitted Tour Data:', tourData); 
    try {
      const response = await createTour(tourData);
      console.log('Tour created successfully:', response);
      router.push('/');
    } catch (error: any) {
      console.error('Error creating tour:', error);
      if (error.response) {
        console.error('Response error data:', error.response.data);
        console.error('Response status:', error.response.status);
      } else {
        console.error('An unknown error occurred:', error.message || error);
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-6 min-h-screen flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl transform transition duration-300 hover:scale-105 w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800 dark:text-gray-100 tracking-tight">
          Yeni Tur Ekle
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Yeni bir tur oluşturmak için bilgileri eksiksiz doldurun. Detaylar ekledikten sonra kaydedebilirsiniz.
        </p>
        <TourForm onSubmit={handleCreate} />
      </div>
    </div>
  );
};

export default NewTourPage;
