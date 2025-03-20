import { assert } from "tsafe/assert";

export const armorKinds = ["head", "chest", "arms", "waist", "legs", "charm"] as const;
export type ArmorKind = (typeof armorKinds)[number];

export interface ArmorPiece {
    name: string;
    description: string;
    id: number;
    kind: ArmorKind;
    skills: {
        id: number;
        level: number;
    }[];
    slots: number[];
}

type Projection<T, Prefix extends string = ""> = {
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

export const armorProjection: Projection<ArmorPiece> = {
    name: true,
    description: true,
    id: true,
    kind: true,
    "skills.id": true,
    "skills.level": true,
    slots: true,
};

interface Charm {
    id: number;
    ranks: CharmRank[];
}

interface CharmRank {
    level: number;
    name: string;
    description: string;
    skills: {
        id: number;
        level: number;
    }[];
}

const charmProjection: Projection<Charm> = {
    id: true,
    "ranks.level": true,
    "ranks.name": true,
    "ranks.description": true,
    "ranks.skills.id": true,
    "ranks.skills.level": true,
};

export async function getArmors(): Promise<ArmorPiece[]> {
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
        return (await resp.json()) as ArmorPiece[];
    };

    const charms = async () => {
        const url = new URL("https://wilds.mhdb.io/en/charms");
        url.searchParams.set("p", JSON.stringify(charmProjection));
        const resp = await fetch(url);
        return (await resp.json()) as Charm[];
    };

    const [piecesRes, charmsRes] = await Promise.all([pieces(), charms()]);

    return piecesRes
        .concat(
            charmsRes.map((charm) => {
                const highestRank = charm.ranks.sort((a, b) => b.level - a.level)[0];
                assert(highestRank !== undefined);

                return {
                    name: highestRank.name,
                    description: highestRank.description,
                    id: charm.id,
                    kind: "charm",
                    skills: highestRank.skills,
                    slots: [],
                };
            }),
        )
        .sort((a, b) => a.name.localeCompare(b.name));
}
