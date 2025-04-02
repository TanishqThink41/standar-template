import { useAuth } from "@/hooks/use-auth";
import { UserCircle, LogOut } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-gradient-to-r from-[#1D72D1] to-[#6D3BF5] py-3 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white font-bold text-xl">
          Home
        </Link>
        <div className="flex items-center gap-4">
          <UserButton />
        </div>
      </div>
    </header>
  );
}

function LogoutButton() {
  const { logoutMutation } = useAuth();
  const [, navigate] = useLocation();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate('/auth');
  };
  
  return (
    <Button 
      variant="ghost" 
      onClick={handleLogout}
      className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
      size="sm"
    >
      <LogOut className="h-4 w-4" />
    </Button>
  );
}

function UserButton() {
  const { user, logoutMutation } = useAuth();
  const [, navigate] = useLocation();
  
  const handleUserClick = () => {
    if (user) {
      logoutMutation.mutate();
    }
    navigate('/auth');
  };
  
  return (
    <button 
      className="rounded-full bg-white p-1"
      onClick={handleUserClick}
    >
      <UserCircle className="h-6 w-6 text-blue-600" />
    </button>
  );
}
