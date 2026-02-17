import api from './api';
import { Group } from '../types';

export const groupService = {
  getGroups: async (): Promise<Group[]> => {
    const response = await api.get<Group[]>('/groups');
    return response.data;
  },

  getGroupById: async (id: string): Promise<Group> => {
    const response = await api.get<Group>(`/groups/${id}`);
    return response.data;
  },

  createGroup: async (data: { name: string; description?: string }): Promise<Group> => {
    const response = await api.post<Group>('/groups', data);
    return response.data;
  },

  updateGroup: async (id: string, data: { name?: string; description?: string }): Promise<Group> => {
    const response = await api.put<Group>(`/groups/${id}`, data);
    return response.data;
  },

  deleteGroup: async (id: string): Promise<void> => {
    await api.delete(`/groups/${id}`);
  },

  addMember: async (groupId: string, userId: string): Promise<Group> => {
    const response = await api.post<Group>(`/groups/${groupId}/members`, { userId });
    return response.data;
  },

  removeMember: async (groupId: string, userId: string): Promise<Group> => {
    const response = await api.delete<Group>(`/groups/${groupId}/members/${userId}`);
    return response.data;
  },

  inviteMemberByUsername: async (groupId: string, username: string): Promise<any> => {
    const response = await api.post(`/groups/${groupId}/invite`, { username });
    return response.data;
  },

  respondToInvitation: async (invitationId: string, accept: boolean): Promise<void> => {
    await api.post(`/groups/invitations/${invitationId}/respond`, { accept });
  },
};
