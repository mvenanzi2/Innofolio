import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types/index.js';

const prisma = new PrismaClient();

export const getGroups = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const groups = await prisma.group.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { id: userId } } }
        ]
      },
      include: {
        owner: { select: { id: true, email: true, username: true } },
        members: { select: { id: true, email: true, username: true } },
        _count: { select: { ideas: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(groups);
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
};

export const getGroupById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const group = await prisma.group.findFirst({
      where: {
        id,
        OR: [
          { ownerId: userId },
          { members: { some: { id: userId } } }
        ]
      },
      include: {
        owner: { select: { id: true, email: true, username: true } },
        members: { select: { id: true, email: true, username: true } }
      }
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json(group);
  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({ error: 'Failed to fetch group' });
  }
};

export const createGroup = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const group = await prisma.group.create({
      data: {
        name,
        description: description || '',
        ownerId: userId
      },
      include: {
        owner: { select: { id: true, email: true, username: true } },
        members: { select: { id: true, email: true, username: true } }
      }
    });

    res.status(201).json(group);
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
};

export const updateGroup = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user?.userId;

    const group = await prisma.group.findFirst({
      where: { id, ownerId: userId }
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found or not authorized' });
    }

    const updatedGroup = await prisma.group.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description })
      },
      include: {
        owner: { select: { id: true, email: true, username: true } },
        members: { select: { id: true, email: true, username: true } }
      }
    });

    res.json(updatedGroup);
  } catch (error) {
    console.error('Update group error:', error);
    res.status(500).json({ error: 'Failed to update group' });
  }
};

export const deleteGroup = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const group = await prisma.group.findFirst({
      where: { id, ownerId: userId }
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found or not authorized' });
    }

    await prisma.group.delete({ where: { id } });

    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Delete group error:', error);
    res.status(500).json({ error: 'Failed to delete group' });
  }
};

export const addMember = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { userId: memberId } = req.body;
    const userId = req.user?.userId;

    const group = await prisma.group.findFirst({
      where: { id, ownerId: userId }
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found or not authorized' });
    }

    const updatedGroup = await prisma.group.update({
      where: { id },
      data: {
        members: {
          connect: { id: memberId }
        }
      },
      include: {
        owner: { select: { id: true, email: true, username: true } },
        members: { select: { id: true, email: true, username: true } }
      }
    });

    res.json(updatedGroup);
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ error: 'Failed to add member' });
  }
};

export const removeMember = async (req: AuthRequest, res: Response) => {
  try {
    const { id, userId: memberId } = req.params;
    const userId = req.user?.userId;

    const group = await prisma.group.findFirst({
      where: { id, ownerId: userId }
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found or not authorized' });
    }

    const updatedGroup = await prisma.group.update({
      where: { id },
      data: {
        members: {
          disconnect: { id: memberId }
        }
      },
      include: {
        owner: { select: { id: true, email: true, username: true } },
        members: { select: { id: true, email: true, username: true } }
      }
    });

    res.json(updatedGroup);
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ error: 'Failed to remove member' });
  }
};
