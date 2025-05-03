
import { useDebate } from "@/contexts/DebateContext";
import { LoginForm } from "@/components/LoginForm";
import { NavBar } from "@/components/NavBar";
import { TopicCard } from "@/components/TopicCard";
import { DebateArena } from "@/components/DebateArena";
import { topics } from "@/data/topics";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { debateState, selectTopic, assignSide } = useDebate();
  const { toast } = useToast();

  const handleSelectTopic = (topic: typeof topics[0]) => {
    selectTopic(topic);
    
    // Randomly assign debate side
    const sides: ('for' | 'against')[] = ['for', 'against'];
    const randomSide = sides[Math.floor(Math.random() * sides.length)];
    assignSide(randomSide);
    
    toast({
      title: "Topic Selected!",
      description: `You will be arguing ${randomSide.toUpperCase()} "${topic.title}"`,
    });
  };

  return (
    <div className="min-h-screen bg-debate-dark text-white">
      <NavBar />
      
      <main className="container mx-auto pt-24 pb-12 px-4">
        {!debateState.isLoggedIn ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-debate-light to-debate-contrast bg-clip-text text-transparent">
                Debate Arena Clash
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Sharpen your debate skills, challenge your thinking, and engage with diverse perspectives
                on today's most important topics. Enter the arena and make your voice heard.
              </p>
            </div>
            <LoginForm />
          </div>
        ) : !debateState.selectedTopic ? (
          <div>
            <h2 className="text-2xl font-bold mb-6">Choose a Topic to Debate</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((topic) => (
                <TopicCard 
                  key={topic.id} 
                  topic={topic} 
                  onClick={() => handleSelectTopic(topic)}
                />
              ))}
            </div>
          </div>
        ) : (
          <DebateArena />
        )}
      </main>
    </div>
  );
};

export default Index;
