import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
};

export const toggleBookmark = async (
  userId: string,
  certificationId: string
) => {
  try {
    const response = await axios.post(`${API_URL}/users/${userId}/bookmark`, {
      certificationId,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error toggling bookmark for user ${userId} and certification ${certificationId}:`,
      error
    );
    throw error;
  }
};
