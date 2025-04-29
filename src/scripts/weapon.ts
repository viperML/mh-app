import { assert } from "tsafe/assert";
import type { Projection } from "./api";
import { rawRankToRank, type RawSkillRank, type Skill, type SkillRank } from "./skill";
import type { DecoSlot, DecoSlotLevel } from "./decorations";

export type WeaponKind =
    | "bow"
    | "charge-blade"
    | "dual-blades"
    | "great-sword"
    | "gunlance"
    | "hammer"
    | "heavy-bowgun"
    | "hunting-horn"
    | "insect-glaive"
    | "lance"
    | "light-bowgun"
    | "long-sword"
    | "switch-axe"
    | "sword-shield";

export interface RawWeapon {
    id: number;
    kind: WeaponKind;
    name: string;
    rarity: number;
    damage: { raw: number; display: number };
    skills: RawSkillRank[];
    slots: number[];
    affinity: number;
}

export type Weapon = {
    id: number;
    kind: WeaponKind;
    name: string;
    rarity: number;
    damage: number;
    skills: SkillRank[];
    slots: Record<DecoSlot, DecoSlotLevel>;
    affinity: number;
};

const weaponProjection: Projection<RawWeapon> = {
    id: true,
    kind: true,
    name: true,
    rarity: true,
    "damage.raw": true,
    "damage.display": false,
    slots: true,
    affinity: true,
    // Only fetch what we need
    "skills.description": false,
    "skills.id": false,
    "skills.level": true,
    "skills.name": false,
    "skills.skill": true,
};

export async function getWeapons(skills: Map<number, Skill>): Promise<Map<number, Weapon>> {
    const url = new URL("https://wilds.mhdb.io/en/weapons");
    url.searchParams.set("p", JSON.stringify(weaponProjection));
    const resp = await fetch(url);
    const rawWeapons = (await resp.json()) as RawWeapon[];

    const res = new Map<number, Weapon>(
        rawWeapons.map(rawWeapon => {
            const weapon: Weapon = {
                id: rawWeapon.id,
                kind: rawWeapon.kind,
                name: rawWeapon.name,
                rarity: rawWeapon.rarity,
                damage: rawWeapon.damage.raw,
                skills: rawWeapon.skills
                    .map(rank => {
                        const res = rawRankToRank(rank, skills);
                        assert(res);
                        return res;
                    })
                    .filter(Boolean),
                slots: {
                    0: (rawWeapon.slots[0] ?? 0) as DecoSlotLevel,
                    1: (rawWeapon.slots[1] ?? 0) as DecoSlotLevel,
                    2: (rawWeapon.slots[2] ?? 0) as DecoSlotLevel,
                },
                affinity: rawWeapon.affinity,
            };
            return [weapon.id, weapon];
        }),
    );
    return res;
}
