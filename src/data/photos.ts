import type { Photo } from '../types/content';

// Add photos here; the gallery and full-photo viewer update automatically.
// Keep source images in public/images. Use an accurate caption and descriptive alt text.
export const photos: Photo[] = [
  {
    src: '/images/photo1.jpg',
    caption: 'Out for a hike',
    category: 'Outdoors',
    alt: 'Friends on a rocky summit surrounded by mountains and clouds',
    position: '50% 75%',
    width: 733,
    height: 1100,
  },
  {
    src: '/images/mddi-scholarship-ceremony-2026.png',
    caption: 'MDDI Family Scholarship Ceremony 2026',
    category: 'Scholarship',
    alt: 'SG Digital Scholarship recipients and guests at the MDDI Family Scholarship Ceremony 2026',
    position: '50% 50%',
    width: 1280,
    height: 852,
  },
  {
    src: '/images/photo2.jpg',
    caption: 'Raffles Hall floorball',
    category: 'With the team',
    alt: 'The Raffles Hall floorball team together on an indoor court',
    position: '50% 50%',
    width: 1000,
    height: 666,
  },
];
