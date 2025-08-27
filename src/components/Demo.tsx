"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useSendTransaction,
  useSignMessage,
  useSignTypedData,
  useWaitForTransactionReceipt,
  useDisconnect,
  useConnect,
  useSwitchChain,
  useChainId,
} from "wagmi";

import { ShareButton } from "./ui/Share";
import { LiveKitSession } from "./ui/LiveKitSession";

import { config } from "~/components/providers/WagmiProvider";
import { Button } from "~/components/ui/Button";
import { truncateAddress } from "~/lib/truncateAddress";
import { base, degen, mainnet, optimism, unichain } from "wagmi/chains";
import { BaseError, UserRejectedRequestError } from "viem";
import { useMiniApp } from "@neynar/react";
import { Header } from "~/components/ui/Header";
import { Footer } from "~/components/ui/Footer";
import { USE_WALLET, APP_NAME } from "~/lib/constants";

export type Tab = "home" | "actions" | "context" | "wallet";
export type Screen = "topic-input" | "livekit-session";

interface NeynarUser {
  fid: number;
  score: number;
}

export default function Demo() {
  const { isSDKLoaded, context, added, notificationDetails, actions } =
    useMiniApp();
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [currentScreen, setCurrentScreen] = useState<Screen>("topic-input");
  const [topic, setTopic] = useState("");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [sendNotificationResult, setSendNotificationResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [neynarUser, setNeynarUser] = useState<NeynarUser | null>(null);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  useEffect(() => {
    console.log("isSDKLoaded", isSDKLoaded);
    console.log("context", context);
    console.log("address", address);
    console.log("isConnected", isConnected);
    console.log("chainId", chainId);
  }, [context, address, isConnected, chainId, isSDKLoaded]);

  // Fetch Neynar user object when context is available
  useEffect(() => {
    const fetchNeynarUserObject = async () => {
      if (context?.user?.fid) {
        try {
          const response = await fetch(`/api/users?fids=${context.user.fid}`);
          const data = await response.json();
          if (data.users?.[0]) {
            setNeynarUser(data.users[0]);
          }
        } catch (error) {
          console.error("Failed to fetch Neynar user object:", error);
        }
      }
    };

    fetchNeynarUserObject();
  }, [context?.user?.fid]);

  const {
    sendTransaction,
    error: sendTxError,
    isError: isSendTxError,
    isPending: isSendTxPending,
  } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

  const {
    signTypedData,
    error: signTypedError,
    isError: isSignTypedError,
    isPending: isSignTypedPending,
  } = useSignTypedData();

  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();

  const {
    switchChain,
    error: switchChainError,
    isError: isSwitchChainError,
    isPending: isSwitchChainPending,
  } = useSwitchChain();

  const nextChain = useMemo(() => {
    if (chainId === base.id) {
      return optimism;
    } else if (chainId === optimism.id) {
      return degen;
    } else if (chainId === degen.id) {
      return mainnet;
    } else if (chainId === mainnet.id) {
      return unichain;
    } else {
      return base;
    }
  }, [chainId]);

  const handleSwitchChain = useCallback(() => {
    switchChain({ chainId: nextChain.id });
  }, [switchChain, nextChain.id]);

  const sendNotification = useCallback(async () => {
    setSendNotificationResult("");
    if (!notificationDetails || !context) {
      return;
    }

    try {
      const response = await fetch("/api/send-notification", {
        method: "POST",
        mode: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fid: context.user.fid,
          notificationDetails,
        }),
      });

      if (response.status === 200) {
        setSendNotificationResult("Success");
        return;
      } else if (response.status === 429) {
        setSendNotificationResult("Rate limited");
        return;
      }

      const data = await response.text();
      setSendNotificationResult(`Error: ${data}`);
    } catch (error) {
      setSendNotificationResult(`Error: ${error}`);
    }
  }, [context, notificationDetails]);

  const sendTx = useCallback(() => {
    sendTransaction(
      {
        // call yoink() on Yoink contract
        to: "0x4bBFD120d9f352A0BEd7a014bd67913a2007a878",
        data: "0x9846cd9efc000023c0",
      },
      {
        onSuccess: (hash) => {
          setTxHash(hash);
        },
      }
    );
  }, [sendTransaction]);

  const signTyped = useCallback(() => {
    signTypedData({
      domain: {
        name: APP_NAME,
        version: "1",
        chainId,
      },
      types: {
        Message: [{ name: "content", type: "string" }],
      },
      message: {
        content: `Hello from ${APP_NAME}!`,
      },
      primaryType: "Message",
    });
  }, [chainId, signTypedData]);

  const handleStartSession = useCallback(() => {
    if (topic.trim()) {
      setCurrentScreen("livekit-session");
    }
  }, [topic]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div className="mx-auto py-2 px-4 pb-20">
        <Header neynarUser={neynarUser} />

        {activeTab === "home" && currentScreen === "topic-input" && (
          <div className="min-h-[calc(100vh-200px)] px-6 py-8">
            <div className="w-full max-w-2xl mx-auto space-y-8">
              {/* Hero Section */}
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <div className="text-3xl">🎓</div>
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Meet EduMate
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Your Personalized AI Learning Coach
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <p className="text-lg leading-relaxed text-black">
                    Ask me <span className="font-semibold">anything</span> you
                    want to learn, and I&apos;ll be your dedicated AI assistant
                    to guide you through it step by step.
                  </p>
                </div>
              </div>

              {/* Learning Topics Examples */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-center text-foreground">
                  What would you like to explore today?
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      icon: "💻",
                      topic: "Programming & Coding",
                      example: "JavaScript fundamentals",
                    },
                    {
                      icon: "🧬",
                      topic: "Science & Nature",
                      example: "How DNA works",
                    },
                    {
                      icon: "🎨",
                      topic: "Arts & Creativity",
                      example: "Color theory basics",
                    },
                    {
                      icon: "📊",
                      topic: "Business & Finance",
                      example: "Investment strategies",
                    },
                    {
                      icon: "🌍",
                      topic: "History & Culture",
                      example: "Ancient civilizations",
                    },
                    {
                      icon: "🔬",
                      topic: "Math & Logic",
                      example: "Calculus concepts",
                    },
                  ].map((category, index) => (
                    <button
                      key={index}
                      onClick={() => setTopic(category.example)}
                      className="p-4 bg-card hover:bg-accent rounded-xl border border-border transition-all duration-200 hover:shadow-md hover:scale-[1.02] text-left group"
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                          {category.icon}
                        </span>
                        <div>
                          <h3 className="font-medium text-foreground text-sm">
                            {category.topic}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            e.g., {category.example}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Section */}
              <div className="space-y-4">
                <div className="relative">
                  <label
                    htmlFor="topic"
                    className="block text-sm font-medium text-foreground mb-3"
                  >
                    Or describe what you&apos;d like to learn:
                  </label>
                  <div className="relative">
                    <textarea
                      id="topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Type anything you're curious about... 
• How do rockets work?
• Explain machine learning in simple terms
• Teach me Spanish conversation basics
• What is quantum computing?"
                      className="w-full p-4 pr-12 border-2 border-border rounded-xl bg-card text-card-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      rows={5}
                    />
                    <div className="absolute bottom-3 right-3 text-2xl opacity-50">
                      💭
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    The more specific you are, the better I can tailor the
                    learning experience for you!
                  </p>
                </div>

                <div className="space-y-3">
                  {/* <Button
                    onClick={handleStartSession}
                    disabled={!topic.trim()}
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {!topic.trim() ? (
                      <>
                        <span className="mr-2">🎯</span>
                        Choose a topic to get started
                      </>
                    ) : (
                      <>
                        <span className="mr-2">🚀</span>
                        Start Learning with EduMate
                      </>
                    )}
                  </Button> */}

                  <Button
                    onClick={handleStartSession}
                    disabled={!topic.trim()}
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {!topic.trim() ? (
                      <>
                        <span className="mr-2">🎯</span>
                        Choose Topic
                      </>
                    ) : (
                      <>
                        <span className="mr-2">🚀</span>
                        Start Learning
                      </>
                    )}
                  </Button>

                  {topic.trim() && (
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                      <p className="text-sm text-green-800 dark:text-green-200 text-center">
                        <span className="font-medium">Ready to learn:</span>{" "}
                        {topic}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <h3 className="font-semibold text-foreground text-center">
                  Why EduMate?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center space-y-2">
                    <div className="w-10 h-10 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      🎯
                    </div>
                    <h4 className="font-medium text-sm text-foreground">
                      Personalized
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Adapts to your learning pace and style
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-10 h-10 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                      🗣️
                    </div>
                    <h4 className="font-medium text-sm text-foreground">
                      Interactive
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Voice conversations make learning engaging
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-10 h-10 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      ⚡
                    </div>
                    <h4 className="font-medium text-sm text-foreground">
                      Instant
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Get answers and explanations right away
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "home" && currentScreen === "livekit-session" && (
          <LiveKitSession
            topic={topic}
            onBack={() => setCurrentScreen("topic-input")}
          />
        )}

        {activeTab === "actions" && (
          <div className="space-y-3 px-6 w-full max-w-md mx-auto">
            <ShareButton
              buttonText="Share Mini App"
              cast={{
                text: "Check out this awesome frame @1 @2 @3! 🚀🪐",
                bestFriends: true,
                embeds: [
                  `${process.env.NEXT_PUBLIC_URL}/share/${
                    context?.user?.fid || ""
                  }`,
                ],
              }}
              className="w-full"
            />

            <Button
              onClick={() =>
                actions.openUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
              }
              className="w-full"
            >
              Open Link
            </Button>

            <Button onClick={actions.close} className="w-full">
              Close Mini App
            </Button>

            <Button
              onClick={actions.addMiniApp}
              disabled={added}
              className="w-full"
            >
              Add Mini App to Client
            </Button>

            {sendNotificationResult && (
              <div className="text-sm w-full">
                Send notification result: {sendNotificationResult}
              </div>
            )}
            <Button
              onClick={sendNotification}
              disabled={!notificationDetails}
              className="w-full"
            >
              Send notification
            </Button>

            <Button
              onClick={async () => {
                if (context?.user?.fid) {
                  const shareUrl = `${process.env.NEXT_PUBLIC_URL}/share/${context.user.fid}`;
                  await navigator.clipboard.writeText(shareUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }
              }}
              disabled={!context?.user?.fid}
              className="w-full"
            >
              {copied ? "Copied!" : "Copy share URL"}
            </Button>
          </div>
        )}

        {activeTab === "context" && (
          <div className="mx-6">
            <h2 className="text-lg font-semibold mb-2 text-foreground">
              Context
            </h2>
            <div className="p-4 bg-card text-card-foreground rounded-lg border border-border">
              <pre className="font-mono text-xs whitespace-pre-wrap break-words w-full">
                {JSON.stringify(context, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {activeTab === "wallet" && USE_WALLET && (
          <div className="space-y-3 px-6 w-full max-w-md mx-auto">
            {address && (
              <div className="text-xs w-full">
                Address:{" "}
                <pre className="inline w-full">{truncateAddress(address)}</pre>
              </div>
            )}

            {chainId && (
              <div className="text-xs w-full">
                Chain ID: <pre className="inline w-full">{chainId}</pre>
              </div>
            )}

            {isConnected ? (
              <Button onClick={() => disconnect()} className="w-full">
                Disconnect
              </Button>
            ) : context ? (
              <Button
                onClick={() => connect({ connector: connectors[0] })}
                className="w-full"
              >
                Connect
              </Button>
            ) : (
              <div className="space-y-3 w-full">
                <Button
                  onClick={() => connect({ connector: connectors[1] })}
                  className="w-full"
                >
                  Connect Coinbase Wallet
                </Button>
                <Button
                  onClick={() => connect({ connector: connectors[2] })}
                  className="w-full"
                >
                  Connect MetaMask
                </Button>
              </div>
            )}

            <SignEvmMessage />

            {isConnected && (
              <>
                <SendEth />
                <Button
                  onClick={sendTx}
                  disabled={!isConnected || isSendTxPending}
                  isLoading={isSendTxPending}
                  className="w-full"
                >
                  Send Transaction (contract)
                </Button>
                {isSendTxError && renderError(sendTxError)}
                {txHash && (
                  <div className="text-xs w-full">
                    <div>Hash: {truncateAddress(txHash)}</div>
                    <div>
                      Status:{" "}
                      {isConfirming
                        ? "Confirming..."
                        : isConfirmed
                        ? "Confirmed!"
                        : "Pending"}
                    </div>
                  </div>
                )}
                <Button
                  onClick={signTyped}
                  disabled={!isConnected || isSignTypedPending}
                  isLoading={isSignTypedPending}
                  className="w-full"
                >
                  Sign Typed Data
                </Button>
                {isSignTypedError && renderError(signTypedError)}
                <Button
                  onClick={handleSwitchChain}
                  disabled={isSwitchChainPending}
                  isLoading={isSwitchChainPending}
                  className="w-full"
                >
                  Switch to {nextChain.name}
                </Button>
                {isSwitchChainError && renderError(switchChainError)}
              </>
            )}
          </div>
        )}

        <Footer
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          showWallet={USE_WALLET}
        />
      </div>
    </div>
  );
}

function SignEvmMessage() {
  const { isConnected } = useAccount();
  const { connectAsync } = useConnect();
  const {
    signMessage,
    data: signature,
    error: signError,
    isError: isSignError,
    isPending: isSignPending,
  } = useSignMessage();

  const handleSignMessage = useCallback(async () => {
    if (!isConnected) {
      await connectAsync({
        chainId: base.id,
        connector: config.connectors[0],
      });
    }

    signMessage({ message: "Hello from Frames v2!" });
  }, [connectAsync, isConnected, signMessage]);

  return (
    <>
      <Button
        onClick={handleSignMessage}
        disabled={isSignPending}
        isLoading={isSignPending}
      >
        Sign Message
      </Button>
      {isSignError && renderError(signError)}
      {signature && (
        <div className="mt-2 text-xs">
          <div>Signature: {signature}</div>
        </div>
      )}
    </>
  );
}

function SendEth() {
  const { isConnected, chainId } = useAccount();
  const {
    sendTransaction,
    data,
    error: sendTxError,
    isError: isSendTxError,
    isPending: isSendTxPending,
  } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: data,
    });

  const toAddr = useMemo(() => {
    // Protocol guild address
    return chainId === base.id
      ? "0x32e3C7fD24e175701A35c224f2238d18439C7dBC"
      : "0xB3d8d7887693a9852734b4D25e9C0Bb35Ba8a830";
  }, [chainId]);

  const handleSend = useCallback(() => {
    sendTransaction({
      to: toAddr,
      value: 1n,
    });
  }, [toAddr, sendTransaction]);

  return (
    <>
      <Button
        onClick={handleSend}
        disabled={!isConnected || isSendTxPending}
        isLoading={isSendTxPending}
      >
        Send Transaction (eth)
      </Button>
      {isSendTxError && renderError(sendTxError)}
      {data && (
        <div className="mt-2 text-xs">
          <div>Hash: {truncateAddress(data)}</div>
          <div>
            Status:{" "}
            {isConfirming
              ? "Confirming..."
              : isConfirmed
              ? "Confirmed!"
              : "Pending"}
          </div>
        </div>
      )}
    </>
  );
}

const renderError = (error: Error | null) => {
  if (!error) return null;
  if (error instanceof BaseError) {
    const isUserRejection = error.walk(
      (e) => e instanceof UserRejectedRequestError
    );

    if (isUserRejection) {
      return <div className="text-red-500 text-xs mt-1">Rejected by user.</div>;
    }
  }

  return <div className="text-red-500 text-xs mt-1">{error.message}</div>;
};
