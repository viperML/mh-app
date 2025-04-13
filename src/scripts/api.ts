import { assert } from "tsafe/assert";
import type { DecoSlot, DecoSlotLevel } from "./decorations";
import { rawRankToRank, type RawSkillRank, type Skill2, type SkillRank2 } from "./skill";

export type ArmorKind = "head" | "chest" | "arms" | "waist" | "legs" | "charm";
export const armorKinds: ArmorKind[] = ["head", "chest", "arms", "waist", "legs", "charm"];

export interface RawArmorPiece {
    name: string;
    description: string;
    id: number;
    kind: ArmorKind;
    skills: RawSkillRank[];
    slots: DecoSlotLevel[];
}

export interface ArmorPiece {
    name: string;
    description: string;
    id: number;
    kind: ArmorKind;
    skills: SkillRank2[];
    slots: Record<DecoSlot, DecoSlotLevel>;
}

export type Projection<T, Prefix extends string = ""> = {
    [K in keyof T & string as T[K] extends (infer U)[]
        ? U extends object
            ? never
            : `${Prefix}${K}`
        : T[K] extends object
          ? never
          : `${Prefix}${K}`]: boolean;
} & {
    [K in keyof T & string as T[K] extends (infer U)[]
        ? U extends object
            ? keyof Projection<U, `${Prefix}${K}.`>
            : never
        : T[K] extends object
          ? keyof Projection<T[K], `${Prefix}${K}.`>
          : never]: boolean;
};

export const armorProjection: Projection<RawArmorPiece> = {
    name: true,
    description: true,
    id: true,
    kind: true,
    slots: true,
    "skills.description": true,
    "skills.id": true,
    "skills.level": true,
    "skills.name": true,
    "skills.skill": true,
};

interface Charm {
    id: number;
    ranks: CharmRank[];
}

interface CharmRank {
    level: number;
    name: string;
    description: string;
    skills: RawSkillRank[];
}

const charmProjection: Projection<Charm> = {
    id: true,
    "ranks.level": true,
    "ranks.name": true,
    "ranks.description": true,
    "ranks.skills.id": true,
    "ranks.skills.level": true,
    "ranks.skills.description": true,
    "ranks.skills.name": true,
    "ranks.skills.skill": true,
};

export async function getArmors(skills: Map<number, Skill2>): Promise<Map<number, ArmorPiece>> {
    const pieces = async () => {
        const url = new URL("https://wilds.mhdb.io/en/armor");
        url.searchParams.set("p", JSON.stringify(armorProjection));
        url.searchParams.set(
            "q",
            JSON.stringify({
                rank: "high",
            }),
        );
        const resp = await fetch(url);
        return (await resp.json()) as RawArmorPiece[];
    };

    const charms = async () => {
        const url = new URL("https://wilds.mhdb.io/en/charms");
        url.searchParams.set("p", JSON.stringify(charmProjection));
        const resp = await fetch(url);
        return (await resp.json()) as Charm[];
    };

    const [piecesRes, charmsRes] = await Promise.all([pieces(), charms()]);

    const allRawPieces: RawArmorPiece[] = piecesRes.concat(
        charmsRes.map(charm => {
            const highestCharm = charm.ranks.sort((a, b) => b.level - a.level)[0];
            assert(highestCharm);

            return {
                name: highestCharm.name,
                description: highestCharm.description,
                id: charm.id,
                kind: "charm",
                skills: highestCharm.skills,
                slots: [],
            };
        }),
    );

    const allPieces = allRawPieces.map(piece => {
        const res: ArmorPiece = {
            description: piece.description,
            id: piece.id,
            kind: piece.kind,
            name: piece.name,
            skills: piece.skills.map(rank => {
                const res = rawRankToRank(rank, skills);
                assert(res);
                return res;
            }),
            slots: {
                0: piece.slots[0] ?? 0,
                1: piece.slots[1] ?? 0,
                2: piece.slots[2] ?? 0,
            },
        };
        return res;
    });

    return new Map(allPieces.map(piece => [piece.id, piece]));
}
