import { assert } from "tsafe/assert";
import type { Projection } from "./api";
import type { RawSkillRank, Skill2, SkillRank2 } from "./skill";

export type DecorationKind = "weapon" | "armor";

interface RawDecoration {
    id: number;
    name: string;
    description: string;
    slot: number;
    kind: DecorationKind;
    skills: RawSkillRank[];
}

const decorationProjection: Projection<RawDecoration> = {
    id: true,
    name: true,
    description: true,
    slot: true,
    kind: true,
    "skills.description": true,
    "skills.id": true,
    "skills.level": true,
    "skills.name": true,
    "skills.skill": true,
};

export type DecoSlot = 0 | 1 | 2;

/// A level of 0 is empty
export type DecoSlotLevel = 0 | 1 | 2 | 3;

export interface Decoration {
    id: number;
    name: string;
    description: string;
    slot: DecoSlotLevel;
    kind: DecorationKind;
    skills: SkillRank2[];
}

export async function getDecorations(skills: Map<number, Skill2>): Promise<Map<number, Decoration>> {
    const url = new URL("https://wilds.mhdb.io/en/decorations");
    url.searchParams.set("p", JSON.stringify(decorationProjection));

    const resp = await fetch(url);
    const rawDecorations = (await resp.json()) as RawDecoration[];

    const res = new Map<number, Decoration>(
        rawDecorations.map(rawDecoration => {
            const decoration: Decoration = {
                id: rawDecoration.id,
                name: rawDecoration.name,
                description: rawDecoration.description,
                slot: rawDecoration.slot as DecoSlotLevel,
                kind: rawDecoration.kind,
                skills: rawDecoration.skills.map(rank => {
                    assert(rank.skill?.id);
                    const s = skills.get(rank.skill.id);
                    assert(s);
                    return {
                        level: rank.level,
                        skill: s,
                    };
                }),
            };
            return [decoration.id, decoration];
        }),
    );

    return res;
}
