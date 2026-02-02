import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import DialogContainer from "@/app/dashboard/us/disputes/dialog-container";

// This would typically come from a database or API
const getTransactionDetails = (id: string) => {
  // Mock data for demonstration
  return {
    date: "2025-02-16 12:20 AM",
    trxNumber: "OQLWHSIRFAIIJI92911",
    marketplace: {
      name: "Jumia King",
      rating: 4.9,
    },
    category: "Fashion",
    amount: "₦5,000",
    charge: "₦1,500",
    status: "Pending",
    client: {
      name: "Joshua King",
      userId: "ORWFQP1681",
      bankAccountName: "Jacob Chris Elvis",
    },
  };
};

export default async function TransactionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Remove the # if it's included in the ID
  const transactionId = id.startsWith("#") ? id.substring(1) : id;

  // In a real app, you would fetch this data from an API or database
  const transaction = getTransactionDetails(transactionId);

  if (!transaction) {
    notFound();
  }

  return (
    <div className="container p-6 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">Transaction Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Transaction Details Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Transaction Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Date</div>
              <div className="text-sm font-medium text-right">
                {transaction.date}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Trx Number</div>
              <div className="text-sm font-medium text-right">
                {transaction.trxNumber}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Marketplace/Client</div>
              <div className="text-sm font-medium text-right flex items-center justify-end">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-1">
                  <span className="text-white text-[10px]">JK</span>
                </div>
                <span>{transaction.marketplace.name}</span>
                <div className="flex items-center text-xs text-yellow-500 ml-1">
                  <span>({transaction.marketplace.rating})</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Category</div>
              <div className="text-sm font-medium text-right">
                {transaction.category}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Amount</div>
              <div className="text-sm font-medium text-right">
                {transaction.amount}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Charge</div>
              <div className="text-sm font-medium text-right">
                {transaction.charge}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Status</div>
              <div className="text-right">
                <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100">
                  {transaction.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client Information Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Client Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Client&#39;s Name</div>
              <div className="text-sm font-medium">
                {transaction.client.name}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">User ID</div>
              <div className="text-sm font-medium">
                {transaction.client.userId}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Bank Account Name</div>
              <div className="text-sm font-medium">
                {transaction.client.bankAccountName}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DialogContainer transactionId={transactionId} />
    </div>
  );
}

export const generateStaticParams = async () => {
  return [
    { id: "11723456789" },
    { id: "11723456790" },
    { id: "11723456791" },
    { id: "11723456792" },
    { id: "11723456793" },
    { id: "11723456794" },
    { id: "11723456795" },
    { id: "11723456796" },
    { id: "11723456797" },
    { id: "11723456798" },
    { id: "11723456799" },
  ];
};
