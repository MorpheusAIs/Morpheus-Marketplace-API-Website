import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserIdFromApiKey } from '@/lib/api-key-utils';

export async function POST(request: NextRequest) {
  // Get the Authorization header
  const apiKey = request.headers.get('Authorization') || '';
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API Key required' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { chatId } = body;

    if (!chatId) {
      return NextResponse.json(
        { error: 'Chat ID is required' },
        { status: 400 }
      );
    }

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

    // First verify this chat belongs to the user
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId,
      },
      select: {
        id: true,
        title: true,
      },
    });

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found or access denied' },
        { status: 404 }
      );
    }

    // Now fetch all messages for this chat
    const messages = await prisma.message.findMany({
      where: {
        chatId,
      },
      select: {
        id: true,
        role: true,
        content: true,
        sequence: true,
        createdAt: true,
      },
      orderBy: {
        sequence: 'asc',
      },
    });

    return NextResponse.json({
      chat,
      messages,
    });
  } catch (error) {
    console.error('Error loading chat:', error);
    return NextResponse.json(
      { error: 'Failed to load chat' },
      { status: 500 }
    );
  }
} 