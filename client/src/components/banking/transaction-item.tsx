import { Transaction } from "@shared/schema";
import { format } from "date-fns";
import { ShoppingCart, Plus, Home, CreditCard, ArrowUpDown } from "lucide-react";

interface TransactionItemProps {
  transaction: Transaction;
  showBalance?: boolean;
}

export function TransactionItem({ transaction, showBalance = false }: TransactionItemProps) {
  const amount = parseFloat(transaction.amount);
  const isDebit = transaction.transactionType === 'debit';
  
  const getIcon = () => {
    const description = transaction.description.toLowerCase();
    if (description.includes('grocery') || description.includes('store')) {
      return <ShoppingCart className="text-slate-600" />;
    }
    if (description.includes('deposit') || description.includes('transfer in')) {
      return <Plus className="text-green-600" />;
    }
    if (description.includes('mortgage') || description.includes('rent')) {
      return <Home className="text-slate-600" />;
    }
    if (description.includes('card') || description.includes('payment')) {
      return <CreditCard className="text-slate-600" />;
    }
    return <ArrowUpDown className="text-slate-600" />;
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  if (showBalance) {
    // Table row format
    return (
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
          {formatDate(transaction.createdAt)}
        </td>
        <td className="px-6 py-4 text-sm text-slate-800">
          {transaction.description}
        </td>
        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
          isDebit ? 'text-red-600' : 'text-green-600'
        }`}>
          {isDebit ? '-' : '+'}{formatAmount(amount)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
          {/* Balance would come from a running total - simplified for now */}
          -
        </td>
      </tr>
    );
  }

  // List item format
  return (
    <div className="p-6 flex items-center justify-between hover:bg-gray-50">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
          {getIcon()}
        </div>
        <div>
          <p className="font-medium text-slate-800">{transaction.description}</p>
          <p className="text-sm text-slate-600">{formatDate(transaction.createdAt)}</p>
        </div>
      </div>
      <span className={`font-semibold ${
        isDebit ? 'text-red-600' : 'text-green-600'
      }`}>
        {isDebit ? '-' : '+'}{formatAmount(amount)}
      </span>
    </div>
  );
}
