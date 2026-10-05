import type { Project } from '../types/content';

export const projects: Project[] = [
  {
    name: 'PayCore',
    label: 'Payment processing & settlement',
    summary:
      'A Go backend modelling payment authorisation, capture and settlement. Built to explore retries, concurrent balance changes and partial failures.',
    details: [
      'Implemented payment holds, durable idempotency records and optimistic concurrency control.',
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
    label: 'Double-entry accounting & reconciliation',
    summary:
      'A Spring Boot backend that records transactions, preserves an audit trail and checks account balances against their ledger entries. It also consumes PayCore events.',
    details: [
      'Built a shared transaction-processing path for API requests and incoming payment events.',
      'Implemented double-entry posting, reversals and duplicate-event handling.',
      'Added reconciliation reports and a recovery path for failed events, with integration tests using PostgreSQL and Kafka.',
    ],
    stack: ['Java', 'Spring Boot', 'PostgreSQL', 'Kafka', 'Testcontainers'],
    flow: ['Record', 'Balance', 'Reconcile'],
    repository: 'https://github.com/fanryan/ledgerflow',
    tone: 'forest',
  },
  {
    name: 'NUSpot',
    label: 'Campus discovery · team project',
    summary:
      'A team-built app for discovering and organising spontaneous activities around NUS. I set up deployment and worked on sprint planning, task coordination and documentation.',
    details: [
      'Set up GitHub Actions and Firebase deployment before the first sprint, giving the team a working release process from the start.',
      'Maintained the backlog and coordinated work across sprints.',
      'Wrote and maintained project documentation covering product decisions, development processes and delivery.',
    ],
    stack: ['Vue', 'Firebase', 'GitHub Actions', 'Leaflet', 'OpenAI API'],
    flow: ['Discover', 'Organise', 'Join'],
    repository: 'https://github.com/fanryan/nuspot',
    tone: 'sage',
  },
];
