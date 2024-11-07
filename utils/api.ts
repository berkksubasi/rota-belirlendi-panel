import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('API_URL is not defined. Please check your environment variables.');
}


export const fetchTours = async () => {
  try {
    const response = await axios.get(`${API_URL}/tours`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tours:', error);
    throw error;
  }
};

export const fetchTour = async (id: string) => {
  if (!id) {
    throw new Error('fetchTour requires a valid id');
  }
  try {
    const response = await axios.get(`${API_URL}/tours/${id}`);
    if (
      response.headers['content-type'] &&
      !response.headers['content-type'].includes('application/json')
    ) {
      throw new Error('Unexpected response format. Expected JSON.');
    }
    
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(`Error fetching tour with id ${id}: ${errorMessage}`);
    throw new Error(`Failed to fetch tour: ${errorMessage}`);
  }
};


export const createTour = async (tourData: any) => {
  try {
    const response = await axios.post(`${API_URL}/tours`, tourData);
    return response.data;
  } catch (error) {
    console.error('Error creating tour:', error);
    throw error;
  }
};

export const updateTour = async (id: string, tourData: any) => {
  if (!id) {
    throw new Error('updateTour requires a valid id');
  }
  try {
    const response = await axios.put(`${API_URL}/tours/${id}`, tourData);
    return response.data;
  } catch (error) {
    console.error(`Error updating tour with id ${id}:`, error);
    throw error;
  }
};

export const deleteTour = async (id: string) => {
  if (!id) {
    throw new Error('deleteTour requires a valid id');
  }
  try {
    const response = await axios.delete(`${API_URL}/tours/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting tour with id ${id}:`, error);
    throw error;
  }
};
