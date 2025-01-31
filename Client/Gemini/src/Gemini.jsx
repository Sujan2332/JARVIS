import axios from 'axios';

const geminiAPI = axios.create({
  baseURL: import.meta.env.VITE_BACKEND , // Make sure your backend is running on this port
});

export const fetchGeminiData = async (data) => {
  try {
    const response = await geminiAPI.post('/request-gemini', data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data from Gemini AI", error);
    throw error;
  }
};
