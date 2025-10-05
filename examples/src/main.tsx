import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BCHConnectProvider, createConfig } from "bch-connect";

const config = createConfig({
  projectId: "443a55415de265485a8eeaa18494d7ad",
  network: "testnet",
  metadata: {
    name: "BCH Connect usage example",
    description:
      "BCH Connect is a react library to seamlessly integrate BCH wallet connections in your dapps",
    url: "https://github.com/fran-dv/bch-connect",
    icons: ["https://placehold.co/600x400?text=BCHConnect"],
  },
  modalConfig: {
    allWallets: "HIDE",
    themeMode: "dark",
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BCHConnectProvider config={config}>
      <App />
    </BCHConnectProvider>
  </StrictMode>,
);
