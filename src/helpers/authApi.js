import request from './request';
import { API_PATHS } from './constants';

export async function validateToken() {
  try {
    return true;
    // const token = localStorage.getItem('access_token');
    // const response = await request.post(API_PATHS.AUTH.VALIDATE, { token: token });
    // return response.data.success;
  } catch (error) {
    return false;
  }
}
