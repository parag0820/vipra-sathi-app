import { axiosInstance } from './axios';
import { GodCategory } from '../data/godCategories';
import {
  Pooja,
  PoojaApiItem,
  PoojaNoteApiItem,
  PoojaPersonalNote,
  CreatePoojaNotePayload,
  UpdatePoojaNotePayload,
} from '../types/pooja';

interface PoojaNoteListApiResponse {
  success?: boolean;
  message?: string;
  count?: number;
  data?: PoojaNoteApiItem[];
}

interface PoojaNoteDetailApiResponse {
  success?: boolean;
  message?: string;
  data?: PoojaNoteApiItem;
}

export const formatHindiDate = (date: Date = new Date()): string => {
  const monthsHindi = [
    'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर',
  ];
  const day = date.getDate();
  const month = monthsHindi[date.getMonth()];
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day} ${month} • ${hours}:${minutes}`;
};

export const mapApiNoteToPersonalNote = (
  item: PoojaNoteApiItem,
  pinnedSet?: Set<string>
): PoojaPersonalNote => {
  const id = item._id || item.id || '';
  const dateSource = item.updatedAt || item.createdAt;
  const parsedDate = dateSource ? new Date(dateSource) : new Date();
  const safeDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

  return {
    id,
    poojaId: item.poojaId,
    userId: item.userId,
    title: item.title || '',
    content: item.description || '',
    isPinned: pinnedSet ? pinnedSet.has(id) : false,
    updatedAt: formatHindiDate(safeDate),
    timestamp: safeDate.getTime(),
    createdAt: item.createdAt,
    isApiNote: true,
  };
};

interface PoojaListApiResponse {
  success?: boolean;
  message?: string;
  count?: number;
  data?: PoojaApiItem[];
}

interface PoojaDetailApiResponse {
  success?: boolean;
  message?: string;
  data?: PoojaApiItem;
}

/**
 * Normalizes a backend PoojaApiItem into the app's unified Pooja shape.
 */
export const mapApiToPooja = (item: PoojaApiItem): Pooja => {
  const id = item._id || item.id || '';

  const categoryObj =
    item.categoryId && typeof item.categoryId === 'object' ? item.categoryId : null;
  const subCategoryObj =
    item.subCategoryId && typeof item.subCategoryId === 'object' ? item.subCategoryId : null;

  const categoryName =
    categoryObj?.categoryName?.trim() ||
    (typeof item.categoryId === 'string' ? item.categoryId.trim() : '') ||
    'अन्य पूजा';

  const categoryId =
    categoryObj?._id ||
    (typeof item.categoryId === 'string' ? item.categoryId : undefined);

  const subCategoryName =
    subCategoryObj?.subCategoryName?.trim() ||
    (typeof item.subCategoryId === 'string' ? item.subCategoryId.trim() : '') ||
    undefined;

  const subCategoryDescription = subCategoryObj?.description?.trim() || undefined;

  const title = item.title?.trim() || 'पूजा विधि';

  const subtitleParts = [subCategoryName, subCategoryDescription].filter(
    (part): part is string => Boolean(part)
  );
  const subtitleHindi =
    subtitleParts.length > 0
      ? subtitleParts.join(' • ')
      : item.sectionType?.trim() || 'पूजन विधि';

  const breadcrumbParts = ['पूजा विधि', categoryName];
  if (subCategoryName && subCategoryName !== categoryName) {
    breadcrumbParts.push(subCategoryName);
  }

  const navAnchors = [categoryName, subCategoryName, item.sectionType?.trim()].filter(
    (val, idx, self): val is string => Boolean(val) && self.indexOf(val) === idx
  );

  return {
    id,
    title,
    headerTitle: title,
    titleHindi: title,
    subtitleHindi,
    breadcrumbs: breadcrumbParts.join('  /  '),
    navAnchors,
    category: categoryName,
    categoryId,
    subCategory: subCategoryName,
    subCategoryDescription,
    sectionType: item.sectionType?.trim() || undefined,
    content: item.content?.trim() || undefined,
    textEditor: item.textEditor?.trim() || undefined,
    completeContent: item.completeContent?.trim() || undefined,
    pdf: item.pdf?.trim() || undefined,
    isFavorite: Boolean(item.isFavorite),
    isAvailableOffline: Boolean(item.isAvailableOffline),
    isApiItem: true,
    samagriList: Array.isArray(item.samagriList) ? item.samagriList : undefined,
    stepsList: Array.isArray(item.stepsList) ? item.stepsList : undefined,
    sections: Array.isArray(item.sections) ? item.sections : undefined,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
};

const GOD_CATEGORY_MATCHERS: Record<string, RegExp[]> = {
  ganesh: [/ganesh/i, /ganpati/i, /vinayak/i, /गणेश/, /गणपति/, /विनायक/],
  shiva: [/\bshiv/i, /mahadev/i, /shankar/i, /\brudra/i, /bholenath/i, /शिव/, /महादेव/, /शंकर/, /रुद्र/],
  satyanarayan: [/satyanarayan/i, /सत्यनारायण/],
  vishnu: [/vishnu/i, /narayan/i, /\bhari\b/i, /विष्णु/, /नारायण/],
  durga: [/durga/i, /bhavani/i, /ambika/i, /chandika/i, /\bdevi\b/i, /दुर्गा/, /भवानी/, /देवी/],
  lakshmi: [/lakshmi/i, /laxmi/i, /लक्ष्मी/, /महालक्ष्मी/],
  saraswati: [/saraswati/i, /sharada/i, /सरस्वती/, /शारदा/],
  hanuman: [/hanuman/i, /bajrang/i, /maruti/i, /हनुमान/, /बजरंग/, /मारुति/],
  ram: [/\bram\b/i, /\brama\b/i, /raghav/i, /श्री\s*राम/, /भगवान\s*राम/, /(^|\s)राम(\s|$)/, /रामचन्द्र/],
  krishna: [/krishna/i, /kanha/i, /gopal/i, /govind/i, /कृष्ण/, /गोपाल/, /गोविन्द/, /कान्हा/],
  surya: [/surya/i, /\bsun\b/i, /aditya/i, /bhaskar/i, /सूर्य/, /आदित्य/, /भास्कर/],
  navagraha: [/navagraha/i, /navgrah/i, /\bgraha?\b/i, /\bshani\b/i, /नवग्रह/, /ग्रह/, /शनि/],
  kali: [/\bkali\b/i, /kalika/i, /mahakali/i, /काली/, /कालिका/, /महाकाली/],
  bhairav: [/bhairav/i, /भैरव/, /कालभैरव/],
  kuldevta: [/kuldev/i, /kuldevi/i, /कुलदेव/, /कुलदेवी/],
};

/**
 * Resolves which predefined GodCategory ID matches a backend pooja category string.
 * Returns null if none of the 15 deity categories match (so it maps to other_samskar).
 */
export const resolveDeityIdForPooja = (pooja: Pooja): string | null => {
  const categoryStr = pooja.category || '';
  if (!categoryStr) return null;

  // Ordered keys so specific categories ('satyanarayan', 'kuldevta') match before broader ones ('vishnu', 'durga')
  const orderedIds = [
    'ganesh',
    'shiva',
    'satyanarayan',
    'kuldevta',
    'vishnu',
    'durga',
    'lakshmi',
    'saraswati',
    'hanuman',
    'ram',
    'krishna',
    'surya',
    'navagraha',
    'kali',
    'bhairav',
  ];

  for (const deityId of orderedIds) {
    const patterns = GOD_CATEGORY_MATCHERS[deityId];
    if (patterns && patterns.some((rx) => rx.test(categoryStr))) {
      return deityId;
    }
  }

  return null;
};

export const matchesGodCategory = (pooja: Pooja, god: GodCategory): boolean => {
  if (pooja.category === god.poojaCategory) return true;

  const resolvedId = resolveDeityIdForPooja(pooja);
  if (god.id === 'other_samskar') {
    return resolvedId === null;
  }

  return resolvedId === god.id;
};

export const poojaApi = {
  getAll: async (): Promise<Pooja[]> => {
    const response = await axiosInstance.get<PoojaListApiResponse | PoojaApiItem[]>(
      '/pooja/get-all'
    );
    const payload = response.data;
    const rawList: PoojaApiItem[] = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : [];

    return rawList.map(mapApiToPooja).filter((p) => Boolean(p.id));
  },

  getById: async (id: string): Promise<Pooja> => {
    const response = await axiosInstance.get<PoojaDetailApiResponse | PoojaApiItem>(
      `/pooja/get-by-id/${id}`
    );
    const payload = response.data;
    const rawItem: PoojaApiItem =
      payload && typeof payload === 'object' && 'data' in payload && payload.data
        ? (payload as PoojaDetailApiResponse).data!
        : (payload as PoojaApiItem);

    if (!rawItem || (!rawItem._id && !rawItem.id)) {
      throw new Error('Pooja details not found');
    }

    return mapApiToPooja(rawItem);
  },
};

export const poojaNotesApi = {
  getByPoojaId: async (poojaId: string): Promise<PoojaPersonalNote[]> => {
    const response = await axiosInstance.get<PoojaNoteListApiResponse | PoojaNoteApiItem[]>(
      `/pooja/notes/${poojaId}`
    );
    const payload = response.data;
    const rawList: PoojaNoteApiItem[] = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : [];

    return rawList
      .map((item) => mapApiNoteToPersonalNote(item))
      .filter((note) => Boolean(note.id));
  },

  getById: async (noteId: string): Promise<PoojaPersonalNote> => {
    const response = await axiosInstance.get<PoojaNoteDetailApiResponse | PoojaNoteApiItem>(
      `/pooja/notes/detail/${noteId}`
    );
    const payload = response.data;
    const rawItem: PoojaNoteApiItem =
      payload && typeof payload === 'object' && 'data' in payload && payload.data
        ? (payload as PoojaNoteDetailApiResponse).data!
        : (payload as PoojaNoteApiItem);

    if (!rawItem || (!rawItem._id && !rawItem.id)) {
      throw new Error('Pooja note details not found');
    }

    return mapApiNoteToPersonalNote(rawItem);
  },

  create: async (data: CreatePoojaNotePayload): Promise<PoojaPersonalNote> => {
    const response = await axiosInstance.post<PoojaNoteDetailApiResponse | PoojaNoteApiItem>(
      '/pooja/notes/create',
      data
    );
    const payload = response.data;
    const rawItem: PoojaNoteApiItem =
      payload && typeof payload === 'object' && 'data' in payload && payload.data
        ? (payload as PoojaNoteDetailApiResponse).data!
        : (payload as PoojaNoteApiItem);

    if (!rawItem || (!rawItem._id && !rawItem.id)) {
      throw new Error('Failed to create pooja note');
    }

    return mapApiNoteToPersonalNote(rawItem);
  },

  update: async (noteId: string, data: UpdatePoojaNotePayload): Promise<PoojaPersonalNote> => {
    const response = await axiosInstance.put<PoojaNoteDetailApiResponse | PoojaNoteApiItem>(
      `/pooja/notes/update/${noteId}`,
      data
    );
    const payload = response.data;
    const rawItem: PoojaNoteApiItem =
      payload && typeof payload === 'object' && 'data' in payload && payload.data
        ? (payload as PoojaNoteDetailApiResponse).data!
        : (payload as PoojaNoteApiItem);

    if (!rawItem || (!rawItem._id && !rawItem.id)) {
      throw new Error('Failed to update pooja note');
    }

    return mapApiNoteToPersonalNote(rawItem);
  },

  delete: async (noteId: string): Promise<void> => {
    await axiosInstance.delete(`/pooja/notes/delete/${noteId}`);
  },
};
