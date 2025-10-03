import { CustomForm } from "@/components/forms/CustomForm";
import { z } from "zod";
import { ControlledInput } from "@/components/forms/ControlledInput";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback } from "react";
import { decodeCashAddress } from "@bitauth/libauth";

const getTransferFormSchema = (balance: number) =>
  z.object({
    recipient: z
      .string({ error: "Recipient is required" })
      .refine(
        (addr) => typeof decodeCashAddress(addr) !== "string",
        "Invalid address. It must be in cashAddress format",
      ),
    satoshis: z
      .number({ error: "Amount is required" })
      .nonnegative("Amount must be positive")
      .min(550, "Minimum amount is 550 satoshis")
      .refine((amount) => amount <= balance, "Not enough funds"),
  });

export type TransferFormValues = z.infer<
  ReturnType<typeof getTransferFormSchema>
>;

interface Props {
  onSubmit: (values: TransferFormValues) => Promise<void>;
  isLoading: boolean;
  balance: number;
}

export const TransferForm: React.FC<Props> = ({
  onSubmit,
  isLoading,
  balance,
}) => {
  const methods = useForm<TransferFormValues>({
    defaultValues: {
      recipient: "",
      satoshis: 0,
    },
    resolver: zodResolver(getTransferFormSchema(balance)),
  });

  const reset = useCallback(() => {
    methods.reset();
  }, [methods]);

  const handleSubmit = async (values: TransferFormValues) => {
    await onSubmit(values);
    reset();
  };

  return (
    <CustomForm onSubmit={handleSubmit} methods={methods}>
      <div>
        <ControlledInput
          name="recipient"
          label="Recipient address"
          type="text"
          placeholder="e.g. bchtest:qz354mlhwdcf0j8ll67nejz8ce3qh2e6vv4qwlrjgr"
        />
      </div>
      <div>
        <ControlledInput
          name="satoshis"
          label="Amount in satoshis"
          type="number"
          placeholder="e.g. 10000"
        />
      </div>

      <SubmitButton disabled={isLoading}>
        {isLoading ? "Awaiting signature..." : "Transfer"}
      </SubmitButton>
    </CustomForm>
  );
};

export default TransferForm;
