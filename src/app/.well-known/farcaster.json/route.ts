import { NextResponse } from 'next/server';

export async function GET() {
  const config = {
    accountAssociation: {
      header: "eyJmaWQiOjEsInR5cGUiOiJjdXN0b2R5IiwiaGV4IjoiMHg4YjNkNDNiOWQ5YTU4NzNjOTQ1M2Y4YjY0NWFkYzA4NzJkMzI5Yjk4In0",
      payload: "eyJkb21haW4iOiJmcmFtZXMudG9vbHMifQ",
      signature: "MHg4YjNkNDNiOWQ5YTU4NzNjOTQ1M2Y4YjY0NWFkYzA4NzJkMzI5Yjk4"
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