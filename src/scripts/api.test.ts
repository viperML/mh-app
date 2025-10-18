import { expect, test } from "vitest";
import { fetchArmors, fetchCharms, fetchDecorations, fetchSkills } from "./api";

test("armors", fetchArmors);
test("charms", fetchCharms)
test("decorations", fetchDecorations);
test("skills", fetchSkills);
