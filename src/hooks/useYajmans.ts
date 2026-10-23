import { useState, useEffect, useCallback } from 'react';
import { Yajman, YajmanCategory } from '../types/yajman';
import { yajmanApi, YajmanApiPayload } from '../api/yajman';
import Toast from 'react-native-toast-message';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getValidUserId, isValidMongoId } from '../utils/objectId';

export const useYajmans = () => {
  const { user } = useAuth();
  const [yajmans, setYajmans] = useState<Yajman[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map API response to our local Yajman type
  const mapApiToYajman = (item: any): Yajman => ({
    id: item._id || item.id,
    name: item.name,
    email: item.email,
    callingMobile: item.callingMobileNumber,
    whatsappMobile: item.whatsappMobileNumber,
    birthday: item.birthday,
    anniversary: item.anniversary,
    yearlyProgramDate: item.yearlyFixedProgramDate,
    city: item.city,
    state: item.state,
    address: item.address,
    category: Array.isArray(item.categoryId)
      ? item.categoryId.map((c: any) => c?.categoryName || c?.name || '').filter(Boolean).join(', ')
      : (item.categoryId?.categoryName || item.categoryId?.name || item.category || 'Karmkand'),
    categoryId: Array.isArray(item.categoryId)
      ? item.categoryId.map((c: any) => c?._id || c)
      : (item.categoryId?._id ? [item.categoryId._id] : (item.categoryId ? [item.categoryId] : [])),
    kycDate: item.date || new Date().toISOString(),
    remark: item.remark,
    createdAt: item.createdAt ? new Date(item.createdAt).getTime() : Date.now(),
    updatedAt: item.updatedAt ? new Date(item.updatedAt).getTime() : Date.now(),
  });

  // Map local Yajman type to API payload
  const mapYajmanToApi = (yajmanData: Partial<Yajman>, overrideUserId?: string): Partial<YajmanApiPayload> => {
    const effectiveUserId = overrideUserId || yajmanData.userId || user?.id || (user as any)?._id || (user as any)?.userId || '';
    const payload: Partial<YajmanApiPayload> = {
      userId: effectiveUserId,
      name: yajmanData.name,
      email: yajmanData.email,
      callingMobileNumber: yajmanData.callingMobile,
      whatsappMobileNumber: yajmanData.whatsappMobile,
      birthday: yajmanData.birthday,
      anniversary: yajmanData.anniversary,
      yearlyFixedProgramDate: yajmanData.yearlyProgramDate,
      city: yajmanData.city,
      state: yajmanData.state,
      address: yajmanData.address,
      categoryId: yajmanData.categoryId && yajmanData.categoryId.length > 0 ? yajmanData.categoryId : undefined,
      date: yajmanData.kycDate,
      remark: yajmanData.remark,
    };
    // Remove undefined and empty string fields for optional attributes
    Object.keys(payload).forEach(key => {
      const val = payload[key as keyof YajmanApiPayload];
      if (val === undefined || (val === '' && key !== 'userId' && key !== 'name' && key !== 'callingMobileNumber')) {
        delete payload[key as keyof YajmanApiPayload];
      }
    });
    return payload;
  };

  // Load yajmans from API
  const loadYajmans = useCallback(async () => {
    const rawId = user?.id || (user as any)?._id || (user as any)?.userId;
    const effectiveUserId = await getValidUserId(rawId);

    try {
      setIsLoading(true);
      setError(null);
      const data = await yajmanApi.getByUserId(effectiveUserId);
      if (data && Array.isArray(data)) {
        setYajmans(data.map(mapApiToYajman));
      } else if (data && data.data && Array.isArray(data.data)) {
        setYajmans(data.data.map(mapApiToYajman));
      } else {
        setYajmans([]);
      }
    } catch (err) {
      console.error('Failed to load yajmans:', err);
      setError('Failed to load yajmans');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadYajmans();
  }, [loadYajmans]);

  const addYajman = async (yajmanData: Omit<Yajman, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const rawId = user?.id || (user as any)?._id || (user as any)?.userId || (yajmanData as any)?.userId;
      const resolvedUserId = await getValidUserId(rawId);

      const payload = mapYajmanToApi(yajmanData, resolvedUserId) as YajmanApiPayload;
      payload.userId = resolvedUserId;
      const response = await yajmanApi.create(payload);
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Yajman entry created successfully',
      });
      
      await loadYajmans(); // Refresh list from server
      return response;
    } catch (err) {
      console.error('Failed to create yajman:', err);
      throw err;
    }
  };

  const updateYajman = async (id: string, yajmanData: Partial<Yajman>) => {
    try {
      const payload = mapYajmanToApi(yajmanData);
      await yajmanApi.update(id, payload);
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Yajman entry updated successfully',
      });
      
      await loadYajmans();
    } catch (err) {
      console.error('Failed to update yajman:', err);
      throw err;
    }
  };

  const deleteYajman = async (id: string) => {
    try {
      await yajmanApi.delete(id);
      Toast.show({
        type: 'success',
        text1: 'Deleted',
        text2: 'Yajman removed',
      });
      await loadYajmans();
    } catch (err) {
      console.error('Failed to delete yajman:', err);
      throw err;
    }
  };
  
  const getUpcomingEvents = useCallback(() => {
    if (!yajmans.length) return [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Look ahead 30 days max
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    type Event = {
      id: string;
      yajmanId: string;
      yajmanName: string;
      type: 'birthday' | 'anniversary' | 'yearlyProgram';
      date: Date;
      title: string;
      daysRemaining: number;
    };
    
    let events: Event[] = [];
    
    const parseMonthDay = (dateStr?: string) => {
      if (!dateStr) return null;
      const parts = dateStr.split('-'); // Assuming YYYY-MM-DD
      if (parts.length >= 3) {
        return { month: parseInt(parts[1], 10) - 1, day: parseInt(parts[2], 10) };
      }
      return null;
    };
    
    yajmans.forEach(yajman => {
      const dates = [
        { type: 'birthday' as const, value: yajman.birthday, title: 'Birthday' },
        { type: 'anniversary' as const, value: yajman.anniversary, title: 'Anniversary' },
        { type: 'yearlyProgram' as const, value: yajman.yearlyProgramDate, title: yajman.yearlyProgramName || 'Yearly Program' }
      ];
      
      dates.forEach(d => {
        const md = parseMonthDay(d.value);
        if (md) {
          // Check this year
          let eventDate = new Date(today.getFullYear(), md.month, md.day);
          
          // If it passed this year, check next year
          if (eventDate < today) {
             eventDate = new Date(today.getFullYear() + 1, md.month, md.day);
          }
          
          if (eventDate >= today && eventDate <= thirtyDaysFromNow) {
            const diffTime = Math.abs(eventDate.getTime() - today.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            events.push({
              id: `${yajman.id}-${d.type}`,
              yajmanId: yajman.id,
              yajmanName: yajman.name,
              type: d.type,
              date: eventDate,
              title: d.title,
              daysRemaining: diffDays
            });
          }
        }
      });
    });
    
    // Sort by nearest date
    return events.sort((a, b) => a.daysRemaining - b.daysRemaining);
  }, [yajmans]);

  return {
    yajmans,
    isLoading,
    error,
    addYajman,
    updateYajman,
    deleteYajman,
    refreshYajmans: loadYajmans,
    upcomingEvents: getUpcomingEvents(),
  };
};
