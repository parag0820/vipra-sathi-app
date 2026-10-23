import axios from 'axios';

export interface SpiritualCardQuote {
  text: string;
  author?: string;
}

export interface SpiritualCardMantra {
  title?: string;
  text: string;
  meaning?: string;
}

export interface SpiritualCardData {
  date?: string;
  thought?: {
    title?: string;
    content?: string;
  };
  mantra?: SpiritualCardMantra;
  festival?: {
    isFestival?: boolean;
    name?: string | null;
    description?: string | null;
  };
  quote?: SpiritualCardQuote;
  language?: string;
}

export interface SpiritualCardResponse {
  success: boolean;
  message?: string;
  data: SpiritualCardData;
}

export const spiritualCardApi = {
  getTodayCard: async (): Promise<SpiritualCardData | null> => {
    try {
      const response = await axios.get<SpiritualCardResponse>(
        'https://backend.viprasaarthi.com/daily-spiritual-card/today',
        { timeout: 8000 }
      );
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.warn('Failed to fetch daily spiritual card:', error);
      return null;
    }
  },
};
