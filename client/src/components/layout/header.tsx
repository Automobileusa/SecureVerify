import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Menu, LogOut } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <img
            src="https://auth.eastcoastcu.ca/resources/themes/theme-eastcoast-md-refresh-mobile/assets/images/logo.png"
            alt="East Coast Credit Union Logo"
            className="h-8"
          />
          <h1 className="text-xl font-semibold text-slate-800 hidden sm:block">
            Online Banking
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-slate-600 hidden sm:block">
            Welcome, {user?.firstName} {user?.lastName}
          </span>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-blue-700 hover:text-blue-800"
            disabled={logoutMutation.isPending}
          >
            <LogOut className="h-4 w-4 mr-1" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}
