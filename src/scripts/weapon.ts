import type { SkillRank2 } from "./skill";

export interface Weapon {
    id: number;
    skills: SkillRank2[];
    affinity: number;
    damage: number;
}

export type WeaponKind =
    | "bow"
    | "charge-blade"
    | "dual-blades"
    | "great-sword"
    | "gunlance"
    | "hammer"
    | "heavy-bowgun"
    | "hunting-horn"
    | "insect-glaive"
    | "lance"
    | "light-bowgun"
    | "long-sword"
    | "switch-axe"
    | "sword-shield";
