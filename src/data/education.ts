import type { Education } from '../types/content';

export const education: Education[] = [
  {
    name: 'National University of Singapore',
    logo: {
      src: '/images/nus.png',
      alt: 'NUS School of Computing',
      width: 230,
      height: 46,
    },
    dates: 'AUG 2024 — MAY 2028 · EXPECTED',
    qualification: 'BSc in Business Analytics',
    result: { label: 'GPA', value: '4.81 / 5.00' },
    awards: [
      'SG Digital Scholarship',
      'Top Students for Application Systems Development (BT3103)',
    ],
    activities: {
      group: 'Raffles Hall',
      logo: '/images/raffles-hall.png',
      items: [
        'Floorball Captain',
        'Sports Management Committee Chairperson',
        'Track member',
        'Road Relay member',
        'Block Committee member',
        'Secretariat member',
        'RHDevelopers member',
        'Rag and Flag (Floats) member',
      ],
    },
    exchange: {
      name: 'Aarhus University',
      logo: '/images/aarhus.png',
      dates: 'AUG — DEC 2026 · EXCHANGE',
      description: 'Student Exchange Programme',
    },
  },
  {
    name: 'Hwa Chong Institution',
    logo: {
      src: '/images/hci.png',
      alt: 'Hwa Chong Institution',
      width: 190,
      height: 68,
    },
    dates: '2016 — 2021',
    qualification: 'Singapore-Cambridge GCE Advanced Level',
    result: { label: 'Rank points', value: '88.75' },
    awards: ['Edusave Scholarship for Independent Schools'],
    activities: {
      items: [
        'Secretary · Project Hear Me Out',
        'Patrol Leader · Hwa Chong Scout Group',
        'Member · Hwa Chong Floorball',
      ],
    },
  },
];
