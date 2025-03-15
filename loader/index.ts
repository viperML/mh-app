import type { ArmorInfo, RawArmor } from "../src/scripts/armor";

import raw from "./raw.json";
const rawTyped = raw as RawArmor[];

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

