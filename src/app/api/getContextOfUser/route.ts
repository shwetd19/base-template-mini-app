import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    
    console.log('🔍 Context requested for organizationId:', organizationId);

    if (!organizationId) {
      return NextResponse.json(
        { error: 'organizationId is required' },
        { status: 400 }
      );
    }

    // Extract topic from room name if it follows our pattern
    let topic = 'general learning';
    
    if (organizationId.startsWith('edumate-')) {
      // Parse room name: edumate-{topic}-{timestamp}
      const parts = organizationId.split('-');
      if (parts.length >= 3) {
        // Remove 'edumate' and timestamp, join the middle parts as topic
        const topicParts = parts.slice(1, -1);
        topic = topicParts.join(' ').replace(/-/g, ' ');
      }
    }

    console.log('📚 Extracted topic:', topic);

    // Try to use database if available
    let session = null;
    try {
      // Check if session already exists
      session = await prisma.session.findUnique({
        where: { sessionId: organizationId }
      });

      // Create session if it doesn't exist
      if (!session) {
        console.log('🆕 Creating new session for:', organizationId);
        session = await prisma.session.create({
          data: {
            sessionId: organizationId,
            context: topic,
            isWebTest: true,
            phoneNumber: null
          }
        });
      }
    } catch (dbError) {
      console.log('Database operation failed, continuing without DB:', dbError);
    }

    // Build educational prompt based on topic
    const educationalPrompt = `You are EduMate, an AI tutor helping someone learn about "${topic}".

Your role:
- Be encouraging and supportive
- Break down complex concepts into simple terms  
- Ask follow-up questions to check understanding
- Provide examples and analogies
- Adapt your teaching style to the user's pace
- Keep responses conversational and engaging

Topic focus: ${topic}

Guidelines:
- If the user seems confused, slow down and explain more simply
- If they're doing well, you can introduce more advanced concepts
- Always be patient and encouraging
- Use real-world examples when possible
- Ask questions to gauge their understanding

Start by greeting them and asking what specific aspect of ${topic} they'd like to explore first.`;

    // Return the expected response format matching your Python service
    const response = {
      bot: {
        prompt: educationalPrompt,
        voice: "f786b574-daa5-4673-aa0c-cbe3e8534c02", // Cartesia voice ID
        voiceSpeed: 1.0,
        llmModelName: "gpt-4o-mini",
        llmModelTemprature: 0.7, // Note: keeping the typo to match your schema
        knowledgeBaseId: null
      },
      // Also provide the individual fields as expected by the Python service
      prompt: educationalPrompt,
      voice: "f786b574-daa5-4673-aa0c-cbe3e8534c02",
      voiceSpeed: 1.0,
      llmModelName: "gpt-4o-mini",
      llmModelTemprature: 0.7,
      knowledgeBaseId: null
    };

    console.log('✅ Returning context for topic:', topic);
    if (session?.id) {
      console.log('📋 Session created/found:', session.id);
    }
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Error getting user context:', error);
    
    // Return default context matching the expected format
    const defaultResponse = {
      bot: {
        prompt: "You are EduMate, a helpful AI tutor. Be encouraging and explain concepts clearly. Help users learn in an interactive and engaging way.",
        voice: "f786b574-daa5-4673-aa0c-cbe3e8534c02",
        voiceSpeed: 1.0,
        llmModelName: "gpt-4o-mini",
        llmModelTemprature: 0.7,
        knowledgeBaseId: null
      },
      prompt: "You are EduMate, a helpful AI tutor. Be encouraging and explain concepts clearly. Help users learn in an interactive and engaging way.",
      voice: "f786b574-daa5-4673-aa0c-cbe3e8534c02",
      voiceSpeed: 1.0,
      llmModelName: "gpt-4o-mini",
      llmModelTemprature: 0.7,
      knowledgeBaseId: null
    };
    
    return NextResponse.json(defaultResponse);
  }
}
