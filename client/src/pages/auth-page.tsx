import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { loginSchema, type LoginData } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, loginMutation } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleLogin = (data: LoginData) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        setLocation("/security");
      },
    });
  };

  if (user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div className="text-white space-y-8 order-2 lg:order-1">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-6xl font-bold">
              Secure Online Banking
            </h1>
            <p className="text-xl lg:text-2xl opacity-90">
              Access your accounts, transfer funds, pay bills, and manage your finances with confidence.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">✓</span>
              </div>
              <span className="text-lg">24/7 secure access to your accounts</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">✓</span>
              </div>
              <span className="text-lg">Advanced fraud protection</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">✓</span>
              </div>
              <span className="text-lg">CDIC insured deposits</span>
            </div>
          </div>
          
          {/* CDIC Footer */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                  <span className="text-blue-700 text-xs font-bold">CDIC</span>
                </div>
                <span className="text-sm font-semibold">Member of Canada Deposit Insurance Corporation</span>
              </div>
              <p className="text-xs opacity-90 leading-relaxed">
                Eligible deposits are protected up to $100,000 per depositor, per insured category, 
                in the event of a member institution failure. East Coast Credit Union is a member 
                of the Canada Deposit Insurance Corporation (CDIC).
              </p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="order-1 lg:order-2">
          <Card className="w-full max-w-md mx-auto shadow-2xl">
            <CardHeader className="text-center border-b bg-white">
              <img 
                src="https://auth.eastcoastcu.ca/resources/themes/theme-eastcoast-md-refresh-mobile/assets/images/logo.png" 
                alt="East Coast Credit Union Logo" 
                className="h-12 mx-auto mb-2"
              />
              <CardTitle className="text-2xl font-semibold text-slate-800">
                Sign In
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-6">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Enter your username"
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="password"
                            placeholder="Enter your password"
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-blue-700 hover:bg-blue-800"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}