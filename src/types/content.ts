/** Shared content contracts. Layouts consume data, never infer meaning from array order. */
export interface Experience {
  company: string;
  logo: string;
  role: string;
  dates: string;
  label: string;
  summary: string;
  status: 'incoming' | 'completed' | 'current';
  details: string[];
  stack: string[];
}

export interface Project {
  name: string;
  label: string;
  repository: string;
  tone: 'sky' | 'forest' | 'sage';
  summary: string;
  details: string[];
  stack: string[];
  flow: string[];
  media?: {
    src: string;
    thumbnail: string;
    alt: string;
    title: string;
    width: number;
    height: number;
    notes: string[];
  };
  preview?: boolean;
}

export interface Photo {
  src: string;
  caption: string;
  category: string;
  alt: string;
  position: string;
  width: number;
  height: number;
}

export interface Education {
  name: string;
  logo: { src: string; alt: string; width: number; height: number };
  dates: string;
  qualification: string;
  result: { label: string; value: string };
  awards: string[];
  activities: { group?: string; logo?: string; items: string[] };
  exchange?: { name: string; logo: string; dates: string; description: string };
}
