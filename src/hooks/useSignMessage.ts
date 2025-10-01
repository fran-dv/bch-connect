import type {
  WcSignMessageRequest,
  WcSignMessageResponse,
} from "@bch-wc2/interfaces";
import { useWalletConnectContext } from "../contexts/WalletConnectContext";
import { NetworksIds } from "@/config/config";
import { stringify } from "@bitauth/libauth";
import { BCHMethods } from "@/config/config";

export interface UseSignMessageReturnType {
  signMessage: (
    options: WcSignMessageRequest,
  ) => Promise<WcSignMessageResponse | undefined>;
}

export const useSignMessage = (): UseSignMessageReturnType => {
  const { provider, session, config } = useWalletConnectContext();

  const signMessage = async (
    options: WcSignMessageRequest,
  ): Promise<WcSignMessageResponse | undefined> => {
    if (!provider || !session) {
      throw new Error(
        "Error signing messages: Provider or session is not defined",
      );
    }

    try {
      const response = await provider.client.request<WcSignMessageResponse>({
        chainId: NetworksIds[config.network],
        topic: session.topic,
        request: {
          method: BCHMethods.signMessage,
          params: JSON.parse(stringify(options)),
        },
      });

      return response;
    } catch (err) {
      throw new Error(`Error signing message: ${err}`);
    }
  };

  return {
    signMessage,
  };
};

export default useSignMessage;
