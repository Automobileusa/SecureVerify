import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();
  
  const { data: securityStatus, isLoading: securityLoading } = useQuery<{ securityVerified: boolean }>({
    queryKey: ["/api/security-status"],
    enabled: !!user,
  });

  if (isLoading || securityLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // If user is authenticated but hasn't completed security verification
  if (user && securityStatus && !securityStatus.securityVerified) {
    return (
      <Route path={path}>
        <Redirect to="/security" />
      </Route>
    );
  }

  return <Component />
}
