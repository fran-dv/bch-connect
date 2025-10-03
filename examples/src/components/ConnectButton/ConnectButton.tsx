import type { ButtonHTMLAttributes } from "react";
import { BackgroundGradient } from "./components/BackgroundGradient";
import { Address } from "@/components/Address";
import { useWallet } from "bch-connect";
import { ExitIcon } from "@radix-ui/react-icons";

export const ConnectButton: React.FC<
  ButtonHTMLAttributes<HTMLButtonElement>
> = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { connect, isConnected, address, disconnect } = useWallet();
  const handleWalletConnect = () => {
    if (isConnected) return;
    connect();
  };
  const handleWalletDisconnect = () => {
    disconnect();
  };

  return (
    <div className="flex items-center gap-2">
      <BackgroundGradient className="rounded-full" animate>
        <button
          {...props}
          className="bg-transparent rounded-full px-5 py-2 hover:translate-y-[-1px] transition-transform text-white-bch font-bold text-sm sm:text-base"
          aria-label="Connect wallet"
          title="Connect Bitcoin Cash wallet"
          onClick={handleWalletConnect}
        >
          {isConnected && address ? (
            <Address address={address} />
          ) : (
            "Connect Wallet"
          )}
        </button>
      </BackgroundGradient>
      {isConnected && (
        <button title="Disconnect wallet" onClick={handleWalletDisconnect}>
          <ExitIcon className="text-white-bch w-4 sm:w-6 h-auto aspect-square" />
        </button>
      )}
    </div>
  );
};

export default ConnectButton;
