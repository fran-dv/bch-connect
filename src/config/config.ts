import type { CustomCaipNetwork } from "@reown/appkit-common";
import { UniversalConnector } from "@reown/appkit-universal-connector";

export const projectId = import.meta.env.VITE_REOWN_PROJECT_ID;

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const ChainIds = {
  mainnet: "bch:bitcoincash",
  testnet: "bch:bchtest",
  regtest: "bch:bchreg",
} as const;

export const BCHMethods = {
  getAddresses: "bch_getAddresses",
  signTransaction: "bch_signTransaction",
  signMessage: "bch_signMessage",
} as const;

const bchTestnet: CustomCaipNetwork<"bch"> = {
  id: "bch",
  chainNamespace: "bch" as const,
  caipNetworkId: ChainIds.testnet,
  name: "Bitcoin Cash",
  nativeCurrency: { name: "Bitcoin Cash", symbol: "BCH", decimals: 8 },
  rpcUrls: { default: { http: [] } },
  testnet: true,
};

export const networks = [bchTestnet] as CustomCaipNetwork[];

export interface Configuration {
  chainId: string;
  networks: CustomCaipNetwork[];
}

export const CurrentConfig: Configuration = {
  chainId: ChainIds.testnet,
  networks: networks,
} as const;

export async function getUniversalConnector() {
  const universalConnector = await UniversalConnector.init({
    projectId,
    metadata: {
      name: "My project",
      description: "My project",
      url: "https://example.com",
      icons: ["https://example.com/icon.png"],
    },
    networks: [
      {
        methods: Object.values(BCHMethods),
        chains: networks,
        events: ["addressesChanged"],
        namespace: "bch",
      },
    ],
  }).catch((err) => {
    console.error("Failed to initialize UniversalConnector:", err);
    throw err;
  });

  return universalConnector;
}
