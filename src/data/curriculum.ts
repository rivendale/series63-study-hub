export interface Topic {
  id: string;
  title: string;
  weight: string;
  order: number;
  summary: string;
  body: string;
  pitfalls: string[];
  keyTerms: { term: string; definition: string }[];
}

export const topics: Topic[] = [];
