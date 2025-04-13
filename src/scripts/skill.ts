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
    description: true,
    kind: true,
    "ranks.id": true,
    "ranks.description": true,
    "ranks.level": true,
    "ranks.name": true,
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
    description: string;
};

export async function getSkills(): Promise<Map<number, Skill2>> {
    const url = new URL("https://wilds.mhdb.io/en/skills");
    url.searchParams.set("p", JSON.stringify(rawSkillProjection));

    const resp = await fetch(url);
    const rawSkills = (await resp.json()) as RawSkill[];

    const res = new Map<number, Skill2>();

    for (const s of rawSkills) {
        res.set(s.id, {
            description: s.description,
            id: s.id,
            kind: s.kind,
            name: s.name,
        });
    }

    return res;
}

// export function mergeSkills(skills: Skill[]): MergedSkills {
//     const merged: MergedSkills = new Map();

//     for (const skill of skills) {
//         const prev = merged.get(skill.name);
//         if (prev === undefined) {
//             merged.set(skill.name, skill.level);
//         } else {
//             merged.set(skill.name, prev + skill.level);
//         }
//     }

//     return merged;
// }
