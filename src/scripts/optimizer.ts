import { type ArmorKind, type ArmorPiece } from "./api";
import { efr } from "./efr";
import { mergeSkills } from "./skill";

export interface OptimizeOptions {
    attack: number;
    affinity: number;
    // Context
    armors: ArmorPiece[];
}

export function optimize(options: OptimizeOptions) {
    // Split armors by kind
    const armorsByKind = new Map<ArmorKind, ArmorPiece[]>();
    for (const armor of options.armors) {
        const armors = armorsByKind.get(armor.kind);
        if (armors) {
            armors.push(armor);
        } else {
            armorsByKind.set(armor.kind, [armor]);
        }
    }

    const time0 = Date.now();
    let bestCombo: ArmorPiece[] = [];
    let maxEfr = 0;

    $outer: for (const headArmor of armorsByKind.get("head") ?? []) {
        for (const chestArmor of armorsByKind.get("chest") ?? []) {
            for (const armsArmor of armorsByKind.get("arms") ?? []) {
                for (const waistArmor of armorsByKind.get("waist") ?? []) {
                    for (const legsArmor of armorsByKind.get("legs") ?? []) {
                        for (const charmArmor of armorsByKind.get("charm") ?? []) {
                            const combo = [headArmor, chestArmor, armsArmor, waistArmor, legsArmor, charmArmor];
                            const mergedSkills = mergeSkills(combo.map(a => a.skills).flat());
                            console.log(combo)

                            const myEfr = efr({
                                attack: options.attack,
                                affinity: options.affinity,
                                skills: mergedSkills,
                            });

                            if (myEfr.effective_raw > maxEfr) {
                                bestCombo = combo;
                                maxEfr = myEfr.effective_raw;
                            }

                            break $outer;
                        }
                    }
                }
            }
        }
    }

    const elapsed = Date.now() - time0;
    console.log("Elapsed: ", elapsed);
    console.log("Max EFR: ", maxEfr);
    console.log("Best combo: ", bestCombo);

    return undefined;
}
