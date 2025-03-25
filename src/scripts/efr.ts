import { assert } from "tsafe/assert";
import type { MergedSkills, Skill } from "./skill";

export interface baseEFR {
    attack: number;
    affinity: number;
    skills: MergedSkills,
}

export type EfrInfo = {
    efr: number;
    attack: number;
    affinity: number;
    // critMult: number;
};

export function efr(base: baseEFR): EfrInfo {
    let attack = base.attack;
    let affinity = base.affinity;

    let attack_multiplier = 0;
    let critical_multiplier = 25;

    const agitator = base.skills.Agitator;
    if (agitator !== undefined) {
        assert(agitator <= 5 && agitator >= 1);
        attack += agitator* 4;
        affinity += ([3, 5, 7, 10, 15][agitator - 1] as number) / 100;
    }

    const wex = base.skills["Weakness Exploit"];
    if (wex !== undefined) {
        assert(wex <= 5 && wex >= 1);
        affinity += ([5, 10, 15, 20, 30][wex - 1] as number) / 100;
    }

    const attack_boost = base.skills["Attack Boost"];
    if (attack_boost !== undefined) {
        assert(attack_boost <= 5 && attack_boost >= 1);
        switch (attack_boost) {
            case 1:
                attack += 3;
                break;
            case 2:
                attack += 5;
                break;
            case 3:
                attack += 7;
                break;
            case 4:
                attack += 8;
                attack_multiplier += 2 / 100;
                break;
            case 5:
                attack += 9;
                attack_multiplier += 4 / 100;
                break;
        }
    }

    const critical_eye = base.skills["Critical Eye"];
    if (critical_eye !== undefined) {
        assert(critical_eye <= 5 && critical_eye >= 1);
        affinity += critical_eye * 4;
    }

    const critical_boost = base.skills["Critical Boost"];
    if (critical_boost !== undefined) {
        assert(critical_boost <= 3 && critical_boost >= 1);
        critical_multiplier = ([28, 31, 34, 37, 40][critical_boost] as number) / 100;
    }

    // Apply attack multiplier
    attack = attack * (1 + attack_multiplier);

    // Calculate EFR
    const res = attack * (1 - affinity) + attack * affinity * (1 + critical_multiplier/100);

    return {
        efr: res,
        attack: attack,
        affinity,
    };
}
