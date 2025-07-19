import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { securityQuestionSchema, type SecurityQuestionData } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export default function SecurityQuestionPage() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      setLocation("/auth");
    }
  }, [user, setLocation]);

  const form = useForm<SecurityQuestionData>({
    resolver: zodResolver(securityQuestionSchema),
    defaultValues: {
      answer: "",
    },
  });

  const handleSubmit = async (data: SecurityQuestionData) => {
    setIsLoading(true);
    setError("");
    
    try {
      await apiRequest("POST", "/api/verify-security", data);
      toast({
        title: "Security verification successful",
        description: "Welcome to your online banking dashboard.",
      });
      setLocation("/");
    } catch (err: any) {
      setError("Incorrect answer. Please try again.");
      form.reset({ answer: "" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setLocation("/auth");
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center border-b bg-white">
          <img 
            src="https://auth.eastcoastcu.ca/resources/themes/theme-eastcoast-md-refresh-mobile/assets/images/logo.png" 
            alt="East Coast Credit Union Logo" 
            className="h-12 mx-auto mb-2"
          />
          <CardTitle className="text-xl font-semibold text-slate-800">
            Security Verification
          </CardTitle>
          <p className="text-sm text-slate-600 mt-2">
            Please answer your security question to continue
          </p>
        </CardHeader>
        
        <CardContent className="p-8">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div>
                <FormLabel className="text-sm font-medium text-slate-800 mb-3 block">
                  Security Question:
                </FormLabel>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-slate-800 font-medium">
                    In what year was your account opened?
                  </p>
                </div>
                
                <FormField
                  control={form.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your answer"
                          className="h-12"
                          autoFocus
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p className="text-xs text-slate-600 mt-2">
                  Please enter the year in YYYY format
                </p>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  type="button"
                  onClick={handleBackToLogin}
                  variant="outline"
                  className="flex-1"
                  disabled={isLoading}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                
                <Button
                  type="submit"
                  className="flex-1 bg-blue-700 hover:bg-blue-800"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Verify"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
