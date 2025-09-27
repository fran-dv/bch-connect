import type { UniversalConnector } from "@reown/appkit-universal-connector";
import { createContext, useContext } from "react";

export type ConnectWalletCallback = () => Promise<void>;
export type DisconnectWalletCallback = () => Promise<void>;

export interface WalletConnectContext {
  session: UniversalConnector["provider"]["session"] | null;
  provider: UniversalConnector["provider"] | null;

  connect: ConnectWalletCallback;
  disconnect: DisconnectWalletCallback;
}

export const WalletConnectContext = createContext<WalletConnectContext | null>(
  null,
);

export const useWalletConnectContext = (): WalletConnectContext => {
  const context = useContext(WalletConnectContext);

  if (!context) {
    throw new Error(
      "useWalletConnectContext must be used within a WalletContextProvider",
    );
  }
  return context;
};
