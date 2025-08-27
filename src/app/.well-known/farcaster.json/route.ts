import { NextResponse } from 'next/server';

export async function GET() {
  const config = {
    accountAssociation: {
      header: "eyJmaWQiOjEyNzcyNzcsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgxNTE3ODQ3YTNBNTU3RTlGOWEyMjhCOTYzNTI5N2FDMjNCNDk0MTMzIn0",
      payload: "eyJkb21haW4iOiJlZHVtYXRlLWFwcC52ZXJjZWwuYXBwIn0",
      signature: "MHhkMGJiMGY5NTk1NjQyMWQyNjdlMmNmM2M3MjJhMjEwMDZlZDNjODk2NjdjODc4MmQzM2M4MjVmNmZhNDYzNjFhMmQ0YjNmOTFlNjNjYTgzYzZkZjI5NDVjNTMyNTA0ZTE4YjdhMjAwOTJiMWY4ZjVjZDg3OThiMzJhMjI1MzM4ZDFj"
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