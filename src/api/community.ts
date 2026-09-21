import axios from 'axios';
import { API_BASE_URL } from './axios';

// Static IDs as requested (will be replaced with real auth IDs later)
const STATIC_USER_ID = 'STATIC_USER_123';
const STATIC_ADMIN_ID = 'STATIC_ADMIN_123';

export interface CreatePostPayload {
  title: string;
  description: string;
  type: string;
  tags?: string[];
}

export const communityApi = {
  createPost: async (data: CreatePostPayload) => {
    const payload = {
      ...data,
      userId: STATIC_USER_ID,
      adminId: STATIC_ADMIN_ID,
    };
    const response = await axios.post(`${API_BASE_URL}/community-post/create`, payload);
    return response.data;
  },

  getAllPosts: async () => {
    const response = await axios.get(`${API_BASE_URL}/community-post/get-all`);
    return response.data;
  },

  getPostById: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/community-post/get-by-id/${id}`);
    return response.data;
  },

  updatePost: async (id: string, data: CreatePostPayload) => {
    const payload = {
      ...data,
      userId: STATIC_USER_ID,
      adminId: STATIC_ADMIN_ID,
    };
    const response = await axios.put(`${API_BASE_URL}/community-post/update/${id}`, payload);
    return response.data;
  },

  deletePost: async (id: string) => {
    const response = await axios.delete(`${API_BASE_URL}/community-post/delete/${id}`);
    return response.data;
  },

  getPostsByUserId: async (userId: string) => {
    const response = await axios.get(`${API_BASE_URL}/community-post/get-by-userid/${userId}`);
    return response.data;
  },

  getPostsByAdminId: async (adminId: string) => {
    const response = await axios.get(`${API_BASE_URL}/community-post/get-by-adminid/${adminId}`);
    return response.data;
  },

  likePost: async (id: string) => {
    const payload = {
      userId: STATIC_USER_ID,
      adminId: STATIC_ADMIN_ID,
    };
    const response = await axios.post(`${API_BASE_URL}/community-post/like/${id}`, payload);
    return response.data;
  },

  unlikePost: async (id: string) => {
    const payload = {
      userId: STATIC_USER_ID,
      adminId: STATIC_ADMIN_ID,
    };
    const response = await axios.post(`${API_BASE_URL}/community-post/unlike/${id}`, payload);
    return response.data;
  },
};

export interface CreateReplyPayload {
  postId: string;
  reply: string;
}

export const communityReplyApi = {
  createReply: async (data: CreateReplyPayload) => {
    const payload = {
      ...data,
      userId: STATIC_USER_ID,
      adminId: STATIC_ADMIN_ID,
    };
    const response = await axios.post(`${API_BASE_URL}/community-reply/create`, payload);
    return response.data;
  },

  getAllReplies: async () => {
    const response = await axios.get(`${API_BASE_URL}/community-reply/get-all`);
    return response.data;
  },

  getReplyById: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/community-reply/get-by-id/${id}`);
    return response.data;
  },

  updateReply: async (id: string, reply: string) => {
    const payload = { reply };
    const response = await axios.put(`${API_BASE_URL}/community-reply/update/${id}`, payload);
    return response.data;
  },

  deleteReply: async (id: string) => {
    const response = await axios.delete(`${API_BASE_URL}/community-reply/delete/${id}`);
    return response.data;
  },

  getRepliesByUserId: async (userId: string) => {
    const response = await axios.get(`${API_BASE_URL}/community-reply/get-by-userid/${userId}`);
    return response.data;
  },

  getRepliesByAdminId: async (adminId: string) => {
    const response = await axios.get(`${API_BASE_URL}/community-reply/get-by-adminid/${adminId}`);
    return response.data;
  },
};
