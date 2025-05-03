
import { Topic } from "@/contexts/DebateContext";

type TopicCardProps = {
  topic: Topic;
  onClick: () => void;
};

export const TopicCard = ({ topic, onClick }: TopicCardProps) => {
  return (
    <div
      className="debate-card hover:border-debate-light cursor-pointer transition-all hover:shadow-md hover:shadow-debate-light/20 group"
      onClick={onClick}
    >
      <div className="aspect-video overflow-hidden rounded-md mb-4 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-debate-dark to-transparent z-10"></div>
        {topic.image ? (
          <img
            src={topic.image}
            alt={topic.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-debate/30 flex items-center justify-center">
            <span className="text-white/60">No image</span>
          </div>
        )}
        <div className="absolute bottom-2 left-2 right-2 z-20">
          <h3 className="text-xl font-bold text-white">{topic.title}</h3>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{topic.description}</p>
    </div>
  );
};
