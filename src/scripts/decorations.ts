import { assert } from "tsafe/assert";
import type { Projection } from "./api";
import type { Skill } from "./skill";

export type DecorationKind = "weapon" | "armor";

type DecorationSkill = {
    skill: {
        id: number;
        name: string;
    };
    level: number;
    description: string;
    id: string;
};

interface RawDecoration {
    id: number;
    name: string;
    description: string;
    slot: number;
    kind: DecorationKind;
    skills: DecorationSkill[];
}

const decorationProjection: Projection<RawDecoration> = {
    id: true,
    name: true,
    description: true,
    slot: true,
    kind: true,
    "skills.id": true,
    "skills.description": true,
    "skills.level": true,
    "skills.skill.id": true,
    "skills.skill.name": true,
};

export type Slot = 0 | 1 | 2;

export interface Decoration {
    id: number;
    name: string;
    description: string;
    slot: Slot;
    kind: DecorationKind;
    skills: Skill[];
}

export async function getDecorations(skills: Map<number, Skill>): Promise<Map<number, Decoration>> {
    const url = new URL("https://wilds.mhdb.io/en/decorations");
    url.searchParams.set("p", JSON.stringify(decorationProjection));

    const resp = await fetch(url);
    const rawDecoratins = (await resp.json()) as RawDecoration[];

    const res = new Map<number, Decoration>(
        rawDecoratins.map(rawDecoration => {
            const decoration: Decoration = {
                id: rawDecoration.id,
                name: rawDecoration.name,
                description: rawDecoration.description,
                slot: rawDecoration.slot as Slot,
                kind: rawDecoration.kind,
                skills: rawDecoration.skills.map(decorationSkill => {
                    const skill = skills.get(decorationSkill.skill.id);
                    assert(skill);
                    return {
                        ...skill,
                        level: decorationSkill.level,
                    };
                }),
            };
            return [decoration.id, decoration];
        }),
    );

    return res;
}
