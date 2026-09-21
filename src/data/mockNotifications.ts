import { NotificationItem } from '../types/notifications';

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    type: 'festival',
    title: 'Upcoming Festival: Diwali',
    message: 'Namaste Pandit Ji, Diwali is just 3 days away. Prepare your Muhurat and Samagri lists for your clients.',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    isRead: false,
  },
  {
    id: 'n2',
    type: 'community',
    title: 'New Reply in Community',
    message: 'Acharya Shukla replied to your question about "Navagraha Shanti Havan".',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isRead: false,
  },
  {
    id: 'n3',
    type: 'panchang',
    title: 'Daily Panchang Alert',
    message: 'Today is Shukla Chaturthi. Rahu Kaal starts at 15:00. View full details on your home screen.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    isRead: true,
  },
  {
    id: 'n4',
    type: 'subscription',
    title: 'Subscription Renewal Warning',
    message: 'Your Vipra Saarthi Premium subscription will expire in 5 days. Tap here to renew and keep your data synced.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isRead: true,
  },
  {
    id: 'n5',
    type: 'update',
    title: 'App Update Available (v1.2)',
    message: 'We have added a new Dakshina Calculator feature as requested by the community! Update now.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    isRead: true,
  }
];
