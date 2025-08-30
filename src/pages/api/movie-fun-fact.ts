import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { prisma } from '../../../lib/prisma';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

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

    if (!user?.favoriteMovie) {
      return res.status(404).json({ message: 'No favorite movie found' });
    }

    // Generate fun fact using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a movie expert that provides interesting and fun facts about movies. Keep responses concise (1-2 sentences) and entertaining.',
        },
        {
          role: 'user',
          content: `Tell me an interesting or fun fact about the movie "${user.favoriteMovie}". Make it something surprising or little-known.`,
        },
      ],
      max_tokens: 100,
    });

    const funFact = completion.choices[0]?.message?.content?.trim();

    if (!funFact) {
      return res.status(500).json({ message: 'Failed to generate fun fact' });
    }

    res.status(200).json({
      movie: user.favoriteMovie,
      funFact,
    });
  } catch (error) {
    console.error('Error generating fun fact:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
