import { assert, expect, test } from "vitest";
import { efr } from "./efr";
import { mergeSkillRanks, type SkillRank } from "./skill";

const ids: Record<string, number> = {};

function mkId(name: string): number {
    if (ids[name] === undefined) {
        ids[name] = Object.keys(ids).length;
    }
    return ids[name];
}

function s(name: string, level: number): SkillRank {
    return {
        level,
        skill: {
            name,
            id: mkId(name),
            kind: "armor",
            maxRank: -1,
            iconKind: "set",
        },
    };
}

function testSkill(...skills: SkillRank[]) {
    // Create a test name from all the skills
    const name = skills.map(rank => `${rank.skill.name}@${String(rank.level)}`).join("+");

    test(`Skills: ${name}`, () => {
        const mergedSkills = mergeSkillRanks(...skills);
        if (skills.length > 0) {
            assert(mergedSkills.length > 0);
        }
        expect([
            mergedSkills,
            efr({
                attack: 100,
                affinity: 0,
                skills: mergedSkills,
            }),
        ]).toMatchSnapshot();
    });
}

testSkill();

testSkill(s("Agitator", 5));
testSkill(s("Weakness Exploit", 5));
testSkill(s("Critical Eye", 5));
testSkill(s("Agitator", 3), s("Critical Eye", 5), s("Agitator", 2));
