import { useState, useEffect, useCallback, useRef } from "react";
import KeyboardLayout from "../components/KeyboardLayout";

type Lesson = {
    id: string;
    title: string;
    subtitle: string;
    chars: string[];
};

const homeRow = ["a", "o", "e", "u", "i", "d", "h", "t", "n", "s"];
const homeRowCaps = [...homeRow, ...homeRow.map(c => c.toUpperCase())];

const upperRow = [";", ",", ".", "p", "y", "f", "g", "c", "r", "l", "/", "@", "\\"];
const upperRowCaps = [
    ";", ",", ".", "p", "y", "f", "g", "c", "r", "l", "/", "@", "\\",
    ":", "<", ">", "P", "Y", "F", "G", "C", "R", "L", "?", "^", "|"
];

const lowerRow = ["'", "q", "j", "k", "x", "b", "m", "w", "v", "z"];
const lowerRowCaps = [
    "'", "q", "j", "k", "x", "b", "m", "w", "v", "z",
    '"', "Q", "J", "K", "X", "B", "M", "W", "V", "Z"
];

const allLowercaseAbc = "abcdefghijklmnopqrstuvwxyz".split("");
const allAlphabets = [...allLowercaseAbc, ...allLowercaseAbc.map(c => c.toUpperCase())];

const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

const symbols = [
    "~", "$", "%", "&", "[", "]", "{", "}", "(", ")", "=", "*", "+", "!", "#", "`",
    ";", ":", ",", "<", ".", ">", "/", "?", "@", "^", "\\", "|",
    "-", "_", "'", '"'
];

const everything = [...allAlphabets, ...numbers, ...symbols];

const LESSONS: Lesson[] = [
    {
        id: "home-row",
        title: "Home Row",
        subtitle: "The foundation — keep fingers resting here",
        chars: homeRow,
    },
    {
        id: "home-row-caps",
        title: "Home Row w/ Caps",
        subtitle: "Add uppercase to the home row",
        chars: homeRowCaps,
    },
    {
        id: "upper-row",
        title: "Upper Row",
        subtitle: "Reach up from home row position",
        chars: upperRow,
    },
    {
        id: "upper-row-caps",
        title: "Upper Row w/ Caps",
        subtitle: "Add uppercase and shifted punctuation",
        chars: upperRowCaps,
    },
    {
        id: "lower-row",
        title: "Lower Row",
        subtitle: "Reach down from home row position",
        chars: lowerRow,
    },
    {
        id: "lower-row-caps",
        title: "Lower Row w/ Caps",
        subtitle: "Add uppercase to the lower row",
        chars: lowerRowCaps,
    },
    {
        id: "all-lowercase",
        title: "All Lowercase",
        subtitle: "All alphabet letters in lowercase",
        chars: allLowercaseAbc,
    },
    {
        id: "all-alphabets",
        title: "All Alphabets",
        subtitle: "Both uppercase and lowercase letters",
        chars: allAlphabets,
    },
    {
        id: "numbers",
        title: "Numbers",
        subtitle: "Shifted top row number keys",
        chars: numbers,
    },
    {
        id: "symbols",
        title: "Symbols",
        subtitle: "Punctuation and special characters",
        chars: symbols,
    },
    {
        id: "everything",
        title: "Everything",
        subtitle: "The ultimate typing challenge",
        chars: everything,
    },
];

function generatePrompt(chars: string[], length = 20): string[] {
    const result: string[] = [];
    for (let i = 0; i < length; i++) {
        result.push(chars[Math.floor(Math.random() * chars.length)]);
    }
    return result;
}

export default function LearnPage() {
    const [lessonIdx, setLessonIdx] = useState(0);
    const [prompt, setPrompt] = useState<string[]>([]);
    const [typed, setTyped] = useState<string[]>([]);
    const [mistakes, setMistakes] = useState(0);
    const [completed, setCompleted] = useState(0);
    const [done, setDone] = useState(false);
    
    const practiceAreaRef = useRef<HTMLDivElement>(null);

    const lesson = LESSONS[lessonIdx];

    const reset = useCallback((idx: number) => {
        setPrompt(generatePrompt(LESSONS[idx].chars));
        setTyped([]);
        setMistakes(0);
        setDone(false);
    }, []);

    useEffect(() => {
        reset(lessonIdx);
    }, [lessonIdx, reset]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (done) return;
            if (e.key === "Backspace") {
                setTyped((t) => t.slice(0, -1));
                return;
            }
            if (e.key.length !== 1) return;

            if (typed.length === 0) {
                practiceAreaRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }

            const pos = typed.length;
            if (pos >= prompt.length) return;

            const correct = e.key === prompt[pos];
            if (!correct) setMistakes((m) => m + 1);

            const next = [...typed, e.key];
            setTyped(next);

            if (next.length === prompt.length) {
                setCompleted((c) => c + 1);
                setDone(true);
                setTimeout(() => {
                    reset(lessonIdx);
                }, 1200);
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [typed, prompt, done, lessonIdx, reset]);

    const accuracy = typed.length === 0 ? 100 : Math.round(((typed.length - mistakes) / typed.length) * 100);

    return (
        <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="mb-10">
                <div style={{ color: "#706677", fontSize: "0.75rem", marginBottom: "8px", letterSpacing: "0.1em" }}>
                    SECTION 02
                </div>
                <h1
                    style={{
                        fontSize: "2rem",
                        fontWeight: 700,
                        color: "#F7F3E3",
                        letterSpacing: "-0.03em",
                        lineHeight: 1.1,
                        marginBottom: "12px",
                    }}>
                    learn the
                    <br />
                    <span style={{ color: "#C678DD" }}>brat layout</span>
                </h1>
                <p style={{ color: "#706677", fontSize: "0.85rem", maxWidth: "480px", lineHeight: 1.6 }}>
                    Build muscle memory one key group at a time. Type each character as it appears.
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "32px" }}>
                {/* Lesson selector */}
                <div>
                    <div style={{ color: "#706677", fontSize: "0.7rem", marginBottom: "10px", letterSpacing: "0.1em" }}>
                        LESSONS
                    </div>
                    {LESSONS.map((l, i) => (
                        <button
                            key={l.id}
                            onClick={() => {
                                setLessonIdx(i);
                                setCompleted(0);
                            }}
                            style={{
                                width: "100%",
                                textAlign: "left",
                                display: "block",
                                padding: "10px 12px",
                                marginBottom: "2px",
                                borderRadius: "4px",
                                border: "none",
                                cursor: "pointer",
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "0.78rem",
                                background: i === lessonIdx ? "#1C1C1C" : "transparent",
                                color: i === lessonIdx ? "#F7F3E3" : "#706677",
                                fontWeight: i === lessonIdx ? 600 : 400,
                                transition: "all 0.1s",
                            }}
                            onMouseEnter={(e) => {
                                if (i !== lessonIdx) e.currentTarget.style.color = "#C8B8A2";
                            }}
                            onMouseLeave={(e) => {
                                if (i !== lessonIdx) e.currentTarget.style.color = "#706677";
                            }}>
                            <span style={{ color: "#706677", marginRight: "8px", fontSize: "0.7rem" }}>
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            {l.title}
                        </button>
                    ))}
                </div>

                {/* Practice area */}
                <div ref={practiceAreaRef}>
                    <div
                        style={{
                            background: "#141414",
                            border: "1px solid #2A2A2A",
                            borderRadius: "6px",
                            padding: "32px",
                            marginBottom: "16px",
                        }}>
                        <div style={{ marginBottom: "16px" }}>
                            <span style={{ color: "#F7F3E3", fontSize: "0.9rem", fontWeight: 600 }}>
                                {lesson.title}
                            </span>
                            <span style={{ color: "#706677", fontSize: "0.78rem", marginLeft: "12px" }}>
                                {lesson.subtitle}
                            </span>
                        </div>

                        {/* Character keys */}
                        <div style={{ marginBottom: "24px", overflowX: "auto", overflowY: "hidden" }}>
                            <div style={{ transform: "scale(0.85)", transformOrigin: "top left", width: "max-content" }}>
                                <KeyboardLayout highlightKeys={lesson.chars} style={{ padding: "12px" }} />
                            </div>
                        </div>

                        {/* Prompt chars */}
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "4px",
                                minHeight: "80px",
                                marginBottom: "20px",
                            }}>
                            {prompt.map((ch, i) => {
                                const isTyped = i < typed.length;
                                const isCurrent = i === typed.length;
                                const isCorrect = isTyped && typed[i] === ch;
                                const isWrong = isTyped && typed[i] !== ch;

                                return (
                                    <span
                                        key={i}
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: "40px",
                                            height: "48px",
                                            fontSize: "1.4rem",
                                            fontWeight: 600,
                                            borderRadius: "4px",
                                            border: isCurrent ? "2px solid #C678DD" : "2px solid transparent",
                                            background: isCorrect ? "#1A2A1E" : isWrong ? "#2A1A1A" : "#1C1C1C",
                                            color: isCorrect
                                                ? "#4EC994"
                                                : isWrong
                                                  ? "#E06C75"
                                                  : isCurrent
                                                    ? "#F7F3E3"
                                                    : "#706677",
                                            transition: "all 0.1s",
                                        }}>
                                        {isWrong ? typed[i] : ch}
                                    </span>
                                );
                            })}
                        </div>

                        {done && (
                            <div style={{ color: "#4EC994", fontSize: "0.85rem", marginBottom: "8px" }}>
                                ✓ round complete — loading next...
                            </div>
                        )}

                        {/* Stats */}
                        <div style={{ display: "flex", gap: "24px" }}>
                            <div>
                                <div style={{ color: "#706677", fontSize: "0.7rem" }}>ACCURACY</div>
                                <div style={{ color: "#F7F3E3", fontSize: "1rem", fontWeight: 600 }}>
                                    {accuracy}
                                    <span style={{ color: "#706677", fontSize: "0.75rem" }}>%</span>
                                </div>
                            </div>
                            <div>
                                <div style={{ color: "#706677", fontSize: "0.7rem" }}>MISTAKES</div>
                                <div
                                    style={{
                                        color: mistakes > 0 ? "#E06C75" : "#4EC994",
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                    }}>
                                    {mistakes}
                                </div>
                            </div>
                            <div>
                                <div style={{ color: "#706677", fontSize: "0.7rem" }}>ROUNDS</div>
                                <div style={{ color: "#F7F3E3", fontSize: "1rem", fontWeight: 600 }}>{completed}</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ color: "#706677", fontSize: "0.72rem" }}>
                        <span style={{ color: "#C678DD" }}>hint</span> — focus on accuracy over speed. Backspace to
                        correct mistakes.
                    </div>
                </div>
            </div>
        </div>
    );
}
