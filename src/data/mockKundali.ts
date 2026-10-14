export interface AshtaKootaScore {
  name: string;
  obtained: number;
  maximum: number;
  description: string;
}

export interface KundaliMatchResult {
  ashtaKoota: AshtaKootaScore[];
  totalScore: number;
  maxScore: number;
  manglikBride: string;
  manglikGroom: string;
  manglikConclusion: string;
  observations: string[];
}

export const MOCK_KUNDALI_RESULT: KundaliMatchResult = {
  ashtaKoota: [
    { name: 'Varna', obtained: 1, maximum: 1, description: 'Work/Ego compatibility' },
    { name: 'Vashya', obtained: 2, maximum: 2, description: 'Dominance/Attraction' },
    { name: 'Tara', obtained: 1.5, maximum: 3, description: 'Health and well-being' },
    { name: 'Yoni', obtained: 3, maximum: 4, description: 'Biological compatibility' },
    { name: 'Graha\n Maitri', obtained: 4, maximum: 5, description: 'Mental compatibility' },
    { name: 'Gana', obtained: 6, maximum: 6, description: 'Temperament matching' },
    { name: 'Bhakoot', obtained: 7, maximum: 7, description: 'Love and family growth' },
    { name: 'Nadi', obtained: 8, maximum: 8, description: 'Health and genetics' },
  ],
  totalScore: 32.5,
  maxScore: 36,
  manglikBride: 'Low Manglik (Anshik)',
  manglikGroom: 'Non-Manglik',
  manglikConclusion: 'Manglik match is acceptable due to cancellation rules. Pooja is recommended.',
  observations: [
    'Excellent Nadi match indicating good health and progeny.',
    'Bhakoot dosha is absent, indicating a harmonious married life.',
    'Gana matching is perfect, suggesting both share similar temperaments.',
    'Overall score is highly favorable (> 18). Marriage is recommended.'
  ]
};

export interface SavedKundali {
  id: string;
  name: string;
  gender: 'male' | 'female';
  dob: string;
  tob: string;
  place: string;
  rashi?: string;
  nakshatra?: string;
  lagna?: string;
  savedAt?: string;
}

export const INITIAL_SAVED_KUNDALIS: SavedKundali[] = [
  {
    id: 'k1',
    name: 'Rahul Sharma',
    gender: 'male',
    dob: '24/09/1990',
    tob: '10:30 AM',
    place: 'Jaipur, Rajasthan',
    rashi: 'Tula (तुला)',
    nakshatra: 'Chitra (चित्रा)',
    lagna: 'Scorpio (वृश्चिक)',
    savedAt: 'Today, 10:45 AM'
  },
  {
    id: 'k2',
    name: 'Priya Verma',
    gender: 'female',
    dob: '15/07/1994',
    tob: '06:15 PM',
    place: 'New Delhi, Delhi',
    rashi: 'Kanya (कन्या)',
    nakshatra: 'Hasta (हस्त)',
    lagna: 'Sagittarius (धनु)',
    savedAt: 'Yesterday'
  },
  {
    id: 'k3',
    name: 'Aarav Joshi',
    gender: 'male',
    dob: '02/11/1998',
    tob: '04:15 AM',
    place: 'Varanasi, UP',
    rashi: 'Mesh (मेष)',
    nakshatra: 'Ashwini (अश्विनी)',
    lagna: 'Leo (सिंह)',
    savedAt: '10 Oct 2026'
  },
  {
    id: 'k4',
    name: 'Ananya Mishra',
    gender: 'female',
    dob: '18/03/1996',
    tob: '08:20 AM',
    place: 'Haridwar, Uttarakhand',
    rashi: 'Kumbha (कुंभ)',
    nakshatra: 'Shatabhisha (शतभिषा)',
    lagna: 'Taurus (वृषभ)',
    savedAt: '05 Oct 2026'
  }
];

