import { expect, test } from "vitest";
import { fetchArmors, fetchCharms, fetchDecorations, fetchSkills, fetchWeapons } from "./api";

test("armors", fetchArmors);
test("charms", fetchCharms)
test("decorations", fetchDecorations);
test("skills", fetchSkills);
test("weapons", fetchWeapons);
