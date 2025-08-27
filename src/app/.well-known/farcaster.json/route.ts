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
      name: "Example Frame",
      iconUrl: "https://edumate-app.vercel.app/icon.png",
      homeUrl: "https://edumate-app.vercel.app",
      imageUrl: "https://edumate-app.vercel.app/image.png",
      buttonTitle: "Check this out",
      splashImageUrl: "https://edumate-app.vercel.app/splash.png",
      splashBackgroundColor: "#eeccff",
      webhookUrl: "https://edumate-app.vercel.app/api/webhook"
    }
  };

  return NextResponse.json(config);
}