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
    "ranks.level": false,
    "ranks.name": false,
    "ranks.skill": false,
    // @ts-expect-error All rank information is removed
    ranks: false,
};

export type SkillRank2 = {
    level: number;
    skill: Skill2;
};

export type Skill2 = {
    id: number;
    name: string;
    kind: SkillKind;
};

export async function getSkills(): Promise<Map<number, Skill2>> {
    const url = new URL("https://wilds.mhdb.io/en/skills");
    url.searchParams.set("p", JSON.stringify(rawSkillProjection));

    const resp = await fetch(url);
    const rawSkills = (await resp.json()) as RawSkill[];

    const res = new Map<number, Skill2>();

    for (const s of rawSkills) {
        res.set(s.id, {
            id: s.id,
            kind: s.kind,
            name: s.name,
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
    for (const rank of ranks) {
        const skill = rank.skill.name;
        const level = rank.level;

        if (res.has(skill)) {
            res.set(skill, res.get(skill)! + level);
        } else {
            res.set(skill, level);
        }
    }
    return res;
}
