import { useEffect, useState } from "react";
import { UniversalConnector } from "@reown/appkit-universal-connector";
import { getUniversalConnector } from "@/config/config";
import { WalletConnectContext } from "@/context/WalletConnectContext";
import type { Configuration } from "@/config/config";

interface Props {
  children: React.ReactNode;
  config: Configuration;
}

export const WalletConnectProvider: React.FC<Props> = ({
  children,
  config,
}: Props) => {
  const [universalConnector, setUniversalConnector] =
    useState<UniversalConnector | null>(null);
  const [session, setSession] = useState<
    UniversalConnector["provider"]["session"] | null
  >(null);

  useEffect(() => {
    const provider = universalConnector?.provider;
    if (!provider) return;

    const handleConnect = async (connectInfo: {
      session: UniversalConnector["provider"]["session"];
    }) => {
      setSession(connectInfo.session);
    };

    const handleDisconnect = async () => {
      setSession(null);
    };

    provider.on("connect", handleConnect);
    provider.on("disconnect", handleDisconnect);

    return () => {
      provider.removeListener("connect", handleConnect);
      provider.removeListener("disconnect", handleDisconnect);
    };
  }, [universalConnector?.provider]);

  useEffect(() => {
    if (universalConnector) return;

    const initializeUniversalConnector = async () => {
      const universalConnector = await getUniversalConnector(config);
      setUniversalConnector(universalConnector);
    };

    initializeUniversalConnector();
  }, [universalConnector, config]);

  useEffect(() => {
    const currentSession = universalConnector?.provider.session;

    if (!currentSession) setSession(null);

    setSession(currentSession);
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
    config,
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
