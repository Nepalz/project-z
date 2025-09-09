import { Post } from '@/types';

export const STATIC_POSTS: Post[] = [
  {
    id: '1',
    content: 'Breaking: Student protest at Tribhuvan University demanding education reform. Peaceful demonstration ongoing. #StudentVoice #Nepal',
    mediaType: 'video',
    username: 'nepal_x7k2m',
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    reports: 0,
    isVisible: true,
    likes: 45,
    dislikes: 3,
    shares: 8
  },
  {
    id: '2',
    content: 'Police blocking access to Maitighar Mandala. Citizens gathering for peaceful assembly.',
    mediaType: 'image',
    username: 'voice_m4j8s',
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    reports: 0,
    isVisible: true,
    likes: 123,
    dislikes: 8,
    shares: 67
  },
  {
    id: '3',
    content: 'Live from Kathmandu: Political party rally causing traffic disruption. Alternative routes suggested.',
    mediaType: 'video',
    username: 'anon_8k9x3',
    timestamp: Date.now() - 1000 * 60 * 60 * 4, // 4 hours ago
    reports: 1,
    isVisible: true,
    likes: 78,
    dislikes: 12,
    shares: 15
  },
  {
    id: '4',
    content: 'Student union leaders addressing media about education policies. Key demands outlined.',
    mediaType: 'image',
    username: 'user_p2q7r',
    timestamp: Date.now() - 1000 * 60 * 60 * 6, // 6 hours ago
    reports: 0,
    isVisible: true,
    likes: 234,
    dislikes: 15,
    shares: 89
  },
  {
    id: '5',
    content: 'Community kitchen set up for protesters. Local businesses showing support.',
    mediaType: 'image',
    username: 'nepal_t5u8v',
    timestamp: Date.now() - 1000 * 60 * 60 * 8, // 8 hours ago
    reports: 0,
    isVisible: true,
    likes: 167,
    dislikes: 5,
    shares: 34
  },
  {
    id: '6',
    content: 'Emergency medical team on standby at protest site. Safety measures in place.',
    mediaType: 'none',
    username: 'voice_w9x2y',
    timestamp: Date.now() - 1000 * 60 * 60 * 10, // 10 hours ago
    reports: 0,
    isVisible: true,
    likes: 89,
    dislikes: 2,
    shares: 23
  }
];