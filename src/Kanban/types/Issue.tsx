import { Assignee } from './Assignee';

export interface Issue {
  find: any;
  id: number;
  summary: string;
  descr: string;
  codigoSei: string;
  type: number;
  priority: number;
  order: number;
  listId: number;
  reporterId: number;
  assignees: Assignee[];
  comments: number;
  createdAt?: string;
  updatedAt?: string;
  dataPrazo: Date;
  listBadge?: string;
  periodReference?: string;
}
