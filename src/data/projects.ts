import type { Project } from '../types/content';

export const projects: Project[] = [
  {
    name: 'PayCore',
    media: {
      src: '/images/projects/paycore-design.png',
      thumbnail: '/images/projects/paycore-design-preview.webp',
      alt: 'PayCore design whiteboard showing payment authorisation, idempotency, transactional outbox and settlement.',
      title: 'System design notes',
      width: 1536,
      height: 1024,
      notes: [
        'Payment state, holds and outbox events share a PostgreSQL transaction. Idempotency response completion happens afterwards, so the crash window shown here remains a known limitation.',
        'Kafka topics default to the event type. The event ID is sent in Kafka headers, while the payload uses snake_case gateway identifiers. LedgerFlow still needs payload and account mapping before these services work together end to end.',
        'The observability panel includes design goals. HTTP, outbox, settlement and other application metrics exist; this diagram does not establish that every listed metric or trace is implemented.',
      ],
    },
    label: 'Payment processing & settlement',
    summary:
      'A Go backend for payment authorisation, capture and settlement, designed to explore retries, concurrency and partial-failure handling.',
    details: [
      'Implemented payment holds, durable idempotency records and optimistic concurrency controls.',
      'Connected PostgreSQL transactions to Kafka through an outbox, with workers for event publishing and settlement.',
      'Added operational metrics and load-test scenarios for retries, contention and processing backlogs.',
    ],
    stack: ['Go', 'PostgreSQL', 'Redis', 'Kafka'],
    flow: ['Authorise', 'Capture', 'Settle'],
    repository: 'https://github.com/fanryan/paycore',
    tone: 'sky',
  },
  {
    name: 'LedgerFlow',
    media: {
      src: '/images/projects/ledgerflow-design.png',
      thumbnail: '/images/projects/ledgerflow-design-preview.webp',
      alt: 'LedgerFlow design whiteboard showing transaction posting, double-entry records, outbox publishing, reversal, replay and reconciliation.',
      title: 'System design notes',
      width: 1536,
      height: 1024,
      notes: [
        'API requests and the prototype Kafka consumers share transaction processing. Double-entry posting, reversals, outbox publication and reconciliation reports are implemented.',
        'The PayCore consumers expect camelCase fields and UUID account identifiers. Both captured and settled events currently post deposits; event-ID deduplication alone does not prevent counting a payment twice across those lifecycle events.',
        'Reconciliation is invoked through the API, rather than a periodic job. Its account-balance check excludes the USD settlement account. Automated alerting and the full observability panel are design goals.',
        'Dead-letter replay calls the original consumer. A returned call is marked replayed even when the consumer catches a failure and saves another dead-letter event; replay status is not proof of successful posting.',
      ],
    },
    label: 'Double-entry accounting & reconciliation',
    summary:
      'A Spring Boot backend for transaction posting, reconciliation and audit tracking, with a prototype consumer for PayCore-style event flows.',
    details: [
      'Built a shared transaction-processing path for API requests and incoming payment events.',
      'Implemented double-entry posting, reversals and duplicate-event handling.',
      'Added reconciliation reporting and recovery paths for failed events, with PostgreSQL and Kafka integration tests.',
    ],
    stack: ['Java', 'Spring Boot', 'PostgreSQL', 'Kafka', 'Testcontainers'],
    flow: ['Record', 'Balance', 'Reconcile'],
    repository: 'https://github.com/fanryan/ledgerflow',
    tone: 'forest',
  },
  {
    name: 'NUSpot',
    preview: true,
    media: {
      src: '/images/projects/nuspot-map.jpg',
      thumbnail: '/images/projects/nuspot-map-preview.webp',
      alt: 'NUSpot website with a campus map, event categories and an upcoming dinner event.',
      title: 'Campus event discovery',
      width: 2940,
      height: 1570,
      notes: [
        'The map view shows how the team-built app presents events by location and category. I contributed across the product and engineering work while also supporting sprint coordination, release setup and project documentation.',
      ],
    },
    label: 'Campus discovery · team project',
    summary:
      'A team-built app for discovering and organising spontaneous activities around NUS. Built alongside the team and supported sprint coordination, release setup and project documentation as the product developed.',
    details: [
      'Contributed across the product and engineering flow, working alongside the team on the app build.',
      'Helped keep delivery moving across sprints with task planning and coordination.',
      'Supported release setup and maintained project documentation as the product evolved.',
    ],
    stack: ['Vue', 'Firebase', 'GitHub Actions', 'Leaflet', 'OpenAI API'],
    flow: ['Discover', 'Organise', 'Join'],
    repository: 'https://github.com/fanryan/NUSpot',
    appUrl: 'https://nuspot-6da9f.web.app/',
    tone: 'sage',
  },
];
