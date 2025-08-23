"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { Button } from "./Button";
import { LIVEKIT_URL } from "~/lib/constants";
import { Room, RoomEvent, RemoteParticipant, RemoteTrack, RemoteTrackPublication, Track } from 'livekit-client';
import { useMiniApp } from "@neynar/react";

interface LiveKitSessionProps {
  topic: string;
  onBack: () => void;
}

export function LiveKitSession({ topic, onBack }: LiveKitSessionProps) {
  const { context } = useMiniApp();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roomName, setRoomName] = useState<string>("");
  const [connectionLogs, setConnectionLogs] = useState<string[]>([]);
  const roomRef = useRef<Room | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const addLog = useCallback((message: string) => {
    console.log(`[LiveKit] ${message}`);
    setConnectionLogs(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`]);
  }, []);

  useEffect(() => {
    // Generate a unique room name based on topic and timestamp
    const timestamp = Date.now();
    const sanitizedTopic = topic.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const generatedRoomName = `edumate-${sanitizedTopic}-${timestamp}`;
    setRoomName(generatedRoomName);
    addLog(`Generated room name: ${generatedRoomName}`);
  }, [topic, addLog]);

  const connectToLiveKit = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    addLog("Starting connection process...");

    try {
      // Generate participant name from Farcaster context
      const participantName = context?.user?.username || `user-${Date.now()}`;
      addLog(`Participant: ${participantName}`);

      // Get access token from our API
      addLog("Requesting access token...");
      const tokenResponse = await fetch('/api/livekit-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomName,
          participantName,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error(`Token request failed: ${tokenResponse.status}`);
      }

      const { token } = await tokenResponse.json();
      addLog("Access token received");

      // Create and configure room
      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });
      roomRef.current = room;

      // Set up event listeners
      room.on(RoomEvent.Connected, () => {
        addLog("Connected to room successfully!");
        setIsConnected(true);
        setIsConnecting(false);
      });

      room.on(RoomEvent.Disconnected, (reason) => {
        addLog(`Disconnected: ${reason}`);
        setIsConnected(false);
      });

      room.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
        addLog(`Participant joined: ${participant.identity}`);
      });

      room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
        addLog(`Track subscribed: ${track.kind} from ${participant.identity}`);
        
        if (track.kind === Track.Kind.Audio) {
          // Create audio element for remote audio
          const audioElement = track.attach();
          audioElementRef.current = audioElement;
          audioElement.play();
          addLog("Audio track attached and playing");
        }
      });

      room.on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
        addLog(`Track unsubscribed: ${track.kind} from ${participant.identity}`);
        track.detach();
      });

      room.on(RoomEvent.ConnectionStateChanged, (state) => {
        addLog(`Connection state: ${state}`);
      });

      // Connect to room
      addLog(`Connecting to ${LIVEKIT_URL}...`);
      await room.connect(LIVEKIT_URL, token);
      
      // Enable microphone
      addLog("Enabling microphone...");
      await room.localParticipant.enableCameraAndMicrophone(false, true);
      addLog("Microphone enabled");
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to connect";
      addLog(`Error: ${errorMessage}`);
      setError(errorMessage);
      setIsConnecting(false);
    }
  }, [roomName, context, addLog]);

  const disconnectFromLiveKit = useCallback(() => {
    addLog("Disconnecting from room...");
    if (roomRef.current) {
      roomRef.current.disconnect();
      roomRef.current = null;
    }
    if (audioElementRef.current) {
      audioElementRef.current.remove();
      audioElementRef.current = null;
    }
    setIsConnected(false);
    setError(null);
    addLog("Disconnected successfully");
  }, [addLog]);

  if (isConnected) {
    return (
      <div className="flex flex-col h-[calc(100vh-200px)] px-6">
        <div className="bg-card text-card-foreground rounded-lg border border-border p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">Learning Session Active</h2>
          <p className="text-sm text-muted-foreground mb-2">Topic: {topic}</p>
          <p className="text-xs text-muted-foreground">Room: {roomName}</p>
        </div>

        <div className="flex-1 bg-card text-card-foreground rounded-lg border border-border p-4 mb-4">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
              </div>
              <p className="text-sm text-muted-foreground">
                Connected to AI tutor
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Start speaking to begin your lesson
              </p>
            </div>
          </div>
        </div>

        {/* Connection Logs */}
        <div className="bg-card text-card-foreground rounded-lg border border-border p-3 mb-4 max-h-32 overflow-y-auto">
          <h3 className="text-sm font-semibold mb-2">Connection Log:</h3>
          {connectionLogs.map((log, index) => (
            <p key={index} className="text-xs text-muted-foreground font-mono">
              {log}
            </p>
          ))}
        </div>

        <div className="space-y-3">
          <Button
            onClick={disconnectFromLiveKit}
            variant="destructive"
            className="w-full"
          >
            End Session
          </Button>
          <Button
            onClick={onBack}
            variant="outline"
            className="w-full"
          >
            Back to Topic Selection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] px-6">
      <div className="bg-card text-card-foreground rounded-lg border border-border p-6 mb-4">
        <h2 className="text-lg font-semibold mb-4">Ready to Start Learning?</h2>
        
        <div className="space-y-3 text-sm text-muted-foreground">
          <p><strong>Topic:</strong> {topic}</p>
          <p><strong>Room:</strong> {roomName}</p>
          <p><strong>AI Tutor:</strong> Ready to assist</p>
          <p><strong>Session Type:</strong> Interactive Voice Chat</p>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Connection Logs */}
      {connectionLogs.length > 0 && (
        <div className="bg-card text-card-foreground rounded-lg border border-border p-3 mb-4 max-h-32 overflow-y-auto">
          <h3 className="text-sm font-semibold mb-2">Connection Log:</h3>
          {connectionLogs.map((log, index) => (
            <p key={index} className="text-xs text-muted-foreground font-mono">
              {log}
            </p>
          ))}
        </div>
      )}

      <div className="flex-1"></div>

      <div className="space-y-3">
        <Button
          onClick={connectToLiveKit}
          disabled={isConnecting}
          isLoading={isConnecting}
          className="w-full"
        >
          {isConnecting ? "Connecting..." : "Connect to AI Tutor"}
        </Button>
        
        <Button
          onClick={onBack}
          variant="outline"
          className="w-full"
          disabled={isConnecting}
        >
          Back to Topic Selection
        </Button>
      </div>

      <div className="text-xs text-muted-foreground text-center mt-2">
        <p>Powered by LiveKit • Secure & Private</p>
      </div>
    </div>
  );
}
