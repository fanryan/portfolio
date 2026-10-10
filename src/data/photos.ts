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
    width: 1090,
    height: 1636,
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
    src: '/images/editorial/mirror.webp',
    caption: 'A stop along the way',
    category: 'With friends',
    alt: 'Friends reflected in a roadside mirror',
    position: '50% 50%',
    width: 960,
    height: 1280,
  },
  {
    src: '/images/editorial/highfive.webp',
    caption: 'On court',
    category: 'Floorball',
    alt: 'Two floorball teammates high-fiving on court',
    position: '50% 15%',
    width: 1280,
    height: 1919,
  },
  {
    src: '/images/editorial/run.webp',
    caption: 'Run for Hope 2024',
    category: 'Outside',
    alt: 'Friends posing together at Run for Hope 2024',
    position: '50% 50%',
    width: 1280,
    height: 960,
  },
  {
    src: '/images/photo2.jpg',
    caption: 'Raffles Hall Floorball',
    category: 'With the team',
    alt: 'The Raffles Hall floorball team together on an indoor court',
    position: '50% 50%',
    width: 1000,
    height: 666,
  },
];
