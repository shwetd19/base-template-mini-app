export const APP_URL = process.env.NEXT_PUBLIC_URL!;
export const APP_NAME = process.env.NEXT_PUBLIC_FRAME_NAME;
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_FRAME_DESCRIPTION;
export const APP_PRIMARY_CATEGORY = process.env.NEXT_PUBLIC_FRAME_PRIMARY_CATEGORY;
export const APP_TAGS = process.env.NEXT_PUBLIC_FRAME_TAGS?.split(',');
export const APP_ICON_URL = `${APP_URL}/icon.png`;
export const APP_OG_IMAGE_URL = `${APP_URL}/api/opengraph-image`;
export const APP_SPLASH_URL = `${APP_URL}/splash.png`;
export const APP_SPLASH_BACKGROUND_COLOR = "#f7f7f7";
export const APP_BUTTON_TEXT = process.env.NEXT_PUBLIC_FRAME_BUTTON_TEXT;
export const APP_WEBHOOK_URL = process.env.NEYNAR_API_KEY && process.env.NEYNAR_CLIENT_ID 
    ? `https://api.neynar.com/f/app/${process.env.NEYNAR_CLIENT_ID}/event`
    : `${APP_URL}/api/webhook`;
export const USE_WALLET = process.env.NEXT_PUBLIC_USE_WALLET === 'true';

// LiveKit configuration
export const LIVEKIT_URL = "wss://edumate-hackathon-9421gd98.livekit.cloud";
export const LIVEKIT_API_KEY = "APIrAqLYiW4mh5u";
export const LIVEKIT_API_SECRET = "ehehqUk4AiwbTMkjp00WiNJNf1sd5Nq3U4zeDMLzh7XA";

// Database configuration
export const DATABASE_URL = "postgresql://postgres.kxalwmxfxvhphyzlkfeq:qnHkpXVs5D1O4HOg@aws-0-us-west-1.pooler.supabase.com:5432/postgres";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtdWd5cHJid2J6eXJyeWdwYWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NTkzNjYsImV4cCI6MjA2OTQzNTM2Nn0.h5DdqWSdLoA2F4KZAHY4Y7EjmyE16NJRpo9IrXBTZSI";
