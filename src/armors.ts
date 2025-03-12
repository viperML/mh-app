export type ArmorTypes = "head" | "chest" | "arms"

export type ArmorSkill = {
    name: string,
    value: number,
}

export type ArmorPiece = {
    name: string,
    skills: ArmorSkill[],
    slots: number[],
}

import armorsData from "./data.json";

type ArmorData = {
    [key in ArmorTypes[number]]: ArmorPiece[]
}

export const armors = armorsData as ArmorData;

export type FoldedSkills = Record<string, number>;

export function foldSkills(skills: ArmorSkill[]): FoldedSkills {
    return skills.reduce((acc, skill) => {
        acc[skill.name] = (acc[skill.name] || 0) + skill.value;
        return acc;
    }, {} as FoldedSkills);
}

export function effectiveRaw(baseDmg: number, skills: FoldedSkills) {
    let critRate = 1.0;
    const dmg = baseDmg;

    critRate += (skills["Critical Eye"] || 0) * 5/100;
    const critDamage = 1.5;

    return baseDmg * (1-critDamage) + (baseDmg * critDamage) * critRate;
}


