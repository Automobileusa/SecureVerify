import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { AccountCard } from "@/components/banking/account-card";
import { TransactionItem } from "@/components/banking/transaction-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Account, Transaction } from "@shared/schema";
import { Link } from "wouter";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: accounts = [], isLoading: accountsLoading } = useQuery<Account[]>({
    queryKey: ["/api/accounts"],
  });

  // Get recent transactions from first account
  const { data: recentTransactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/accounts", accounts[0]?.id, "transactions"],
    enabled: accounts.length > 0,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 lg:ml-0 min-h-screen">
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Account Overview</h2>
              <p className="text-slate-600">Welcome back! Here's your account summary.</p>
            </div>

            {/* Account Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {accountsLoading ? (
                // Loading skeletons
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                accounts.map((account) => (
                  <AccountCard key={account.id} account={account} />
                ))
              )}
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-800">
                    Recent Transactions
                  </CardTitle>
                  <Button variant="ghost" asChild>
                    <Link href="/transactions" className="text-sm text-blue-700 hover:underline">
                      View All
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {recentTransactions.length === 0 ? (
                  <div className="p-6 text-center text-slate-600">
                    No recent transactions found.
                  </div>
                ) : (
                  <div className="divide-y">
                    {recentTransactions.slice(0, 5).map((transaction) => (
                      <TransactionItem key={transaction.id} transaction={transaction} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
