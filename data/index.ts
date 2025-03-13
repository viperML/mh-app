import { readFileSync } from "fs";
import { Plugin } from "vite";
import fs from 'node:fs';

interface RawArmorData {
    indexRaw: string;
    index: number;
    nameRaw: string;
    name: string;
    typeRaw: string;
    type: string;
    seriesRaw: string;
    series: string;
    defenseRaw: string;
    defense: number;
    fireResRaw: string;
    fireRes: number;
    waterResRaw: string;
    waterRes: number;
    thunderResRaw: string;
    thunderRes: number;
    iceResRaw: string;
    iceRes: number;
    dragonResRaw: string;
    dragonRes: number;
    slot1Raw: string;
    slot1: number;
    slot2Raw: string;
    slot2: number;
    slot3Raw: string;
    slot3: number;
    seriesSkillRaw: string;
    groupSkillRaw: string;
    groupSkill: string;
    skill1Raw: string;
    skill1: string;
    skillLevel1Raw: string;
    skillLevel1: number;
    skill2Raw: string;
    skill2: string;
    skillLevel2Raw: string;
    skillLevel2: number;
    skill3Raw: string;
    skillLevel3Raw: string;
}

export type Skill = {
    name: string,
    level: number,
}

export type ArmorData = {
    name: string,
    type: "HELM",
    skills: Skill[],
    deco1Count: number,
    deco2Count: number,
    deco3Count: number,
}

export function parse(src: string): ArmorData[] {
    const raw: RawArmorData[] = JSON.parse(src)
    const res: ArmorData[] = []

    return []
}


function transformJsonPlugin(): Plugin {
  return {
    name: 'transform-json-plugin',
    enforce: 'pre',
    // resolveId(source) {
    //   if (source.endsWith('data.json')) {
    //     return source + '?transform';
    //   }
    //   return null;
    // },
    async load(id) {
      if (id.endsWith("armor.json")) {
        // const jsonContent = await fs.promises.readFile(id, 'utf-8');
        // const data = JSON.parse(jsonContent);

        // // Modify the data as needed
        // data.modified = true;
        let data = {}

        const tsContent = `export default ${JSON.stringify(data, null, 2)};`;
        const tsPath = id.replace('.json', '.ts');

        await fs.promises.writeFile(tsPath, tsContent, 'utf-8');

        return tsContent;
      }
      return null;
    },
  };
}

export default transformJsonPlugin;
