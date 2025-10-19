import { test } from "vitest";
import * as api from "./api";

test("armors", api.fetchArmors);
test("charms", api.fetchCharms)
test("decorations", api.fetchDecorations);
test("skills", api.fetchSkills);
test("weapons", api.fetchWeapons);
