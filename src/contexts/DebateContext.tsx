import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Topic = {
  id: string;
  title: string;
  description: string;
  image?: string;
};

export type Side = 'for' | 'against';

export type DebateRound = {
  type: 'opening' | 'rebuttal' | 'closing';
  forArgument: string;
  againstArgument: string;
};

export type DebateState = {
  isLoggedIn: boolean;
  username: string;
  selectedTopic: Topic | null;
  assignedSide: Side | null;
  opponent: string | null;
  rounds: DebateRound[];
  currentRound: number;
  result: {
    winner: 'for' | 'against' | 'tie' | null;
    feedback: string;
    score: number;
  };
  points: number;
  badges: Array<{ id: number; name: string }>;
  completedDebates: Array<{
    topic: Topic;
    assignedSide: Side;
    result: {
      winner: 'for' | 'against' | 'tie';
      feedback: string;
      score: number;
    };
  }>;
};

type DebateContextType = {
  debateState: DebateState;
  login: (username: string) => void;
  logout: () => void;
  selectTopic: (topic: Topic) => void;
  assignSide: (side: Side) => void;
  setOpponent: (name: string) => void;
  submitArgument: (argument: string) => void;
  submitOpponentArgument: (argument: string) => void;
  nextRound: () => void;
  setResult: (winner: 'for' | 'against' | 'tie', feedback: string, score: number) => void;
  resetDebate: () => void;
  purchaseBadge: (badge: { id: number; name: string; cost: number }) => void;
};

const initialState: DebateState = {
  isLoggedIn: false,
  username: '',
  selectedTopic: null,
  assignedSide: null,
  opponent: null,
  rounds: [],
  currentRound: 0,
  result: {
    winner: null,
    feedback: '',
    score: 0
  },
  points: 0,
  badges: [],
  completedDebates: [],
};

const DebateContext = createContext<DebateContextType | undefined>(undefined);

export const DebateProvider = ({ children }: { children: ReactNode }) => {
  const [debateState, setDebateState] = useState<DebateState>(initialState);

  const login = (username: string) => {
    setDebateState(prev => ({ ...prev, isLoggedIn: true, username }));
  };

  const logout = () => {
    setDebateState(initialState);
  };

  const selectTopic = (topic: Topic) => {
    const newRounds = [
      { type: 'opening', forArgument: '', againstArgument: '' },
      { type: 'rebuttal', forArgument: '', againstArgument: '' },
      { type: 'closing', forArgument: '', againstArgument: '' }
    ] as DebateRound[];

    setDebateState(prev => ({ 
      ...prev, 
      selectedTopic: topic,
      rounds: newRounds
    }));
  };

  const assignSide = (side: Side) => {
    setDebateState(prev => ({ ...prev, assignedSide: side }));
  };

  const setOpponent = (name: string) => {
    setDebateState(prev => ({ ...prev, opponent: name }));
  };

  const submitArgument = (argument: string) => {
    const updatedRounds = [...debateState.rounds];
    const roundIndex = debateState.currentRound;
    
    if (debateState.assignedSide === 'for') {
      updatedRounds[roundIndex].forArgument = argument;
    } else {
      updatedRounds[roundIndex].againstArgument = argument;
    }
    
    setDebateState(prev => ({ 
      ...prev, 
      rounds: updatedRounds
    }));
  };

  const submitOpponentArgument = (argument: string) => {
    const updatedRounds = [...debateState.rounds];
    const roundIndex = debateState.currentRound;
    
    if (debateState.assignedSide === 'for') {
      updatedRounds[roundIndex].againstArgument = argument;
    } else {
      updatedRounds[roundIndex].forArgument = argument;
    }
    
    setDebateState(prev => ({ 
      ...prev, 
      rounds: updatedRounds
    }));
  };

  const nextRound = () => {
    if (debateState.currentRound < 2) {
      setDebateState(prev => ({ 
        ...prev, 
        currentRound: prev.currentRound + 1
      }));
    }
  };

  const setResult = (winner: 'for' | 'against' | 'tie', feedback: string, score: number) => {
    setDebateState(prev => {
      const newPoints = winner === prev.assignedSide ? prev.points + score : prev.points;
      const completedDebate = {
        topic: prev.selectedTopic!,
        assignedSide: prev.assignedSide!,
        result: { winner, feedback, score }
      };
      
      return {
        ...prev,
        result: { winner, feedback, score },
        points: newPoints,
        completedDebates: [...(prev.completedDebates || []), completedDebate]
      };
    });
  };

  const purchaseBadge = (badge: { id: number; name: string; cost: number }) => {
    setDebateState(prev => {
      if (prev.points >= badge.cost && !prev.badges.some(b => b.id === badge.id)) {
        return {
          ...prev,
          points: prev.points - badge.cost,
          badges: [...prev.badges, { id: badge.id, name: badge.name }]
        };
      }
      return prev;
    });
  };

  const resetDebate = () => {
    setDebateState(prev => ({
      ...initialState,
      isLoggedIn: prev.isLoggedIn,
      username: prev.username
    }));
  };

  return (
    <DebateContext.Provider value={{ 
      debateState, 
      login, 
      logout, 
      selectTopic, 
      assignSide, 
      setOpponent, 
      submitArgument,
      submitOpponentArgument,
      nextRound,
      setResult,
      resetDebate,
      purchaseBadge
    }}>
      {children}
    </DebateContext.Provider>
  );
};

export const useDebate = (): DebateContextType => {
  const context = useContext(DebateContext);
  if (context === undefined) {
    throw new Error('useDebate must be used within a DebateProvider');
  }
  return context;
};
