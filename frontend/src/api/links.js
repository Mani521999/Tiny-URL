import { apiClient } from './client';

export async function fetchLinks() {
  const res = await apiClient.get('/links');
  return res.data.data || [];
}

export async function createLink(payload) {
  const res = await apiClient.post('/links', payload);
  return res.data.data;
}

export async function fetchLink(code) {
  const res = await apiClient.get(`/links/${code}`);
  return res.data.data;
}

export async function deleteLink(code) {
  const res = await apiClient.delete(`/links/${code}`);
  return res.data;
}
