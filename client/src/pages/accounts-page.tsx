import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export default function AccountsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 lg:ml-0 min-h-screen">
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Link External Account</h2>
              <p className="text-slate-600">Connect external bank accounts for transfers and monitoring.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Link Account Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Add External Account</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <InfoIcon className="h-4 w-4" />
                    <AlertDescription>
                      External account linking requires verification and may take 1-2 business days to complete.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bank-name">Bank Name</Label>
                      <Input id="bank-name" placeholder="Enter bank name" />
                    </div>

                    <div>
                      <Label htmlFor="account-number">Account Number</Label>
                      <Input id="account-number" placeholder="Enter account number" type="password" />
                    </div>

                    <div>
                      <Label htmlFor="routing-number">Institution Number</Label>
                      <Input id="routing-number" placeholder="Enter institution number" />
                    </div>

                    <div>
                      <Label htmlFor="transit-number">Transit Number</Label>
                      <Input id="transit-number" placeholder="Enter transit number" />
                    </div>

                    <div>
                      <Label htmlFor="account-type">Account Type</Label>
                      <select 
                        id="account-type"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      >
                        <option value="">Select account type</option>
                        <option value="chequing">Chequing</option>
                        <option value="savings">Savings</option>
                      </select>
                    </div>

                    <Button className="w-full bg-blue-700 hover:bg-blue-800">
                      Link Account
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Linked Accounts */}
              <Card>
                <CardHeader>
                  <CardTitle>Linked Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-slate-600 mb-4">No external accounts linked yet.</p>
                    <p className="text-sm text-slate-500">
                      External accounts will appear here once verified.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Information Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Important Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">Security & Verification</h4>
                  <ul className="text-sm text-slate-600 space-y-1 ml-4">
                    <li>• All external account links require micro-deposit verification</li>
                    <li>• Verification typically takes 1-2 business days</li>
                    <li>• Account information is encrypted and secure</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">Transfer Limits</h4>
                  <ul className="text-sm text-slate-600 space-y-1 ml-4">
                    <li>• Daily transfer limit: $5,000 CAD</li>
                    <li>• Monthly transfer limit: $25,000 CAD</li>
                    <li>• Transfers typically process within 1 business day</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">Supported Banks</h4>
                  <ul className="text-sm text-slate-600 space-y-1 ml-4">
                    <li>• All major Canadian banks and credit unions</li>
                    <li>• Some international banks (contact us for availability)</li>
                    <li>• Must be accounts in your name</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
