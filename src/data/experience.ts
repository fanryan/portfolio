import type { Experience } from '../types/content';

export const experience: Experience[] = [
  {
    company: 'TikTok',
    logo: 'tiktok',
    role: 'Incoming Software Engineer Intern',
    dates: 'JAN — JUL 2027',
    label: 'Social / Messaging',
    summary: 'Joining TikTok’s Social / Messaging team in January 2027.',
    details: [],
    stack: [],
    status: 'incoming',
  },
  {
    company: 'CSIT',
    logo: 'csit',
    role: 'Software Engineer Intern',
    dates: 'MAY — JUL 2026',
    label: 'AI tooling & retrieval',
    summary:
      'Built Python tooling for security investigation workflows, combining information retrieval, structured evidence and reliable data updates.',
    details: [
      'Developed retrieval tools using FastMCP, ChromaDB and SQLite to find relevant information and maintain consistent indicator records.',
      'Built processing workflows that produced structured outputs with supporting evidence and source references.',
      'Improved data ingestion and update handling through concurrent processing, retries and incremental exports.',
    ],
    stack: ['Python', 'FastMCP', 'SQLite', 'ChromaDB', 'DSPy', 'Pydantic'],
    status: 'completed',
  },
  {
    company: 'Secretlab',
    logo: 'secretlab',
    role: 'Data Engineer Intern',
    dates: 'JAN — MAY 2026',
    label: 'Data infrastructure',
    summary:
      'Worked on the infrastructure behind data pipelines and reporting, from deploying Airflow to making dashboard refreshes depend on actual data readiness.',
    details: [
      'Set up Airflow environments on Astronomer, with deployment pipelines and secrets management, and moved scheduled jobs into a shared orchestration platform.',
      'Built dependency-aware refresh workflows connecting dbt, Snowflake and Tableau, replacing a fixed waiting period with checks on upstream readiness.',
      'Developed cost-attribution models across AWS, Fivetran and Snowflake to help teams understand spending and identify optimisation opportunities.',
    ],
    stack: [
      'Airflow',
      'Python',
      'SQL',
      'Snowflake',
      'dbt',
      'AWS',
      'GitHub Actions',
    ],
    status: 'completed',
  },
];
