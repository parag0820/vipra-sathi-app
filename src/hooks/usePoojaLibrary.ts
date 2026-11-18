import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PoojaPersonalNote } from '../types/pooja';
import { INITIAL_GANESH_NOTES } from '../data/mockPoojas';
import { poojaNotesApi, formatHindiDate } from '../api/pooja';
import { useAuth } from '../context/AuthContext';
import { isValidMongoId } from '../utils/objectId';

export { formatHindiDate };

const FAVORITES_KEY = '@pooja_favorites';
const NOTES_PREFIX = '@pooja_notes_';
const PERSONAL_NOTES_PREFIX = '@pooja_personal_notes_';
const PINNED_NOTES_PREFIX = '@pooja_pinned_notes_';
const FONT_SIZE_KEY = '@pooja_font_size_offset';

export const usePoojaLibrary = (poojaId?: string) => {
  const { user, isAuthenticated, isGuest } = useAuth();
  const userScopeId = user?.id || (isGuest ? 'guest' : 'anonymous');

  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [legacyNotes, setLegacyNotes] = useState<string>('');
  const [personalNotes, setPersonalNotes] = useState<PoojaPersonalNote[]>([]);
  const [notesLoading, setNotesLoading] = useState<boolean>(false);
  const [notesRefreshing, setNotesRefreshing] = useState<boolean>(false);
  const [notesError, setNotesError] = useState<string | null>(null);
  const [isCloudNotesActive, setIsCloudNotesActive] = useState<boolean>(false);
  const [fontSizeOffset, setFontSizeOffsetState] = useState<number>(0);
  const [isReady, setIsReady] = useState(false);

  const getLocalNotesKey = useCallback(
    (pid: string) => `${PERSONAL_NOTES_PREFIX}${userScopeId}_${pid}`,
    [userScopeId]
  );

  const getPinnedNotesKey = useCallback(
    (pid: string) => `${PINNED_NOTES_PREFIX}${userScopeId}_${pid}`,
    [userScopeId]
  );

  const loadPinnedSet = useCallback(
    async (pid: string): Promise<Set<string>> => {
      try {
        const stored = await AsyncStorage.getItem(getPinnedNotesKey(pid));
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            return new Set<string>(parsed);
          }
        }
      } catch {
        // ignore storage parse error
      }
      return new Set<string>();
    },
    [getPinnedNotesKey]
  );

  const persistPinnedSet = useCallback(
    async (pid: string, pinned: Set<string>) => {
      try {
        await AsyncStorage.setItem(getPinnedNotesKey(pid), JSON.stringify(Array.from(pinned)));
      } catch (e) {
        console.error('Failed to persist pinned note ids', e);
      }
    },
    [getPinnedNotesKey]
  );

  const loadPersonalNotes = useCallback(
    async (isRefresh: boolean = false) => {
      if (!poojaId) {
        setPersonalNotes([]);
        setIsCloudNotesActive(false);
        return;
      }

      if (isRefresh) {
        setNotesRefreshing(true);
      } else {
        setNotesLoading(true);
      }
      setNotesError(null);

      try {
        const token = await AsyncStorage.getItem('auth_token');
        const useCloud = Boolean(token && !isGuest && isValidMongoId(poojaId));
        setIsCloudNotesActive(useCloud);

        if (useCloud) {
          const [apiNotes, pinnedSet] = await Promise.all([
            poojaNotesApi.getByPoojaId(poojaId),
            loadPinnedSet(poojaId),
          ]);
          const merged = apiNotes.map((note) => ({
            ...note,
            isPinned: pinnedSet.has(note.id),
          }));
          setPersonalNotes(merged);
          return;
        }

        // Local user-scoped storage fallback (for guest / offline / mock poojas)
        const notesKey = getLocalNotesKey(poojaId);
        const storedNotes = await AsyncStorage.getItem(notesKey);
        if (storedNotes) {
          setPersonalNotes(JSON.parse(storedNotes));
        } else if (poojaId === 'p1') {
          setPersonalNotes(INITIAL_GANESH_NOTES);
          await AsyncStorage.setItem(notesKey, JSON.stringify(INITIAL_GANESH_NOTES));
        } else {
          setPersonalNotes([]);
        }
      } catch (e: any) {
        console.error('Failed to load pooja notes:', e);
        setNotesError('नोट्स लोड करने में समस्या आई।');
      } finally {
        setNotesLoading(false);
        setNotesRefreshing(false);
      }
    },
    [poojaId, isGuest, loadPinnedSet, getLocalNotesKey]
  );

  useEffect(() => {
    let isMounted = true;

    const loadAll = async () => {
      try {
        const storedFavs = await AsyncStorage.getItem(FAVORITES_KEY);
        if (storedFavs && isMounted) {
          setFavorites(new Set(JSON.parse(storedFavs)));
        }

        const storedFont = await AsyncStorage.getItem(FONT_SIZE_KEY);
        if (storedFont !== null && isMounted) {
          setFontSizeOffsetState(parseFloat(storedFont) || 0);
        }

        if (poojaId) {
          const legacy = await AsyncStorage.getItem(`${NOTES_PREFIX}${poojaId}`);
          if (legacy && isMounted) {
            setLegacyNotes(legacy);
          }
          await loadPersonalNotes(false);
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
  }, [poojaId, isAuthenticated, userScopeId, loadPersonalNotes]);

  const toggleFavorite = useCallback(async (sectionId: string) => {
    setFavorites((prevFavs) => {
      const newFavs = new Set(prevFavs);
      if (newFavs.has(sectionId)) {
        newFavs.delete(sectionId);
      } else {
        newFavs.add(sectionId);
      }
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(newFavs))).catch((e) => {
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

  const persistLocalNotes = useCallback(
    async (updated: PoojaPersonalNote[]) => {
      if (!poojaId) return;
      try {
        await AsyncStorage.setItem(getLocalNotesKey(poojaId), JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to persist local personal notes', e);
      }
    },
    [poojaId, getLocalNotesKey]
  );

  const fetchSingleNoteDetail = useCallback(
    async (noteId: string): Promise<PoojaPersonalNote | null> => {
      if (!poojaId || !noteId) return null;
      const token = await AsyncStorage.getItem('auth_token');
      if (!token || isGuest || !isValidMongoId(noteId)) {
        return personalNotes.find((n) => n.id === noteId) || null;
      }

      const [detail, pinnedSet] = await Promise.all([
        poojaNotesApi.getById(noteId),
        loadPinnedSet(poojaId),
      ]);
      const merged: PoojaPersonalNote = {
        ...detail,
        isPinned: pinnedSet.has(detail.id),
      };
      setPersonalNotes((prev) =>
        prev.map((n) => (n.id === merged.id ? merged : n))
      );
      return merged;
    },
    [poojaId, isGuest, personalNotes, loadPinnedSet]
  );

  const addPersonalNote = useCallback(
    async (title: string, content: string, isPinned: boolean = false) => {
      if (!poojaId) return undefined;

      const token = await AsyncStorage.getItem('auth_token');
      const useCloud = Boolean(token && !isGuest && isValidMongoId(poojaId));

      if (useCloud) {
        const created = await poojaNotesApi.create({
          poojaId,
          title: title.trim(),
          description: content.trim(),
        });
        if (isPinned && created.id) {
          const pinnedSet = await loadPinnedSet(poojaId);
          pinnedSet.add(created.id);
          await persistPinnedSet(poojaId, pinnedSet);
        }
        const finalNote: PoojaPersonalNote = { ...created, isPinned };
        setPersonalNotes((prev) => [finalNote, ...prev]);
        return finalNote;
      }

      const newNote: PoojaPersonalNote = {
        id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        poojaId,
        userId: userScopeId,
        title: title.trim(),
        content: content.trim(),
        isPinned,
        updatedAt: formatHindiDate(new Date()),
        timestamp: Date.now(),
        isApiNote: false,
      };

      setPersonalNotes((prev) => {
        const updated = [newNote, ...prev];
        persistLocalNotes(updated);
        return updated;
      });

      return newNote;
    },
    [poojaId, isGuest, userScopeId, loadPinnedSet, persistPinnedSet, persistLocalNotes]
  );

  const updatePersonalNote = useCallback(
    async (id: string, title: string, content: string, isPinned: boolean) => {
      if (!poojaId) return undefined;

      const token = await AsyncStorage.getItem('auth_token');
      const useCloud = Boolean(token && !isGuest && isValidMongoId(poojaId) && isValidMongoId(id));

      if (useCloud) {
        const updatedNote = await poojaNotesApi.update(id, {
          title: title.trim(),
          description: content.trim(),
        });
        const pinnedSet = await loadPinnedSet(poojaId);
        if (isPinned) {
          pinnedSet.add(id);
        } else {
          pinnedSet.delete(id);
        }
        await persistPinnedSet(poojaId, pinnedSet);

        const finalNote: PoojaPersonalNote = { ...updatedNote, isPinned };
        setPersonalNotes((prev) =>
          prev.map((note) => (note.id === id ? finalNote : note))
        );
        return finalNote;
      }

      let modified: PoojaPersonalNote | undefined;
      setPersonalNotes((prev) => {
        const updated = prev.map((note) => {
          if (note.id === id) {
            modified = {
              ...note,
              title: title.trim(),
              content: content.trim(),
              isPinned,
              updatedAt: formatHindiDate(new Date()),
              timestamp: Date.now(),
            };
            return modified;
          }
          return note;
        });
        persistLocalNotes(updated);
        return updated;
      });
      return modified;
    },
    [poojaId, isGuest, loadPinnedSet, persistPinnedSet, persistLocalNotes]
  );

  const deletePersonalNote = useCallback(
    async (id: string) => {
      if (!poojaId) return;

      const token = await AsyncStorage.getItem('auth_token');
      const useCloud = Boolean(token && !isGuest && isValidMongoId(poojaId) && isValidMongoId(id));

      if (useCloud) {
        await poojaNotesApi.delete(id);
        const pinnedSet = await loadPinnedSet(poojaId);
        if (pinnedSet.has(id)) {
          pinnedSet.delete(id);
          await persistPinnedSet(poojaId, pinnedSet);
        }
        setPersonalNotes((prev) => prev.filter((note) => note.id !== id));
        return;
      }

      setPersonalNotes((prev) => {
        const updated = prev.filter((note) => note.id !== id);
        persistLocalNotes(updated);
        return updated;
      });
    },
    [poojaId, isGuest, loadPinnedSet, persistPinnedSet, persistLocalNotes]
  );

  const togglePinNote = useCallback(
    async (id: string) => {
      if (!poojaId) return;

      if (isCloudNotesActive) {
        const pinnedSet = await loadPinnedSet(poojaId);
        const nextPinned = !pinnedSet.has(id);
        if (nextPinned) {
          pinnedSet.add(id);
        } else {
          pinnedSet.delete(id);
        }
        await persistPinnedSet(poojaId, pinnedSet);
        setPersonalNotes((prev) =>
          prev.map((note) =>
            note.id === id ? { ...note, isPinned: nextPinned } : note
          )
        );
        return;
      }

      setPersonalNotes((prev) => {
        const updated = prev.map((note) => {
          if (note.id === id) {
            return {
              ...note,
              isPinned: !note.isPinned,
              updatedAt: formatHindiDate(new Date()),
            };
          }
          return note;
        });
        persistLocalNotes(updated);
        return updated;
      });
    },
    [poojaId, isCloudNotesActive, loadPinnedSet, persistPinnedSet, persistLocalNotes]
  );

  return {
    favorites,
    toggleFavorite,
    notes: legacyNotes,
    saveNotes,
    personalNotes,
    notesLoading,
    notesRefreshing,
    notesError,
    isCloudNotesActive,
    refreshPersonalNotes: loadPersonalNotes,
    fetchSingleNoteDetail,
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
