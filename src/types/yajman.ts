export interface YajmanCategory {
  _id: string;
  categoryName: string;
  [key: string]: any;
}

export interface Yajman {
  id: string;
  userId?: string;
  name: string;
  email?: string;
  callingMobile: string;
  whatsappMobile?: string;
  birthday?: string; // ISO Date string YYYY-MM-DD
  anniversary?: string; // ISO Date string YYYY-MM-DD
  yearlyProgramDate?: string; // ISO Date string YYYY-MM-DD
  yearlyProgramName?: string; // e.g. "Yearly Shraddha / Tithi"
  city?: string;
  state?: string;
  address?: string;
  category: string;
  categoryId?: string[];
  kycDate: string; // ISO Date string YYYY-MM-DD
  remark?: string;
  createdAt: number;
  updatedAt: number;
}
