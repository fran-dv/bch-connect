import { useEffect, useState } from "react";
import { UniversalConnector } from "@reown/appkit-universal-connector";
import { getUniversalConnector, type Configuration } from "@/config/config";
import { WalletConnectContext } from "@/contexts/WalletConnectContext";

interface Props {
  children: React.ReactNode;
  config: Configuration;
}

export const BCHConnectProvider: React.FC<Props> = ({
  children,
  config,
}: Props) => {
  const [universalConnector, setUniversalConnector] =
    useState<UniversalConnector | null>(null);
  const [session, setSession] = useState<
    UniversalConnector["provider"]["session"] | null
  >(null);
  const [connectError, setConnectError] = useState<Error | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [disconnectError, setDisconnectError] = useState<Error | null>(null);

  useEffect(() => {
    if (universalConnector !== null) return;
    // Initialize the universal connector only on mount
    (async () => {
      try {
        const connector = await getUniversalConnector(config);
        setUniversalConnector(connector);
      } catch (err) {
        setConnectError(err as Error);
      }
    })();
  }, [config, universalConnector]);

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
    const currentSession = universalConnector?.provider.session;

    if (!currentSession) setSession(null);

    setSession(currentSession);
  }, [universalConnector?.provider]);

  const connect = async () => {
    if (!universalConnector) return;

    try {
      const result = await universalConnector.connect();
      setSession(result.session);
    } catch (err) {
      setConnectError(err as Error);
    }
  };

  const disconnect = async () => {
    const provider = universalConnector?.provider;

    if (!provider) return;

    setIsDisconnecting(true);
    try {
      await provider.disconnect();
      setSession(null);
    } catch (err) {
      setDisconnectError(err as Error);
    } finally {
      setIsDisconnecting(false);
    }
  };

  const walletConnectContextVaues: WalletConnectContext = {
    config,
    session,
    provider: universalConnector?.provider ?? null,
    connectError,
    isDisconnecting,
    disconnectError,
    connect,
    disconnect,
  };

  return (
    <WalletConnectContext.Provider value={walletConnectContextVaues}>
      {children}
    </WalletConnectContext.Provider>
  );
};

export default BCHConnectProvider;
