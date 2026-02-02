import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// This would typically come from a database or API
const getTransactionDetails = (id: string) => {
  // Mock data for demonstration
  return {
    type: "deposit", // Can be "deposit" or "withdrawal"
    date: "2025-02-16 12:20 AM",
    trxNumber: "OQLWHSIRFAIIJI92911",
    username: "@jacobchris",
    method: "Bank Transfer",
    amount: "₦223,871,000",
    charge: "₦21,000.00",
    status: "Completed",
    userInfo: {
      bankAccount: "0133475793",
      bank: "Guaranteed Trust Bank",
      bankAccountName: "Jacob Chris Elvis",
    },
  };
};

export default async function WalletTransactionDetailsPage({
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
    return <div>Transaction not found</div>;
  }

  const isDeposit = transaction.type === "deposit";
  const transactionTypeTitle = isDeposit ? "Deposit" : "Withdrawal";
  const pageTitle = `${transactionTypeTitle} Transaction Details`;
  const cardTitle = `${transactionTypeTitle} Via ${transaction.method}`;
  const userInfoTitle = isDeposit
    ? "User Deposit Information"
    : "User Withdrawal Information";

  // Status color based on status and type
  const getStatusColor = () => {
    if (transaction.status.toLowerCase() === "completed") {
      return "bg-green-100 text-green-700 hover:bg-green-100";
    } else if (transaction.status.toLowerCase() === "pending") {
      return "bg-orange-100 text-orange-600 hover:bg-orange-100";
    } else if (transaction.status.toLowerCase() === "failed") {
      return "bg-red-100 text-red-600 hover:bg-red-100";
    }
    return "bg-gray-100 text-gray-600 hover:bg-gray-100";
  };

  return (
    <div className="containers p-6 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">{pageTitle}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transaction Details Card */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-800">
              {cardTitle}
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
              <div className="text-sm text-gray-500">Username</div>
              <div className="text-sm font-medium text-right text-blue-600">
                {transaction.username}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Method</div>
              <div className="text-sm font-medium text-right">
                {transaction.method}
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
                <Badge className={getStatusColor()}>
                  • {transaction.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Information Card */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-800">
              {userInfoTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Bank Account</div>
              <div className="text-sm font-medium">
                {transaction.userInfo.bankAccount}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-gray-500">Bank</div>
              <div className="text-sm font-medium text-gray-600">
                {transaction.userInfo.bank}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-gray-500">Bank Account Name</div>
              <div className="text-sm font-medium text-gray-600">
                {transaction.userInfo.bankAccountName}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
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
  ];
};
