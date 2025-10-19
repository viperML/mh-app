import * as api from "./src/scripts/api";
import fs from "node:fs/promises";
import path from "node:path";

const pairs: [string, () => Promise<any>][] = [
    ["skills.json", api.fetchSkills],
    ["armors.json", api.fetchArmors],
    ["weapons.json", api.fetchWeapons],
    ["decorations.json", api.fetchDecorations],
]

Promise.all(pairs.map(async ([filename, fetcher]) => {
    const data = await fetcher();
    const p = path.join("dist", "dump", filename);
    await fs.mkdir(path.dirname(p), { recursive: true });
    await fs.writeFile(p, JSON.stringify(data, null, 2), "utf-8");
}))
