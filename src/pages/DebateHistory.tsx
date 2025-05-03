
import { useDebate } from "@/contexts/DebateContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Trophy, Wallet } from "lucide-react";
import { PurchasableBadge } from "@/components/PurchasableBadge";

export default function DebateHistory() {
  const { debateState } = useDebate();

  const calculateStats = () => {
    const wins = debateState.completedDebates?.filter(
      (debate) => debate.result.winner === debateState.assignedSide
    ).length || 0;
    
    const losses = debateState.completedDebates?.filter(
      (debate) => debate.result.winner !== debateState.assignedSide && debate.result.winner !== 'tie'
    ).length || 0;

    return { wins, losses };
  };

  const { wins, losses } = calculateStats();
  
  const badges = [
    { id: 1, name: "Novice Debater", cost: 100, icon: "trophy" },
    { id: 2, name: "Master Orator", cost: 500, icon: "star" },
    { id: 3, name: "Elite Wordsmith", cost: 1000, icon: "award" }
  ];

  return (
    <div className="container mx-auto py-20 px-4">
      <h1 className="text-4xl font-bold text-white mb-8">Debate History</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-debate-dark border-debate-light">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="text-debate-light" />
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="text-white space-y-4">
            <div className="flex justify-between items-center">
              <span>Wins</span>
              <span className="text-green-500">{wins}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Losses</span>
              <span className="text-red-500">{losses}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <Wallet className="text-debate-light" />
                Points
              </span>
              <span className="text-debate-light">{debateState.points}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-debate-dark border-debate-light">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Star className="text-debate-light" />
              Your Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {debateState.badges?.map((badge) => (
                <Badge 
                  key={badge.id}
                  variant="secondary"
                  className="bg-debate-light text-white"
                >
                  {badge.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-debate-dark border-debate-light">
          <CardHeader>
            <CardTitle className="text-white">Badge Shop</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {badges.map((badge) => (
                <PurchasableBadge
                  key={badge.id}
                  badge={badge}
                  canAfford={debateState.points >= badge.cost}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
