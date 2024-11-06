'use client';
import { useState } from 'react';
import { Tour } from '../types/Tour';
import router from 'next/router';

interface TourFormProps {
  onSubmit: (tourData: Tour) => void;
  initialData?: Tour;
}

const TourForm: React.FC<TourFormProps> = ({ onSubmit, initialData }) => {
  const [tourData, setTourData] = useState<Tour>({
    _id: initialData?._id || '',
    name: initialData?.name || '',
    details: initialData?.details || '',
    date: initialData?.date || '',
    price: initialData?.price || 0,
    img: initialData?.img || '',
    includes: initialData?.includes || [],
    excludes: initialData?.excludes || [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTourData((prevData) => ({
      ...prevData,
      [name]: name === 'price' ? (value ? parseFloat(value) : 0) : value,
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>, fieldName: 'includes' | 'excludes') => {
    const { value } = e.target;
    setTourData((prevData) => ({
      ...prevData,
      [fieldName]: value.split('\n'),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(tourData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-lg space-y-6 text-gray-800 dark:text-gray-100 transition-all duration-300">
      <input
        name="name"
        value={tourData.name}
        onChange={handleChange}
        placeholder="Tur Adı"
        required
        className="w-full mb-4 p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-200"
      />

      <textarea
        name="details"
        value={tourData.details}
        onChange={handleChange}
        placeholder="Detaylar"
        required
        className="w-full mb-4 p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-200 resize-none"
      />

      <input
        name="date"
        type="date"
        value={tourData.date}
        onChange={handleChange}
        required
        className="w-full mb-4 p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-200"
      />

      <input
        name="price"
        type="number"
        value={tourData.price}
        onChange={handleChange}
        placeholder="Fiyat"
        required
        className="w-full mb-4 p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-200"
      />

      <input
        name="img"
        value={tourData.img}
        onChange={handleChange}
        placeholder="Görsel URL"
        className="w-full mb-4 p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-200"
      />

      <textarea
        name="includes"
        value={Array.isArray(tourData.includes) ? tourData.includes.join('\n') : ''}
        onChange={(e) => handleTextareaChange(e, 'includes')}
        placeholder="Dahil Olanlar (Her bir öğeyi yeni satıra yazın)"
        className="w-full mb-4 p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-200 resize-none"
      />

      <textarea
        name="excludes"
        value={Array.isArray(tourData.excludes) ? tourData.excludes.join('\n') : ''}
        onChange={(e) => handleTextareaChange(e, 'excludes')}
        placeholder="Dahil Olmayanlar (Her bir öğeyi yeni satıra yazın)"
        className="w-full mb-4 p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-200 resize-none"
      />

      <button
        type="submit"
        className="w-full mb-4 bg-blue-500 dark:bg-blue-400 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 dark:hover:bg-blue-500 transition-all duration-300 transform hover:scale-105"
      >
        Kaydet
      </button>
    </form>
  );
};

export default TourForm;
