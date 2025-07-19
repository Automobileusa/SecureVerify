import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home, 
  ArrowLeftRight, 
  CreditCard, 
  FileText, 
  CheckSquare, 
  LinkIcon 
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { name: "Pay Bills", href: "/bills", icon: FileText },
  { name: "Order Cheques", href: "/cheques", icon: CheckSquare },
  { name: "Link Account", href: "/accounts", icon: LinkIcon },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <nav
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full pt-16 lg:pt-0">
          <div className="flex-1 overflow-y-auto py-6">
            <ul className="space-y-1 px-3">
              {navigation.map((item) => {
                const isActive = location === item.href;
                return (
                  <li key={item.name}>
                    <Link href={item.href}>
                      <span
                        className={cn(
                          "nav-link flex items-center px-4 py-3 text-sm font-medium rounded-lg cursor-pointer",
                          isActive && "active"
                        )}
                        onClick={() => onClose()}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.name}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
