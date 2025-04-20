
/**
 * Parses a string, possibly returning undefined.
 */
export function parseNumber(string: string): number | undefined {
    const res = Number(string);
    if (isNaN(res)) {
        return undefined;
    } else {
        return res;
    }
}
