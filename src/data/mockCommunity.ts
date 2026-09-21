import { Post } from '../types/community';

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    type: 'question',
    title: 'Proper sequence for Navagraha Shanti Havan?',
    content: 'I have been performing Navagraha Shanti for years, but recently a senior Pandit suggested a different sequence for the Ahutis. Does anyone have a definitive reference from the Shastras on the exact order of planets?',
    author: {
      id: 'u1',
      name: 'Pandit Ramakant',
      verified: true
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    likes: 12,
    tags: ['Navagraha', 'Havan', 'Vidhi'],
    comments: [
      {
        id: 'c1',
        author: {
          id: 'u2',
          name: 'Acharya Shukla'
        },
        content: 'The standard sequence starts with Surya and ends with Ketu, but some traditions invoke them based on the days of the week. I follow the Brihat Parashara Hora Shastra guidelines.',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        likes: 5
      }
    ]
  },
  {
    id: 'p2',
    type: 'knowledge',
    title: 'Importance of Kusha Grass in Sankalpa',
    content: 'Kusha grass is considered a purifier. When taking Sankalpa, holding Kusha grass along with water and akshat signifies that the merit of the karma is firmly established. It acts as an energetic conductor.',
    author: {
      id: 'u3',
      name: 'Dr. Vedprakash',
      verified: true
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    likes: 45,
    tags: ['Sankalpa', 'Kusha', 'Philosophy'],
    comments: []
  },
  {
    id: 'p3',
    type: 'suggestion',
    title: 'Add Muhurat calculation for vehicle purchase',
    content: 'The app is great! It would be really helpful if the Muhurat section could automatically calculate the best days for purchasing a new vehicle based on the Panchang.',
    author: {
      id: 'u4',
      name: 'Pandit Sharma'
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    likes: 8,
    tags: ['App Suggestion', 'Muhurat'],
    comments: [
      {
        id: 'c2',
        author: {
          id: 'admin',
          name: 'Vipra Saarthi Team',
          verified: true
        },
        content: 'Thank you for the suggestion! We have added this to our roadmap for the next update.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
        likes: 15
      }
    ]
  }
];
