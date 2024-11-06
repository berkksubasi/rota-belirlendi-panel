import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchTours = () => axios.get(`${API_URL}/tours`);
export const fetchTour = (id: string) => axios.get(`${API_URL}/tours/${id}`);
export const createTour = (tourData: any) => axios.post(`${API_URL}/tours`, tourData);
export const updateTour = (id: string, tourData: any) => axios.put(`${API_URL}/tours/${id}`, tourData);
export const deleteTour = (id: string) => axios.delete(`${API_URL}/tours/${id}`);
