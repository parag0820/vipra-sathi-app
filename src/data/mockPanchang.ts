export interface PanchangDetails {
  date: string;
  location: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  tithi: string;
  paksha: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  rahuKaal: string;
  yamaganda: string;
  gulikaKaal: string;
  abhijitMuhurat: string;
  choghadiya: string;
  shakaSamvat: string;
  vikramSamvat: string;
  gujaratiSamvat: string;
  amantaMonth: string;
  purnimantaMonth: string;
  sunSign: string;
  sunNakshatra: string;
  moonNakshatra: string;
  padaCharan: Array<{
    pada: number;
    name: string;
    time: string;
  }>;
  festivals: string[];
}

export const generateMockPanchang = (dateObj: Date): PanchangDetails => {
  const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  return {
    date: dateStr,
    location: 'New Delhi, India',
    sunrise: '06:11 AM',
    sunset: '06:14 PM',
    moonrise: '06:23 PM',
    moonset: '05:07 AM',
    tithi: 'Ekadashi (up to 04:30 PM)',
    paksha: 'Shukla Paksha',
    nakshatra: 'Shatabhisha',
    yoga: 'Vaidhriti',
    karana: 'Vanija',
    rahuKaal: '04:30 PM - 06:00 PM',
    yamaganda: '12:00 PM - 01:30 PM',
    gulikaKaal: '10:30 AM - 12:00 PM',
    abhijitMuhurat: '11:45 AM - 12:35 PM',
    choghadiya: 'Shubh (06:00 AM - 07:30 AM), Labh (12:00 PM - 01:30 PM)',
    shakaSamvat: '1948 Parabhava',
    vikramSamvat: '2083 Nala',
    gujaratiSamvat: '2082 Krodhana',
    amantaMonth: 'Bhadrapada',
    purnimantaMonth: 'Ashwin',
    sunSign: 'Virgo (Kanya) 7°45\'',
    sunNakshatra: 'Uttara Phalguni',
    moonNakshatra: 'Shatabhisha',
    padaCharan: [
      { pada: 4, name: 'Shatabhisha', time: '11:21:33' },
      { pada: 1, name: 'Purva Bhadrapada', time: '17:27:22' },
      { pada: 2, name: 'Purva Bhadrapada', time: '23:30:51' },
      { pada: 3, name: 'Purva Bhadrapada', time: '05:32:05*' },
    ],
    festivals: dateObj.getDate() % 5 === 0 ? ['Devshayani Ekadashi', 'Tulsi Vivah Beginning'] : [],
  };
};
