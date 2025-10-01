import {
  cashAddressToLockingBytecode,
  lockingBytecodeToCashAddress,
} from "@bitauth/libauth";

export interface AddressToTokenAddressParams {
  address: string;
  network: "mainnet" | "testnet" | "regtest";
}

export const addressToTokenAddress = ({
  address,
  network,
}: AddressToTokenAddressParams) => {
  const toBytecodeResult = cashAddressToLockingBytecode(address);

  if (typeof toBytecodeResult === "string") {
    throw new Error(toBytecodeResult);
  }

  const toAddressresult = lockingBytecodeToCashAddress({
    prefix:
      network === "mainnet"
        ? "bitcoincash"
        : network === "testnet"
          ? "bchtest"
          : "bchreg",
    bytecode: toBytecodeResult.bytecode,
    tokenSupport: true,
  });

  if (typeof toAddressresult === "string") {
    throw new Error(toAddressresult);
  }

  return toAddressresult.address;
};

export default addressToTokenAddress;
