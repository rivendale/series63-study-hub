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

import { topic as t1 } from './topics/usa-foundations';
import { topic as t2 } from './topics/agent-registration';
import { topic as t3 } from './topics/bd-registration';
import { topic as t4 } from './topics/ia-registration';
import { topic as t5 } from './topics/securities-registration';
import { topic as t6 } from './topics/exempt-securities';
import { topic as t7 } from './topics/exempt-transactions';
import { topic as t8 } from './topics/security-definition';
import { topic as t9 } from './topics/unethical-bd';
import { topic as t10 } from './topics/unethical-ia';
import { topic as t11 } from './topics/fraud';
import { topic as t12 } from './topics/admin-actions';
import { topic as t13 } from './topics/communications';
import { topic as t14 } from './topics/recent-updates';

export const topics: Topic[] = [t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14];
