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
