export type SectionType = 'Heading' | 'Description' | 'Dhyan' | 'Mantra' | 'Vidhi' | 'Audio';

export interface PoojaSection {
  sectionId: string;
  sectionType: SectionType;
  content: string;
}

export interface PoojaStepItem {
  id: string;
  stepNumber: number;
  title: string;
  content: string;
  subItems?: string[];
}

export interface PoojaPersonalNote {
  id: string;
  poojaId: string;
  title: string;
  content: string;
  isPinned: boolean;
  updatedAt: string;
  timestamp: number;
}

export interface PoojaCategoryRef {
  _id: string;
  categoryName: string;
  isActive?: boolean;
}

export interface PoojaSubCategoryRef {
  _id: string;
  subCategoryName: string;
  description?: string;
  parentId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

export interface PoojaApiItem {
  _id?: string;
  id?: string;
  categoryId?: PoojaCategoryRef | string | null;
  subCategoryId?: PoojaSubCategoryRef | string | null;
  sectionType?: string;
  title?: string;
  content?: string;
  textEditor?: string;
  completeContent?: string;
  isFavorite?: boolean;
  isAvailableOffline?: boolean;
  pdf?: string;
  samagriList?: string[];
  stepsList?: PoojaStepItem[];
  sections?: PoojaSection[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Pooja {
  id: string;
  title: string;
  category: string;
  categoryId?: string;
  subCategory?: string;
  subCategoryDescription?: string;
  sectionType?: string;
  content?: string;
  textEditor?: string;
  completeContent?: string;
  pdf?: string;
  isFavorite?: boolean;
  isAvailableOffline?: boolean;
  isApiItem?: boolean;
  thumbnail?: string;
  sections?: PoojaSection[];
  headerTitle?: string;
  titleHindi?: string;
  subtitleHindi?: string;
  breadcrumbs?: string;
  navAnchors?: string[];
  samagriList?: string[];
  stepsList?: PoojaStepItem[];
  createdAt?: string;
  updatedAt?: string;
}
