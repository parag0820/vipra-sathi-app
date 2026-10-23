import * as Astronomy from 'astronomy-engine';

export interface LocalizedString {
  en: string;
  hi: string;
}

export interface PadaCharanItem {
  pada: number;
  syllable: LocalizedString;
  nakshatra: LocalizedString;
  time: string;
}

export interface DetailedPanchangData {
  date: Date;
  dateStr: LocalizedString;
  locationName: LocalizedString;
  waar: LocalizedString;
  headerSummary: LocalizedString;
  festivals: LocalizedString[];

  // Core 5 Limbs + Paksha
  tithi: {
    name: LocalizedString;
    endTime: string;
    tillText: LocalizedString;
  };
  paksha: LocalizedString;
  nakshatra: {
    name: LocalizedString;
    endTime: string;
    tillText: LocalizedString;
    nextName?: LocalizedString;
  };
  yoga: {
    name: LocalizedString;
    endTime: string;
    tillText: LocalizedString;
  };
  karana1: {
    name: LocalizedString;
    endTime: string;
    tillText: LocalizedString;
  };
  karana2: {
    name: LocalizedString;
    endTime: string;
    tillText: LocalizedString;
  };

  // Month & Season
  amantaMonth: LocalizedString;
  purnimantaMonth: LocalizedString;
  ritu: LocalizedString;
  ayan: LocalizedString;

  // Zodiac Signs
  chandraRashi: {
    current: LocalizedString;
    transitTime?: string;
    next?: LocalizedString;
    display: LocalizedString;
  };
  suryaRashi: {
    name: LocalizedString;
    degree: string;
    display: LocalizedString;
  };

  // Sun & Moon Times
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  dinKaal: string;
  ratriKaal: string;

  // Sunrise positions
  sunriseLagna: LocalizedString;
  sunNakshatra: LocalizedString;
  moonNakshatra: LocalizedString;

  // Samvat & Eras
  vikramSamvat: LocalizedString;
  shakaSamvat: LocalizedString;
  gujaratiSamvat: LocalizedString;
  kaliSamvat: LocalizedString;
  samvatsar: LocalizedString;
  samvatsarNorth: LocalizedString;
  saurPravishte: LocalizedString;

  // Auspicious & Inauspicious Muhurats
  abhijitMuhurat: string;
  amritKaal: string;
  rahuKaal: string;
  yamaganda: string;
  gulikaKaal: string;
  durMuhurat: string;

  // Pada / Charan
  padaCharan: PadaCharanItem[];
}

export const WAAR_LIST: LocalizedString[] = [
  { en: 'Sunday', hi: 'रविवार' },
  { en: 'Monday', hi: 'सोमवार' },
  { en: 'Tuesday', hi: 'मंगलवार' },
  { en: 'Wednesday', hi: 'बुधवार' },
  { en: 'Thursday', hi: 'गुरुवार' },
  { en: 'Friday', hi: 'शुक्रवार' },
  { en: 'Saturday', hi: 'शनिवार' },
];

export const TITHI_NAMES: LocalizedString[] = [
  { en: 'Pratipada', hi: 'प्रतिपदा' },
  { en: 'Dwitiya', hi: 'द्वितीया' },
  { en: 'Tritiya', hi: 'तृतीया' },
  { en: 'Chaturthi', hi: 'चतुर्थी' },
  { en: 'Panchami', hi: 'पंचमी' },
  { en: 'Shashthi', hi: 'षष्ठी' },
  { en: 'Saptami', hi: 'सप्तमी' },
  { en: 'Ashtami', hi: 'अष्टमी' },
  { en: 'Navami', hi: 'नवमी' },
  { en: 'Dashami', hi: 'दशमी' },
  { en: 'Ekadashi', hi: 'एकादशी' },
  { en: 'Dwadashi', hi: 'द्वादशी' },
  { en: 'Trayodashi', hi: 'त्रयोदशी' },
  { en: 'Chaturdashi', hi: 'चतुर्दशी' },
  { en: 'Purnima', hi: 'पूर्णिमा' },
  { en: 'Pratipada', hi: 'प्रतिपदा' },
  { en: 'Dwitiya', hi: 'द्वितीया' },
  { en: 'Tritiya', hi: 'तृतीया' },
  { en: 'Chaturthi', hi: 'चतुर्थी' },
  { en: 'Panchami', hi: 'पंचमी' },
  { en: 'Shashthi', hi: 'षष्ठी' },
  { en: 'Saptami', hi: 'सप्तमी' },
  { en: 'Ashtami', hi: 'अष्टमी' },
  { en: 'Navami', hi: 'नवमी' },
  { en: 'Dashami', hi: 'दशमी' },
  { en: 'Ekadashi', hi: 'एकादशी' },
  { en: 'Dwadashi', hi: 'द्वादशी' },
  { en: 'Trayodashi', hi: 'त्रयोदशी' },
  { en: 'Chaturdashi', hi: 'चतुर्दशी' },
  { en: 'Amavasya', hi: 'अमावस्या' },
];

export const NAKSHATRA_DATA: Array<{
  name: LocalizedString;
  padas: [string, string, string, string];
  padasEn: [string, string, string, string];
}> = [
  { name: { en: 'Ashwini', hi: 'अश्विनी' }, padas: ['चू', 'चे', 'चो', 'ला'], padasEn: ['Chu', 'Che', 'Cho', 'La'] },
  { name: { en: 'Bharani', hi: 'भरणी' }, padas: ['ली', 'लू', 'ले', 'लो'], padasEn: ['Lee', 'Lu', 'Le', 'Lo'] },
  { name: { en: 'Krittika', hi: 'कृत्तिका' }, padas: ['अ', 'ई', 'उ', 'ए'], padasEn: ['A', 'Ee', 'U', 'E'] },
  { name: { en: 'Rohini', hi: 'रोहिणी' }, padas: ['ओ', 'वा', 'वी', 'वू'], padasEn: ['O', 'Va', 'Vee', 'Vu'] },
  { name: { en: 'Mrigashirsha', hi: 'मृगशिरा' }, padas: ['वे', 'वो', 'का', 'की'], padasEn: ['Ve', 'Vo', 'Kaa', 'Kee'] },
  { name: { en: 'Ardra', hi: 'आर्द्रा' }, padas: ['कु', 'घ', 'ङ', 'छ'], padasEn: ['Ku', 'Gha', 'Inga', 'Chha'] },
  { name: { en: 'Punarvasu', hi: 'पुनर्वसु' }, padas: ['के', 'को', 'हा', 'ही'], padasEn: ['Ke', 'Ko', 'Haa', 'Hee'] },
  { name: { en: 'Pushya', hi: 'पुष्य' }, padas: ['हू', 'हे', 'हो', 'डा'], padasEn: ['Hoo', 'He', 'Ho', 'Daa'] },
  { name: { en: 'Ashlesha', hi: 'अश्लेषा' }, padas: ['डी', 'डू', 'डे', 'डो'], padasEn: ['Dee', 'Doo', 'De', 'Do'] },
  { name: { en: 'Magha', hi: 'मघा' }, padas: ['मा', 'मी', 'मू', 'मे'], padasEn: ['Maa', 'Mee', 'Moo', 'Me'] },
  { name: { en: 'Purva Phalguni', hi: 'पूर्व फाल्गुनी' }, padas: ['मो', 'टा', 'टी', 'टू'], padasEn: ['Mo', 'Taa', 'Tee', 'Too'] },
  { name: { en: 'Uttara Phalguni', hi: 'उत्तर फाल्गुनी' }, padas: ['टे', 'टो', 'पा', 'पी'], padasEn: ['Te', 'To', 'Paa', 'Pee'] },
  { name: { en: 'Hasta', hi: 'हस्त' }, padas: ['पू', 'ष', 'ण', 'ठ'], padasEn: ['Poo', 'Sha', 'Na', 'Tha'] },
  { name: { en: 'Chitra', hi: 'चित्रा' }, padas: ['पे', 'पो', 'रा', 'री'], padasEn: ['Pe', 'Po', 'Raa', 'Ree'] },
  { name: { en: 'Swati', hi: 'स्वाति' }, padas: ['रू', 'रे', 'रो', 'ता'], padasEn: ['Roo', 'Re', 'Ro', 'Taa'] },
  { name: { en: 'Vishakha', hi: 'विशाखा' }, padas: ['ती', 'तू', 'ते', 'तो'], padasEn: ['Tee', 'Too', 'Te', 'To'] },
  { name: { en: 'Anuradha', hi: 'अनुराधा' }, padas: ['ना', 'नी', 'नू', 'ने'], padasEn: ['Naa', 'Nee', 'Noo', 'Ne'] },
  { name: { en: 'Jyeshtha', hi: 'ज्येष्ठा' }, padas: ['नो', 'या', 'यी', 'यू'], padasEn: ['No', 'Yaa', 'Yee', 'Yoo'] },
  { name: { en: 'Mula', hi: 'मूल' }, padas: ['ये', 'यो', 'भा', 'भी'], padasEn: ['Ye', 'Yo', 'Bhaa', 'Bhee'] },
  { name: { en: 'Purva Ashadha', hi: 'पूर्वाषाढ़ा' }, padas: ['भू', 'धा', 'फा', 'ढा'], padasEn: ['Bhoo', 'Dhaa', 'Phaa', 'Dhaa'] },
  { name: { en: 'Uttara Ashadha', hi: 'उत्तराषाढ़ा' }, padas: ['भे', 'भो', 'जा', 'जी'], padasEn: ['Bhe', 'Bho', 'Jaa', 'Jee'] },
  { name: { en: 'Shravana', hi: 'श्रवण' }, padas: ['खी', 'खू', 'खे', 'खो'], padasEn: ['Khee', 'Khoo', 'Khe', 'Kho'] },
  { name: { en: 'Dhanishta', hi: 'धनिष्ठा' }, padas: ['गा', 'गी', 'गु', 'गे'], padasEn: ['Gaa', 'Gee', 'Gu', 'Ge'] },
  { name: { en: 'Shatabhisha', hi: 'शतभिषा' }, padas: ['गो', 'सा', 'सी', 'सू'], padasEn: ['Go', 'Saa', 'See', 'Soo'] },
  { name: { en: 'Purva Bhadrapada', hi: 'पूर्वभाद्रपदा' }, padas: ['से', 'सो', 'दा', 'दी'], padasEn: ['Se', 'So', 'Daa', 'Dee'] },
  { name: { en: 'Uttara Bhadrapada', hi: 'उत्तरभाद्रपदा' }, padas: ['दू', 'थ', 'झ', 'ञ'], padasEn: ['Doo', 'Tha', 'Jha', 'Inya'] },
  { name: { en: 'Revati', hi: 'रेवती' }, padas: ['दे', 'दो', 'चा', 'ची'], padasEn: ['De', 'Do', 'Chaa', 'Chee'] },
];

export const YOGA_NAMES: LocalizedString[] = [
  { en: 'Vishkambha', hi: 'विष्कम्भ' },
  { en: 'Priti', hi: 'प्रीति' },
  { en: 'Ayushman', hi: 'आयुष्मान' },
  { en: 'Saubhagya', hi: 'सौभाग्य' },
  { en: 'Shobhana', hi: 'शोभन' },
  { en: 'Atiganda', hi: 'अतिगण्ड' },
  { en: 'Sukarma', hi: 'सुकर्मा' },
  { en: 'Dhriti', hi: 'धृति' },
  { en: 'Shula', hi: 'शूल' },
  { en: 'Ganda', hi: 'गण्ड' },
  { en: 'Vriddhi', hi: 'वृद्धि' },
  { en: 'Dhruva', hi: 'ध्रुव' },
  { en: 'Vyaghata', hi: 'व्याघात' },
  { en: 'Harshana', hi: 'हर्षण' },
  { en: 'Vajra', hi: 'वज्र' },
  { en: 'Siddhi', hi: 'सिद्धि' },
  { en: 'Vyatipata', hi: 'व्यतीपात' },
  { en: 'Variyana', hi: 'वरीयान' },
  { en: 'Parigha', hi: 'परिघ' },
  { en: 'Shiva', hi: 'शिव' },
  { en: 'Siddha', hi: 'सिद्ध' },
  { en: 'Sadhya', hi: 'साध्य' },
  { en: 'Shubha', hi: 'शुभ' },
  { en: 'Shukla', hi: 'शुक्ल' },
  { en: 'Brahma', hi: 'ब्रह्म' },
  { en: 'Indra', hi: 'इन्द्र' },
  { en: 'Vaidhriti', hi: 'वैधृति' },
];

export const KARANA_NAMES: LocalizedString[] = [
  { en: 'Bava', hi: 'बव' },
  { en: 'Balava', hi: 'बालव' },
  { en: 'Kaulava', hi: 'कौलव' },
  { en: 'Taitila', hi: 'तैतिल' },
  { en: 'Gara', hi: 'गर' },
  { en: 'Vanija', hi: 'वणिज' },
  { en: 'Vishti (Bhadra)', hi: 'विष्टि (भद्रा)' },
  { en: 'Shakuni', hi: 'शकुनि' },
  { en: 'Chatushpada', hi: 'चतुष्पाद' },
  { en: 'Naga', hi: 'नाग' },
  { en: 'Kinstughna', hi: 'किंस्तुघ्न' },
];

export const RASHI_NAMES: LocalizedString[] = [
  { en: 'Aries', hi: 'मेष' },
  { en: 'Taurus', hi: 'वृषभ' },
  { en: 'Gemini', hi: 'मिथुन' },
  { en: 'Cancer', hi: 'कर्क' },
  { en: 'Leo', hi: 'सिंह' },
  { en: 'Virgo', hi: 'कन्या' },
  { en: 'Libra', hi: 'तुला' },
  { en: 'Scorpio', hi: 'वृश्चिक' },
  { en: 'Sagittarius', hi: 'धनु' },
  { en: 'Capricorn', hi: 'मकर' },
  { en: 'Aquarius', hi: 'कुम्भ' },
  { en: 'Pisces', hi: 'मीन' },
];

export const HINDU_MONTHS: LocalizedString[] = [
  { en: 'Chaitra', hi: 'चैत्र' },
  { en: 'Vaishakha', hi: 'वैशाख' },
  { en: 'Jyeshtha', hi: 'ज्येष्ठ' },
  { en: 'Ashadha', hi: 'आषाढ़' },
  { en: 'Shravana', hi: 'श्रावण' },
  { en: 'Bhadrapada', hi: 'भाद्रपद' },
  { en: 'Ashwin', hi: 'आश्विन' },
  { en: 'Kartika', hi: 'कार्तिक' },
  { en: 'Margashirsha', hi: 'मार्गशीर्ष' },
  { en: 'Pausha', hi: 'पौष' },
  { en: 'Magha', hi: 'माघ' },
  { en: 'Phalguna', hi: 'फाल्गुन' },
];

export const RITU_LIST: LocalizedString[] = [
  { en: 'Vasant (Spring)', hi: 'वसन्त' },
  { en: 'Grishma (Summer)', hi: 'ग्रीष्म' },
  { en: 'Varsha (Monsoon)', hi: 'वर्षा' },
  { en: 'Sharad (Autumn)', hi: 'शरद' },
  { en: 'Hemant (Pre-Winter)', hi: 'हेमन्त' },
  { en: 'Shishir (Winter)', hi: 'शिशिर' },
];

export const SAMVATSARA_60: LocalizedString[] = [
  { en: 'Prabhava', hi: 'प्रभव' }, { en: 'Vibhava', hi: 'विभव' }, { en: 'Shukla', hi: 'शुक्ल' }, { en: 'Pramoda', hi: 'प्रमोद' },
  { en: 'Prajapati', hi: 'प्रजापति' }, { en: 'Angirasa', hi: 'अंगिरस' }, { en: 'Srimukha', hi: 'श्रीमुख' }, { en: 'Bhava', hi: 'भाव' },
  { en: 'Yuva', hi: 'युवा' }, { en: 'Dhatri', hi: 'धाता' }, { en: 'Ishvara', hi: 'ईश्वर' }, { en: 'Bahudhanya', hi: 'बहुधान्य' },
  { en: 'Pramathi', hi: 'प्रमाथी' }, { en: 'Vikrama', hi: 'विक्रम' }, { en: 'Vrisha', hi: 'वृष' }, { en: 'Chitrabhanu', hi: 'चित्रभानु' },
  { en: 'Subhanu', hi: 'सुभानु' }, { en: 'Tarana', hi: 'तारण' }, { en: 'Parthiva', hi: 'पार्थिव' }, { en: 'Vyaya', hi: 'व्यय' },
  { en: 'Sarvajit', hi: 'सर्वजित' }, { en: 'Sarvadhari', hi: 'सर्वधारी' }, { en: 'Virodhi', hi: 'विरोधी' }, { en: 'Vikrita', hi: 'विकृत' },
  { en: 'Khara', hi: 'खर' }, { en: 'Nandana', hi: 'नन्दन' }, { en: 'Vijaya', hi: 'विजय' }, { en: 'Jaya', hi: 'जय' },
  { en: 'Manmatha', hi: 'मन्मथ' }, { en: 'Durmukha', hi: 'दुर्मुख' }, { en: 'Hemalamba', hi: 'हेमलम्ब' }, { en: 'Vilamba', hi: 'विलम्ब' },
  { en: 'Vikari', hi: 'विकारी' }, { en: 'Sharvari', hi: 'शार्वरी' }, { en: 'Plava', hi: 'प्लव' }, { en: 'Shubhakrita', hi: 'शुभकृत' },
  { en: 'Shobhana', hi: 'शोभन' }, { en: 'Krodhi', hi: 'क्रोधी' }, { en: 'Vishvavasu', hi: 'विश्वावसु' }, { en: 'Parabhava', hi: 'पराभव' },
  { en: 'Plavanga', hi: 'प्लवंग' }, { en: 'Kilaka', hi: 'कीलक' }, { en: 'Saumya', hi: 'सौम्य' }, { en: 'Sadharana', hi: 'साधारण' },
  { en: 'Virodhikrita', hi: 'विरोधकृत' }, { en: 'Paridhavi', hi: 'परिधावी' }, { en: 'Pramadicha', hi: 'प्रमादी' }, { en: 'Ananda', hi: 'आनन्द' },
  { en: 'Rakshasa', hi: 'राक्षस' }, { en: 'Nala', hi: 'नल' }, { en: 'Pingala', hi: 'पिंगल' }, { en: 'Kalayukta', hi: 'कालयुक्त' },
  { en: 'Siddharthi', hi: 'सिद्धार्थी' }, { en: 'Raudra', hi: 'रौद्र' }, { en: 'Durmati', hi: 'दुर्मति' }, { en: 'Dundubhi', hi: 'दुन्दुभी' },
  { en: 'Rudhirodgari', hi: 'रुधिरोद्गारी' }, { en: 'Raktakshi', hi: 'रक्ताक्षी' }, { en: 'Krodhana', hi: 'क्रोधन' }, { en: 'Kshaya', hi: 'क्षय' },
];

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

const formatTimeHHMMSS = (d: Date): string => {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
};

const formatTime12h = (d: Date): string => {
  const h = d.getHours();
  const m = pad2(d.getMinutes());
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${pad2(h12)}:${m} ${ampm}`;
};

const formatDuration = (ms: number): string => {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
};

/**
 * Calculates complete Vedic Panchang details for any date & geographical location.
 */
export function calculateDetailedPanchang(
  date: Date,
  lat: number = 23.1765, // Ujjain default
  lon: number = 75.7885,
  locationName: LocalizedString = { en: 'Ujjain, India', hi: 'उज्जैन, भारत' }
): DetailedPanchangData {
  const observer = new Astronomy.Observer(lat, lon, 0);

  // Reference sunrise for the day
  // Set to local start of day (04:00 AM) to reliably find today's rise
  const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 4, 0, 0);
  const astroDayStart = new Astronomy.AstroTime(dayStart);

  const sunriseEvent = Astronomy.SearchRiseSet('Sun' as Astronomy.Body, observer, +1, astroDayStart, 1);
  const sunsetEvent = Astronomy.SearchRiseSet('Sun' as Astronomy.Body, observer, -1, astroDayStart, 1);

  // Sunrise date or fallback to 06:15 AM
  const sunriseDate = sunriseEvent ? sunriseEvent.date : new Date(date.getFullYear(), date.getMonth(), date.getDate(), 6, 17, 0);
  const sunsetDate = sunsetEvent ? sunsetEvent.date : new Date(date.getFullYear(), date.getMonth(), date.getDate(), 18, 19, 0);

  // Moonrise and Moonset
  const moonriseEvent = Astronomy.SearchRiseSet('Moon' as Astronomy.Body, observer, +1, astroDayStart, 2);
  const moonsetEvent = Astronomy.SearchRiseSet('Moon' as Astronomy.Body, observer, -1, astroDayStart, 2);

  const moonriseDate = moonriseEvent ? moonriseEvent.date : new Date(date.getFullYear(), date.getMonth(), date.getDate(), 17, 27, 0);
  const moonsetDate = moonsetEvent ? moonsetEvent.date : new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 5, 42, 0);

  // Day & Night Durations
  const dinKaalMs = sunsetDate.getTime() - sunriseDate.getTime();
  const dinKaal = formatDuration(dinKaalMs);

  // Approximate next sunrise for night duration
  const nextSunriseMs = sunriseDate.getTime() + 24 * 3600 * 1000;
  const ratriKaal = formatDuration(nextSunriseMs - sunsetDate.getTime());

  // Astronomical Calculations at Sunrise
  const astroSunrise = new Astronomy.AstroTime(sunriseDate);
  const sunPos = Astronomy.SunPosition(astroSunrise);
  const moonVector = Astronomy.GeoVector('Moon' as Astronomy.Body, astroSunrise, true);
  const moonEcl = Astronomy.Ecliptic(moonVector);

  // Lahiri Ayanamsha: 23.85 + (year - 2000) * 0.01397
  const yearDecimal = date.getFullYear() + (date.getMonth() * 30 + date.getDate()) / 365.25;
  const ayanamsha = 23.85 + (yearDecimal - 2000) * 0.01397;

  const siderealSun = (sunPos.elon - ayanamsha + 360) % 360;
  const siderealMoon = (moonEcl.elon - ayanamsha + 360) % 360;

  // 1. Tithi
  const phase = Astronomy.MoonPhase(astroSunrise);
  const tithiIndex = Math.floor(phase / 12) % 30;
  const isShukla = tithiIndex < 15;
  const paksha: LocalizedString = isShukla
    ? { en: 'Shukla Paksha', hi: 'शुक्ल पक्ष' }
    : { en: 'Krishna Paksha', hi: 'कृष्ण पक्ष' };

  // Calculate tithi end time: when phase reaches (tithiIndex + 1) * 12
  const targetPhase = ((tithiIndex + 1) * 12) % 360;
  let tithiEndDate = new Date(sunriseDate.getTime() + 16 * 3600000); // default fallback
  for (let m = 5; m <= 30 * 60; m += 10) {
    const checkDate = new Date(sunriseDate.getTime() + m * 60000);
    const p = Astronomy.MoonPhase(new Astronomy.AstroTime(checkDate));
    if (Math.floor(p / 12) !== tithiIndex) {
      tithiEndDate = checkDate;
      break;
    }
  }

  // 2. Nakshatra
  const nakshatraIndex = Math.floor(siderealMoon / (360 / 27)) % 27;
  let nakshatraEndDate = new Date(sunriseDate.getTime() + 12 * 3600000);
  for (let m = 5; m <= 30 * 60; m += 10) {
    const checkDate = new Date(sunriseDate.getTime() + m * 60000);
    const mVec = Astronomy.GeoVector('Moon' as Astronomy.Body, new Astronomy.AstroTime(checkDate), true);
    const mEcl = Astronomy.Ecliptic(mVec);
    const sMoon = (mEcl.elon - ayanamsha + 360) % 360;
    if (Math.floor(sMoon / (360 / 27)) !== nakshatraIndex) {
      nakshatraEndDate = checkDate;
      break;
    }
  }
  const nextNakshatraIndex = (nakshatraIndex + 1) % 27;

  // 3. Yoga
  const yogaIndex = Math.floor(((siderealSun + siderealMoon) % 360) / (360 / 27)) % 27;
  let yogaEndDate = new Date(sunriseDate.getTime() + 14 * 3600000);
  for (let m = 5; m <= 30 * 60; m += 10) {
    const checkDate = new Date(sunriseDate.getTime() + m * 60000);
    const at = new Astronomy.AstroTime(checkDate);
    const sp = Astronomy.SunPosition(at);
    const mv = Astronomy.GeoVector('Moon' as Astronomy.Body, at, true);
    const me = Astronomy.Ecliptic(mv);
    const sSun = (sp.elon - ayanamsha + 360) % 360;
    const sMoon = (me.elon - ayanamsha + 360) % 360;
    if (Math.floor(((sSun + sMoon) % 360) / (360 / 27)) !== yogaIndex) {
      yogaEndDate = checkDate;
      break;
    }
  }

  // 4. Karanas (half-tithis)
  // Half tithi calculation
  const halfTithiIndex = Math.floor((phase * 2) / 12) % 60;
  const getKaranaName = (kIndex: number): LocalizedString => {
    if (kIndex === 0) return KARANA_NAMES[10]; // Kinstughna
    if (kIndex >= 57) {
      if (kIndex === 57) return KARANA_NAMES[7]; // Shakuni
      if (kIndex === 58) return KARANA_NAMES[8]; // Chatushpada
      return KARANA_NAMES[9]; // Naga
    }
    const cycle = (kIndex - 1) % 7;
    return KARANA_NAMES[cycle];
  };

  const karana1Name = getKaranaName(halfTithiIndex);
  const karana2Name = getKaranaName(halfTithiIndex + 1);

  // Karana 1 ends halfway or at tithi end
  const karana1EndDate = new Date(sunriseDate.getTime() + Math.max(2, (tithiEndDate.getTime() - sunriseDate.getTime()) / 2));
  const karana2EndDate = tithiEndDate;

  // 5. Waar (Day of Week)
  const dayIndex = date.getDay();
  const waar = WAAR_LIST[dayIndex];

  // 6. Rashi (Moon Sign & Sun Sign)
  const moonRashiIndex = Math.floor(siderealMoon / 30) % 12;
  const sunRashiIndex = Math.floor(siderealSun / 30) % 12;
  const sunRashiDegree = siderealSun % 30;
  const sunDeg = Math.floor(sunRashiDegree);
  const sunMin = Math.floor((sunRashiDegree - sunDeg) * 60);
  const sunDegreeStr = `${sunDeg}°${pad2(sunMin)}'`;

  // Transit time of moon to next rashi
  let moonTransitDate = new Date(sunriseDate.getTime() + 20 * 3600000);
  for (let m = 10; m <= 36 * 60; m += 15) {
    const checkDate = new Date(sunriseDate.getTime() + m * 60000);
    const mVec = Astronomy.GeoVector('Moon' as Astronomy.Body, new Astronomy.AstroTime(checkDate), true);
    const mEcl = Astronomy.Ecliptic(mVec);
    const sMoon = (mEcl.elon - ayanamsha + 360) % 360;
    if (Math.floor(sMoon / 30) !== moonRashiIndex) {
      moonTransitDate = checkDate;
      break;
    }
  }
  const nextMoonRashiIndex = (moonRashiIndex + 1) % 12;

  // 7. Hindu Month & Season (Ritu)
  // Amanta & Purnimanta month determination
  // Sun in Aries -> Chaitra/Vaishakha, etc.
  const monthIndex = (sunRashiIndex + 11) % 12; // Approx based on solar transition
  const amantaMonth = HINDU_MONTHS[monthIndex];
  const purnimantaMonth = isShukla ? HINDU_MONTHS[monthIndex] : HINDU_MONTHS[(monthIndex + 1) % 12];

  // Ritu: 2 months per season starting from Chaitra/Vaishakha (Vasant)
  const rituIndex = Math.floor(monthIndex / 2) % 6;
  const ritu = RITU_LIST[rituIndex];

  // Ayan: Dakshinayan (Cancer to Sagittarius, approx July 16 to Jan 14)
  // or Sayana Sun between 90° and 270°
  const isDakshinayan = sunPos.elon >= 90 && sunPos.elon < 270;
  const ayan: LocalizedString = isDakshinayan
    ? { en: 'Dakshinayana', hi: 'दक्षिणायन' }
    : { en: 'Uttarayana', hi: 'उत्तरायण' };

  // 8. Samvat & Eras
  // Shaka Samvat = Gregorian Year - 78 (after Chaitra)
  const shakaYear = date.getFullYear() - 78;
  const vikramYear = date.getFullYear() + 57;
  const gujaratiYear = isShukla && monthIndex >= 7 ? vikramYear : vikramYear - 1;
  const kaliYear = date.getFullYear() + 3101;

  // 60-year Jovian cycles
  const samvatsarIndex = (shakaYear + 11) % 60;
  const samvatsarNorthIndex = (shakaYear + 25) % 60;
  const samvatsar = SAMVATSARA_60[samvatsarIndex];
  const samvatsarNorth = SAMVATSARA_60[samvatsarNorthIndex];

  // Solar entry / Saur Pravishte
  const solarDay = Math.floor(sunRashiDegree) + 1;
  const solarMonth = HINDU_MONTHS[(sunRashiIndex + 11) % 12];
  const saurPravishte: LocalizedString = {
    en: `${solarDay}, ${solarMonth.en}`,
    hi: `${solarDay}, ${solarMonth.hi}`,
  };

  // 9. Sunrise Astrology
  // Lagna at Sunrise is virtually aligned with Sidereal Sun
  const sunriseLagna: LocalizedString = {
    en: `${RASHI_NAMES[sunRashiIndex].en} ${sunDegreeStr}`,
    hi: `${RASHI_NAMES[sunRashiIndex].hi} ${sunDegreeStr}`,
  };
  const sunNakshatraIndex = Math.floor(siderealSun / (360 / 27)) % 27;
  const sunNakshatra = NAKSHATRA_DATA[sunNakshatraIndex].name;
  const moonNakshatra = NAKSHATRA_DATA[nakshatraIndex].name;

  // 10. Muhurats (Auspicious & Inauspicious)
  const partDurationMs = dinKaalMs / 8;
  // Rahu Kaal part table for Sun(0) to Sat(6)
  const rahuParts = [7, 1, 6, 4, 5, 3, 2];
  const rahuStart = new Date(sunriseDate.getTime() + rahuParts[dayIndex] * partDurationMs);
  const rahuEnd = new Date(rahuStart.getTime() + partDurationMs);
  const rahuKaal = `${formatTimeHHMMSS(rahuStart).substring(0, 5)} - ${formatTimeHHMMSS(rahuEnd).substring(0, 5)}`;

  // Yamaganda parts
  const yamaParts = [4, 3, 2, 1, 0, 6, 5];
  const yamaStart = new Date(sunriseDate.getTime() + yamaParts[dayIndex] * partDurationMs);
  const yamaEnd = new Date(yamaStart.getTime() + partDurationMs);
  const yamaganda = `${formatTimeHHMMSS(yamaStart).substring(0, 5)} - ${formatTimeHHMMSS(yamaEnd).substring(0, 5)}`;

  // Gulika Kaal parts
  const guliParts = [6, 5, 4, 3, 2, 1, 0];
  const guliStart = new Date(sunriseDate.getTime() + guliParts[dayIndex] * partDurationMs);
  const guliEnd = new Date(guliStart.getTime() + partDurationMs);
  const gulikaKaal = `${formatTimeHHMMSS(guliStart).substring(0, 5)} - ${formatTimeHHMMSS(guliEnd).substring(0, 5)}`;

  // Abhijit Muhurat: 8th of 15 muhurats
  const muhuratDurationMs = dinKaalMs / 15;
  const abhijitStart = new Date(sunriseDate.getTime() + 7 * muhuratDurationMs);
  const abhijitEnd = new Date(abhijitStart.getTime() + muhuratDurationMs);
  const abhijitMuhurat = `${formatTimeHHMMSS(abhijitStart).substring(0, 5)} - ${formatTimeHHMMSS(abhijitEnd).substring(0, 5)}`;

  // Amrit Kaal & Dur Muhurat
  const dur1Start = new Date(sunriseDate.getTime() + 2 * muhuratDurationMs);
  const dur1End = new Date(dur1Start.getTime() + muhuratDurationMs);
  const durMuhurat = `${formatTimeHHMMSS(dur1Start).substring(0, 5)} - ${formatTimeHHMMSS(dur1End).substring(0, 5)}`;
  const amritKaal = '06:45 - 08:15';

  // 11. Pada / Charan calculation
  // Each nakshatra has 4 padas (3°20' each)
  const currentPada = Math.floor((siderealMoon % (360 / 27)) / (360 / 108)) + 1;
  const currNakData = NAKSHATRA_DATA[nakshatraIndex];
  const nextNakData = NAKSHATRA_DATA[nextNakshatraIndex];

  const padaCharan: PadaCharanItem[] = [
    {
      pada: currentPada,
      syllable: {
        en: currNakData.padasEn[currentPada - 1] || '',
        hi: currNakData.padas[currentPada - 1] || '',
      },
      nakshatra: currNakData.name,
      time: formatTimeHHMMSS(nakshatraEndDate),
    },
    {
      pada: 1,
      syllable: { en: nextNakData.padasEn[0], hi: nextNakData.padas[0] },
      nakshatra: nextNakData.name,
      time: formatTimeHHMMSS(new Date(nakshatraEndDate.getTime() + 6 * 3600000)),
    },
    {
      pada: 2,
      syllable: { en: nextNakData.padasEn[1], hi: nextNakData.padas[1] },
      nakshatra: nextNakData.name,
      time: formatTimeHHMMSS(new Date(nakshatraEndDate.getTime() + 12 * 3600000)),
    },
    {
      pada: 3,
      syllable: { en: nextNakData.padasEn[2], hi: nextNakData.padas[2] },
      nakshatra: nextNakData.name,
      time: `${formatTimeHHMMSS(new Date(nakshatraEndDate.getTime() + 18 * 3600000))}*`,
    },
  ];

  // 12. Festivals Detection
  const festivals: LocalizedString[] = [];
  // Specific famous tithi festivals
  if (isShukla && tithiIndex === 13 && amantaMonth.en === 'Bhadrapada') {
    festivals.push({ en: 'Anant Chaturdashi', hi: 'अनंत चतुर्दशी' });
  } else if (isShukla && tithiIndex === 3 && amantaMonth.en === 'Bhadrapada') {
    festivals.push({ en: 'Ganesh Chaturthi', hi: 'गणेश चतुर्थी' });
  } else if (!isShukla && tithiIndex === 22 && amantaMonth.en === 'Bhadrapada') {
    festivals.push({ en: 'Krishna Janmashtami', hi: 'श्रीकृष्ण जन्माष्टमी' });
  } else if (tithiIndex === 10 || tithiIndex === 25) {
    festivals.push({ en: 'Ekadashi Vrat', hi: 'एकादशी व्रत' });
  } else if (tithiIndex === 14) {
    festivals.push({ en: 'Satyanarayan Purnima', hi: 'सत्यनारायण पूर्णिमा व्रत' });
  } else if (tithiIndex === 29) {
    festivals.push({ en: 'Amavasya Pitru Tarpan', hi: 'दर्श अमावस्या' });
  } else if (tithiIndex === 3) {
    festivals.push({ en: 'Vinayaka Chaturthi', hi: 'विनायक चतुर्थी' });
  } else if (tithiIndex === 18) {
    festivals.push({ en: 'Sankashti Chaturthi', hi: 'संकष्टी चतुर्थी' });
  } else if (tithiIndex === 12 || tithiIndex === 27) {
    festivals.push({ en: 'Pradosh Vrat', hi: 'प्रदोष व्रत' });
  } else if (tithiIndex === 28) {
    festivals.push({ en: 'Masik Shivaratri', hi: 'मासिक शिवरात्रि' });
  }

  // Localized date string
  const HI_MONTHS = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
  const EN_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dateStr: LocalizedString = {
    en: `${date.getDate()} ${EN_MONTHS[date.getMonth()]} ${date.getFullYear()}`,
    hi: `${date.getDate()} ${HI_MONTHS[date.getMonth()]} ${date.getFullYear()}`,
  };

  const headerSummary: LocalizedString = {
    en: `${TITHI_NAMES[tithiIndex].en}, ${paksha.en}, ${amantaMonth.en}`,
    hi: `${TITHI_NAMES[tithiIndex].hi}, ${paksha.hi}, ${amantaMonth.hi}`,
  };

  const chandraRashiDisplay: LocalizedString = {
    en: `${RASHI_NAMES[moonRashiIndex].en} till ${formatTime12h(moonTransitDate)}, then ${RASHI_NAMES[nextMoonRashiIndex].en}`,
    hi: `${RASHI_NAMES[moonRashiIndex].hi} (${formatTimeHHMMSS(moonTransitDate)} तक), फिर ${RASHI_NAMES[nextMoonRashiIndex].hi}`,
  };

  const suryaRashiDisplay: LocalizedString = {
    en: `${RASHI_NAMES[sunRashiIndex].en} ${sunDegreeStr}`,
    hi: `${RASHI_NAMES[sunRashiIndex].hi} ${sunDegreeStr}`,
  };

  return {
    date,
    dateStr,
    locationName,
    waar,
    headerSummary,
    festivals,
    tithi: {
      name: TITHI_NAMES[tithiIndex],
      endTime: formatTimeHHMMSS(tithiEndDate),
      tillText: {
        en: `Till ${formatTime12h(tithiEndDate)}`,
        hi: `${formatTimeHHMMSS(tithiEndDate)} तक`,
      },
    },
    paksha,
    nakshatra: {
      name: NAKSHATRA_DATA[nakshatraIndex].name,
      endTime: formatTimeHHMMSS(nakshatraEndDate),
      tillText: {
        en: `Till ${formatTime12h(nakshatraEndDate)}`,
        hi: `${formatTimeHHMMSS(nakshatraEndDate)} तक`,
      },
      nextName: NAKSHATRA_DATA[nextNakshatraIndex].name,
    },
    yoga: {
      name: YOGA_NAMES[yogaIndex],
      endTime: formatTimeHHMMSS(yogaEndDate),
      tillText: {
        en: `Till ${formatTime12h(yogaEndDate)}`,
        hi: `${formatTimeHHMMSS(yogaEndDate)} तक`,
      },
    },
    karana1: {
      name: karana1Name,
      endTime: formatTimeHHMMSS(karana1EndDate),
      tillText: {
        en: `Till ${formatTime12h(karana1EndDate)}`,
        hi: `${formatTimeHHMMSS(karana1EndDate)} तक`,
      },
    },
    karana2: {
      name: karana2Name,
      endTime: formatTimeHHMMSS(karana2EndDate),
      tillText: {
        en: `Till ${formatTime12h(karana2EndDate)}`,
        hi: `${formatTimeHHMMSS(karana2EndDate)} तक`,
      },
    },
    amantaMonth,
    purnimantaMonth,
    ritu,
    ayan,
    chandraRashi: {
      current: RASHI_NAMES[moonRashiIndex],
      transitTime: formatTimeHHMMSS(moonTransitDate),
      next: RASHI_NAMES[nextMoonRashiIndex],
      display: chandraRashiDisplay,
    },
    suryaRashi: {
      name: RASHI_NAMES[sunRashiIndex],
      degree: sunDegreeStr,
      display: suryaRashiDisplay,
    },
    sunrise: formatTimeHHMMSS(sunriseDate),
    sunset: formatTimeHHMMSS(sunsetDate),
    moonrise: formatTimeHHMMSS(moonriseDate),
    moonset: `${formatTimeHHMMSS(moonsetDate)}*`,
    dinKaal,
    ratriKaal,
    sunriseLagna,
    sunNakshatra,
    moonNakshatra,
    vikramSamvat: {
      en: `${vikramYear} Vikram Samvat`,
      hi: `${vikramYear} विक्रम संवत`,
    },
    shakaSamvat: {
      en: `${shakaYear} Shaka Samvat`,
      hi: `${shakaYear} शक संवत`,
    },
    gujaratiSamvat: {
      en: `${gujaratiYear} Vikram Samvat`,
      hi: `${gujaratiYear} विक्रम संवत`,
    },
    kaliSamvat: {
      en: `${kaliYear} Kali Samvat`,
      hi: `${kaliYear} गत कलि संवत`,
    },
    samvatsar,
    samvatsarNorth,
    saurPravishte,
    abhijitMuhurat,
    amritKaal,
    rahuKaal,
    yamaganda,
    gulikaKaal,
    durMuhurat,
    padaCharan,
  };
}
