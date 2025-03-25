import type { Projection } from "./api";

export interface Skill {
    id: number,
    name: string,
    level: number,
}

export type MergedSkills = Record<string, number>;

interface SkillRaw {
    id: number;
    name: string;
    ranks: SkillRank[],
}

interface SkillRank {
    id: number,
    level: number,
}

const skillRawProjection: Projection<SkillRaw> = {
    id: true,
    name: true,
    "ranks.id": true,
    "ranks.level": true,
};

export async function getSkills(): Promise<Record<number, Skill>> {
    const url = new URL("https://wilds.mhdb.io/en/skills");
    url.searchParams.set("p", JSON.stringify(skillRawProjection));

    const resp = await fetch(url);
    const rawSkills = (await resp.json()) as SkillRaw[];

    const entries: [number, Skill][] = []
    for (const rawSkill of rawSkills) {
        console.log(rawSkill);
        for (const rank of rawSkill.ranks) {
            const ins = {
                id: rank.id,
                name: rawSkill.name,
                level: rank.level,
            }
            entries.push([rank.id, ins]);
        }
    }

    return Object.fromEntries(entries);
}

export function mergeSkills(skills: Skill[]): MergedSkills {
    const merged: MergedSkills = {};

    for (const skill of skills) {
        if (merged[skill.name] === undefined) {
            merged[skill.name] = 0;
        }
        (merged[skill.name] as number) += skill.level;
    }

    return merged;
}
