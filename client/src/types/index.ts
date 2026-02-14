export interface User {
  id: string;
  email: string;
  username: string;
  role: 'MEMBER' | 'ADMIN';
  team?: Team;
}

export interface Team {
  id: string;
  name: string;
}

export interface Idea {
  id: string;
  ideaNumber: number;
  globalCounter: number;
  title: string;
  description: string;
  opportunity: string;
  tags: string;
  visibility: 'PRIVATE' | 'PUBLIC' | 'GROUP';
  allowedGroup?: { id: string; name: string };
  stageGate: StageGate;
  isSidelined: boolean;
  owner: { id: string; email: string; username: string };
  collaborators: { id: string; email: string; username: string }[];
  createdAt: string;
  updatedAt: string;
}

export type StageGate = 'IDEA' | 'IN_DEVELOPMENT' | 'LAUNCHED' | 'SIDELINED';

export interface CreateIdeaDto {
  title: string;
  description: string;
  opportunity?: string;
  tags?: string;
  visibility?: 'PRIVATE' | 'PUBLIC' | 'GROUP';
  allowedGroupId?: string;
}

export interface UpdateIdeaDto {
  title?: string;
  description?: string;
  opportunity?: string;
  tags?: string;
  visibility?: 'PRIVATE' | 'PUBLIC' | 'GROUP';
  allowedGroupId?: string;
  stageGate?: StageGate;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  owner: { id: string; email: string; username: string };
  members: { id: string; email: string; username: string }[];
  createdAt: string;
  _count?: { ideas: number };
}

export interface SignupDto {
  email: string;
  username: string;
  password: string;
  teamName?: string;
  teamId?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
