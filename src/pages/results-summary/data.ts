import Reaction from "./assets/images/icon-reaction.svg";
import Memory from "./assets/images/icon-memory.svg";
import Verbal from "./assets/images/icon-verbal.svg";
import Visual from "./assets/images/icon-visual.svg";
import type { ImageMetadata } from "astro";

type Result = {
  category: string;
  score: number;
  icon: ImageMetadata;
};
type Results = Result[];

const results: Results = [
  {
    category: "Reaction",
    score: 80,
    icon: Reaction,
  },
  {
    category: "Memory",
    score: 92,
    icon: Memory,
  },
  {
    category: "Verbal",
    score: 61,
    icon: Verbal,
  },
  {
    category: "Visual",
    score: 72,
    icon: Visual,
  },
];

let totalScore = results.reduce((acc, result) => acc + result.score, 0);
totalScore = Math.round(totalScore / results.length);

export default results;
export { totalScore };
