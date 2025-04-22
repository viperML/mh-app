export type Settings = {
    decorationDisplay: DecorationDisplay;
};

export type DecorationDisplay = "name" | "skills";

export function readSettings(): Settings {
    return {
        decorationDisplay: (localStorage.getItem("decoration-display") ?? "name") as DecorationDisplay,
    };
}
