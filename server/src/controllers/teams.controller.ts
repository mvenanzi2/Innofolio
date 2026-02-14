import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types/index.js';

const prisma = new PrismaClient();

export const getTeam = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userTeamId = req.user?.teamId;

    if (id !== userTeamId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        members: { select: { id: true, email: true, role: true } }
      }
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json(team);
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ error: 'Failed to fetch team' });
  }
};

export const getTeamMembers = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userTeamId = req.user?.teamId;

    if (id !== userTeamId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const members = await prisma.user.findMany({
      where: { teamId: id },
      select: { id: true, email: true, role: true }
    });

    res.json(members);
  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
};
