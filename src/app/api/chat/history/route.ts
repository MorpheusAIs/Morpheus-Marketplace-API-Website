import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserIdFromApiKey } from '@/lib/api-key-utils';

export async function GET(request: NextRequest) {
  // Debug database connection
  console.log('Database URL:', process.env.DATABASE_URL?.replace(/:([^:@]+)@/, ':****@'));
  
  // Get the Authorization header
  const apiKey = request.headers.get('Authorization') || '';
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API Key required' },
      { status: 401 }
    );
  }

  try {
    // Get user ID from API key
    const userId = await getUserIdFromApiKey(apiKey, async (hash) => {
      return await prisma.user.findUnique({ 
        where: { apiKey: hash },
        select: { id: true }
      });
    });

    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid API Key' },
        { status: 401 }
      );
    }

    // Fetch chat histories for this user, ordered by last updated
    const chats = await prisma.chat.findMany({
      where: {
        userId,
        isArchived: false,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json({ chats });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
} 