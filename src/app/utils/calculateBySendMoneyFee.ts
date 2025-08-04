export const calculateBySendMoneyFee = (
  amount: number,
  feePerThousand: number = 5
) => {
  if (amount < 1000) {
    return {
      totalAmount: amount,
      fee: 0,
    };
  }
  const fee = feePerThousand;
  const totalAmount = parseFloat((amount + fee).toFixed(2));
  return { totalAmount, fee };
};
