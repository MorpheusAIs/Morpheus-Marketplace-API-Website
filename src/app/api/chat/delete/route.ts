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
    });

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found or access denied' },
        { status: 404 }
      );
    }

    // Delete the chat - Prisma will cascade delete messages
    await prisma.chat.delete({
      where: {
        id: chatId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Chat deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting chat:', error);
    return NextResponse.json(
      { error: 'Failed to delete chat' },
      { status: 500 }
    );
  }
} 