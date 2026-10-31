import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PoojaPersonalNote } from '../types/pooja';
import { INITIAL_GANESH_NOTES } from '../data/mockPoojas';

const FAVORITES_KEY = '@pooja_favorites';
const NOTES_PREFIX = '@pooja_notes_';
const PERSONAL_NOTES_PREFIX = '@pooja_personal_notes_';
const FONT_SIZE_KEY = '@pooja_font_size_offset';

export const formatHindiDate = (date: Date = new Date()): string => {
  const monthsHindi = [
    'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
  ];
  const day = date.getDate();
  const month = monthsHindi[date.getMonth()];
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day} ${month} • ${hours}:${minutes}`;
};

export const usePoojaLibrary = (poojaId?: string) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [legacyNotes, setLegacyNotes] = useState<string>('');
  const [personalNotes, setPersonalNotes] = useState<PoojaPersonalNote[]>([]);
  const [fontSizeOffset, setFontSizeOffsetState] = useState<number>(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadAll = async () => {
      try {
        // Load favorites
        const storedFavs = await AsyncStorage.getItem(FAVORITES_KEY);
        if (storedFavs && isMounted) {
          setFavorites(new Set(JSON.parse(storedFavs)));
        }

        // Load font size preference
        const storedFont = await AsyncStorage.getItem(FONT_SIZE_KEY);
        if (storedFont !== null && isMounted) {
          setFontSizeOffsetState(parseFloat(storedFont) || 0);
        }

        // Load personal notes
        if (poojaId) {
          const notesKey = `${PERSONAL_NOTES_PREFIX}${poojaId}`;
          const storedNotes = await AsyncStorage.getItem(notesKey);
          if (storedNotes && isMounted) {
            setPersonalNotes(JSON.parse(storedNotes));
          } else if (poojaId === 'p1' && isMounted) {
            // Seed initial mock notes for Ganesh Pooja to match screenshot
            setPersonalNotes(INITIAL_GANESH_NOTES);
            await AsyncStorage.setItem(notesKey, JSON.stringify(INITIAL_GANESH_NOTES));
          }

          // Legacy notes support
          const legacy = await AsyncStorage.getItem(`${NOTES_PREFIX}${poojaId}`);
          if (legacy && isMounted) {
            setLegacyNotes(legacy);
          }
        }
      } catch (e) {
        console.error('Failed to load pooja library data', e);
      } finally {
        if (isMounted) setIsReady(true);
      }
    };

    loadAll();

    return () => {
      isMounted = false;
    };
  }, [poojaId]);

  const toggleFavorite = useCallback(async (sectionId: string) => {
    setFavorites(prevFavs => {
      const newFavs = new Set(prevFavs);
      if (newFavs.has(sectionId)) {
        newFavs.delete(sectionId);
      } else {
        newFavs.add(sectionId);
      }
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(newFavs))).catch(e => {
        console.error('Failed to save favorites', e);
      });
      return newFavs;
    });
  }, []);

  const saveNotes = useCallback(async (id: string, newNotes: string) => {
    setLegacyNotes(newNotes);
    try {
      await AsyncStorage.setItem(`${NOTES_PREFIX}${id}`, newNotes);
    } catch (e) {
      console.error('Failed to save legacy notes', e);
    }
  }, []);

  const setFontSizeOffset = useCallback(async (offset: number) => {
    const clamped = Math.max(-2, Math.min(6, offset));
    setFontSizeOffsetState(clamped);
    try {
      await AsyncStorage.setItem(FONT_SIZE_KEY, clamped.toString());
    } catch (e) {
      console.error('Failed to save font size', e);
    }
  }, []);

  const increaseFontSize = useCallback(() => {
    setFontSizeOffset(fontSizeOffset + 1);
  }, [fontSizeOffset, setFontSizeOffset]);

  const decreaseFontSize = useCallback(() => {
    setFontSizeOffset(fontSizeOffset - 1);
  }, [fontSizeOffset, setFontSizeOffset]);

  const persistPersonalNotes = async (updated: PoojaPersonalNote[]) => {
    if (!poojaId) return;
    try {
      await AsyncStorage.setItem(`${PERSONAL_NOTES_PREFIX}${poojaId}`, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to persist personal notes', e);
    }
  };

  const addPersonalNote = useCallback(async (title: string, content: string, isPinned: boolean = false) => {
    if (!poojaId) return;
    const newNote: PoojaPersonalNote = {
      id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      poojaId,
      title: title.trim(),
      content: content.trim(),
      isPinned,
      updatedAt: formatHindiDate(new Date()),
      timestamp: Date.now(),
    };

    setPersonalNotes(prev => {
      const updated = [newNote, ...prev];
      persistPersonalNotes(updated);
      return updated;
    });

    return newNote;
  }, [poojaId]);

  const updatePersonalNote = useCallback(async (id: string, title: string, content: string, isPinned: boolean) => {
    if (!poojaId) return;
    setPersonalNotes(prev => {
      const updated = prev.map(note => {
        if (note.id === id) {
          return {
            ...note,
            title: title.trim(),
            content: content.trim(),
            isPinned,
            updatedAt: formatHindiDate(new Date()),
            timestamp: Date.now(),
          };
        }
        return note;
      });
      persistPersonalNotes(updated);
      return updated;
    });
  }, [poojaId]);

  const deletePersonalNote = useCallback(async (id: string) => {
    if (!poojaId) return;
    setPersonalNotes(prev => {
      const updated = prev.filter(note => note.id !== id);
      persistPersonalNotes(updated);
      return updated;
    });
  }, [poojaId]);

  const togglePinNote = useCallback(async (id: string) => {
    if (!poojaId) return;
    setPersonalNotes(prev => {
      const updated = prev.map(note => {
        if (note.id === id) {
          return {
            ...note,
            isPinned: !note.isPinned,
            updatedAt: formatHindiDate(new Date()),
          };
        }
        return note;
      });
      persistPersonalNotes(updated);
      return updated;
    });
  }, [poojaId]);

  return {
    favorites,
    toggleFavorite,
    notes: legacyNotes,
    saveNotes,
    personalNotes,
    addPersonalNote,
    updatePersonalNote,
    deletePersonalNote,
    togglePinNote,
    fontSizeOffset,
    setFontSizeOffset,
    increaseFontSize,
    decreaseFontSize,
    isReady,
  };
};
