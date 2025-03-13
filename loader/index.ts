import raw from "./raw.json";

export const armorTypes = ["HELM", "BODY", "ARM", "WAIST", "LEG"] as const;
export type ArmorType = typeof armorTypes[number];

interface RawArmor {
    name: string,
    type: ArmorType,
    index: number,
    indexRaw: string,
    nameRaw: string,

    skill1?: string,
    skillLevel1?: number,
    skill2?: string,
    skillLevel2?: number,
    skill3?: string
    skillLevel3?: number,

    slot1: number,
    slot2: number,
    slot3: number,
}

export type ArmorSkill = {
    name: string,
    level: number
}

export type Armor = {
    name: string,
    type: ArmorType,
    skills: ArmorSkill[],
    slots: {
        s1: number,
        s2: number,
        s3: number,
    }
}

const rawTyped = raw as RawArmor[];

export type ArmorInfo = Record<string, Armor>;

export function parse(): ArmorInfo {
    return Object.fromEntries(rawTyped
        .sort((left, right) => {
            return left.name.localeCompare(right.name);
        })
        .map(rawArmor => {
        if (rawArmor.index <= 131) {
            return undefined;
        }

        const skills = [];

        if (rawArmor.skill1 !== undefined && rawArmor.skillLevel1 !== undefined) {
            skills.push({
                name: rawArmor.skill1,
                level: rawArmor.skillLevel1,
            });
        }

        if (rawArmor.skill2 !== undefined && rawArmor.skillLevel2 !== undefined) {
            skills.push({
                name: rawArmor.skill2,
                level: rawArmor.skillLevel2,
            });
        }

        if (rawArmor.skill3 !== undefined && rawArmor.skillLevel3 !== undefined) {
            skills.push({
                name: rawArmor.skill3,
                level: rawArmor.skillLevel3,
            });
        }

        return [rawArmor.nameRaw, {
            name: rawArmor.name,
            type: rawArmor.type,
            skills,
            slots: {
                s1: rawArmor.slot1,
                s2: rawArmor.slot2,
                s3: rawArmor.slot3,
            }
        }];
    }).filter(o => o !== undefined))
}

