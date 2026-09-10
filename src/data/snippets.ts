import { typescriptSnippets } from "./snippets/typescript";
import { javascriptSnippets } from "./snippets/javascript";
import { pythonSnippets } from "./snippets/python";
import { cppSnippets } from "./snippets/cpp";
import { rustSnippets } from "./snippets/rust";
import { goSnippets } from "./snippets/go";
import { englishSnippets } from "./snippets/english";

export type Language = "typescript" | "javascript" | "python" | "cpp" | "rust" | "go" | "english";

export const SNIPPETS: Record<Language, string[]> = {
    typescript: typescriptSnippets,
    javascript: javascriptSnippets,
    python: pythonSnippets,
    cpp: cppSnippets,
    rust: rustSnippets,
    go: goSnippets,
    english: englishSnippets,
};

export const LANGUAGE_COLORS: Record<Language, string> = {
    typescript: "#61AFEF",
    javascript: "#E5C07B",
    python: "#4EC994",
    cpp: "#C678DD",
    rust: "#E06C75",
    go: "#56B6C2",
    english: "#C8B8A2",
};

export const LANGUAGES: Language[] = ["typescript", "javascript", "python", "cpp", "rust", "go", "english"];
