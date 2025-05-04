"use client";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header({ onCreateTask }) {
  const router = useRouter();
  const userName = "John Doe"; // Replace with actual user data

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="bg-slate-900/50 border-b border-purple-500/20 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback>
                  {userName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div>
            <h1 className="text-xl font-semibold text-white">
              Welcome back, {userName}
            </h1>
            <p className="text-gray-400 text-sm">
              Manage your tasks efficiently
            </p>
          </div>
        </div>

        <Button 
          onClick={onCreateTask}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Create Task
        </Button>
      </div>
    </header>
  );
}
