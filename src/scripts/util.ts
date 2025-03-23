
export function parseInt2(string: string): number | undefined {
    const res = parseInt(string);
    if (isNaN(res)) {
        return undefined;
    } else {
        return res;
    }
}
