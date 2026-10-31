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

export interface Pooja {
  id: string;
  title: string;
  category: string;
  subCategory?: string;
  thumbnail?: string;
  sections: PoojaSection[];
  headerTitle?: string;
  titleHindi?: string;
  subtitleHindi?: string;
  breadcrumbs?: string;
  navAnchors?: string[];
  samagriList?: string[];
  stepsList?: PoojaStepItem[];
}
