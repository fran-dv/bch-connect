import type { CustomCaipNetwork } from "@reown/appkit-common";
import { UniversalConnector } from "@reown/appkit-universal-connector";

export const NetworksIds: Record<
  "mainnet" | "testnet" | "regtest",
  "bch:bitcoincash" | "bch:bchtest" | "bch:bchreg"
> = {
  mainnet: "bch:bitcoincash",
  testnet: "bch:bchtest",
  regtest: "bch:bchreg",
} as const;

export const BCHMethods = {
  getAddresses: "bch_getAddresses",
  signTransaction: "bch_signTransaction",
  signMessage: "bch_signMessage",
} as const;

const bchMainnet: CustomCaipNetwork<"bch"> = {
  id: "bch",
  chainNamespace: "bch" as const,
  caipNetworkId: NetworksIds.mainnet,
  name: "Bitcoin Cash",
  nativeCurrency: { name: "Bitcoin Cash", symbol: "BCH", decimals: 8 },
  rpcUrls: { default: { http: [] } },
  testnet: false,
} as const;

const bchTestnet: CustomCaipNetwork<"bch"> = {
  id: "bch",
  chainNamespace: "bch" as const,
  caipNetworkId: NetworksIds.testnet,
  name: "Bitcoin Cash (Testnet)",
  nativeCurrency: { name: "Bitcoin Cash", symbol: "BCH", decimals: 8 },
  rpcUrls: { default: { http: [] } },
  testnet: true,
} as const;

const bchRegtest: CustomCaipNetwork<"bch"> = {
  id: "bch",
  chainNamespace: "bch" as const,
  caipNetworkId: NetworksIds.regtest,
  name: "Bitcoin Cash (Regtest)",
  nativeCurrency: { name: "Bitcoin Cash", symbol: "BCH", decimals: 8 },
  rpcUrls: { default: { http: [] } },
  testnet: true,
} as const;

export const Networks: Record<
  "mainnet" | "testnet" | "regtest",
  CustomCaipNetwork
> = {
  mainnet: bchMainnet as CustomCaipNetwork,
  testnet: bchTestnet as CustomCaipNetwork,
  regtest: bchRegtest as CustomCaipNetwork,
} as const;

export interface Configuration {
  projectId: string;
  network: "mainnet" | "testnet" | "regtest";
  metadata: {
    name: string;
    description: string;
    url: string;
    icons: string[];
  };
}

export const createConfig = (options: Configuration): Configuration => options;

export async function getUniversalConnector({
  projectId,
  network,
  metadata,
}: Configuration): Promise<UniversalConnector> {
  const universalConnector = await UniversalConnector.init({
    projectId,
    networks: [
      {
        methods: Object.values(BCHMethods),
        chains: [Networks[network]],
        events: ["addressesChanged"],
        namespace: "bch",
      },
    ],
    metadata,
  }).catch((err) => {
    throw err;
  });

  return universalConnector;
}
