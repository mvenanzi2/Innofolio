import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    teamId: string;
    role: string;
  };
}

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
  stageGate?: 'IDEA' | 'IN_DEVELOPMENT' | 'LAUNCHED' | 'SIDELINED';
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
