import { BCHMethods, CurrentConfig } from "@/config/config";
import {
  useWalletConnectContext,
  type ConnectWalletCallback,
  type DisconnectWalletCallback,
} from "@/context/WalletConnectContext";
import { useEffect, useState } from "react";
import {
  type WcSignMessageRequest,
  type WcSignMessageResponse,
  type WcSignTransactionRequest,
  type WcSignTransactionResponse,
} from "@bch-wc2/interfaces";
import { stringify } from "@bitauth/libauth";

export interface UseWalletReturnType {
  addresses: string[] | null;

  isConnected: boolean;
  isConnecting: boolean;

  connect: ConnectWalletCallback;
  disconnect: DisconnectWalletCallback;
  signTransaction: (
    options: WcSignTransactionRequest,
  ) => Promise<WcSignTransactionResponse | undefined>;
  signMessage: (
    options: WcSignMessageRequest,
  ) => Promise<WcSignMessageResponse | undefined>;
}

export const useWallet = (): UseWalletReturnType => {
  const { connect, disconnect, session, provider } = useWalletConnectContext();
  const isConnected = !!session;
  const isConnecting = false;
  const [addresses, setAddresses] = useState<string[] | null>(null);

  useEffect(() => {
    if (!isConnected || !session || !provider) {
      console.log(
        "is connected is false or ther is not sessions / provider. Bye",
      );
      setAddresses(null);
      return;
    }

    const fetchAndSetAddresses = async () => {
      try {
        const addresses = await provider?.client.request<string[]>({
          chainId: CurrentConfig.chainId,
          topic: session.topic,
          request: {
            method: "bch_getAddresses",
            params: {},
          },
        });

        if (!addresses) return;

        setAddresses(addresses);
      } catch (err) {
        console.error("Failed to get addresses:", err);
      }
    };

    fetchAndSetAddresses();
  }, [session, provider, isConnected]);

  const signTransaction = async (
    options: WcSignTransactionRequest,
  ): Promise<WcSignTransactionResponse | undefined> => {
    if (!provider || !session) {
      console.error(
        "Error signing transactions: Provider or session is not defined",
      );
      return undefined;
    }

    try {
      const response = await provider.client.request<WcSignTransactionResponse>(
        {
          chainId: CurrentConfig.chainId,
          topic: session.topic,
          request: {
            method: BCHMethods.signTransaction,
            params: JSON.parse(stringify(options)),
          },
        },
      );

      return response;
    } catch (err) {
      console.error("Failed to sign transaction:", err);
      return undefined;
    }
  };

  const signMessage = async (
    options: WcSignMessageRequest,
  ): Promise<WcSignMessageResponse | undefined> => {
    if (!provider || !session) {
      console.error(
        "Error signing messages: Provider or session is not defined",
      );
      return undefined;
    }

    try {
      const response = await provider.client.request<WcSignMessageResponse>({
        chainId: CurrentConfig.chainId,
        topic: session.topic,
        request: {
          method: BCHMethods.signMessage,
          params: JSON.parse(stringify(options)),
        },
      });

      return response;
    } catch (err) {
      console.error("Failed to sign message:", err);
      return undefined;
    }
  };

  return {
    addresses,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    signTransaction,
    signMessage,
  };
};

export default useWallet;
