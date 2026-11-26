/**
 * Person-name matching. Huly stores names as "Family,Given" ("Lý Đức,Huy"),
 * while people type them in display order ("Huy Lý Đức") or without the comma
 * ("Lý Đức Huy"). Comparing the bag of words, case-insensitively, lets any of
 * those forms find the person, without guessing when several people match.
 */
export interface NamedPerson { _id: string; name?: string; email?: string; }

export function nameWords(name: string): string[] {
    return name
        .normalize('NFC')
        .toLowerCase()
        .split(/[\s,]+/)
        .filter(Boolean)
        .sort();
}

function sameWords(a: string, b: string): boolean {
    const x = nameWords(a);
    const y = nameWords(b);
    return x.length > 0 && x.length === y.length && x.every((w, i) => w === y[i]);
}

/**
 * Exact `_id`, exact name or exact email wins. Otherwise every person whose
 * name has the same words in any order. The caller decides what to do with
 * zero or several matches.
 */
export function matchPersons<T extends NamedPerson>(persons: T[], input: string): T[] {
    const needle = input.trim();
    const lower = needle.toLowerCase();
    const exact = persons.filter((p) =>
        p._id === needle ||
        p.name?.toLowerCase() === lower ||
        p.email?.toLowerCase() === lower,
    );
    if (exact.length > 0) return exact;
    return persons.filter((p) => p.name && sameWords(p.name, needle));
}
