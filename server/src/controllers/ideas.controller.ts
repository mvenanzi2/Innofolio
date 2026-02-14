import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, CreateIdeaDto, UpdateIdeaDto } from '../types/index.js';

const prisma = new PrismaClient();

const getNextIdeaNumber = async (teamId: string): Promise<number> => {
  const lastIdea = await prisma.idea.findFirst({
    where: { teamId },
    orderBy: { ideaNumber: 'desc' }
  });
  return (lastIdea?.ideaNumber || 0) + 1;
};

const getNextGlobalCounter = async (): Promise<number> => {
  const counter = await prisma.globalCounter.upsert({
    where: { id: 'singleton' },
    update: { counter: { increment: 1 } },
    create: { id: 'singleton', counter: 1 }
  });
  return counter.counter;
};

export const getIdeas = async (req: AuthRequest, res: Response) => {
  try {
    const { stageGate, search, includeSidelined, tag } = req.query;
    const userId = req.user?.userId;

    const where: any = {
      OR: [
        // Ideas owned by user
        { ownerId: userId },
        // Ideas where user is collaborator
        { collaborators: { some: { id: userId } } },
        // Public ideas
        { visibility: 'PUBLIC' },
        // Ideas shared with groups user is in
        {
          AND: [
            { visibility: 'GROUP' },
            {
              allowedGroup: {
                OR: [
                  { ownerId: userId },
                  { members: { some: { id: userId } } }
                ]
              }
            }
          ]
        }
      ]
    };

    if (!includeSidelined) {
      where.isSidelined = false;
    }

    if (stageGate) {
      where.stageGate = stageGate;
    }

    if (tag) {
      where.tags = { contains: tag as string };
    }

    if (search) {
      where.AND = where.AND || [];
      where.AND.push({
        OR: [
          { title: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } }
        ]
      });
    }

    const ideas = await prisma.idea.findMany({
      where,
      include: {
        owner: { select: { id: true, email: true, username: true } },
        collaborators: { select: { id: true, email: true, username: true } },
        allowedGroup: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(ideas);
  } catch (error) {
    console.error('Get ideas error:', error);
    res.status(500).json({ error: 'Failed to fetch ideas' });
  }
};

export const getIdeaById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const teamId = req.user?.teamId;

    const idea = await prisma.idea.findFirst({
      where: { id, teamId },
      include: {
        owner: { select: { id: true, email: true } },
        collaborators: { select: { id: true, email: true } }
      }
    });

    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    res.json(idea);
  } catch (error) {
    console.error('Get idea error:', error);
    res.status(500).json({ error: 'Failed to fetch idea' });
  }
};

export const createIdea = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, opportunity, tags, visibility, allowedGroupId }: CreateIdeaDto = req.body;
    const userId = req.user?.userId;
    const teamId = req.user?.teamId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const ideaNumber = teamId ? await getNextIdeaNumber(teamId) : await getNextIdeaNumber('personal-' + userId);
    const globalCounter = await getNextGlobalCounter();

    const idea = await prisma.idea.create({
      data: {
        title,
        description,
        opportunity: opportunity || '',
        tags: tags || '',
        visibility: visibility || 'PRIVATE',
        allowedGroupId: visibility === 'GROUP' ? allowedGroupId : null,
        ideaNumber,
        globalCounter,
        ownerId: userId,
        teamId: teamId || null
      },
      include: {
        owner: { select: { id: true, email: true, username: true } },
        collaborators: { select: { id: true, email: true, username: true } },
        allowedGroup: { select: { id: true, name: true } }
      }
    });

    res.status(201).json(idea);
  } catch (error) {
    console.error('Create idea error:', error);
    res.status(500).json({ error: 'Failed to create idea' });
  }
};

export const updateIdea = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, opportunity, stageGate, tags, visibility, allowedGroupId }: UpdateIdeaDto = req.body;
    const userId = req.user?.userId;

    const idea = await prisma.idea.findFirst({
      where: { id },
      include: { collaborators: true }
    });

    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    const isOwner = idea.ownerId === userId;
    const isCollaborator = idea.collaborators.some(c => c.id === userId);
    const isAdmin = req.user?.role === 'ADMIN';

    if (!isOwner && !isCollaborator && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to edit this idea' });
    }

    const updatedIdea = await prisma.idea.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(opportunity !== undefined && { opportunity }),
        ...(tags !== undefined && { tags }),
        ...(visibility && { visibility }),
        ...(visibility === 'GROUP' && allowedGroupId && { allowedGroupId }),
        ...(visibility && visibility !== 'GROUP' && { allowedGroupId: null }),
        ...(stageGate && { stageGate })
      },
      include: {
        owner: { select: { id: true, email: true, username: true } },
        collaborators: { select: { id: true, email: true, username: true } },
        allowedGroup: { select: { id: true, name: true } }
      }
    });

    res.json(updatedIdea);
  } catch (error) {
    console.error('Update idea error:', error);
    res.status(500).json({ error: 'Failed to update idea' });
  }
};

export const sidelineIdea = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const teamId = req.user?.teamId;

    const idea = await prisma.idea.findFirst({
      where: { id, teamId }
    });

    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    const isOwner = idea.ownerId === userId;
    const isAdmin = req.user?.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Only owner or admin can sideline ideas' });
    }

    const updatedIdea = await prisma.idea.update({
      where: { id },
      data: {
        isSidelined: !idea.isSidelined,
        stageGate: !idea.isSidelined ? 'SIDELINED' : 'IDEA'
      },
      include: {
        owner: { select: { id: true, email: true } },
        collaborators: { select: { id: true, email: true } }
      }
    });

    res.json(updatedIdea);
  } catch (error) {
    console.error('Sideline idea error:', error);
    res.status(500).json({ error: 'Failed to sideline idea' });
  }
};

export const addCollaborator = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { userId: collaboratorId } = req.body;
    const userId = req.user?.userId;
    const teamId = req.user?.teamId;

    const idea = await prisma.idea.findFirst({
      where: { id, teamId },
      include: { collaborators: true }
    });

    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    const isOwner = idea.ownerId === userId;
    const isCollaborator = idea.collaborators.some(c => c.id === userId);

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ error: 'Not authorized to add collaborators' });
    }

    const collaborator = await prisma.user.findFirst({
      where: { id: collaboratorId, teamId }
    });

    if (!collaborator) {
      return res.status(404).json({ error: 'User not found in team' });
    }

    const updatedIdea = await prisma.idea.update({
      where: { id },
      data: {
        collaborators: {
          connect: { id: collaboratorId }
        }
      },
      include: {
        owner: { select: { id: true, email: true } },
        collaborators: { select: { id: true, email: true } }
      }
    });

    res.json(updatedIdea);
  } catch (error) {
    console.error('Add collaborator error:', error);
    res.status(500).json({ error: 'Failed to add collaborator' });
  }
};

export const removeCollaborator = async (req: AuthRequest, res: Response) => {
  try {
    const { id, userId: collaboratorId } = req.params;
    const userId = req.user?.userId;
    const teamId = req.user?.teamId;

    const idea = await prisma.idea.findFirst({
      where: { id, teamId }
    });

    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    const isOwner = idea.ownerId === userId;

    if (!isOwner) {
      return res.status(403).json({ error: 'Only owner can remove collaborators' });
    }

    const updatedIdea = await prisma.idea.update({
      where: { id },
      data: {
        collaborators: {
          disconnect: { id: collaboratorId }
        }
      },
      include: {
        owner: { select: { id: true, email: true } },
        collaborators: { select: { id: true, email: true } }
      }
    });

    res.json(updatedIdea);
  } catch (error) {
    console.error('Remove collaborator error:', error);
    res.status(500).json({ error: 'Failed to remove collaborator' });
  }
};

export const deleteIdea = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const teamId = req.user?.teamId;

    const idea = await prisma.idea.findFirst({
      where: { id, ...(teamId && { teamId }) }
    });

    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    const isOwner = idea.ownerId === userId;
    const isAdmin = req.user?.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Only owner or admin can delete ideas' });
    }

    await prisma.idea.delete({
      where: { id }
    });

    res.json({ message: 'Idea deleted successfully' });
  } catch (error) {
    console.error('Delete idea error:', error);
    res.status(500).json({ error: 'Failed to delete idea' });
  }
};
