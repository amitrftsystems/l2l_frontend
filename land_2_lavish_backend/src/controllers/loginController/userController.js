import bcrypt from 'bcryptjs';
import prisma from '../../db/index.js';

export const createUser = async (req, res) => {
  const { userId, email, password, name, role } = req.body;
  const creatorRole = req.user.role;

  // Check if creator has permission to create the specified role
  if (creatorRole === 'SUPERADMIN' && role !== 'ADMIN') {
    return res.status(403).json({ error: 'Superadmin can only create admin users' });
  }
  if (creatorRole === 'ADMIN' && role !== 'EMPLOYEE') {
    return res.status(403).json({ error: 'Admin can only create employee users' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        userId,
        email,
        password: hashedPassword,
        name,
        role,
        createdById: req.user.id,
      },
    });

    res.status(201).json({
      id: user.id,
      userId: user.userId,
      email: user.email,
      role: user.role,
      name: user.name,
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getUsers = async (req, res) => {
  const userRole = req.user.role;

  try {
    let users;
    switch (userRole) {
      case 'SUPERADMIN':
        users = await prisma.user.findMany({
          where: { role: 'ADMIN' },
          select: {
            id: true,
            userId: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
          },
        });
        break;
      case 'ADMIN':
        users = await prisma.user.findMany({
          where: { role: 'EMPLOYEE' },
          select: {
            id: true,
            userId: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
          },
        });
        break;
      default:
        return res.status(403).json({ error: 'Access denied' });
    }
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, userId } = req.body;
  const userRole = req.user.role;

  try {
    const userToUpdate = await prisma.user.findUnique({
      where: { id },
    });

    if (!userToUpdate) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has permission to update
    if (userRole === 'SUPERADMIN' && userToUpdate.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Can only update admin users' });
    }
    if (userRole === 'ADMIN' && userToUpdate.role !== 'EMPLOYEE') {
      return res.status(403).json({ error: 'Can only update employee users' });
    }

    // Check if the new userId is already taken by another user
    if (userId && userId !== userToUpdate.userId) {
      const existingUser = await prisma.user.findUnique({
        where: { userId },
      });
      if (existingUser) {
        return res.status(400).json({ error: 'User ID is already taken' });
      }
    }

    // Prepare update data
    const updateData = {
      name,
      email,
      userId,
    };

    // If password is provided, hash it and add to update data
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    res.json({
      id: updatedUser.id,
      userId: updatedUser.userId,
      email: updatedUser.email,
      role: updatedUser.role,
      name: updatedUser.name,
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const userRole = req.user.role;

  try {
    const userToDelete = await prisma.user.findUnique({
      where: { id },
      include: {
        createdUsers: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    if (!userToDelete) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has permission to delete
    if (userRole === 'SUPERADMIN' && userToDelete.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Can only delete admin users' });
    }
    if (userRole === 'ADMIN' && userToDelete.role !== 'EMPLOYEE') {
      return res.status(403).json({ error: 'Can only delete employee users' });
    }

    // Check if user has created any other users
    if (userToDelete.createdUsers.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete user who has created other users',
        details: {
          createdUsers: userToDelete.createdUsers,
          message: 'Please delete their created users first'
        }
      });
    }

    await prisma.user.delete({
      where: { id },
    });

    res.json({ 
      message: 'User deleted successfully',
      deletedUser: {
        id: userToDelete.id,
        name: userToDelete.name,
        role: userToDelete.role
      }
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword, retypePassword } = req.body;
  const userRole = req.user.role;

  try {
    const userToUpdate = await prisma.user.findUnique({
      where: { id },
    });

    if (!userToUpdate) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has permission to reset password
    if (userRole === 'SUPERADMIN' && userToUpdate.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Can only reset admin users passwords' });
    }
    if (userRole === 'ADMIN' && userToUpdate.role !== 'EMPLOYEE') {
      return res.status(403).json({ error: 'Can only reset employee users passwords' });
    }

    // Verify old password
    const validPassword = await bcrypt.compare(oldPassword, userToUpdate.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid old password' });
    }

    // Check if new passwords match
    if (newPassword !== retypePassword) {
      return res.status(400).json({ error: 'New passwords do not match' });
    }

    // Check if new password is the same as the old password
    if (newPassword === oldPassword) {
      return res.status(400).json({ error: 'New password cannot be the same as the old password' });
    }

    // Validate new password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number' 
      });
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}; 