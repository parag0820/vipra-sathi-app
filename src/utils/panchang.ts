import * as Astronomy from 'astronomy-engine';

export interface PanchangData {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  tithiKey: string;
  pakshaKey: string;
  monthKey: string;
}

const TITHI_KEYS = [
  'pratipada', 'dwitiya', 'tritiya', 'chaturthi', 'panchami',
  'shashthi', 'saptami', 'ashtami', 'navami', 'dashami',
  'ekadashi', 'dwadashi', 'trayodashi', 'chaturdashi', 'purnima',
  'pratipada', 'dwitiya', 'tritiya', 'chaturthi', 'panchami',
  'shashthi', 'saptami', 'ashtami', 'navami', 'dashami',
  'ekadashi', 'dwadashi', 'trayodashi', 'chaturdashi', 'amavasya'
];

// Helper to format time (e.g., 06:45 AM)
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const calculatePanchang = (latitude: number, longitude: number, date: Date): PanchangData => {
  const observer = new Astronomy.Observer(latitude, longitude, 0); // Elevation 0
  const astroTime = new Astronomy.AstroTime(date);

  // 1. Calculate Sunrise & Sunset
  const sunriseEvent = Astronomy.SearchRiseSet('Sun' as Astronomy.Body, observer, +1, astroTime, 300);
  const sunsetEvent = Astronomy.SearchRiseSet('Sun' as Astronomy.Body, observer, -1, astroTime, 300);

  // 2. Calculate Moonrise & Moonset
  const moonriseEvent = Astronomy.SearchRiseSet('Moon' as Astronomy.Body, observer, +1, astroTime, 300);
  const moonsetEvent = Astronomy.SearchRiseSet('Moon' as Astronomy.Body, observer, -1, astroTime, 300);

  // 3. Calculate Tithi
  // Tithi depends on the angle (Moon Longitude - Sun Longitude).
  const diff = Astronomy.MoonPhase(astroTime);

  // Tithi is 0-indexed here (0 to 29)
  const tithiIndex = Math.floor(diff / 12);
  const tithiKey = TITHI_KEYS[tithiIndex];

  // Paksha (0-14 is Shukla, 15-29 is Krishna)
  const pakshaKey = tithiIndex < 15 ? 'shukla' : 'krishna';

  // Return the data
  return {
    sunrise: sunriseEvent ? formatTime(sunriseEvent.date) : 'N/A',
    sunset: sunsetEvent ? formatTime(sunsetEvent.date) : 'N/A',
    moonrise: moonriseEvent ? formatTime(moonriseEvent.date) : 'N/A',
    moonset: moonsetEvent ? formatTime(moonsetEvent.date) : 'N/A',
    tithiKey: `panchang.tithi.${tithiKey}`,
    pakshaKey: `panchang.paksha.${pakshaKey}`,
    monthKey: 'panchang.month.phalguna', // Mocked to Phalguna
  };
};
