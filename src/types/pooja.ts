export type SectionType = 'Heading' | 'Description' | 'Dhyan' | 'Mantra' | 'Vidhi' | 'Audio';

export interface PoojaSection {
  sectionId: string;
  sectionType: SectionType;
  content: string;
}

export interface Pooja {
  id: string;
  title: string;
  category: string;
  subCategory?: string;
  thumbnail?: string;
  sections: PoojaSection[];
}
