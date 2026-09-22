import SellerInformationCard from "@/components/TransactionDetailComponents/SellerInformationCard";
import StatusCard from "@/components/StatusCard";
import TransactionProgressCard from "@/components/TransactionProgressCard";

export default function WaitingForResponseContent({
  transaction,
  role,
  status,
}) {
  return (
    <>
      <TransactionProgressCard step={1} role={role} />
      <SellerInformationCard item={transaction} />
      <StatusCard status={status} transaction={transaction} />
    </>
  );
}
