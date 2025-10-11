import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchCertifications = async () => {
  try {
    const response = await axios.get(`${API_URL}/certifications`);
    console.log("Fetched certifications:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return [];
  }
};

export const addCertification = async (certificationData: unknown) => {
  try {
    const response = await axios.post(
      `${API_URL}/certifications/add`,
      certificationData
    );
    return response.data;
  } catch (error) {
    console.error("Error adding certification:", error);
    throw error;
  }
};

export const suggestedCertifications = async (studentId: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/student/suggestion/68e9f7d66a1322d3419bc0e3`
    );
    console.log("suggested certs:", response);
    return response.data;
  } catch (error) {
    console.error("Error adding certification:", error);
    throw error;
  }
};
