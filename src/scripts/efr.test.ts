import { expect, test } from "vitest";
import { efr, type EfrInfo } from "./efr";
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
        ]),
    ).toEqual({
        Agitator: 5,
    });
});

interface TestSkill {
    skills: Skill[];
    expect: EfrInfo;
}

function testSkill(input: TestSkill) {
    // Create a test name from all the skills
    const name = input.skills.map(skill => `${skill.name} ${skill.level.toString()}`).join("+");

    test(name, () => {
        expect(
            efr({
                attack: 100,
                affinity: 0,
                skills: mergeSkills(input.skills),
            }),
        ).toMatchSnapshot();
    });
}

testSkill({
    skills: [],
    expect: {
        efr: 100,
        attack: 100,
        affinity: 0,
    },
});

testSkill({
    skills: [
        {
            id: 0,
            name: "Agitator",
            level: 5,
        },
    ],
    expect: {
        efr: 0,
        attack: 120,
        affinity: 0.15,
    },
});

testSkill({
    skills: [
        {
            id: 0,
            name: "Weakness Exploit",
            level: 5,
        },
    ],
    expect: {
        efr: 0,
        attack: 100,
        affinity: 0.3,
    },
});
