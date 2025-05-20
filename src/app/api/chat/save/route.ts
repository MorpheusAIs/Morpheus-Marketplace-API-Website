import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserIdFromApiKey, hashApiKey } from '@/lib/api-key-utils';

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
    const { 
      chatId, 
      title,
      userMessage, 
      assistantMessage,
      saveChatHistory = true
    } = body;

    // If saveChatHistory is false, just return success without saving
    if (!saveChatHistory) {
      return NextResponse.json({ success: true, saved: false });
    }

    if (!userMessage) {
      return NextResponse.json(
        { error: 'User message is required' },
        { status: 400 }
      );
    }

    // Hash the API key for lookup
    const apiKeyHash = hashApiKey(apiKey);

    // Find or create user based on API key
    let user = await prisma.user.findUnique({
      where: { apiKey: apiKeyHash },
    });

    if (!user) {
      // Create new user with this API key
      user = await prisma.user.create({
        data: {
          apiKey: apiKeyHash,
        },
      });
    } else {
      // Update lastActiveAt
      await prisma.user.update({
        where: { id: user.id },
        data: { lastActiveAt: new Date() },
      });
    }

    // Find or create chat
    let chat;
    if (chatId) {
      // Verify the chat belongs to this user
      chat = await prisma.chat.findFirst({
        where: {
          id: chatId,
          userId: user.id,
        },
      });

      if (!chat) {
        return NextResponse.json(
          { error: 'Chat not found or access denied' },
          { status: 404 }
        );
      }

      // Update chat's updatedAt timestamp
      chat = await prisma.chat.update({
        where: { id: chatId },
        data: { updatedAt: new Date() },
      });
    } else {
      // Create a new chat
      chat = await prisma.chat.create({
        data: {
          userId: user.id,
          title: title || 'New Chat',
        },
      });
    }

    // Get the latest sequence number for this chat
    const latestMessage = await prisma.message.findFirst({
      where: { chatId: chat.id },
      orderBy: { sequence: 'desc' },
      select: { sequence: true },
    });

    const nextSequence = latestMessage ? latestMessage.sequence + 1 : 1;

    // Create the user message
    await prisma.message.create({
      data: {
        chatId: chat.id,
        role: 'user',
        content: userMessage,
        sequence: nextSequence,
      },
    });

    // Create the assistant message if provided
    if (assistantMessage) {
      await prisma.message.create({
        data: {
          chatId: chat.id,
          role: 'assistant',
          content: assistantMessage,
          sequence: nextSequence + 1,
        },
      });
    }

    return NextResponse.json({
      success: true,
      saved: true,
      chatId: chat.id,
    });
  } catch (error) {
    console.error('Error saving chat:', error);
    return NextResponse.json(
      { error: 'Failed to save chat' },
      { status: 500 }
    );
  }
} 