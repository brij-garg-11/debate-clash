
import { useDebate } from "@/contexts/DebateContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Star, Trophy } from "lucide-react";

interface BadgeType {
  id: number;
  name: string;
  cost: number;
  icon: string;
}

interface PurchasableBadgeProps {
  badge: BadgeType;
  canAfford: boolean;
}

export const PurchasableBadge = ({ badge, canAfford }: PurchasableBadgeProps) => {
  const { purchaseBadge } = useDebate();

  const IconComponent = () => {
    switch (badge.icon) {
      case 'trophy':
        return <Trophy className="h-8 w-8 text-debate-light" />;
      case 'star':
        return <Star className="h-8 w-8 text-debate-light" />;
      case 'award':
        return <Award className="h-8 w-8 text-debate-light" />;
      default:
        return <Trophy className="h-8 w-8 text-debate-light" />;
    }
  };

  return (
    <Card className="bg-debate-dark border-debate-light">
      <CardContent className="pt-6 text-center">
        <div className="mb-4 flex justify-center">
          <IconComponent />
        </div>
        <h3 className="text-white font-semibold mb-2">{badge.name}</h3>
        <p className="text-debate-light mb-4">{badge.cost} points</p>
        <Button
          onClick={() => purchaseBadge(badge)}
          disabled={!canAfford}
          variant="outline"
          className="w-full border-debate-light text-white hover:bg-debate-light/20"
        >
          {canAfford ? 'Purchase Badge' : 'Not Enough Points'}
        </Button>
      </CardContent>
    </Card>
  );
};
