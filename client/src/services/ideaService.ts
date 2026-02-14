import api from './api';
import { Idea, CreateIdeaDto, UpdateIdeaDto } from '../types';

export const ideaService = {
  getIdeas: async (params?: {
    stageGate?: string;
    search?: string;
    includeSidelined?: boolean;
    tag?: string;
  }): Promise<Idea[]> => {
    const response = await api.get<Idea[]>('/ideas', { params });
    return response.data;
  },

  getIdeaById: async (id: string): Promise<Idea> => {
    const response = await api.get<Idea>(`/ideas/${id}`);
    return response.data;
  },

  createIdea: async (data: CreateIdeaDto): Promise<Idea> => {
    const response = await api.post<Idea>('/ideas', data);
    return response.data;
  },

  updateIdea: async (id: string, data: UpdateIdeaDto): Promise<Idea> => {
    const response = await api.put<Idea>(`/ideas/${id}`, data);
    return response.data;
  },

  sidelineIdea: async (id: string): Promise<Idea> => {
    const response = await api.patch<Idea>(`/ideas/${id}/sideline`);
    return response.data;
  },

  addCollaborator: async (ideaId: string, userId: string): Promise<Idea> => {
    const response = await api.post<Idea>(`/ideas/${ideaId}/collaborators`, { userId });
    return response.data;
  },

  removeCollaborator: async (ideaId: string, userId: string): Promise<Idea> => {
    const response = await api.delete<Idea>(`/ideas/${ideaId}/collaborators/${userId}`);
    return response.data;
  },

  deleteIdea: async (id: string): Promise<void> => {
    await api.delete(`/ideas/${id}`);
  },
};
