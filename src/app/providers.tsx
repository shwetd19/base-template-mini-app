"use client";

import dynamic from "next/dynamic";
import { MiniAppProvider } from "@neynar/react";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { base } from "wagmi/chains";

const WagmiProvider = dynamic(
  () => import("~/components/providers/WagmiProvider"),
  {
    ssr: false,
  }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider>
      <MiniKitProvider 
        apiKey={process.env.NEXT_PUBLIC_CDP_CLIENT_API_KEY || process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY} 
        chain={base}
      >
        <MiniAppProvider analyticsEnabled={true}>{children}</MiniAppProvider>
      </MiniKitProvider>
    </WagmiProvider>
  );
}
