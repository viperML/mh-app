import { expect, test } from "vitest";
import { efr } from "./efr";
import { mergeSkills, type Skill } from "./skill";

test("merge skills", () => {
    expect(
        mergeSkills([
            {
                id: 0,
                name: "Agitator",
                level: 3,
            },
            {
                id: 0,
                name: "Agitator",
                level: 2,
            },
            {
                id: 0,
                name: "Weakness Exploit",
                level: 3,
            },
        ]),
    ).toMatchSnapshot();
});

function testSkill(skills: Skill[]) {
    // Create a test name from all the skills
    const name = skills.map(skill => `${skill.name} ${skill.level.toString()}`).join("+");

    test(`Skills: ${name}`, () => {
        expect(
            efr({
                attack: 100,
                affinity: 0,
                skills: mergeSkills(skills),
            }),
        ).toMatchSnapshot();
    });
}

testSkill([]);

testSkill([
    {
        id: 0,
        name: "Agitator",
        level: 5,
    },
]);

testSkill([
    {
        id: 0,
        name: "Weakness Exploit",
        level: 5,
    },
]);

testSkill([
    {
        id: 0,
        name: "Critical Eye",
        level: 5,
    },
]);
