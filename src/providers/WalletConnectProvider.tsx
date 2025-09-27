import { useEffect, useState } from "react";
import { UniversalConnector } from "@reown/appkit-universal-connector";
import { getUniversalConnector } from "@/config/config";
import { WalletConnectContext } from "@/context/WalletConnectContext";

interface Props {
  children: React.ReactNode;
}

export const WalletConnectProvider: React.FC<Props> = ({ children }: Props) => {
  const [universalConnector, setUniversalConnector] =
    useState<UniversalConnector | null>(null);
  const [session, setSession] = useState<
    UniversalConnector["provider"]["session"] | null
  >(null);

  useEffect(() => {
    if (universalConnector) return;

    const initializeUniversalConnector = async () => {
      const universalConnector = await getUniversalConnector();
      setUniversalConnector(universalConnector);
    };

    initializeUniversalConnector();
  }, [universalConnector]);

  useEffect(() => {
    const currentSession = universalConnector?.provider.session;

    if (!currentSession) setSession(null);

    setSession(currentSession);
  }, [universalConnector?.provider]);

  useEffect(() => {
    const provider = universalConnector?.provider;

    if (!provider) return;

    provider.on("display_uri", (uri: unknown) => {
      console.log("display_uri", uri);
    });

    provider.on(
      "session_delete",
      ({ id, topic }: { id: number; topic: string }) => {
        console.log("session_delete", id, topic);
      },
    );
  }, [universalConnector?.provider]);

  const connect = async () => {
    if (!universalConnector) return;

    await universalConnector.connect();
  };

  const disconnect = async () => {
    const provider = universalConnector?.provider;

    if (!provider) return;

    await provider.disconnect();
    setSession(null);
  };

  const walletConnectContextVaues: WalletConnectContext = {
    session,
    provider: universalConnector?.provider ?? null,

    connect,
    disconnect,
  };

  return (
    <WalletConnectContext.Provider value={walletConnectContextVaues}>
      {children}
    </WalletConnectContext.Provider>
  );
};

export default WalletConnectProvider;
