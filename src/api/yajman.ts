import { axiosInstance } from './axios';
import { getValidUserId, isValidMongoId } from '../utils/objectId';

export interface YajmanApiPayload {
  userId: string;
  name: string;
  email?: string;
  callingMobileNumber: string;
  whatsappMobileNumber?: string;
  birthday?: string;
  anniversary?: string;
  yearlyFixedProgramDate?: string;
  city?: string;
  state?: string;
  address?: string;
  categoryId?: string[]; 
  date?: string; // kycDate
  remark?: string;
}

export const yajmanApi = {
  create: async (data: YajmanApiPayload) => {
    data.userId = await getValidUserId(data.userId);

    if (data.categoryId && Array.isArray(data.categoryId)) {
      data.categoryId = data.categoryId.filter((id) => isValidMongoId(id));
      if (data.categoryId.length === 0) {
        delete data.categoryId;
      }
    }

    const response = await axiosInstance.post('/yajman-entry/create', data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<YajmanApiPayload>) => {
    if (data.userId) {
      data.userId = await getValidUserId(data.userId);
    }
    if (data.categoryId && Array.isArray(data.categoryId)) {
      data.categoryId = data.categoryId.filter((catId) => isValidMongoId(catId));
      if (data.categoryId.length === 0) {
        delete data.categoryId;
      }
    }
    const response = await axiosInstance.put(`/yajman-entry/update/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/yajman-entry/delete/${id}`);
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await axiosInstance.get(`/yajman-entry/get-by-id/${id}`);
    return response.data;
  },
  
  getByUserId: async (userId: string) => {
    const validId = await getValidUserId(userId);
    const response = await axiosInstance.get(`/yajman-entry/get-by-userId/${validId}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await axiosInstance.get('/yajman-category/get-all');
    return response.data;
  }
};
