import { Verdict, Challenge } from '../types';

export const VERDICTS: Record<string, Verdict> = {
  YTA: {
    type: 'YTA',
    label: 'You\'re the Asshole',
    description: 'The person is clearly in the wrong'
  },
  NTA: {
    type: 'NTA',
    label: 'Not the Asshole',
    description: 'The person did nothing wrong'
  },
  ESH: {
    type: 'ESH',
    label: 'Everyone Sucks Here',
    description: 'Everyone involved is at fault'
  },
  NAH: {
    type: 'NAH',
    label: 'No Assholes Here',
    description: 'No one is at fault, just a misunderstanding'
  }
};

export const JUDGE_RANKS = [
  { level: 0, rank: "🐣 Rookie Judge", xpRequired: 0 },
  { level: 1, rank: "👨‍⚖️ Courtroom Intern", xpRequired: 50 },
  { level: 2, rank: "⚖️ Junior Justice", xpRequired: 150 },
  { level: 3, rank: "🎓 Senior Arbitrator", xpRequired: 300 },
  { level: 4, rank: "🧙 Reddit Justice Wizard", xpRequired: 500 },
  { level: 5, rank: "👑 Supreme Karma Judge", xpRequired: 1000 }
];

export const DAILY_CHALLENGES: Challenge[] = [
  {
    id: "streak_3",
    title: "Hat Trick",
    description: "Get 3 judgments correct in a row",
    target: 3,
    progress: 0,
    reward: 25,
    completed: false
  },
  {
    id: "judge_10",
    title: "Busy Day",
    description: "Judge 10 cases today",
    target: 10,
    progress: 0,
    reward: 30,
    completed: false
  },
  {
    id: "perfect_accuracy",
    title: "Perfect Record",
    description: "Maintain 100% accuracy for 5 judgments",
    target: 5,
    progress: 0,
    reward: 50,
    completed: false
  }
];