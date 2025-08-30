import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '../../../../lib/prisma';

interface SessionWithUserId {
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const session = (await getServerSession(
        req,
        res,
        authOptions
      )) as SessionWithUserId;

      if (!session || !session.user?.id) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Get user's favorite movie
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { favoriteMovie: true },
      });

      res.status(200).json({
        favoriteMovie: user?.favoriteMovie || null,
      });
    } catch (error) {
      console.error('Error fetching favorite movie:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const session = (await getServerSession(
        req,
        res,
        authOptions
      )) as SessionWithUserId;

      if (!session || !session.user?.id) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { favoriteMovie } = req.body;

      if (!favoriteMovie || typeof favoriteMovie !== 'string') {
        return res.status(400).json({ message: 'Favorite movie is required' });
      }

      // Update user's favorite movie
      const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: { favoriteMovie },
      });

      res.status(200).json({
        message: 'Favorite movie updated successfully',
        favoriteMovie: updatedUser.favoriteMovie,
      });
    } catch (error) {
      console.error('Error updating favorite movie:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
