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
}

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
};

export type SkillRank2 = {
    level: number;
    skill: Skill2;
};

export type Skill2 = {
    id: number;
    name: string;
    kind: SkillKind;
    maxRank: number;
};

export async function getSkills(): Promise<Map<number, Skill2>> {
    const url = new URL("https://wilds.mhdb.io/en/skills");
    url.searchParams.set("p", JSON.stringify(rawSkillProjection));

    const resp = await fetch(url);
    const rawSkills = (await resp.json()) as RawSkill[];

    const res = new Map<number, Skill2>();

    for (const s of rawSkills) {
        const maxRank = s.ranks.reduce((max, { level }) => Math.max(max, level), 1);

        res.set(s.id, {
            id: s.id,
            kind: s.kind,
            name: s.name,
            maxRank,
        });
    }

    return res;
}

export function rawRankToRank(rank: RawSkillRank, allSkills: Map<number, Skill2>): SkillRank2 | undefined {
    const skill = rank.skill?.id ? allSkills.get(rank.skill.id) : undefined;
    return skill
        ? {
              level: rank.level,
              skill,
          }
        : undefined;
}

export type MergedSkills = Map<string, number>;

export function mergeSkillRanks(...ranks: SkillRank2[]): MergedSkills {
    const res: MergedSkills = new Map();
    mergeSkillsRanksInto(res, ...ranks);
    return res;
}

export function mergeSkillsRanksInto(merged: MergedSkills, ...ranks: SkillRank2[]) {
    for (const rank of ranks) {
        const skill = rank.skill.name;
        const level = rank.level;

        if (merged.has(skill)) {
            merged.set(skill, merged.get(skill)! + level);
        } else {
            merged.set(skill, level);
        }
    }
    return merged;
}


export type MergedSkills2 = Map<number, number>;

export function mergeSkillsRanksInto2(merged: MergedSkills2, ...ranks: SkillRank2[]) {
    for (const rank of ranks) {
        const skill = rank.skill.id;
        const level = rank.level;

        if (merged.has(skill)) {
            merged.set(skill, merged.get(skill)! + level);
        } else {
            merged.set(skill, level);
        }
    }
    return merged;
}
