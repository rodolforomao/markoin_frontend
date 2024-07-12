import { Issue } from '../types/Issue';
import { Decimal } from 'decimal.js';

export interface AuthUser {
  map(arg0: (user: any) => JSX.Element): import("react").ReactNode;
  id: number;
  username: string;
  email: string;
  profileUrl: string;
  lastLoggedIn: string;
  createdAt: string;
  updatedAt: string;
}

export interface Orders {
  map(arg0: (user: any) => JSX.Element): import("react").ReactNode;
  id: number;
  userId: number;
  value: Decimal;
  orderType: number;
  addressFrom: string;
  addressTo: string;
  scheduled: Date;
  createdAt: string;
}


export type updateAuthUser = Partial<Pick<AuthUser, 'username' | 'email' | 'profileUrl'>>;

export interface List {
  id: number;
  name: string;
  order: number;
  projectId: number;
}

export interface CreateList {
  projectId: number;
}

export interface UpdateList {
  listId: number;
  body: Partial<List>;
}

export interface DeleteList {
  listId: number;
  projectId: number;
}



export interface Project {
  id: number;
  name: string;
  userId: number;
  desktopId: number;
  lists?: List[];
}


export type CreateProject = Omit<Project, 'id'>;

export interface LeaveProject {
  projectId: number;
  userId: number;
  memberId: number;
}

export interface Desktop {
  id: number;
  nameDesktop: string;
  userId: number;
  projects: Project[];
}

export type CreateDesktop = Omit<Desktop, 'id'>;

export interface LeaveDesktop {
  desktopId: number;
  userId: number;
  memberId: number;
}

export interface EditDesktop extends Partial<Desktop> {
  id: number;
}

export interface PublicUser {
  id: number;
  username: string;
  email: string;
  profileUrl: string;
}

export interface EditProject extends Partial<Project> {
  id: number;
}

export interface Issues {
  [key: string]: Issue[];
}

export interface ReorderList {
  id: number;
  order: number;
  newOrder: number;
  projectId: number;
}

export interface reorderIssues {
  id: number;
  s: {
    sId: number;
    order: number;
  };
  d: {
    dId: number;
    newOrder: number;
  };
  projectId: number;
}

export interface AddMember {
  projectId: number | undefined;
  userId: number;
  desktopId: number | undefined;

}

export interface RemoveMember extends AddMember {
  memberId: number;
}

export interface dndOrderData {
  s: { sId: number; index: number };
  d: { dId: number; index: number };
}

export interface CreateIssue {
  id?: number;
  type: number;
  reporterId: number | null;
  assignees: number[];
  listId: number | null;
  priority: number;
  summary: string;
  codigoSei: string;
  descr: string;
  createdAt?: string;
  updatedAt?: string;
  projectId: number;
  listBasdge?: string;
}

export type MoveIssue = {
  issueId: number;
  newOrder: number;
  projectId: number;
  listId: number | string | undefined;
};

export type BadgeIssue = {
  issueId: number;
  listBadge: string[];
};

export type UpdateIssueType =
  | 'type'
  | 'summary'
  | 'descr'
  | 'assignee'
  | 'priority'
  | 'listId'
  | 'addAssignee'
  | 'codigoSei'
  | 'removeAssignee'
  | 'dataPrazo'
  | 'listBadge';


export interface UpdateIssue {
  id: number;
  body: {
    type: UpdateIssueType;
    value: string | number | number[];
    projectId: number;
  };
}

export interface RestartIssue {
  id: number | undefined;
  body: {
    projectId: number | undefined;
    userId: number | undefined;
    issueId: number | undefined;
    listId: number | undefined;
  };
}

export interface UpdatePeriodReferenceIssue {
  issueId: number;
  selectedPeriodReference: string;
}

export interface DeleteIssue {
  issueId: number;
  projectId: number;
}

export interface IssueQuery {
  projectId: number;
  userId?: number;
}

export interface SearchIssueQuery {
  query: string;

}

export interface APIERROR {
  message: string;
  status: number;
}

export interface Comment {
  id: number;
  username: string;
  profileUrl?: string;
  userId: number;
  descr: string;
  createdAt: string;
}

export interface getComments {
  issueId: number;
  projectId: number;
}

export interface CreateComment {
  issueId: number;
  userId: number;
  descr: string;
  projectId: number;
}

export interface DeleteComment {
  id: number;
  projectId: number;
}

export interface ListActivity {
  id: number;
  id_AcoesAssessorias: number;
  desc_atividades: string;
}

export interface DetailMovimentList {
  username: String;
  listOld: String;
  listCurrent: string;
  dateCreate: Date;
}

export interface ReviewTask {

}

export interface PermissionKanban {
  profileKanban: any;
  userId: number;
  profileId: number;
  projectId?: number;
  desktopId?: number;
  resourceId?: number;
}

export interface ProfileKanban {
  id: number;
  nameProfile: string;
}

export type updatePermissionKanban = Partial<Pick<PermissionKanban, 'profileId' | 'projectId' | 'desktopId' | 'resourceId'>>;

export interface SearchResult {
  issueId: number
  projectId: number
  summary: string;
  listName: string;
  projectName: string;
}
