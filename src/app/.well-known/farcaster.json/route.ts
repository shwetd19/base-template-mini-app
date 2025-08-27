import { NextResponse } from 'next/server';

export async function GET() {
  const config = {
    accountAssociation: {
      header: "eyJmaWQiOjEyNzcyNzcsInR5cGUiOiJhdXRoIiwia2V5IjoiMHg1RTJmRjA5OTZFRDE2OWNBYjQ3QWMyNjk2N0ZjYjZDMzBjNzRhZGMxIn0",
      payload: "eyJkb21haW4iOiJlZHVtYXRlLWFwcC52ZXJjZWwuYXBwIn0",
      signature: "anVR+aGPrLFbGTkfaKQhre1HJXypo1gxyIo1zCAeAm8pX9x3Mp96HMfX+Du2voEozuX5MK/z9Go41r5AJOjAoxw="
    },
    frame: {
      version: "1",
      name: "EduMate",
      iconUrl: "https://edumate-app.vercel.app/app-icon.png",
      homeUrl: "https://edumate-app.vercel.app/",
      subtitle: "Your Personalized AI Learning Coach",
      description: "Ask me anything you want to learn, and I'll be your dedicated AI assistant to guide you through it step by step.",
      primaryCategory: "education",
      screenshotUrls: [
        "https://edumate-app.vercel.app/edu-mate.png"
      ],
      tags: [
        "education"
      ],
      imageUrl: "https://edumate-app.vercel.app/edu-mate.png",
      heroImageUrl: "https://edumate-app.vercel.app/edu-mate.png",
      splashImageUrl: "https://edumate-app.vercel.app/edu-mate.png",
      splashBackgroundColor: "#000000",
      tagline: "Your AI Learning Coach",
      buttonTitle: "Choose a topic to get started",
      ogTitle: "EduMate - Your Learning Coach",
      ogDescription: "Learn Smarter, Faster, Anytime with Your AI Tutor",
      ogImageUrl: "https://edumate-app.vercel.app/edu-mate.png",
      webhookUrl: "https://edumate-app.vercel.app/api/webhook"
    }
  };

  return NextResponse.json(config);
}
