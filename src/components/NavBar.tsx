
import { Button } from "@/components/ui/button";
import { useDebate } from "@/contexts/DebateContext";
import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";

export const NavBar = () => {
  const { debateState, logout } = useDebate();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-debate-dark/80 backdrop-blur-md border-b border-debate/20 z-50">
      <div className="container mx-auto flex justify-between items-center py-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-debate-light animate-pulse-debate"></div>
          <Link to="/" className="text-xl font-bold text-white">
            Debate Arena Clash
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {debateState.isLoggedIn && (
            <>
              <Link 
                to="/history" 
                className="flex items-center gap-2 text-white hover:text-debate-light transition-colors"
              >
                <Trophy className="h-5 w-5" />
                History
              </Link>
              <span className="text-white">
                Welcome, <span className="font-semibold">{debateState.username}</span>
              </span>
              <Button 
                variant="outline" 
                onClick={logout}
                className="border-debate-light text-white hover:bg-debate-light/20"
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
