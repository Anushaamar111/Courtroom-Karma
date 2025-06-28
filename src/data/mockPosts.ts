import { AITAPost } from '../types';

export const mockAITAPosts: AITAPost[] = [
  {
    id: "1",
    title: "AITA for refusing to give up my airplane seat to a family?",
    content: "I (28M) was flying home for the holidays and had booked an aisle seat in advance. A family with two young kids approached me asking if I could move to a middle seat so they could sit together. I politely declined because I specifically chose and paid extra for the aisle seat due to my long legs. The mother became very upset and said I was being selfish. Other passengers started staring and I felt awkward. AITA?",
    author: "TallTraveler28",
    score: 2847,
    num_comments: 1203,
    created_utc: Date.now() - 86400000,
    permalink: "/r/AmItheAsshole/comments/example1/",
    url: "https://reddit.com/r/AmItheAsshole/comments/example1/"
  },
  {
    id: "2",
    title: "AITA for eating my roommate's leftovers?",
    content: "My roommate (24F) left Chinese takeout in the fridge for 5 days. It was starting to smell and I was hungry, so I ate it and threw away the container. She came home and was furious, saying she was saving it for today. I told her food shouldn't sit in the fridge that long anyway and I was doing her a favor by preventing food poisoning. She's demanding I pay her back $15. AITA?",
    author: "HungryRoomie",
    score: 4521,
    num_comments: 892,
    created_utc: Date.now() - 172800000,
    permalink: "/r/AmItheAsshole/comments/example2/",
    url: "https://reddit.com/r/AmItheAsshole/comments/example2/"
  },
  {
    id: "3",
    title: "AITA for not inviting my sister to my wedding?",
    content: "My sister (30F) and I (28F) have had a rocky relationship. Last year, she missed my birthday party because she 'forgot' but posted on Instagram that same night at a bar with friends. She's also made several comments about my fiancé being 'not good enough' for me. I decided not to invite her to my wedding to avoid drama. My parents are furious and say I'm tearing the family apart. AITA?",
    author: "BrideToBe2024",
    score: 6234,
    num_comments: 1567,
    created_utc: Date.now() - 259200000,
    permalink: "/r/AmItheAsshole/comments/example3/",
    url: "https://reddit.com/r/AmItheAsshole/comments/example3/"
  },
  {
    id: "4",
    title: "AITA for telling my neighbor their dog is annoying?",
    content: "My neighbor's dog barks constantly from 6 AM to 11 PM. I've tried to be patient for months, but it's affecting my work-from-home job and sleep. I finally went over and politely told them their dog was disturbing the peace and asked if they could do something about it. They got defensive and said 'dogs bark, deal with it.' I told them their dog was poorly trained and annoying. Now they're giving me dirty looks. AITA?",
    author: "QuietNeighbor",
    score: 8932,
    num_comments: 2341,
    created_utc: Date.now() - 345600000,
    permalink: "/r/AmItheAsshole/comments/example4/",
    url: "https://reddit.com/r/AmItheAsshole/comments/example4/"
  },
  {
    id: "5",
    title: "AITA for refusing to pay for my friend's expensive dinner?",
    content: "My friend invited me to dinner at a fancy restaurant. She didn't mention it was expensive - I assumed it was casual dining. When I saw the menu, everything was $40-60 per dish. I ordered the cheapest salad ($28) while she got a $75 steak and $15 cocktails. When the bill came, she suggested we split it evenly. I said I'd only pay for what I ordered plus tip. She got embarrassed and said I was being cheap in front of our server. AITA?",
    author: "BudgetDiner",
    score: 5678,
    num_comments: 1834,
    created_utc: Date.now() - 432000000,
    permalink: "/r/AmItheAsshole/comments/example5/",
    url: "https://reddit.com/r/AmItheAsshole/comments/example5/"
  }
];

// Mock Reddit verdicts (what the community actually voted)
export const mockRedditVerdicts: Record<string, 'YTA' | 'NTA' | 'ESH' | 'NAH'> = {
  "1": "NTA", // Airplane seat
  "2": "YTA", // Roommate's leftovers
  "3": "NTA", // Wedding invitation
  "4": "NTA", // Dog complaint
  "5": "NTA"  // Restaurant bill
};