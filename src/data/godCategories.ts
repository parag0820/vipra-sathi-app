export interface GodCategory {
  id: string;
  name_en: string;
  name_hi: string;
  subtitle_en: string;
  subtitle_hi: string;
  iconName: string; // MaterialCommunityIcons name
  poojaCategory: string;
  stotramCategory: string;
  aartiCategory: string;
  color: string;
  bgColor: string;
}

export const GOD_CATEGORIES: GodCategory[] = [
  {
    id: 'ganesh',
    name_hi: 'श्री गणेश',
    name_en: 'Lord Ganesha',
    subtitle_hi: 'विघ्नहर्ता एवं प्रथम पूज्य',
    subtitle_en: 'Remover of Obstacles',
    iconName: 'om',
    poojaCategory: 'Ganesh Pooja',
    stotramCategory: 'Ganesh Stotras',
    aartiCategory: 'Ganesh Aarti',
    color: '#D35400',
    bgColor: '#FDEED9',
  },
  {
    id: 'shiva',
    name_hi: 'भगवान शिव',
    name_en: 'Lord Shiva',
    subtitle_hi: 'महादेव एवं औढरदानी',
    subtitle_en: 'Mahadev & Rudra',
    iconName: 'water',
    poojaCategory: 'Shiva Pooja',
    stotramCategory: 'Shiva Stotras',
    aartiCategory: 'Shiva Aarti',
    color: '#1F618D',
    bgColor: '#EBF5FB',
  },
  {
    id: 'vishnu',
    name_hi: 'श्री विष्णु',
    name_en: 'Lord Vishnu',
    subtitle_hi: 'जगतपालक श्रीहरि नारायण',
    subtitle_en: 'Preserver & Protector',
    iconName: 'feather',
    poojaCategory: 'Vishnu Pooja',
    stotramCategory: 'Vishnu Stotras',
    aartiCategory: 'Vishnu Aarti',
    color: '#B7950B',
    bgColor: '#FEF9E7',
  },
  {
    id: 'durga',
    name_hi: 'माँ दुर्गा',
    name_en: 'Maa Durga',
    subtitle_hi: 'आदिशक्ति भगवती भवानी',
    subtitle_en: 'Divine Mother & Shakti',
    iconName: 'shield-sun',
    poojaCategory: 'Durga Pooja',
    stotramCategory: 'Durga Stotras',
    aartiCategory: 'Durga Aarti',
    color: '#C0392B',
    bgColor: '#FDEDEC',
  },
  {
    id: 'lakshmi',
    name_hi: 'माँ लक्ष्मी',
    name_en: 'Maa Lakshmi',
    subtitle_hi: 'धन, धान्य एवं वैभव दायिनी',
    subtitle_en: 'Goddess of Prosperity',
    iconName: 'flower-tulip-outline',
    poojaCategory: 'Lakshmi Pooja',
    stotramCategory: 'Lakshmi Stotras',
    aartiCategory: 'Lakshmi Aarti',
    color: '#9B59B6',
    bgColor: '#F5EEF8',
  },
  {
    id: 'hanuman',
    name_hi: 'श्री हनुमान',
    name_en: 'Lord Hanuman',
    subtitle_hi: 'संकटमोचन पवनपुत्र',
    subtitle_en: 'Sankat Mochan Bajrangbali',
    iconName: 'fire',
    poojaCategory: 'Hanuman Pooja',
    stotramCategory: 'Hanuman Stotras',
    aartiCategory: 'Hanuman Aarti',
    color: '#E65100',
    bgColor: '#FBE9E7',
  },
];
