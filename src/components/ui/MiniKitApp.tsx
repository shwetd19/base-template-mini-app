'use client';

import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useEffect } from 'react';

export default function MiniKitApp() {
  const { context, isFrameReady, setFrameReady } = useMiniKit();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  return (
    <div className="p-4 bg-card text-foreground rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-2">Welcome, User {context?.user?.fid}!</h1>
      <p className="text-muted-foreground mb-2">
        Launched from: {JSON.stringify(context?.location) || 'Unknown'}
      </p>
      {context?.client?.added && (
        <p className="text-green-600">✅ You&apos;ve saved this app!</p>
      )}
    </div>
  );
}
