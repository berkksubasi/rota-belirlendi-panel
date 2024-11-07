'use client';
import { useState } from 'react';
import { Tour } from '../types/Tour';
import InfiniteScroll from 'react-infinite-scroll-component';

interface TourFormProps {
  onSubmit: (tourData: Tour) => Promise<void>;
  initialData?: Tour;
}

const TourForm: React.FC<TourFormProps> = ({ onSubmit, initialData }) => {
  const [tourData, setTourData] = useState<Tour>({
    _id: initialData?._id || '',
    name: initialData?.name || '',
    details: initialData?.details || '',
    date: initialData?.date || { start: '', end: '' },
    price: initialData?.price || 0,
    img: initialData?.img || '',
    includes: initialData?.includes || [],
    excludes: initialData?.excludes || [],
    itinerary: initialData?.itinerary || [{ day: 1, activities: [''] }],
    status: initialData?.status || 'available',
    length: 0
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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'start' | 'end') => {
    const { value } = e.target;
    setTourData((prevData) => ({
      ...prevData,
      date: { ...prevData.date, [field]: value },
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>, fieldName: 'includes' | 'excludes') => {
    const { value } = e.target;
    setTourData((prevData) => ({
      ...prevData,
      [fieldName]: value.split('\n'),
    }));
  };

  const handleItineraryChange = (index: number, field: 'day' | 'activities', value: string | string[]) => {
    const updatedItinerary = [...tourData.itinerary];
    if (field === 'activities') {
      updatedItinerary[index].activities = typeof value === 'string' ? value.split('\n') : value;
    } else {
      updatedItinerary[index].day = parseInt(value as string) || 0;
    }
    setTourData((prevData) => ({
      ...prevData,
      itinerary: updatedItinerary,
    }));
  };

  const addItineraryItem = () => {
    setTourData((prevData) => ({
      ...prevData,
      itinerary: [...prevData.itinerary, { day: 0, activities: [''] }],
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTourData((prevData) => ({
      ...prevData,
      status: e.target.value as 'available' | 'unavailable',
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

  function fetchMoreData() {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="h-screen overflow-y-auto">

      <InfiniteScroll
        dataLength={tourData.length} // Verinin uzunluğu
        next={fetchMoreData} // Daha fazla veri almak için çağırılacak fonksiyon
        hasMore={true} // Daha fazla veri yüklenip yüklenemeyeceğini belirten boolean
        loader={<h4>Yükleniyor...</h4>}
      >
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

          <div className="mb-4">
            <label className="block mb-2">Başlangıç Tarihi</label>
            <input
              name="dateStart"
              type="date"
              value={tourData.date.start}
              onChange={(e) => handleDateChange(e, 'start')}
              required
              className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-200"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Bitiş Tarihi</label>
            <input
              name="dateEnd"
              type="date"
              value={tourData.date.end}
              onChange={(e) => handleDateChange(e, 'end')}
              required
              className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-200"
            />
          </div>

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

          <div className="mb-4">
            <label className="block mb-2">Güzergah</label>
            {tourData.itinerary.map((item, index) => (
              <div key={index} className="mb-2">
                <input
                  type="number"
                  placeholder="Gün"
                  value={item.day}
                  onChange={(e) => handleItineraryChange(index, 'day', e.target.value)}
                  className="w-full mb-1 p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none"
                />
                <textarea
                  placeholder="Aktiviteler (Her bir öğeyi yeni satıra yazın)"
                  value={item.activities.join('\n')}
                  onChange={(e) => handleItineraryChange(index, 'activities', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addItineraryItem}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Yeni Güzergah Ekle
            </button>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Durum</label>
            <select
              value={tourData.status}
              onChange={handleStatusChange}
              className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none"
            >
              <option value="available">Mevcut</option>
              <option value="unavailable">Mevcut Değil</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mb-4 ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
              } dark:bg-blue-400 dark:hover:bg-blue-500 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform ${loading ? '' : 'hover:scale-105'
              }`}
          >
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </form>
      </InfiniteScroll>
    </div>
  );
};

export default TourForm;
