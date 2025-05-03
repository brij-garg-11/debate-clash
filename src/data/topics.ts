
import { Topic } from '../contexts/DebateContext';

export const topics: Topic[] = [
  {
    id: '1',
    title: 'Universal Basic Income',
    description: 'Should governments provide a universal basic income to all citizens?',
    image: 'https://images.unsplash.com/photo-1579621970590-9d624316904b?q=80&w=2070'
  },
  {
    id: '2',
    title: 'Artificial Intelligence Regulation',
    description: 'Should AI development be strictly regulated by governments?',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2232'
  },
  {
    id: '3',
    title: 'Climate Change Solutions',
    description: 'Are carbon taxes the most effective way to combat climate change?',
    image: 'https://images.unsplash.com/photo-1536882240095-0379873feb4e?q=80&w=2232'
  },
  {
    id: '4',
    title: 'Digital Privacy',
    description: 'Do tech companies collect too much personal data from users?',
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=2070'
  },
  {
    id: '5',
    title: 'Education Reform',
    description: 'Should standardized testing be eliminated from education systems?',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2122'
  },
  {
    id: '6',
    title: 'Healthcare Systems',
    description: 'Is universal healthcare a right that should be provided to all citizens?',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070'
  },
];

export const getRandomOpponent = (): string => {
  const opponents = [
    'LogicMaster42', 
    'DebateChampion', 
    'ArgumentKing', 
    'RationalThinker', 
    'PersuasiveSpeaker',
    'DialogueExpert',
    'RhetoricGuru',
    'ThoughtProvoker',
    'MindChanger'
  ];
  return opponents[Math.floor(Math.random() * opponents.length)];
};
