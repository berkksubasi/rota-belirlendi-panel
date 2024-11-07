export type Tour = {
  _id: string;
  img?: string;
  name: string;
  details: string;
  date: {
    start: string;
    end: string;
  };
  price: number;
  includes: string[];
  excludes: string[];
  itinerary: {
    day: number;
    activities: string[];
  }[];
  status: 'available' | 'unavailable';
};
