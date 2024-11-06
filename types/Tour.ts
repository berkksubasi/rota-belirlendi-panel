export type Tour = {
    _id: string;
    img?: string;
    name: string;
    details: string;
    date: string;
    price?: number;
    includes: string[];
    excludes: string[];
  };  