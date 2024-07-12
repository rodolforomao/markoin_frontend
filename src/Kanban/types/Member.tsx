import { Assignee } from './Assignee';

export interface Member {
    [x: string]: any;
    id: number;
    username: string;
    profileUrl: string;
    email: string;
    projectId: number;
    desktopId: number;
    userId: number;
    nameProfile?: String;
  }
  