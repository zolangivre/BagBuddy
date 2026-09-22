import SellerInformationCard from "@/components/TransactionDetailComponents/SellerInformationCard";
import StatusCard from "@/components/StatusCard";

export default function CancelledContent({ transaction, status }) {
  return (
    <>
      <SellerInformationCard item={transaction} />
      <StatusCard status={status} />
    </>
  );
}
