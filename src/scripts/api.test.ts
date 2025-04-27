import { describe, expectTypeOf, test } from "vitest";
import { type Decoration, getDecorations } from "./decorations";
import { getSkills, type Skill } from "./skill";
import { type ArmorPiece, getArmors } from "./api";
import { getWeapons, type WeaponPiece } from "./weapon";

let skills: Map<number, Skill> | undefined;

test.sequential("Skills", async () => {
    skills = await getSkills();
    for (const [, skill] of skills) {
        expectTypeOf(skill).toMatchObjectType<Skill>();
    }
});

test.sequential("Decorations", async () => {
    const decos = await getDecorations(skills!);
    for (const [, deco] of decos) {
        expectTypeOf(deco).toMatchObjectType<Decoration>();
    }
});

test.sequential("Armor", async () => {
    const armorPieces = await getArmors(skills!);
    for (const [, armorPiece] of armorPieces) {
        expectTypeOf(armorPiece).toMatchObjectType<ArmorPiece>();
    }
});

test.sequential("Weapons", async () => {
    const weapons = await getWeapons(skills!);
    console.log(weapons);
    for (const [, weapon] of weapons) {
        expectTypeOf(weapon).toMatchObjectType<WeaponPiece>();
    }
});
