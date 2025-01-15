import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

interface HttpClient {
  get<T>(url: string, config?: object): Promise<T>;
  post<T>(url: string, data: object, config?: object): Promise<T>;
  put<T>(url: string, data: object, config?: object): Promise<T>;
  delete<T>(url: string, config?: object): Promise<T>;
}

@Injectable()
export class HttpClientService implements HttpClient {
  private readonly httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create();
  }

  async get<T>(url: string, config: object = {}): Promise<T> {
    const response = await this.httpClient.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data: object, config: object = {}): Promise<T> {
    const response = await this.httpClient.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data: object, config: object = {}): Promise<T> {
    const response = await this.httpClient.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config: object = {}): Promise<T> {
    const response = await this.httpClient.delete(url, config);
    return response.data;
  }
}
