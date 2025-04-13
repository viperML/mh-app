import { expect, test } from "vitest";
import { efr } from "./efr";
import { mergeSkillRanks, type SkillRank2 } from "./skill";

function fakeSkill(name: string, level: number): SkillRank2 {
    return {
        level,
        skill: {
            name,
            id: 0,
            description: "FIXME",
            kind: "armor",
        },
    };
}

test("merge skills", () => {
    expect(
        mergeSkillRanks(fakeSkill("Weakness Exploit", 3), fakeSkill("Agitator", 4), fakeSkill("Agitator", 1)),
    ).toMatchSnapshot();
});

function testSkill(...skills: SkillRank2[]) {
    // Create a test name from all the skills
    const name = skills.map(rank => `${rank.skill.name}@${String(rank.level)}`).join("+");

    test(`Skills: ${name}`, () => {
        expect(
            efr({
                attack: 100,
                affinity: 0,
                skills: mergeSkillRanks(...skills),
            }),
        ).toMatchSnapshot();
    });
}

testSkill();

testSkill(fakeSkill("Agitator", 5));
testSkill(fakeSkill("Weakness Exploit", 5));
testSkill(fakeSkill("Critical Eye", 5));
