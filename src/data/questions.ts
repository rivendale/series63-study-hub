export interface Question {
  id: number;
  topic: string;
  q: string;
  choices: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  exp: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

import { items as q_usa_foundations } from './questions/usa-foundations';
import { items as q_agent_registration } from './questions/agent-registration';
import { items as q_bd_registration } from './questions/bd-registration';
import { items as q_unethical_bd } from './questions/unethical-bd';
import { items as q_admin_actions } from './questions/admin-actions';
import { items as q_fraud } from './questions/fraud';

export const questions: Question[] = [...q_usa_foundations, ...q_agent_registration, ...q_bd_registration, ...q_unethical_bd, ...q_admin_actions, ...q_fraud];
