import { test } from "vitest";
import { getDecorations } from "./decorations";
import { getSkills } from "./skill";
import util from "node:util";
import { getArmors } from "./api";

test("Skills", async () => {
    const skills = await getSkills();
    console.log(util.inspect(skills, { depth: null }));
});

test("Decorations", async () => {
    const skills = await getSkills();
    const decorations = await getDecorations(skills);
    console.log(util.inspect(decorations, { depth: null }));
});

test("Armor", async () => {
    const skills = await getSkills();
    const armors = await getArmors(skills);
    console.log(util.inspect(armors, { depth: null }));
});
