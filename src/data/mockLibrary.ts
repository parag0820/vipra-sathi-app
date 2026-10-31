import { Stotram, Aarti } from '../types/library';

export const STOTRAM_CATEGORIES = [
  'All',
  'Ganesh Stotras',
  'Shiva Stotras',
  'Vishnu Stotras',
  'Durga Stotras',
  'Lakshmi Stotras',
  'Hanuman Stotras'
];

const DUMMY_AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

export const MOCK_STOTRAS: Stotram[] = [
  {
    id: 's1',
    title: 'Sankat Nashan Stotram',
    category: 'Ganesh Stotras',
    subCategory: 'Sankat Nashan',
    audioUrl: DUMMY_AUDIO_URL,
    content: `Pranamya shirasa devam Gauri putram Vinayakam.
Bhavthavasam smare nityam ayuh kama artha sidhaye.

Prathamam Vakratundam cha, Ekadantam dwitiyakam.
Tritiyam Krishna Pingaksham, Gajavaktram Chaturthakam.

Lambodaram Panchamam cha, Shashtham Vikatameva cha.
Saptamam Vighna Rajam cha, Dhoomravarnam tathashtamam.

Navamam Bhalchandram cha, Dashamam tu Vinayakam.
Ekadasham Ganapatim, Dwadasham tu Gajananam.`
  },
  {
    id: 's2',
    title: 'Ganapati Atharvashirsha',
    category: 'Ganesh Stotras',
    subCategory: 'Upanishad',
    audioUrl: DUMMY_AUDIO_URL,
    content: `Om Namaste Ganapataye.
Tvameva pratyaksham tattvamasi.
Tvameva kevalam kartasi.

Tvameva kevalam dhartasi.
Tvameva kevalam hartasi.
Tvameva sarvam khalvidam brahmasi.
Tvam sakshadatmasi nityam.`
  },
  {
    id: 's3',
    title: 'Ganesh Pancharatnam',
    category: 'Ganesh Stotras',
    subCategory: 'Pancharatnam',
    audioUrl: DUMMY_AUDIO_URL,
    content: `Muda Karatta Modakam Sada Vimukti Sadhakam
Kala Dharavatamsakam Vilasi Loka Rakshakam

Anayakaika Nayakam Vinasitebha Daityakam
Natasubhasu Nasakam Namami Tham Vinayakam.`
  },
  {
    id: 's4',
    title: 'Vishnu Sahasranamam (Excerpt)',
    category: 'Vishnu Stotras',
    subCategory: 'Sahasranama',
    audioUrl: DUMMY_AUDIO_URL,
    content: `Shuklam-baradharam vishnum shashi-varnam chatur-bhujam
Prasanna-vadanam dhyayet sarva-vighnopa-shantaye

Vyasam vasishtha-naptaram shakteh pautram-akalmasham
Parasharatmajam vande shukatatam taponidhim`
  },
  {
    id: 's5',
    title: 'Ganesh Kavach',
    category: 'Ganesh Stotras',
    subCategory: 'Kavach',
    audioUrl: DUMMY_AUDIO_URL,
    content: `Esoumati prasarpaami kavacham sarvakaamikam.
Shrunu vakshyaami te devi kavacham sarvasiddhidam.

Ganeshou me shirah paatu, bhaalam paatu Gajaananah.`
  },
  {
    id: 's6',
    title: 'Vakratunda Mahakaya',
    category: 'Ganesh Stotras',
    subCategory: 'Dhyan',
    audioUrl: DUMMY_AUDIO_URL,
    content: `Vakratunda Mahakaya,
Suryakoti Samaprabha,

Nirvighnam Kuru Me Deva,
Sarvakaryeshu Sarvada.`
  },
  {
    id: 's7',
    title: 'Shiv Tandav Stotram',
    category: 'Shiva Stotras',
    subCategory: 'Tandav Stotram',
    audioUrl: DUMMY_AUDIO_URL,
    content: `Jata tavee gala jjala pravaha pavitha sthale,
Gale avalambya lambitham bhujanga thunga malikam.

Dama ddama ddama ddaman ninaadvaddamarvayam,
Chakara chanda thandavam thanothu na shiva shivam.

Jata kataha sambhramab hramanni limpani rjharee,
Vilola vee chivallaree viraja mana moordhani.

Dhagadhagaddhagajjvala llalata patta pavake,
Kishora chandra shekhare rathi prathikshanam mama.`
  },
  {
    id: 's8',
    title: 'Shiv Lingashtakam',
    category: 'Shiva Stotras',
    subCategory: 'Ashtakam',
    audioUrl: DUMMY_AUDIO_URL,
    content: `Brahma Murari Suraarchita Lingam
Nirmala Bhaashita Shobhita Lingam

Janmaja Dukkha Vinaashaka Lingam
Tat-Pranamaami Sadaashiva Lingam.

Devamuni Pravaraarchita Lingam
Kaamadahana Karunaakara Lingam

Raavana Darpa Vinaashaka Lingam
Tat-Pranamaami Sadaashiva Lingam.`
  },
  {
    id: 's9',
    title: 'Argala Stotram',
    category: 'Durga Stotras',
    subCategory: 'Stotram',
    audioUrl: DUMMY_AUDIO_URL,
    content: `Jayanti Mangala Kali Bhadrakali Kapalini.
Durga Kshama Shiva Dhatri Swaha Swadha Namostute.

Jaya Tvam Devi Chamunde Jaya Bhutartiharini.
Jaya Sarvagate Devi Kalratri Namostute.

Madhu Kaitabha Vidravin Vidhatra Varade Namah.
Rupam Dehi Jayam Dehi Yasho Dehi Dviso Jahi.`
  },
  {
    id: 's10',
    title: 'Shri Suktam',
    category: 'Lakshmi Stotras',
    subCategory: 'Vedic Suktam',
    audioUrl: DUMMY_AUDIO_URL,
    content: `Om Hiranyavarnam Harineem Suvarnarajatasrajam
Chandraam Hiranmayeem Lakshmeem Jaatavedo Ma Aavaha.

Taam Ma Aavaha Jaatavedo Lakshmeemanapagaamineem
Yasyaam Hiranyam Vindeyam Gaamashvam Purushanaham.

Ashwapurvaam Rathamadhyaam Hastinaada Prabodhineem
Shriyam Devee-mupahvaye Shreerma Devee Jushataam.`
  },
  {
    id: 's11',
    title: 'Hanuman Chalisa',
    category: 'Hanuman Stotras',
    subCategory: 'Chalisa',
    audioUrl: DUMMY_AUDIO_URL,
    content: `Shri Guru Charan Saroj Raj, Nij Manu Mukuru Sudhari.
Barnao Rahubhar Bimal Jasu, Jo Dayaku Phal Chari.

Buddhiheen Tanu Janike, Sumirau Pavan-Kumar.
Bal Buddhi Vidya Dehu Mohi, Harahu Kalesh Bikaar.

Jai Hanuman Gyan Gun Sagar,
Jai Kapis Tihun Lok Ujagar.
Ram Doot Atulit Bal Dhama,
Anjani Putra Pavan Sut Nama.`
  },
  {
    id: 's12',
    title: 'Sankat Mochan Hanumanashtak',
    category: 'Hanuman Stotras',
    subCategory: 'Ashtakam',
    audioUrl: DUMMY_AUDIO_URL,
    content: `Baal Samay Ravi Bhakshi Liyo Tab,
Teenahu Lok Bhayo Andhiyaro.

Taahi So Tras Bhayo Jag Ko,
Yeh Sankat Kahu So Jaat Na Taron.

Devan Aani Kari Vinati Tab,
Chhadi Diyo Ravi Kashta Nivaaro.

Ko Nahin Jaanat Hai Jag Mein Kapi,
Sankat Mochan Naam Tiharo.`
  }
];

export const AARTI_CATEGORIES = [
  'All',
  'Ganesh Aarti',
  'Shiva Aarti',
  'Vishnu Aarti',
  'Durga Aarti',
  'Lakshmi Aarti',
  'Hanuman Aarti'
];

export const MOCK_AARTIS: Aarti[] = [
  {
    id: 'a1',
    title: 'Jai Ganesh Deva',
    category: 'Ganesh Aarti',
    subCategory: 'Aarti',
    audioUrl: DUMMY_AUDIO_URL,
    imageUrl: 'https://images.unsplash.com/photo-1579564639904-e5357c9ee364?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    content: `Jai Ganesh Jai Ganesh,
Jai Ganesh Deva
Mata Jaki Parvati
Pita Mahadeva.

Ek Dant Dayavant,
Char Bhuja Dhari
Mathe Sindur Sohai,
Muse Ki Savari.

Andhan Ko Aankh Det,
Korthin Ko Kaya
Banjhan Ko Putra Det,
Nirdhan Ko Maya.

Pan Chadhe Phul Chadhe,
Aur Chadhe Meva
Ladduan Ka Bhog Lage,
Sant Kare Seva.

Din Ki Laaj Rakho,
Shambhu Sut Vari
Kamana Ko Purna Karo,
Jag Balihari.`
  },
  {
    id: 'a2',
    title: 'Om Jai Jagdish Hare',
    category: 'Vishnu Aarti',
    subCategory: 'Maha Aarti',
    audioUrl: DUMMY_AUDIO_URL,
    imageUrl: 'https://images.unsplash.com/photo-1629532587783-a79fa4f519eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    content: `Om Jai Jagdish hare,
Swami Jai Jagdish hare,
Bhakt jano ke sankat,
Das jano ke sankat,
Kshan men dur kare,
Om Jai Jagdish hare.

Jo Dhyave Phal Pave,
Dukh Binse Man Ka,
Swami Dukh Binse Man Ka.
Sukh Sampati Ghar Ave,
Kasht Mite Tan Ka,
Om Jai Jagdish hare.

Mata Pita Tum Mere,
Sharan Gahu Main Kiski,
Swami Sharan Gahu Main Kiski.
Tum Bin Aur Na Duja,
Aas Karun Jiski,
Om Jai Jagdish hare.

Tum Puran Paramatma,
Tum Antaryami,
Parabrahma Parameshwar,
Tum Sabke Swami,
Om Jai Jagdish hare.`
  },
  {
    id: 'a3',
    title: 'Aarti Kije Hanuman Lala Ki',
    category: 'Hanuman Aarti',
    subCategory: 'Aarti',
    audioUrl: DUMMY_AUDIO_URL,
    imageUrl: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    content: `Aarti kije Hanuman lala ki,
Dusht dalan Raghunath kala ki.
Jake bal se girivar kanpe,
Rog dosh ja ke nikat na jhankhe.

Anjani putra Maha baldayi,
Santan ke prabhu sada sahayi.
De beera Raghunath pathaye,
Lanka jari siya sudi laye.

Lanka so kot samudra si khai,
Jat pavan sut bar na lai.
Lanka jari asur samhare,
Siyaramji ke kaj savare.

Sur nar muni aarti utare,
Jai jai jai Hanuman uchare.
Kanchan thaal kapur lau chhai,
Aarti karat Anjana mai.`
  },
  {
    id: 'a4',
    title: 'Om Jai Shiv Omkara',
    category: 'Shiva Aarti',
    subCategory: 'Maha Aarti',
    audioUrl: DUMMY_AUDIO_URL,
    imageUrl: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    content: `Om Jai Shiv Omkara,
Prabhu Har Shiv Omkara.
Brahma Vishnu Sadashiv,
Ardhangi Dhara.
Om Jai Shiv Omkara.

Ekanan Chaturanana,
Panchanan Raje.
Hansanan Garudasan,
Vrishavahan Saje.
Om Jai Shiv Omkara.

Do Bhuj Char Chaturbhuj,
Dashabhuj Ati Sohe.
Tinon Roop Nirakhata,
Tribhuvan Jan Mohe.
Om Jai Shiv Omkara.

Akshyamala Banamala,
Rundamala Dhari.
Tripurari Kamsari,
Kar Mala Dhari.
Om Jai Shiv Omkara.`
  },
  {
    id: 'a5',
    title: 'Ambe Tu Hai Jagdambe Kali',
    category: 'Durga Aarti',
    subCategory: 'Aarti',
    audioUrl: DUMMY_AUDIO_URL,
    imageUrl: 'https://images.unsplash.com/photo-1579564639904-e5357c9ee364?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    content: `Ambe Tu Hai Jagdambe Kali,
Jai Durge Khappar Wali.
Tere Hi Gun Gave Bharati,
O Maiya Hum Sab Utare Teri Aarti.

Tere Bhakt Jano Par Mata,
Bhir Padi Hai Bhari.
Danav Dal Par Toot Pado Maa,
Karke Singh Savari.
O Maiya Hum Sab Utare Teri Aarti.

Maan Bete Ka Hai Is Jag Me,
Bada Hi Nirmal Nata.
Poot Kapoot Sune Hai Par Na,
Mata Suni Kumata.
O Maiya Hum Sab Utare Teri Aarti.`
  },
  {
    id: 'a6',
    title: 'Om Jai Lakshmi Mata',
    category: 'Lakshmi Aarti',
    subCategory: 'Aarti',
    audioUrl: DUMMY_AUDIO_URL,
    imageUrl: 'https://images.unsplash.com/photo-1629532587783-a79fa4f519eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    content: `Om Jai Lakshmi Mata,
Maiya Jai Lakshmi Mata.
Tumko Nishidin Sevat,
Hari Vishnu Vidhata.
Om Jai Lakshmi Mata.

Uma Rama Brahmani,
Tum Hi Jag-Mata.
Surya-Chandrama Dhyavat,
Narad Rishi Gata.
Om Jai Lakshmi Mata.

Durga Roop Niranjani,
Sukh Sampati Data.
Jo Koyi Tumko Dhyavat,
Riddhi Siddhi Pata.
Om Jai Lakshmi Mata.`
  }
];
