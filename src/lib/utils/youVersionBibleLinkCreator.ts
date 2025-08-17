// KJV short codes used by bible.com
const BOOK_CODE = new Map<string, string>([
  ["Genesis","gen"],["Exodus","exo"],["Leviticus","lev"],["Numbers","num"],["Deuteronomy","deu"],
  ["Joshua","jos"],["Judges","jdg"],["Ruth","rut"],["1 Samuel","1sa"],["2 Samuel","2sa"],
  ["1 Kings","1ki"],["2 Kings","2ki"],["1 Chronicles","1ch"],["2 Chronicles","2ch"],
  ["Ezra","ezr"],["Nehemiah","neh"],["Esther","est"],["Job","job"],["Psalm","psa"],["Proverbs","pro"],
  ["Ecclesiastes","ecc"],["Song of Solomon","sng"],["Isaiah","isa"],["Jeremiah","jer"],
  ["Lamentations","lam"],["Ezekiel","ezk"],["Daniel","dan"],["Hosea","hos"],["Joel","jol"],
  ["Amos","amo"],["Obadiah","oba"],["Jonah","jon"],["Micah","mic"],["Nahum","nam"],
  ["Habakkuk","hab"],["Zephaniah","zep"],["Haggai","hag"],["Zechariah","zec"],["Malachi","mal"],
  ["Matthew","mat"],["Mark","mrk"],["Luke","luk"],["John","jhn"],["Acts","act"],["Romans","rom"],
  ["1 Corinthians","1co"],["2 Corinthians","2co"],["Galatians","gal"],["Ephesians","eph"],
  ["Philippians","php"],["Colossians","col"],["1 Thessalonians","1th"],["2 Thessalonians","2th"],
  ["1 Timothy","1ti"],["2 Timothy","2ti"],["Titus","tit"],["Philemon","phm"],["Hebrews","heb"],
  ["James","jas"],["1 Peter","1pe"],["2 Peter","2pe"],["1 John","1jn"],["2 John","2jn"],
  ["3 John","3jn"],["Jude","jud"],["Revelation","rev"]
]);

const SINGLE_CHAPTER = new Set(["Obadiah","Philemon","2 John","3 John","Jude"]);

/**
 * Build a bible.com link from a textual reference.
 * Returns an empty string if it cannot parse a sensible target.
 * translation: 'KJV' by default; change if needed (e.g. 'ESV').
 */
export function toBibleLink(raw: string, translation = "KJV"): string {
  if (!raw) return "";

  // Normalize
  let s = raw
    .replace(/\s+/g, " ")
    .replace(/^Psalms\b/i, "Psalm") // normalize Psalms → Psalm
    .trim();

  // Full pattern: Book [Chapter] [:Verse[-Range]]
  // Examples it matches:
  // - "John 3"
  // - "John 3:16"
  // - "1 John 2:1-3"
  // - "3 John 11"          (special case below)
  // - "Jude 5–7"           (en dash ok)
  const m = s.match(/^((?:[1-3]\s)?[A-Za-z]+(?:\s(?:of|the)\s[A-Za-z]+)?)\s+(\d+)(?::(\d+)(?:[-–]\d+)?)?$/);

  // If match failed, try single-chapter pattern: Book + Verse
  // e.g., "3 John 11", "Jude 5", "Philemon 6"
  if (!m) {
    const ms = s.match(/^((?:[1-3]\s)?[A-Za-z]+(?:\s(?:of|the)\s[A-Za-z]+)?)\s+(\d+)$/);
    if (ms) {
      const bookName = tidyBook(ms[1]);
      if (SINGLE_CHAPTER.has(bookName)) {
        const code = BOOK_CODE.get(bookName);
        if (!code) return "";
        const verse = ms[2];
        // chapter is always 1 for single-chapter books
        return `https://www.bible.com/bible/1/${code}.1.${verse}.${translation}`;
      }
    }
    return "";
  }

  const bookName = tidyBook(m[1]);
  const chapter = m[2];
  const verse = m[3]; // may be undefined
  const code = BOOK_CODE.get(bookName);
  if (!code) return "";

  // Single-chapter books: if a "chapter" was provided, it’s actually the verse
  if (SINGLE_CHAPTER.has(bookName)) {
    const v = verse ?? chapter; // treat "Book 11" or "Book 1:11" the same → verse 11
    return `https://www.bible.com/bible/1/${code}.1.${v}.${translation}`;
  }

  // Multi-chapter: include verse if present; otherwise link to chapter
  return verse
    ? `https://www.bible.com/bible/1/${code}.${chapter}.${verse}.${translation}`
    : `https://www.bible.com/bible/1/${code}.${chapter}.${translation}`;
}

function tidyBook(name: string): string {
  return name
    .replace(/\s+/g, " ")
    .replace(/\bof the\b/i, "of the") // keep casing consistent
    .replace(/\bof\b/i, "of")
    .replace(/\bthe\b/i, "the")
    .trim()
    // Capitalize first letters of simple words if someone passes lowercase
    .replace(/\b[a-z]/g, (c) => c.toUpperCase());
}
