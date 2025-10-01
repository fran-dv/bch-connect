import {
  useWalletConnectContext,
  type ConnectWalletCallback,
  type DisconnectWalletCallback,
} from "@/contexts/WalletConnectContext";
import addressToTokenAddress from "@/utils/addressToTokenAddress";
import { useCallback, useEffect, useState } from "react";
import useGetAddresses from "@/hooks/useGetAddresses";

export interface UseWalletReturnType {
  address: string | null;
  tokenAddress: string | null;
  areAddressesLoading: boolean;
  addressError: Error | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectError: Error | null;
  isDisconnecting: boolean;
  disconnectError: Error | null;
  isError: boolean;
  connect: ConnectWalletCallback;
  disconnect: DisconnectWalletCallback;
  refetchAddresses: () => Promise<void>;
}

export const useWallet = (): UseWalletReturnType => {
  const {
    connect,
    disconnect,
    session,
    provider,
    config,
    isConnecting,
    connectError,
    isDisconnecting,
    disconnectError,
  } = useWalletConnectContext();
  const { getAddresses } = useGetAddresses();
  const isConnected = !!session;
  const [address, setAddress] = useState<string | null>(null);
  const [areAddressesLoading, setAreAddressesLoading] = useState(false);
  const [addressError, setAddressError] = useState<Error | null>(null);
  const [tokenAddress, setTokenAddress] = useState<string | null>(null);
  const isError = !!addressError || !!connectError || !!disconnectError;

  const fetchAddresses = useCallback(async () => {
    setAreAddressesLoading(true);
    try {
      const addresses = await getAddresses();

      if (!addresses) return;

      setAddress(addresses[0]);
      setAddressError(null);
    } catch (err) {
      setAddressError(err as Error);
    } finally {
      setAreAddressesLoading(false);
    }
  }, [getAddresses]);

  useEffect(() => {
    if (!isConnected || !session || !provider) {
      setAddress(null);
      return;
    }

    fetchAddresses();
  }, [session, isConnected, provider, fetchAddresses, config.network]);

  useEffect(() => {
    if (!address) return;

    try {
      const tokenAddress = addressToTokenAddress({
        address,
        network: config.network,
      });
      setTokenAddress(tokenAddress);
      setAddressError(null);
    } catch (err) {
      setAddressError(err as Error);
    }
  }, [address, config.network]);

  return {
    address,
    tokenAddress,
    areAddressesLoading,
    addressError,
    isConnected,
    isConnecting,
    connectError,
    isDisconnecting,
    disconnectError,
    isError,
    connect,
    disconnect,
    refetchAddresses: fetchAddresses,
  };
};

export default useWallet;
