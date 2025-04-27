import { assert } from "tsafe/assert";
import type { SkillRank } from "./skill";

export interface EfrInput {
    attack: number;
    affinity: number;
    skills: SkillRank[];
}

export interface EfrInfo {
    effective_raw: number;
    attack: number;
    affinity: number;
    // critMult: number;
}

export function efr(input: EfrInput): EfrInfo {
    let attack = input.attack;
    let affinity = input.affinity;

    let attack_multiplier = 0;
    let critical_multiplier = 25;

    function handle(skillName: string, cb: (level: number) => undefined) {
        const level = input.skills.find(sr => sr.skill.name === skillName)?.level;
        if (level !== undefined) cb(level);
    }

    // https://monsterhunterwilds.wiki.fextralife.com/SkillsA

    /**
     * Attack Skills
     */
    handle("Attack Boost", attack_boost => {
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
    });
    handle("Resentment", level => {
        attack += level * 5;
    });
    // Adrenaline Rush
    // Offensive Guard
    handle("Peak Performance", level => {
        switch (level) {
            case 1:
                attack += 3;
                break;
            case 2:
                attack += 6;
                break;
            case 3:
                attack += 10;
                break;
            case 4:
                attack += 15;
                break;
            case 5:
                attack += 20;
                break;
        }
    });
    // Counterstrike
    handle("Weakness Exploit", wex => {
        assert(wex <= 5 && wex >= 1);
        affinity += ([5, 10, 15, 20, 30][wex - 1] as number) / 100;
    });
    handle("Maximum Might", max_might => {
        assert(max_might >= 1 && max_might <= 3);
        affinity += max_might / 10;
    });

    /**
     * Affinity
     */
    handle("Critical Boost", critical_boost => {
        assert(critical_boost <= 3 && critical_boost >= 1);
        critical_multiplier = ([28, 31, 34, 37, 40][critical_boost] as number) / 100;
    });
    handle("Critical Eye", critical_eye => {
        assert(critical_eye <= 5 && critical_eye >= 1);
        affinity += (critical_eye * 4) / 100;
    });
    // Critical Draw

    /**
     * Offensive
     */
    handle("Agitator", agitator => {
        assert(agitator <= 5 && agitator >= 1);
        attack += agitator * 4;
        affinity += ([3, 5, 7, 10, 15][agitator - 1] as number) / 100;
    });

    // Apply attack multiplier
    attack = attack * (1 + attack_multiplier);

    // Calculate EFR
    const res = attack * (1 - affinity) + attack * affinity * (1 + critical_multiplier / 100);

    return {
        effective_raw: res,
        attack: attack,
        affinity,
    };
}
