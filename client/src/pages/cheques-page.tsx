import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { chequeOrderSchema, type Account } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { z } from "zod";

type ChequeOrderFormData = z.infer<typeof chequeOrderSchema>;

export default function ChequesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();

  const { data: accounts = [] } = useQuery<Account[]>({
    queryKey: ["/api/accounts"],
  });

  const form = useForm<ChequeOrderFormData>({
    resolver: zodResolver(chequeOrderSchema),
    defaultValues: {
      chequeStyle: "personal",
      quantity: 50,
    },
  });

  const chequeOrderMutation = useMutation({
    mutationFn: async (data: ChequeOrderFormData) => {
      const res = await apiRequest("POST", "/api/cheque-orders", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Cheque order placed",
        description: "Your cheque order has been successfully placed. You will receive a confirmation email shortly.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Order failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: ChequeOrderFormData) => {
    chequeOrderMutation.mutate(data);
  };

  const chequingAccounts = accounts.filter(account => account.accountType === 'chequing');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 lg:ml-0 min-h-screen">
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Order Cheques</h2>
              <p className="text-slate-600">Order new cheques for your accounts.</p>
            </div>

            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle>Cheque Order Form</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="accountId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account</FormLabel>
                          <FormControl>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Account" />
                              </SelectTrigger>
                              <SelectContent>
                                {chequingAccounts.map((account) => (
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
                      control={form.control}
                      name="chequeStyle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cheque Style</FormLabel>
                          <FormControl>
                            <RadioGroup
                              value={field.value}
                              onValueChange={field.onChange}
                              className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                              <div className="border rounded-lg p-4 cursor-pointer hover:border-blue-700">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="personal" id="personal" />
                                  <div>
                                    <div className="font-medium">Personal Cheques</div>
                                    <div className="text-sm text-slate-600">Standard personal cheques - $29.95</div>
                                  </div>
                                </div>
                              </div>
                              <div className="border rounded-lg p-4 cursor-pointer hover:border-blue-700">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="business" id="business" />
                                  <div>
                                    <div className="font-medium">Business Cheques</div>
                                    <div className="text-sm text-slate-600">Professional business cheques - $34.95</div>
                                  </div>
                                </div>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="50">50 Cheques</SelectItem>
                                <SelectItem value="100">100 Cheques</SelectItem>
                                <SelectItem value="200">200 Cheques</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="deliveryAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Address</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={3}
                              placeholder="Enter your mailing address"
                              className="resize-none"
                              onChange={(e) => field.onChange(e.target.value.replace(/[<>]/g, ''))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-slate-600">
                        <p className="mb-2"><strong>Processing Time:</strong> 5-7 business days</p>
                        <p className="mb-2"><strong>Delivery:</strong> Canada Post standard delivery</p>
                        <p><strong>Cost:</strong> Personal cheques $29.95 | Business cheques $34.95</p>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="bg-blue-700 hover:bg-blue-800"
                      disabled={chequeOrderMutation.isPending}
                    >
                      {chequeOrderMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Order Cheques
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}