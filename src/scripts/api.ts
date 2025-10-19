import { z } from "zod";

const SkillRankZ = z.object({
    id: z.number(),
    name: z.string().nullish(),
    description: z.nullable(z.string()),
    level: z.number(),
})


const ArmorRankZ = z.enum(["low", "high", "master"]);

const ArmorKindZ = z.enum([
    "head",
    "chest",
    "arms",
    "waist",
    "legs"
])

const SkillKindZ = z.enum(["armor", "weapon", "set", "group"]);

const SkillZ = z.object({
    id: z.number(),
    name: z.string(),
    description: z.nullable(z.string()),
    ranks: z.array(SkillRankZ),
    kind: SkillKindZ,
})

const ArmorZ = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    rank: ArmorRankZ,
    kind: ArmorKindZ,
    rarity: z.number(),
    slots: z.array(z.number()),
    skills: z.array(SkillRankZ),
})

const CharmRankZ = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    level: z.number(),
    rarity: z.number(),
    skills: z.array(SkillRankZ),
})

const CharmZ = z.object({
    id: z.number(),
    ranks: z.array(CharmRankZ),
})

const DecorationKindZ = z.enum(["weapon", "armor"]);

const DecorationZ = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    slot: z.number(),
    rarity: z.number(),
    kind: DecorationKindZ,
    skills: z.array(SkillRankZ),
})

const WeaponKindZ = z.enum([
    "bow",
    "charge-blade",
    "dual-blades",
    "great-sword",
    "gunlance",
    "hammer",
    "heavy-bowgun",
    "hunting-horn",
    "insect-glaive",
    "lance",
    "light-bowgun",
    "long-sword",
    "switch-axe",
    "sword-shield"
]);

const WeaponZ = z.object({
    id: z.number(),
    kind: WeaponKindZ,
    name: z.string(),
    rarity: z.number(),
    skills: z.array(SkillRankZ),
    affinity: z.number(),
})

function mkFetcher<T>(url: URL | string, _z: z.ZodType<T>) {
    return async function (): Promise<T> {
        const resp = await fetch(url);
        const j = await resp.json();
        const parsed = _z.parse(j);
        return parsed;
    }
}

export const fetchArmors: () => Promise<Armor[]> = mkFetcher(
    "https://wilds.mhdb.io/en/armor",
    z.array(ArmorZ)
);

export const fetchCharms: () => Promise<Charm[]> = mkFetcher(
    "https://wilds.mhdb.io/en/charms",
    z.array(CharmZ)
)

export const fetchDecorations: () => Promise<Decoration[]> = mkFetcher(
    "https://wilds.mhdb.io/en/decorations",
    z.array(DecorationZ),
)

export const fetchSkills: () => Promise<Skill[]> = mkFetcher(
    "https://wilds.mhdb.io/en/skills",
    z.array(SkillZ),
)

export const fetchWeapons: () => Promise<Weapon[]> = mkFetcher(
    "https://wilds.mhdb.io/en/weapons",
    z.array(WeaponZ),
)

export type SkillRank = z.infer<typeof SkillRankZ>;
export type ArmorRank = z.infer<typeof ArmorRankZ>;
export type ArmorKind = z.infer<typeof ArmorKindZ>;
export type SkillKind = z.infer<typeof SkillKindZ>;
export type Skill = z.infer<typeof SkillZ>;
export type Armor = z.infer<typeof ArmorZ>;
export type CharmRank = z.infer<typeof CharmRankZ>;
export type Charm = z.infer<typeof CharmZ>;
export type DecorationKind = z.infer<typeof DecorationKindZ>;
export type Decoration = z.infer<typeof DecorationZ>;
export type WeaponKind = z.infer<typeof WeaponKindZ>;
export type Weapon = z.infer<typeof WeaponZ>;
