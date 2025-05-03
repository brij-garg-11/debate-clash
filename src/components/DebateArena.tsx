import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDebate } from "@/contexts/DebateContext";
import { useToast } from "@/hooks/use-toast";
import { getRandomOpponent } from "@/data/topics";

export const DebateArena = () => {
  const { debateState, submitArgument, submitOpponentArgument, nextRound, setResult, resetDebate, setOpponent } = useDebate();
  const [argument, setArgument] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(30); // Changed to 30 seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const { selectedTopic, assignedSide, opponent, currentRound, rounds } = debateState;
  
  const roundTypes = ["Opening Arguments", "Rebuttal", "Closing Arguments"];
  const currentRoundType = roundTypes[currentRound];
  
  const isLastRound = currentRound === 2;

  // Set opponent name when component mounts
  useEffect(() => {
    if (!opponent) {
      const randomOpponent = getRandomOpponent();
      setOpponent(randomOpponent);
    }
  }, [opponent, setOpponent]);

  // Timer effect - only run during active debate rounds, not between rounds
  useEffect(() => {
    if (!isSubmitted && timeRemaining > 0 && !isLoading) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isSubmitted) {
      handleSubmit();
      toast({
        title: "Time's up!",
        description: "Your argument has been automatically submitted.",
        variant: "destructive",
      });
    }
  }, [timeRemaining, isSubmitted, isLoading]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSubmit = async () => {
    if (argument.trim().length < 10) {
      toast({
        title: "Argument too short",
        description: "Please provide a more substantial argument (at least 10 characters).",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitted(true);
    submitArgument(argument);
    
    // Simulate opponent response
    setIsLoading(true);
    
    // Generate random opponent response time (2-4 seconds)
    const responseTime = Math.floor(Math.random() * 2000) + 2000;
    
    setTimeout(() => {
      const opponentArgument = generateOpponentArgument(
        selectedTopic?.title || '', 
        assignedSide === 'for' ? 'against' : 'for', 
        currentRoundType.toLowerCase()
      );
      
      submitOpponentArgument(opponentArgument);
      setIsLoading(false);
      
      if (isLastRound) {
        evaluateDebate();
      }
    }, responseTime);
  };

  const evaluateDebate = () => {
    const forArguments = rounds.map(round => round.forArgument);
    const againstArguments = rounds.map(round => round.againstArgument);
    
    // In a real app, this would be an API call to GPT-4
    const outcomes = ['for', 'against'] as const;
    const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    const randomScore = Math.floor(Math.random() * 50) + 50;
    
    const feedback = generateDetailedFeedback(
      randomOutcome,
      assignedSide || 'for',
      forArguments,
      againstArguments
    );
    
    setTimeout(() => {
      setResult(randomOutcome, feedback, randomScore);
    }, 2000);
  };

  const generateDetailedFeedback = (winner: 'for' | 'against', userSide: 'for' | 'against', forArgs: string[], againstArgs: string[]) => {
    const winningArgs = winner === 'for' ? forArgs : againstArgs;
    const losingArgs = winner === 'for' ? againstArgs : forArgs;
    
    // Analyze specific strong points from the winning side
    const strongPoints = [
      getStrongPoint(winningArgs[0], "opening"),
      getStrongPoint(winningArgs[1], "rebuttal"),
      getStrongPoint(winningArgs[2], "closing")
    ];
    
    if (winner === userSide) {
      return `Congratulations on your victory! Your arguments were particularly compelling, especially:
      
1. In your opening, ${strongPoints[0]}
2. Your rebuttal effectively ${strongPoints[1]}
3. Your closing argument ${strongPoints[2]}

Overall, you maintained a clear logical flow and supported your points with strong evidence.`;
    } else {
      return `Your opponent presented stronger arguments this time. Here's why:

1. Their opening ${strongPoints[0]}
2. In the rebuttal phase, they ${strongPoints[1]}
3. Their closing argument ${strongPoints[2]}

Consider strengthening your counter-arguments and providing more specific examples in your next debate.`;
    }
  };

  const getStrongPoint = (argument: string, phase: string) => {
    // This would ideally be analyzed by GPT-4 in a production environment
    const openingPoints = [
      "effectively established the fundamental principles",
      "presented a compelling framework for analysis",
      "introduced strong statistical evidence"
    ];
    
    const rebuttalPoints = [
      "systematically addressed and dismantled counter-arguments",
      "provided concrete examples to support the position",
      "highlighted logical inconsistencies in the opposition's stance"
    ];
    
    const closingPoints = [
      "synthesized all key points into a cohesive conclusion",
      "reinforced the strongest arguments while addressing potential weaknesses",
      "presented a clear call to action"
    ];
    
    const points = phase === "opening" ? openingPoints :
                  phase === "rebuttal" ? rebuttalPoints :
                  closingPoints;
    
    return points[Math.floor(Math.random() * points.length)];
  };

  const generateOpponentArgument = (topic: string, side: string, round: string) => {
    const opponentArguments = {
      "Universal Basic Income": {
        "for": {
          "opening": "Universal Basic Income represents a transformative solution to systemic poverty and economic inequality. Research from the World Economic Forum shows that automation could displace 85 million jobs by 2025. UBI provides essential financial security, enables entrepreneurship, and reduces the psychological burden of poverty, as demonstrated by successful pilots in Finland and Canada where recipients showed improved mental health and job-seeking behavior.",
          "rebuttal": "Critics overlook crucial evidence: existing welfare systems cost more to administer and often trap people in poverty through benefit cliffs. The Alaska Permanent Fund has proven UBI's sustainability over 40 years. Studies from the Roosevelt Institute demonstrate that UBI could grow the economy by $2.5 trillion by 2025 through increased consumer spending and entrepreneurship. The argument about laziness is contradicted by data from pilot programs.",
          "closing": "The evidence conclusively supports UBI's effectiveness. Pilot programs consistently show improved health outcomes, educational attainment, and entrepreneurship rates. The cost concern is addressed through proposed funding mechanisms like carbon taxes and technology dividends. By providing economic security, UBI doesn't just alleviate poverty—it empowers individuals to contribute meaningfully to society while adapting to rapid technological change. The time for implementation is now."
        },
        "against": {
          "opening": "Universal Basic Income, while well-intentioned, represents a fundamentally flawed approach to addressing poverty. Economic analysis from the Congressional Budget Office estimates a comprehensive UBI would cost upwards of $3.8 trillion annually—nearly equivalent to the entire federal budget. This astronomical cost would either require doubling current tax rates or dangerous levels of deficit spending, potentially triggering severe inflation and economic instability.",
          "rebuttal": "Proponents ignore critical implementation challenges: Finland's UBI experiment was limited in scope and ultimately discontinued due to sustainability concerns. The myth that UBI would simplify welfare is contradicted by evidence showing most proposals would require maintaining existing programs alongside UBI. The Roosevelt Institute's growth projections assume unrealistic monetary policies and ignore potential inflationary effects. Furthermore, real-world data from lottery winners demonstrates that sudden guaranteed income often leads to poor financial decisions.",
          "closing": "The evidence clearly demonstrates that UBI is an unsustainable and potentially harmful policy. Instead, we should focus on targeted assistance programs, job training initiatives, and economic growth policies that create meaningful opportunities. The success of programs like the Earned Income Tax Credit shows that connecting benefits to work while providing targeted support produces better outcomes than universal handouts. We need practical solutions, not utopian experiments that risk economic stability."
        }
      }
    };
    
    // Default response if specific topic/side/round not found
    return opponentArguments["Universal Basic Income"]?.[side as 'for' | 'against']?.[round as 'opening' | 'rebuttal' | 'closing'] || 
      `As the ${side} side, I believe this position is the correct one for ${topic} in this ${round} round.`;
  };

  const handleNext = () => {
    nextRound();
    setArgument("");
    setTimeRemaining(30); // Reset to 30 seconds for next round
    setIsSubmitted(false);
  };

  const handleReset = () => {
    resetDebate();
  };

  return (
    <div className="debate-card">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">{currentRoundType}</h2>
          <p className="text-muted-foreground">
            Topic: {selectedTopic?.title} • You are arguing: 
            <span className={`ml-1 font-semibold ${assignedSide === 'for' ? 'text-green-400' : 'text-red-400'}`}>
              {assignedSide === 'for' ? 'FOR' : 'AGAINST'}
            </span>
          </p>
        </div>
        {!isSubmitted && (
          <div className={`text-xl font-mono ${timeRemaining < 60 ? 'text-red-400' : 'text-white'}`}>
            {formatTime(timeRemaining)}
          </div>
        )}
      </div>
      
      {!isSubmitted ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Your Argument</label>
            <Textarea 
              value={argument}
              onChange={(e) => setArgument(e.target.value)}
              className="debate-input h-40"
              placeholder={`Write your ${currentRoundType.toLowerCase()} here...`}
            />
          </div>
          <div className="text-right">
            <Button 
              className="debate-button"
              onClick={handleSubmit}
              disabled={argument.trim().length < 10}
            >
              Submit Argument
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Your Argument:</h3>
            <div className="debate-card bg-debate/10">
              <p className="whitespace-pre-line">{rounds[currentRound][assignedSide === 'for' ? 'forArgument' : 'againstArgument']}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span>{opponent}'s Argument:</span>
              {isLoading && (
                <span className="inline-block h-4 w-4 rounded-full border-2 border-debate-light border-t-transparent animate-spin"></span>
              )}
            </h3>
            {isLoading ? (
              <div className="debate-card bg-secondary/50 h-32 flex items-center justify-center">
                <p className="text-muted-foreground">Opponent is typing...</p>
              </div>
            ) : (
              <div className="debate-card bg-secondary/50">
                <p className="whitespace-pre-line">{rounds[currentRound][assignedSide === 'for' ? 'againstArgument' : 'forArgument']}</p>
              </div>
            )}
          </div>
          
          {!isLoading && !isLastRound && (
            <div className="text-right">
              <Button className="debate-button" onClick={handleNext}>
                Next Round
              </Button>
            </div>
          )}
          
          {isLastRound && !isLoading && debateState.result.winner && (
            <div className="mt-8 text-center">
              <h3 className="text-xl font-bold mb-4">Debate Results</h3>
              <div className="debate-card bg-debate/10 mb-4">
                <div className="text-2xl font-bold mb-2">
                  {debateState.result.winner === (assignedSide as 'for' | 'against') ? (
                    <span className="text-green-400">You Won!</span>
                  ) : debateState.result.winner === 'tie' ? (
                    <span className="text-yellow-400">It's a Tie!</span>
                  ) : (
                    <span className="text-red-400">Opponent Won</span>
                  )}
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{debateState.result.score}</span>
                  <span className="text-muted-foreground"> points earned</span>
                </div>
                <p className="text-muted-foreground">{debateState.result.feedback}</p>
              </div>
              <Button className="debate-button" onClick={handleReset}>
                Start New Debate
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
