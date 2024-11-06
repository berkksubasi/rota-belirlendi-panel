'use client';
import { useState } from 'react';
import { Tour } from '../types/Tour';

interface TourFormProps {
  onSubmit: (tourData: Tour) => Promise<void>; 
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit(tourData);
    } catch (err) {
      console.error('Error submitting tour data:', err);
      setError('Tur verileri kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg space-y-6 text-gray-800 dark:text-gray-100 transition-all duration-300"
    >
      {error && <div className="text-red-500 mb-4">{error}</div>}
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
        disabled={loading}
        className={`w-full mb-4 ${
          loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
        } dark:bg-blue-400 dark:hover:bg-blue-500 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform ${
          loading ? '' : 'hover:scale-105'
        }`}
      >
        {loading ? 'Kaydediliyor...' : 'Kaydet'}
      </button>
    </form>
  );
};

export default TourForm;
