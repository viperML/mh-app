import type { Skill } from "./skill";

export interface EfrOptions {
    baseRawDamage: number;
    baseCritChance: number;
    skills: Skill[];
}

export type EfrInfo = {
    efr: number;
    rawDamage: number;
    critChance: number;
    critMult: number;
};

const WEX = "Weakness Exploit";
const AGI = "Agitator";

// export function efr(options: EfrOptions): EfrInfo {
    // const rawDamage = options.baseRawDamage;
    // let critChance = options.baseCritChance;
    // const critMult = 1.5;
    // if (options.skills[AGI] !== undefined) {
    //     critChance += (options.skills[AGI] * 5.0) / 100.0;
    // }

    // if (options.skills[WEX] !== undefined) {
    //     critChance += (options.skills[WEX] * 5.0) / 100.0;
    // }

    // const efr = rawDamage * (1.0 - critChance) + rawDamage * critMult * critChance;

    // return {
    //     efr,
    //     rawDamage,
    //     critChance,
    //     critMult,
    // };
// }
