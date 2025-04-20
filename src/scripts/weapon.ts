import type { SkillRank2 } from "./skill";

export interface Weapon {
    id: number;
    skills: SkillRank2[];
    affinity: number;
    damage: number;
}
