import type { Projection } from "./api";

export interface Skill {
    id: number,
    name: string,
    level: number,
}

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

export async function getSkills(): Promise<Record<number, SkillRaw>> {
    const url = new URL("https://wilds.mhdb.io/en/skills");
    url.searchParams.set("p", JSON.stringify(skillRawProjection));

    const resp = await fetch(url);
    const rawSkills = (await resp.json()) as SkillRaw[];

    const entries = []
    for (const rawSkill of rawSkills) {
        console.log(rawSkill);
        for (const rank of rawSkill.ranks) {
            const ins: Skill = {
                id: rank.id,
                name: rawSkill.name,
                level: rank.level,
            }
            entries.push([rank.id, ins]);
        }
    }

    return Object.fromEntries(entries);
}
