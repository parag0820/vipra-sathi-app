import { Pooja } from '../types/pooja';

export const CATEGORIES = [
  'All',
  'Vishnu Pooja',
  'Ganesh Pooja',
  'Shiva Pooja',
  'Durga Pooja',
  'Lakshmi Pooja',
  'Hanuman Pooja'
];

export const MOCK_POOJAS: Pooja[] = [
  {
    id: 'p1',
    title: 'Ganesh Chaturthi Pooja',
    category: 'Ganesh Pooja',
    subCategory: 'Shodashopchar Pooja',
    sections: [
      { sectionId: 's1', sectionType: 'Heading', content: 'Ganesh Chaturthi Special' },
      { sectionId: 's2', sectionType: 'Description', content: 'This pooja is performed to invoke the blessings of Lord Ganesha, the remover of obstacles.' },
      { sectionId: 's3', sectionType: 'Dhyan', content: 'Vakratunda Mahakaya Surya Koti Samaprabha\nNirvighnam Kuru Me Deva Sarva Karyeshu Sarvada' },
      { sectionId: 's4', sectionType: 'Heading', content: 'Main Mantra' },
      { sectionId: 's5', sectionType: 'Mantra', content: 'Om Gam Ganapataye Namaha' },
    ]
  },
  {
    id: 'p2',
    title: 'Satyanarayan Vrat Katha',
    category: 'Vishnu Pooja',
    subCategory: 'Panchopchar Pooja',
    sections: [
      { sectionId: 's1', sectionType: 'Heading', content: 'Satyanarayan Vrat' },
      { sectionId: 's2', sectionType: 'Description', content: 'Dedicated to Lord Vishnu in his manifestation as Lord Satyanarayan. Performed for prosperity and happiness.' },
      { sectionId: 's3', sectionType: 'Dhyan', content: 'Shantakaram Bhujagashayanam Padmanabham Suresham\nVishwadharam Gaganasadrisham Meghavarnam Shubhangam' },
      { sectionId: 's4', sectionType: 'Heading', content: 'Mantra' },
      { sectionId: 's5', sectionType: 'Mantra', content: 'Om Namo Bhagavate Vasudevaya' },
    ]
  },
  {
    id: 'p3',
    title: 'Maha Shivratri Pooja',
    category: 'Shiva Pooja',
    subCategory: 'Rajopchar Pooja',
    sections: [
      { sectionId: 's1', sectionType: 'Heading', content: 'Shivratri Rudrabhishek' },
      { sectionId: 's2', sectionType: 'Description', content: 'The great night of Shiva, involves offering Bael leaves, milk, and water to the Shiva Linga.' },
      { sectionId: 's3', sectionType: 'Mantra', content: 'Om Namah Shivaya' },
      { sectionId: 's4', sectionType: 'Mantra', content: 'Mahamrityunjaya Mantra: Om Tryambakam Yajamahe...' },
    ]
  },
  {
    id: 'p4',
    title: 'Comprehensive Pooja ',
    category: 'All',
    subCategory: 'Complete Setup',
    sections: [
      { sectionId: 's1', sectionType: 'Heading', content: 'Sankalp' },
      { sectionId: 's2', sectionType: 'Vidhi', content: 'Take water, rice, and flowers in your right hand. State your name, gotra, and the purpose of the pooja.' },
      { sectionId: 's3', sectionType: 'Mantra', content: 'Om Vishnu Vishnu Vishnu... Tithou... Vasare... Sankalpam Aham Karishye.' },
      { sectionId: 's4', sectionType: 'Audio', content: 'sankalp_audio.mp3' },

      { sectionId: 'g1', sectionType: 'Heading', content: 'Ganesh Pujan' },
      { sectionId: 'g2', sectionType: 'Vidhi', content: 'Offer water, sandalwood paste, and durva grass to Lord Ganesha.' },
      { sectionId: 'g3', sectionType: 'Mantra', content: 'Om Gam Ganapataye Namaha' },
      { sectionId: 'g4', sectionType: 'Audio', content: 'ganesh_audio.mp3' },

      { sectionId: 'k1', sectionType: 'Heading', content: 'Kalash Pujan' },
      { sectionId: 'k2', sectionType: 'Vidhi', content: 'Place mango leaves in the kalash and top it with a coconut. Invoke the holy rivers.' },
      { sectionId: 'k3', sectionType: 'Mantra', content: 'Gange Cha Yamune Chaiva Godavari Saraswati...' },
      { sectionId: 'k4', sectionType: 'Audio', content: 'kalash_audio.mp3' },

      { sectionId: 'n1', sectionType: 'Heading', content: 'Navgraha' },
      { sectionId: 'n2', sectionType: 'Vidhi', content: 'Invoke the nine planets using akshat (rice) and offer prayers for peace.' },
      { sectionId: 'n3', sectionType: 'Mantra', content: 'Om Brahma Murari Tripurantkari Bhanuh Shashi Bhumisutau...' },
      { sectionId: 'n4', sectionType: 'Audio', content: 'navgraha_audio.mp3' },

      { sectionId: 'm1', sectionType: 'Heading', content: 'Main Pooja' },
      { sectionId: 'm2', sectionType: 'Vidhi', content: 'Perform the Shodashopchar (16-step) worship for the main deity.' },
      { sectionId: 'm3', sectionType: 'Mantra', content: 'Om Namo Bhagavate Vasudevaya' },
      { sectionId: 'm4', sectionType: 'Audio', content: 'main_pooja_audio.mp3' },

      { sectionId: 'a1', sectionType: 'Heading', content: 'Aarti' },
      { sectionId: 'a2', sectionType: 'Vidhi', content: 'Light the camphor or ghee lamp and sing the aarti.' },
      { sectionId: 'a3', sectionType: 'Mantra', content: 'Om Jai Jagdish Hare...' },
      { sectionId: 'a4', sectionType: 'Audio', content: 'aarti_audio.mp3' },

      { sectionId: 'h1', sectionType: 'Heading', content: 'Havan' },
      { sectionId: 'h2', sectionType: 'Vidhi', content: 'Offer ahutis into the sacred fire using ghee and havan samagri.' },
      { sectionId: 'h3', sectionType: 'Mantra', content: 'Om Swaha, Idam Na Mama...' },
      { sectionId: 'h4', sectionType: 'Audio', content: 'havan_audio.mp3' },
    ]
  }
];
