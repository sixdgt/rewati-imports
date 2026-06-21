import axios from 'axios';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.INTERNAL_API_URL || 'http://127.0.0.1:8000/api';

export async function getServerApi() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  return axios.create({
    baseURL: `${API_BASE_URL}/`,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}