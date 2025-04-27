import type { Projection } from "./api";

export interface RawSkillRank {
    id: number;
    name?: string;
    description: string;
    level: number;
    /// Reference to parent's skill
    skill?: {
        id?: number;
        name?: string;
    };
}

export type SkillKind = "armor" | "weapon" | "set" | "group";

export interface RawSkill {
    id: number;
    name: string;
    description: string;
    ranks: RawSkillRank[];
    kind: SkillKind;
    icon: SkillIcon;
}

interface SkillIcon {
    kind: SkillIconKind;
}

export type SkillIconKind =
    | "affinity"
    | "attack"
    | "defense"
    | "element"
    | "gathering"
    | "group"
    | "handicraft"
    | "health"
    | "item"
    | "offense"
    | "ranged"
    | "set"
    | "stamina"
    | "utility";

const rawSkillProjection: Projection<RawSkill> = {
    id: true,
    name: true,
    description: false,
    kind: true,
    "ranks.id": false,
    "ranks.description": false,
    "ranks.level": true,
    "ranks.name": false,
    "ranks.skill": false,
    "icon.kind": true,
};

export type SkillRank = {
    level: number;
    skill: Skill;
};

export type Skill = {
    id: number;
    name: string;
    kind: SkillKind;
    maxRank: number;
    iconKind: SkillIconKind;
};

export async function getSkills(): Promise<Map<number, Skill>> {
    const url = new URL("https://wilds.mhdb.io/en/skills");
    url.searchParams.set("p", JSON.stringify(rawSkillProjection));

    const resp = await fetch(url);
    const rawSkills = (await resp.json()) as RawSkill[];

    const res = new Map<number, Skill>();

    for (const s of rawSkills) {
        const maxRank = s.ranks.reduce((max, { level }) => Math.max(max, level), 1);

        res.set(s.id, {
            id: s.id,
            kind: s.kind,
            name: s.name,
            maxRank,
            iconKind: s.icon.kind,
        });
    }

    return res;
}

export function rawRankToRank(rank: RawSkillRank, allSkills: Map<number, Skill>): SkillRank | undefined {
    const skill = rank.skill?.id ? allSkills.get(rank.skill.id) : undefined;
    return skill
        ? {
              level: rank.level,
              skill,
          }
        : undefined;
}

export function mergeSkillRanks(...ranks: SkillRank[]): SkillRank[] {
    const res: SkillRank[] = [];
    for (const rank of ranks) {
        const existing = res.find(r => r.skill.id === rank.skill.id);
        if (existing) {
            existing.level += rank.level;
        } else {
            res.push({
                level: rank.level,
                skill: rank.skill,
            });
        }
    }

    return res;
}
