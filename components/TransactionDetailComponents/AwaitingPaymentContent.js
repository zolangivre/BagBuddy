import TransactionProgressCard from "@/components/TransactionProgressCard";
import SellerInformationCard from "./SellerInformationCard";
import StatusCard from "@/components/StatusCard";
import CancelTransaction from "@/components/TransactionDetailComponents/CancelTransaction";

export default function AwaitingPaymentContent({ transaction, role, status }) {
  return (
    <>
      <TransactionProgressCard step={1} role={role} />
      <SellerInformationCard item={transaction} />
      <StatusCard status={status} transaction={transaction} />
      <CancelTransaction transaction={transaction}/>
    </>
  );
}
