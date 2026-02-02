import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { notFound } from "next/navigation";

// Updated interface to match the new transaction structure
interface TransactionDetails {
  dateTime: string;
  escrowNumber: string;
  marketplace: {
    name: string;
    rating: number;
    logo?: string;
  };
  type: string;
  amount: string;
  charge: string;
  status: "Completed" | "Pending" | "Failed";
  buyer: {
    name: string;
    username: string;
    userId: string;
    bankAccountName: string;
    avatar?: string;
  };
  seller: {
    name: string;
    username: string;
    userId: string;
    bankAccountName: string;
    avatar?: string;
  };
}

// This would typically come from a database or API
const getTransactionDetails = (id: string): TransactionDetails | null => {
  // Mock data for demonstration
  return {
    dateTime: "27th March, 2024. 2:39 PM",
    escrowNumber: id,
    marketplace: {
      name: "Jiji",
      rating: 4.8,
      logo: "/logos/jiji.png",
    },
    type: "Service",
    amount: "₦5,000.00",
    charge: "₦150.00",
    status: "Completed",
    buyer: {
      name: "John Mark",
      username: "Johnmark012",
      userId: "BUYER001681",
      bankAccountName: "John Mark Adebayo",
      avatar: "/avatars/john-mark.jpg",
    },
    seller: {
      name: "Sarah Johnson",
      username: "sarahj_seller",
      userId: "SELLER002456",
      bankAccountName: "Sarah Johnson Enterprises",
      avatar: "/avatars/sarah-johnson.jpg",
    },
  };
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700 hover:bg-green-100";
    case "Pending":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
    case "Failed":
      return "bg-red-100 text-red-700 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-100";
  }
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
    <div className="container p-6 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Transaction Details</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Transaction Details Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Transaction Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-gray-500">Date/Time</div>
                <div className="text-sm font-medium text-right">
                  {transaction.dateTime}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-gray-500">Escrow Number</div>
                <div className="text-sm font-medium text-right">
                  <Badge
                    variant="outline"
                    className="border border-blue-300 text-blue-600 bg-blue-50"
                  >
                    #{transaction.escrowNumber}
                  </Badge>
                </div>
              </div>

              {/* <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-gray-500">Marketplace</div>
                <div className="text-sm font-medium text-right flex items-center justify-end">
                  <Avatar className="w-5 h-5 mr-2">
                    <AvatarImage
                      src={transaction.marketplace.logo}
                      alt={transaction.marketplace.name}
                    />
                    <AvatarFallback className="text-[10px]">
                      {transaction.marketplace.name
                        .substring(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{transaction.marketplace.name}</span>
                  <div className="flex items-center text-xs text-yellow-500 ml-1">
                    <span>({transaction.marketplace.rating})</span>
                  </div>
                </div>
              </div> */}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-gray-500">Type</div>
                <div className="text-sm font-medium text-right flex items-center justify-end">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  {transaction.type}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-gray-500">Amount</div>
                <div className="text-sm font-medium text-right font-semibold">
                  {transaction.amount}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-gray-500">Service Charge</div>
                <div className="text-sm font-medium text-right">
                  {transaction.charge}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-gray-500">Status</div>
                <div className="text-right">
                  <Badge className={getStatusStyle(transaction.status)}>
                    • {transaction.status}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buyer Information Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Avatar className="w-8 h-8 mr-3">
                <AvatarImage
                  src={transaction.buyer.avatar}
                  alt={transaction.buyer.name}
                />
                <AvatarFallback>
                  {transaction.buyer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              Buyer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Full Name</div>
              <div className="text-sm font-medium text-right">
                {transaction.buyer.name}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Username</div>
              <div className="text-sm font-medium text-right text-blue-600">
                @{transaction.buyer.username}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">User ID</div>
              <div className="text-sm font-medium text-right">
                {transaction.buyer.userId}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Bank Account Name</div>
              <div className="text-sm font-medium text-right">
                {transaction.buyer.bankAccountName}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seller Information Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Avatar className="w-8 h-8 mr-3">
                <AvatarImage
                  src={transaction.seller.avatar}
                  alt={transaction.seller.name}
                />
                <AvatarFallback>
                  {transaction.seller.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              Seller Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Full Name</div>
              <div className="text-sm font-medium text-right">
                {transaction.seller.name}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Username</div>
              <div className="text-sm font-medium text-right text-blue-600">
                @{transaction.seller.username}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">User ID</div>
              <div className="text-sm font-medium text-right">
                {transaction.seller.userId}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Bank Account Name</div>
              <div className="text-sm font-medium text-right">
                {transaction.seller.bankAccountName}
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
    { id: "019234890" },
    { id: "019234891" },
    { id: "019234892" },
    { id: "019234893" },
    { id: "019234894" },
    { id: "019234895" },
    { id: "019234896" },
    { id: "019234897" },
    { id: "019234898" },
    { id: "019234899" },
    { id: "019234900" },
    { id: "019234901" },
  ];
};
