import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { billPaymentSchema, type Account, type Payee } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { z } from "zod";

type BillPaymentFormData = z.infer<typeof billPaymentSchema>;

export default function BillsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddPayee, setShowAddPayee] = useState(false);
  const { toast } = useToast();

  const { data: accounts = [] } = useQuery<Account[]>({
    queryKey: ["/api/accounts"],
  });

  const { data: payees = [] } = useQuery<Payee[]>({
    queryKey: ["/api/payees"],
  });

  const billPaymentForm = useForm<BillPaymentFormData>({
    resolver: zodResolver(billPaymentSchema),
    defaultValues: {
      paymentDate: new Date(),
    },
  });

  const billPaymentMutation = useMutation({
    mutationFn: async (data: BillPaymentFormData) => {
      const res = await apiRequest("POST", "/api/bill-payments", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Bill payment scheduled",
        description: "Your payment has been successfully scheduled.",
      });
      billPaymentForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Payment failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addPayeeMutation = useMutation({
    mutationFn: async (data: { payeeName: string; accountNumber?: string }) => {
      const res = await apiRequest("POST", "/api/payees", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payees"] });
      toast({
        title: "Payee added",
        description: "New payee has been added successfully.",
      });
      setShowAddPayee(false);
    },
  });

  const handleBillPayment = (data: BillPaymentFormData) => {
    billPaymentMutation.mutate(data);
  };

  const handleAddPayee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payeeName = formData.get("payeeName") as string;
    const accountNumber = formData.get("accountNumber") as string;
    
    if (payeeName) {
      addPayeeMutation.mutate({ payeeName, accountNumber });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 lg:ml-0 min-h-screen">
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Pay Bills</h2>
              <p className="text-slate-600">Manage your bill payments and payees.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Quick Payment */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...billPaymentForm}>
                    <form onSubmit={billPaymentForm.handleSubmit(handleBillPayment)} className="space-y-4">
                      <FormField
                        control={billPaymentForm.control}
                        name="payeeId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pay To</FormLabel>
                            <FormControl>
                              <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Payee" />
                                </SelectTrigger>
                                <SelectContent>
                                  {payees.map((payee) => (
                                    <SelectItem key={payee.id} value={payee.id.toString()}>
                                      {payee.payeeName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={billPaymentForm.control}
                        name="fromAccountId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>From Account</FormLabel>
                            <FormControl>
                              <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Account" />
                                </SelectTrigger>
                                <SelectContent>
                                  {accounts.filter(a => a.accountType !== 'credit').map((account) => (
                                    <SelectItem key={account.id} value={account.id.toString()}>
                                      {account.accountName} (**** {account.accountNumber.slice(-4)})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={billPaymentForm.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={billPaymentForm.control}
                        name="paymentDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Date</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                                onChange={(e) => field.onChange(new Date(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full bg-blue-700 hover:bg-blue-800"
                        disabled={billPaymentMutation.isPending}
                      >
                        {billPaymentMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Pay Bill"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Manage Payees */}
              <Card>
                <CardHeader>
                  <CardTitle>Manage Payees</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    {payees.length === 0 ? (
                      <p className="text-slate-600 text-center py-4">No payees found.</p>
                    ) : (
                      payees.map((payee) => (
                        <div key={payee.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <span className="font-medium text-slate-800">{payee.payeeName}</span>
                            {payee.accountNumber && (
                              <p className="text-sm text-slate-600">**** {payee.accountNumber.slice(-4)}</p>
                            )}
                          </div>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>

                  {!showAddPayee ? (
                    <Button 
                      onClick={() => setShowAddPayee(true)}
                      className="w-full bg-gray-100 text-slate-800 hover:bg-gray-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Payee
                    </Button>
                  ) : (
                    <form onSubmit={handleAddPayee} className="space-y-3">
                      <Input
                        name="payeeName"
                        placeholder="Payee name"
                        required
                      />
                      <Input
                        name="accountNumber"
                        placeholder="Account number (optional)"
                      />
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          onClick={() => setShowAddPayee(false)}
                          variant="outline"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          className="flex-1 bg-blue-700 hover:bg-blue-800"
                          disabled={addPayeeMutation.isPending}
                        >
                          {addPayeeMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Add Payee"
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
