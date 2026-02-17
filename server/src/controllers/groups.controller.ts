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

export const inviteMemberByUsername = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user is group owner
    const group = await prisma.group.findFirst({
      where: { id, ownerId: userId },
      include: { members: true }
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found or not authorized' });
    }

    // Find user by username
    const invitee = await prisma.user.findFirst({
      where: { username }
    });

    if (!invitee) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is already a member
    const isAlreadyMember = group.members.some(member => member.id === invitee.id);
    if (isAlreadyMember) {
      return res.status(400).json({ error: 'User is already a member' });
    }

    // Check if invitation already exists
    const existingInvitation = await prisma.groupInvitation.findUnique({
      where: {
        groupId_receiverId: {
          groupId: id,
          receiverId: invitee.id
        }
      }
    });

    if (existingInvitation) {
      if (existingInvitation.status === 'PENDING') {
        return res.status(400).json({ error: 'Invitation already sent' });
      }
      // Update existing declined invitation to pending
      const updatedInvitation = await prisma.groupInvitation.update({
        where: { id: existingInvitation.id },
        data: { status: 'PENDING', createdAt: new Date() }
      });
      
      // Send notification email
      const { sendGroupInvitationEmail } = await import('../utils/email.js');
      const sender = await prisma.user.findUnique({ where: { id: userId } });
      await sendGroupInvitationEmail(invitee.email, sender?.username || sender?.email || 'Someone', group.name);
      
      return res.json(updatedInvitation);
    }

    // Create new invitation
    const invitation = await prisma.groupInvitation.create({
      data: {
        groupId: id,
        senderId: userId,
        receiverId: invitee.id,
        status: 'PENDING'
      },
      include: {
        group: true,
        sender: { select: { id: true, email: true, username: true } },
        receiver: { select: { id: true, email: true, username: true } }
      }
    });

    // Send notification email
    const { sendGroupInvitationEmail } = await import('../utils/email.js');
    const sender = await prisma.user.findUnique({ where: { id: userId } });
    await sendGroupInvitationEmail(invitee.email, sender?.username || sender?.email || 'Someone', group.name);

    res.status(201).json(invitation);
  } catch (error) {
    console.error('Invite member error:', error);
    res.status(500).json({ error: 'Failed to send invitation' });
  }
};

export const respondToInvitation = async (req: AuthRequest, res: Response) => {
  try {
    const { invitationId } = req.params;
    const { accept } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const invitation = await prisma.groupInvitation.findFirst({
      where: {
        id: invitationId,
        receiverId: userId,
        status: 'PENDING'
      }
    });

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    if (accept) {
      // Accept invitation - add user to group
      await prisma.group.update({
        where: { id: invitation.groupId },
        data: {
          members: {
            connect: { id: userId }
          }
        }
      });

      await prisma.groupInvitation.update({
        where: { id: invitationId },
        data: { status: 'ACCEPTED' }
      });

      res.json({ message: 'Invitation accepted' });
    } else {
      // Decline invitation
      await prisma.groupInvitation.update({
        where: { id: invitationId },
        data: { status: 'DECLINED' }
      });

      res.json({ message: 'Invitation declined' });
    }
  } catch (error) {
    console.error('Respond to invitation error:', error);
    res.status(500).json({ error: 'Failed to respond to invitation' });
  }
};
