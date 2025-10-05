import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL 

export const fetchCertifications = async () => {
  try {
    const response = await axios.get(`${API_URL}/certifications`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return [];
  }
};