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
import { items as q_ia_registration } from './questions/ia-registration';
import { items as q_securities_registration } from './questions/securities-registration';
import { items as q_exempt_securities } from './questions/exempt-securities';
import { items as q_exempt_transactions } from './questions/exempt-transactions';
import { items as q_security_definition } from './questions/security-definition';
import { items as q_unethical_bd } from './questions/unethical-bd';
import { items as q_unethical_ia } from './questions/unethical-ia';
import { items as q_fraud } from './questions/fraud';
import { items as q_admin_actions } from './questions/admin-actions';
import { items as q_communications } from './questions/communications';
import { items as q_recent_updates } from './questions/recent-updates';

export const questions: Question[] = [
  ...q_usa_foundations,
  ...q_agent_registration,
  ...q_bd_registration,
  ...q_ia_registration,
  ...q_securities_registration,
  ...q_exempt_securities,
  ...q_exempt_transactions,
  ...q_security_definition,
  ...q_unethical_bd,
  ...q_unethical_ia,
  ...q_fraud,
  ...q_admin_actions,
  ...q_communications,
  ...q_recent_updates,
];
