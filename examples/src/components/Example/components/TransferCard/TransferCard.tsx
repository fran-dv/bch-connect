import {
  TransferForm,
  type TransferFormValues,
} from "./components/TransferForm";

interface Props {
  isConnected: boolean;
  onFormSubmit: (values: TransferFormValues) => Promise<void>;
  balance: number;
  isLoading: boolean;
}

export const TransferCard: React.FC<Props> = ({
  isConnected,
  onFormSubmit,
  balance,
  isLoading,
}: Props) => {
  return (
    <div className="flex w-full items-center p-6 md:p-10 bg-black-bch/75 z-10 rounded-3xl shadow-xl backdrop-blur-xs text-white-bch ">
      {isConnected ? (
        <div className="flex flex-col gap-3 w-full">
          <h2 className="text-xl md:text-2xl font-bold">
            Transfer some sats (testnet)
          </h2>
          <TransferForm
            onSubmit={onFormSubmit}
            isLoading={isLoading}
            balance={balance}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-2 align-baseline">
          <h3 className="font-bold text-base sm:text-lg md:text-xl">
            Connect your Bitcoin Cash wallet on the testnet to transfer some
            sats.
          </h3>
          <br />
          <p className="text-base md:text-lg">
            To get started, please use a supported wallet:
          </p>
          <ul className="flex flex-col gap-2 align-baseline list-disc pl-6">
            <li>
              <a
                className="text-green-bch text-base md:text-lg font-bold hover:underline"
                href="https://cashonize.com/"
              >
                Cashonize
              </a>
            </li>
          </ul>
          <br />
          <p className="text-sm sm:text-base italic">
            * The library also supports{" "}
            <a
              href="https://zapit.io/"
              className="text-green-bch text-base md:text-lg font-bold hover:underline"
            >
              zapit
            </a>
            , but it only works on the mainnet <br />
            (this example is on the testnet).
          </p>
        </div>
      )}
    </div>
  );
};
