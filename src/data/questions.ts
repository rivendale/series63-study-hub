export interface Question {
  id: number;
  topic: string;
  q: string;
  choices: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  exp: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export const questions: Question[] = [];
