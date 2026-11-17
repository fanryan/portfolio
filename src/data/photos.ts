import type { Photo } from '../types/content';

// Add photos here; the gallery updates automatically.
// Keep source images in public/images. Use an accurate caption and descriptive alt text.
export const photos: Photo[] = [
  {
    src: '/images/photo1.jpg',
    caption: 'Hiking Tre Cime',
    category: 'Outdoors',
    alt: 'Friends on a rocky summit surrounded by mountains and clouds',
    position: '50% 65%',
    width: 1090,
    height: 1636,
  },
  {
    src: '/images/editorial/mddi-scholarship-ceremony-2026.jpg',
    caption: 'MDDI Family Scholarship Ceremony 2026',
    category: 'Scholarship',
    alt: 'Ryan receiving an SG Digital Scholarship at the MDDI Family Scholarship Ceremony 2026',
    position: '50% 50%',
    width: 1600,
    height: 1067,
  },
  {
    src: '/images/editorial/mirror.webp',
    caption: 'Taiwan trip with RHAG Floaters',
    category: 'With friends',
    alt: 'Friends reflected in a roadside mirror',
    position: '50% 65%',
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
    position: '50% 64%',
    width: 1280,
    height: 960,
  },
  {
    src: '/images/editorial/scuba-diving.jpg',
    caption: 'Diving in Tioman',
    category: 'In the water',
    alt: 'A group of friends in scuba gear floating in the sea',
    position: '50% 50%',
    width: 1600,
    height: 1195,
  },
];
