import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const fetchChats = async (token) => {
  const response = await axios.get(`${API_URL}/messages/chats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchActiveUsers = async (token) => {
  const response = await axios.get(`${API_URL}/ws/active-users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchMessageHistory = async (token, user) => {
  const response = await axios.get(`${API_URL}/messages/direct`, {
    params: { user },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const registerUser = async (username, password) => {
  await axios.post(`${API_URL}/register`, { username, password });
};

export const loginUser = async (username, password) => {
  const response = await axios.post(`${API_URL}/login`, { username, password });
  return response.data;
};


