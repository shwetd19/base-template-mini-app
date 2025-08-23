import { NextResponse } from 'next/server';

export async function GET() {
  const config = {
    accountAssociation: {
      header: "eyJmaWQiOjEsInR5cGUiOiJjdXN0b2R5IiwiaGV4IjoiMHg4YjNkNDNiOWQ5YTU4NzNjOTQ1M2Y4YjY0NWFkYzA4NzJkMzI5Yjk4In0",
      payload: "eyJkb21haW4iOiJmcmFtZXMudG9vbHMifQ",
      signature: "MHg4YjNkNDNiOWQ5YTU4NzNjOTQ1M2Y4YjY0NWFkYzA4NzJkMzI5Yjk4"
    }
  };

  return NextResponse.json(config);
}