import type { ArmorKind } from "../scripts/api";

import ArmsIcon from "./arms_armor_icons_mhw_wiki_guide.png";
import ChestIcon from "./chest_armor_icons_mhw_wiki_guide.png";
import HeadIcon from "./head_armor_icons_mhw_wiki_guide.png";
import LegsIcon from "./legs_armor_icons_mhw_wiki_guide.png";
import WaistIcon from "./waist_armor_icons_mhw_wiki_guide.png";
import CharmIcon from "./talisman.3bd90f20.png";

const icons: Record<ArmorKind, ImageMetadata> = {
    charm: CharmIcon,
    arms: ArmsIcon,
    chest: ChestIcon,
    head: HeadIcon,
    legs: LegsIcon,
    waist: WaistIcon,
};

export default icons;
