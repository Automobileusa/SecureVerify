import { Card, CardContent } from "@/components/ui/card";
import { Account } from "@shared/schema";

interface AccountCardProps {
  account: Account;
}

export function AccountCard({ account }: AccountCardProps) {
  const getStatusColor = (balance: string) => {
    const numBalance = parseFloat(balance);
    if (numBalance > 0) return "bg-green-500";
    if (numBalance < 0) return "bg-red-500";
    return "bg-yellow-500";
  };

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(Math.abs(num));
  };

  const getBalanceColor = (balance: string) => {
    const num = parseFloat(balance);
    return num < 0 ? "text-red-600" : "text-slate-800";
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">{account.accountName}</h3>
          <div className={`w-2 h-2 rounded-full ${getStatusColor(account.balance)}`} />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-slate-600">
            **** {account.accountNumber.slice(-4)}
          </p>
          <p className={`text-2xl font-bold ${getBalanceColor(account.balance)}`}>
            {parseFloat(account.balance) < 0 && "-"}
            {formatBalance(account.balance)}
          </p>
          <p className="text-xs text-slate-600">
            {account.accountType === 'credit' ? 'Current Balance' : 'Available Balance'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
