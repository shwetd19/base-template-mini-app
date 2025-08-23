import { NextRequest, NextResponse } from 'next/server';

// Conditionally import Prisma to avoid build-time errors
let prisma: typeof import('~/lib/prisma').prisma | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const prismaModule = require('~/lib/prisma');
  prisma = prismaModule.prisma;
} catch {
  console.log('Prisma not available during build, webhook will work without database');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🎯 LiveKit webhook received:', {
      event: body.event,
      room: body.room?.name,
      participant: body.participant?.identity,
      transcript: body.transcript,
      timestamp: new Date().toISOString()
    });

    // Handle different webhook events
    switch (body.event) {
      case 'transcription_received':
        console.log(`📝 Transcription: ${body.transcript}`);
        
        if (body.participant?.kind === 'USER') {
          console.log(`👤 User said: ${body.transcript}`);
        } else if (body.participant?.kind === 'AGENT') {
          console.log(`🤖 Agent said: ${body.transcript}`);
        }

        // Store transcript in database if we have room info
        if (body.room?.name && body.transcript && prisma) {
          try {
            // Check if we have a call record for this room
            let call = await prisma.call.findFirst({
              where: { livekitRoomId: body.room.name }
            });

            if (!call) {
              // Create a new call record
              call = await prisma.call.create({
                data: {
                  callSid: `livekit-${body.room.name}`,
                  fromNumber: body.participant?.identity || "Unknown",
                  toNumber: "EduMate",
                  status: "in-progress",
                  direction: "inbound",
                  startTime: new Date(),
                  livekitRoomId: body.room.name,
                  transcript: body.transcript
                }
              });
              console.log('📋 Created new call record:', call.id);
            } else {
              // Update existing call record with new transcript
              const existingTranscript = call.transcript || '';
              const updatedTranscript = existingTranscript + '\n' + body.transcript;
              
              await prisma.call.update({
                where: { id: call.id },
                data: { 
                  transcript: updatedTranscript,
                  updatedAt: new Date()
                }
              });
              console.log('📝 Updated call transcript:', call.id);
            }
          } catch (dbError) {
            console.error('❌ Database error:', dbError);
            // Continue processing even if database fails
          }
        }
        break;
        
      case 'participant_connected':
        console.log(`👋 Participant joined: ${body.participant?.identity}`);
        break;
        
      case 'participant_disconnected':
        console.log(`👋 Participant left: ${body.participant?.identity}`);
        
        // Update call status when participant disconnects
        if (body.room?.name && prisma) {
          try {
            await prisma.call.updateMany({
              where: { livekitRoomId: body.room.name },
              data: { 
                status: "completed",
                endTime: new Date()
              }
            });
            console.log('📞 Call marked as completed for room:', body.room.name);
          } catch (dbError) {
            console.error('❌ Database error updating call status:', dbError);
          }
        }
        break;
        
      default:
        console.log(`📨 Unknown event: ${body.event}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully',
      event: body.event 
    });

  } catch (error) {
    console.error('❌ Error processing LiveKit webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Handle GET requests for webhook verification
export async function GET() {
  return NextResponse.json({ 
    status: 'LiveKit webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}
