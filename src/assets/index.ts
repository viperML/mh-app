import type { WeaponKind } from "../scripts/weapon";
import _bow from "./bow-png-150x150.png";
import _chargeblade from "./chargeblade-png-150x150.png";
import _dual_blades from "./dual-blades-png-150x150.png";
import _greatsword from "./greatsword-png-150x150.png";
import _gunlance from "./gunlance-png-150x150.png";
import _hammer from "./hammer-png-150x150.png";
import _heavy_bowgun from "./heavy-bowgun-png-150x150.png";
import _hunting_horn from "./hunting-horn-png-150x150.png";
import _insect_glaive from "./insect-glaive-150x150.png";
import _lance from "./lance-png.png";
import _light_bowgun from "./light-bowgun-png-150x150.png";
import _long_sword from "./longsword-png-150x150.png";
import _switch_axe from "./switch-axe-png-150x150.png";
import _sword_shield from "./sword-and-shield-png-150x150.png";

export const weaponIcon: Record<WeaponKind, ImageMetadata> = {
    bow: _bow,
    "charge-blade": _chargeblade,
    "dual-blades": _dual_blades,
    "great-sword": _greatsword,
    gunlance: _gunlance,
    hammer: _hammer,
    "heavy-bowgun": _heavy_bowgun,
    "hunting-horn": _hunting_horn,
    "insect-glaive": _insect_glaive,
    lance: _lance,
    "light-bowgun": _light_bowgun,
    "long-sword": _long_sword,
    "switch-axe": _switch_axe,
    "sword-shield": _sword_shield,
};
