export const armorTypes = ["HELM", "BODY", "ARM", "WAIST", "LEG"] as const;
export type ArmorType = typeof armorTypes[number];

export interface RawArmor {
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

export type ArmorInfo = Record<string, Armor>;

export function reduceSkills(...skills: ArmorSkill[]): Record<string, number> {
    return skills.reduce((acc, skill) => {
        console.log(skill);
        acc[skill.name] = (acc[skill.name] ?? 0) + skill.level;
        return acc;
    }, {} as Record<string, number>);
}
