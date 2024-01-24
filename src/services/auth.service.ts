import { AxiosResponse } from 'axios';
import { LoginDto } from 'src/utils/fakeDto';
import axiosClient from './axiosClient/axiosClient';

export const authService = {
  login: (payload: {
    username: string;
    password: string;
  }): Promise<AxiosResponse<LoginDto>> => {
    const url = '/auth/login';
    return axiosClient.post(url, { ...payload });
  }
};
