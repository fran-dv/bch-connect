import type {
  WcSignTransactionRequest,
  WcSignTransactionResponse,
} from "@bch-wc2/interfaces";
import { useWalletConnectContext } from "../contexts/WalletConnectContext";
import { NetworksIds } from "@/config/config";
import { stringify } from "@bitauth/libauth";
import { BCHMethods } from "@/config/config";

export interface UseSignTransactionReturnType {
  signTransaction: (
    options: WcSignTransactionRequest,
  ) => Promise<WcSignTransactionResponse | undefined>;
}

export const useSignTransaction = (): UseSignTransactionReturnType => {
  const { provider, session, config } = useWalletConnectContext();

  const signTransaction = async (
    options: WcSignTransactionRequest,
  ): Promise<WcSignTransactionResponse | undefined> => {
    if (!provider || !session) {
      throw new Error(
        "Error signing transactions: Provider or session is not defined",
      );
    }

    try {
      const response = await provider.client.request<WcSignTransactionResponse>(
        {
          chainId: NetworksIds[config.network],
          topic: session.topic,
          request: {
            method: BCHMethods.signTransaction,
            params: JSON.parse(stringify(options)),
          },
        },
      );

      return response;
    } catch (err) {
      throw err as Error & { code: number };
    }
  };

  return {
    signTransaction,
  };
};

export default useSignTransaction;
