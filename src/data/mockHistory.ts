import { HistoryItem } from '../types/history';

export const MOCK_HISTORY: HistoryItem[] = [
  {
    id: 'h1',
    type: 'pdf',
    title: 'Ganesh Pooja Vidhi PDF Generated',
    description: 'Generated a customized PDF for the upcoming Ganesh Pooja.',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    metadata: {
      fileSize: '1.2 MB'
    }
  },
  {
    id: 'h2',
    type: 'view',
    title: 'Viewed Vishnu Sahasranamam',
    description: 'Accessed Stotram Library',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
  },
  {
    id: 'h3',
    type: 'activity',
    title: 'Added new booking: Vastu Shanti',
    description: 'Scheduled on Availability Calendar',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
  },
  {
    id: 'h4',
    type: 'download',
    title: 'Downloaded Diwali Pooja Samagri List',
    description: 'Saved to local device storage.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    metadata: {
      fileSize: '450 KB'
    }
  },
  {
    id: 'h5',
    type: 'invoice',
    title: 'Vipra Saarthi Premium Subscription',
    description: 'Annual renewal successful.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    metadata: {
      amount: 999
    }
  },
  {
    id: 'h6',
    type: 'view',
    title: 'Viewed Kundali: Rahul Sharma',
    description: 'Accessed Kundali matching module.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), // 6 days ago
  }
];
