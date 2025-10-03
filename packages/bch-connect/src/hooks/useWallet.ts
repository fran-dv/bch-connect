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
  tokenAddressError: Error | null;
  isConnected: boolean;
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
  const [tokenAddressError, setTokenAddressError] = useState<Error | null>(
    null,
  );
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
    if (!session) {
      setAddress(null);
      return;
    }

    const namespaceAddress = session.namespaces.bch.accounts[0];
    if (!namespaceAddress) {
      setAddressError(new Error("No address found in session's namespace"));
      setAddress(null);
      return;
    }

    const prefix = "bch:";
    const cleanAddress = namespaceAddress.replace(prefix, "");
    setAddress(cleanAddress);
    setAddressError(null);
  }, [session]);

  useEffect(() => {
    if (!provider) return;

    const handleAddressesChanged = () => {
      fetchAddresses();
    };

    provider.on("addressesChanged", handleAddressesChanged);

    return () => {
      provider.removeListener("addressesChanged", handleAddressesChanged);
    };
  }, [fetchAddresses, provider]);

  useEffect(() => {
    if (!address) {
      setTokenAddress(null);
      return;
    }

    try {
      const tokenAddress = addressToTokenAddress({
        address,
        network: config.network,
      });
      setTokenAddress(tokenAddress);
      setTokenAddressError(null);
    } catch (err) {
      setTokenAddressError(err as Error);
    }
  }, [address, config.network]);

  return {
    address,
    tokenAddress,
    areAddressesLoading,
    addressError,
    tokenAddressError,
    isConnected,
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
