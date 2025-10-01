import { useWalletConnectContext } from "@/contexts/WalletConnectContext";
import { BCHMethods, NetworksIds } from "@/config/config";

export interface UseGetAddressesReturnType {
  getAddresses: () => Promise<string[] | undefined>;
}

export const useGetAddresses = (): UseGetAddressesReturnType => {
  const { provider, session, config } = useWalletConnectContext();

  const getAddresses = async (): Promise<string[] | undefined> => {
    if (!provider || !session) {
      throw new Error(
        "Error getting addresses: Provider or session is not defined",
      );
    }

    try {
      const addresses = await provider?.client.request<string[]>({
        chainId: NetworksIds[config.network],
        topic: session.topic,
        request: {
          method: BCHMethods.getAddresses,
          params: { token: true },
        },
      });

      return addresses;
    } catch (err) {
      throw err as Error & { code: number };
    }
  };

  return {
    getAddresses,
  };
};

export default useGetAddresses;
