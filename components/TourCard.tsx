import Image from 'next/image';
import { Tour } from '../types/Tour';

interface TourCardProps {
  tour: Tour;
}

const TourCard: React.FC<TourCardProps> = ({ tour }) => {
  return (
    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-5 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
    <div className="w-full h-48 overflow-hidden rounded-md mb-4">
      <Image
        src={tour.img || '/default-image.jpg'}
        alt={tour.name}
        width={400}
        height={250}
        className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
      />
    </div>
    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{tour.name}</h2>
    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">{tour.details}</p>
    <a href={`/tours/${tour._id}`} className="text-blue-500 dark:text-blue-400 hover:underline inline-flex items-center mt-4">
      Detayları Gör
    </a>
  </div>
  );
};

export default TourCard;
