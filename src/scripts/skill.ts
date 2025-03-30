import type { Projection } from "./api";

export interface Skill {
    id: number;
    name: string;
    level: number;
}

export type MergedSkills = Map<string, number>;

interface SkillRaw {
    id: number;
    name: string;
    ranks: SkillRank[];
}

export interface SkillRank {
    id: number;
    level: number;
}

const skillRawProjection: Projection<SkillRaw> = {
    id: true,
    name: true,
    "ranks.id": true,
    "ranks.level": true,
};

export async function getSkills(): Promise<Map<number, Skill>> {
    const url = new URL("https://wilds.mhdb.io/en/skills");
    url.searchParams.set("p", JSON.stringify(skillRawProjection));

    const resp = await fetch(url);
    const rawSkills = (await resp.json()) as SkillRaw[];

    const res = new Map<number, Skill>();

    for (const rawSkill of rawSkills) {
        for (const rank of rawSkill.ranks) {
            const skill: Skill = {
                id: rank.id,
                name: rawSkill.name,
                level: rank.level,
            };
            res.set(rank.id, skill);
        }
    }

    return res;
}

export function mergeSkills(skills: Skill[]): MergedSkills {
    const merged: MergedSkills = new Map();

    for (const skill of skills) {
        const prev = merged.get(skill.name);
        if (prev === undefined) {
            merged.set(skill.name, skill.level);
        } else {
            merged.set(skill.name, prev + skill.level);
        }
    }

    return merged;
}
