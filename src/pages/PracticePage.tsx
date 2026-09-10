import { useState, useEffect, useRef, useCallback } from "react";
import { SNIPPETS, LANGUAGES, LANGUAGE_COLORS, type Language } from "../data/snippets";

type State = "idle" | "running" | "done";

function pickSnippet(lang: Language): string {
    const list = SNIPPETS[lang];
    return list[Math.floor(Math.random() * list.length)];
}

export default function PracticePage() {
    const [lang, setLang] = useState<Language>("typescript");
    const [snippet, setSnippet] = useState(() => pickSnippet("typescript"));
    const [typed, setTyped] = useState("");
    const [state, setState] = useState<State>("idle");
    const [elapsed, setElapsed] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [isIdle, setIsIdle] = useState(false);
    const [tabToRestart, setTabToRestart] = useState(false);
    const [bestWpm, setBestWpm] = useState(() => {
        const stored = localStorage.getItem("bestWpm");
        return stored ? parseInt(stored, 10) : 0;
    });
    
    const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);

    const wpm = elapsed > 0 ? Math.round(typed.length / 5 / (elapsed / 60)) : 0;

    const accuracy = typed.length === 0 ? 100 : Math.round(((typed.length - mistakes) / typed.length) * 100);

    const reset = useCallback(
        (newLang?: Language) => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            const l = newLang ?? lang;
            setSnippet(pickSnippet(l));
            setTyped("");
            setState("idle");
            setElapsed(0);
            setMistakes(0);
            setIsIdle(false);
            setTabToRestart(false);
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
            containerRef.current?.focus();
        },
        [lang],
    );

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        };
    }, []);

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            if (e.key.length === 1 || e.key === "Backspace" || e.key === "Enter" || e.key === "Tab") {
                if (document.activeElement !== containerRef.current) {
                    containerRef.current?.focus();
                }
            }
        };
        window.addEventListener("keydown", handleGlobalKeyDown);
        return () => window.removeEventListener("keydown", handleGlobalKeyDown);
    }, []);

    useEffect(() => {
        if (state === "running" && !isIdle) {
            let lastTick = Date.now();
            intervalRef.current = setInterval(() => {
                const now = Date.now();
                setElapsed((e) => e + (now - lastTick) / 1000);
                lastTick = now;
            }, 100);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [state, isIdle]);

    useEffect(() => {
        if (state === "done" && wpm > bestWpm) {
            setBestWpm(wpm);
            localStorage.setItem("bestWpm", wpm.toString());
        }
    }, [state, wpm, bestWpm]);

    useEffect(() => {
        if (!cursorRef.current || state === "done") return;
        const target = document.getElementById(`char-${typed.length}`);
        if (target) {
            cursorRef.current.style.transform = `translate(${target.offsetLeft}px, ${target.offsetTop}px)`;
            cursorRef.current.style.height = `${target.offsetHeight}px`;
        }
    }, [typed.length, state, snippet]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (state === "done") {
            if (e.key === "Tab" || e.key === "Enter") {
                e.preventDefault();
                reset();
            }
            return;
        }
        if (e.ctrlKey || e.metaKey || e.altKey) return;

        if (e.key === "Escape") {
            reset();
            return;
        }

        if (e.key === "Tab") {
            e.preventDefault();
            setTabToRestart(true);
            return;
        }

        if (e.key === "Enter" && tabToRestart) {
            e.preventDefault();
            reset();
            return;
        }

        if (tabToRestart) {
            setTabToRestart(false);
        }

        if (e.key.length !== 1 && e.key !== "Backspace" && e.key !== "Enter") return;

        e.preventDefault();

        setIsIdle(false);
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        
        if (state === "idle") {
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
            setState("running");
        }

        idleTimerRef.current = setTimeout(() => {
            if (state === "running" || state === "idle") {
                // Actually, just set idle to true since typing hasn't happened.
                // We'll only show the blur overlay if state is running though.
                setIsIdle(true);
            }
        }, 3000); // 3 seconds of inactivity to blur

        if (e.key === "Backspace") {
            setTyped((t) => t.slice(0, -1));
            return;
        }

        const pos = typed.length;

        if (e.key === "Enter") {
            const remaining = snippet.slice(pos);
            const match = remaining.match(/^\n[ \t]*/);
            
            let next: string;
            if (match) {
                // Correct enter: automatically append newline and all following whitespace
                next = typed + match[0];
            } else {
                // Incorrect enter: log mistake and just add \n
                const expected = remaining.slice(0, 1);
                if ("\n" !== expected) setMistakes((m) => m + 1);
                next = typed + "\n";
            }
            
            setTyped(next);
            if (next.length >= snippet.length) {
                setState("done");
                if (intervalRef.current) clearInterval(intervalRef.current);
            }
            return;
        }

        const key = e.key;
        const expected = snippet.slice(pos, pos + key.length);
        if (key !== expected) {
            setMistakes((m) => m + 1);
        }

        const next = typed + key;
        setTyped(next);

        if (next.length >= snippet.length) {
            setState("done");
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="mb-10">
                <div style={{ color: "#706677", fontSize: "0.75rem", marginBottom: "8px", letterSpacing: "0.1em" }}>
                    SECTION 03
                </div>
                <h1
                    style={{
                        fontSize: "2.2rem",
                        fontWeight: 700,
                        color: "#F7F3E3",
                        letterSpacing: "-0.03em",
                        lineHeight: 1.1,
                        marginBottom: "16px",
                    }}>
                    practice with
                    <br />
                    <span style={{ color: "#61AFEF" }}>real code</span>
                </h1>
                <p style={{ color: "#706677", fontSize: "0.85rem", maxWidth: "480px", lineHeight: 1.7 }}>
                    Type actual code snippets from popular languages. Speed and accuracy tracked live.
                </p>
            </div>

            {/* Language picker */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
                {LANGUAGES.map((l) => (
                    <button
                        key={l}
                        onClick={() => {
                            setLang(l);
                            reset(l);
                        }}
                        style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.78rem",
                            padding: "6px 14px",
                            borderRadius: "4px",
                            border: `1px solid ${lang === l ? LANGUAGE_COLORS[l] : "#2A2A2A"}`,
                            cursor: "pointer",
                            background: lang === l ? "#1C1C1C" : "transparent",
                            color: lang === l ? LANGUAGE_COLORS[l] : "#706677",
                            fontWeight: lang === l ? 600 : 400,
                            transition: "all 0.15s",
                        }}>
                        {l}
                    </button>
                ))}
            </div>

            {/* macOS Window Container */}
            <div style={{
                background: "#0F0F0F",
                border: "1px solid #2A2A2A",
                borderRadius: "8px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
                overflow: "hidden"
            }}>
                {/* Title bar */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 16px",
                    background: "#1C1C1C",
                    borderBottom: "1px solid #2A2A2A"
                }}>
                    {/* Traffic lights */}
                    <div style={{ display: "flex", gap: "8px", marginRight: "32px" }}>
                        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#FF5F56" }} />
                        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#FFBD2E" }} />
                        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#27C93F" }} />
                    </div>

                    {/* Stats */}
                    <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                        <StatItem label="WPM" value={state === "idle" ? "—" : `${wpm}`} color="#61AFEF" />
                        <StatItem label="BEST WPM" value={`${bestWpm}`} color="#E5C07B" />
                        <StatItem
                            label="ACC"
                            value={state === "idle" ? "—" : `${accuracy}%`}
                            color={accuracy >= 90 ? "#4EC994" : "#E06C75"}
                        />
                        <StatItem label="TIME" value={state === "idle" ? "—" : `${elapsed.toFixed(1)}s`} color="#F7F3E3" />
                        <StatItem
                            label="ERRORS"
                            value={state === "idle" ? "—" : `${mistakes}`}
                            color={mistakes === 0 ? "#4EC994" : "#E06C75"}
                        />
                    </div>

                    <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
                        {state === "done" && (
                            <button
                                onClick={() => reset()}
                                style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: "0.78rem",
                                    padding: "6px 14px",
                                    borderRadius: "4px",
                                    border: "none",
                                    cursor: "pointer",
                                    background: "#4EC994",
                                    color: "#0C0C0C",
                                    fontWeight: 700,
                                }}>
                                next snippet →
                            </button>
                        )}
                        <button
                            onClick={() => reset()}
                            style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "0.78rem",
                                padding: "6px 14px",
                                borderRadius: "4px",
                                border: `1px solid ${tabToRestart ? "#F7F3E3" : "#2A2A2A"}`,
                                cursor: "pointer",
                                background: tabToRestart ? "#F7F3E3" : "transparent",
                                color: tabToRestart ? "#0C0C0C" : "#706677",
                                transition: "all 0.15s",
                                fontWeight: tabToRestart ? 600 : 400,
                            }}>
                            {tabToRestart ? "enter to reset" : "↺ reset"}
                        </button>
                    </div>
                </div>

                {/* Typing area */}
                <div
                    ref={containerRef}
                    tabIndex={0}
                    onKeyDown={handleKeyDown}
                    onClick={() => containerRef.current?.focus()}
                    style={{
                        outline: "none",
                        padding: "32px",
                        cursor: "text",
                        position: "relative",
                        minHeight: "160px"
                    }}>
                {/* Language badge */}
                <div
                    style={{
                        position: "absolute",
                        top: "16px",
                        right: "20px",
                        color: LANGUAGE_COLORS[lang],
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                    }}>
                    {lang}
                </div>

                    {/* Code display */}
                <pre
                    style={{
                        position: "relative",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.92rem",
                        lineHeight: 1.8,
                        margin: 0,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                        filter: isIdle && state === "running" ? "blur(4px)" : "none",
                        transition: "filter 0.3s",
                    }}>
                    {state !== "done" && (
                        <div
                            ref={cursorRef}
                            style={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                width: "2px",
                                background: "#61AFEF",
                                transition: "transform 0.1s ease-out",
                                pointerEvents: "none",
                                zIndex: 10,
                                opacity: isIdle ? 0 : 1,
                            }}
                        />
                    )}
                    {snippet.split("").map((ch, i) => {
                        const isTyped = i < typed.length;
                        const isCorrect = isTyped && typed[i] === ch;
                        const isWrong = isTyped && typed[i] !== ch;

                        return (
                            <span
                                key={i}
                                id={`char-${i}`}
                                style={{
                                    color: isCorrect ? "#F7F3E3" : isWrong ? "#E06C75" : "#3A3A3A",
                                    background: isWrong ? "rgba(224,108,117,0.12)" : "transparent",
                                    transition: "color 0.05s",
                                }}>
                                {ch}
                            </span>
                        );
                    })}
                </pre>

                {/* Done overlay */}
                {state === "done" && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(12,12,12,0.88)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "16px",
                        }}>
                        <div style={{ color: "#4EC994", fontSize: "1rem", fontWeight: 700 }}>✓ snippet complete</div>
                        <div style={{ display: "flex", gap: "32px" }}>
                            <ResultStat label="WPM" value={`${wpm}`} />
                            <ResultStat label="Accuracy" value={`${accuracy}%`} />
                            <ResultStat label="Time" value={`${elapsed.toFixed(1)}s`} />
                            <ResultStat label="Errors" value={`${mistakes}`} />
                        </div>
                        <button
                            onClick={() => reset()}
                            style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                marginTop: "8px",
                                background: "#4EC994",
                                color: "#0C0C0C",
                                border: "none",
                                borderRadius: "4px",
                                padding: "10px 28px",
                                fontSize: "0.85rem",
                                fontWeight: 700,
                                cursor: "pointer",
                            }}>
                            next snippet →
                        </button>
                    </div>
                )}

                {/* Idle blur overlay */}
                {isIdle && state === "running" && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(15,15,15,0.4)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 10,
                        }}>
                        <div style={{ color: "#F7F3E3", fontSize: "1.2rem", fontWeight: 600 }}>Paused</div>
                        <div style={{ color: "#706677", fontSize: "0.85rem", marginTop: "8px" }}>Press any key to resume typing</div>
                    </div>
                )}

                {/* Idle hint */}
                {state === "idle" && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: "14px",
                            left: "28px",
                            color: "#3A3A3A",
                            fontSize: "0.72rem",
                        }}>
                        click here and start typing — esc to reset
                    </div>
                )}
            </div>
            </div>
        </div>
    );
}

function StatItem({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <div>
            <div style={{ color: "#706677", fontSize: "0.65rem", letterSpacing: "0.08em", marginBottom: "2px" }}>
                {label}
            </div>
            <div style={{ color, fontSize: "1rem", fontWeight: 700 }}>{value}</div>
        </div>
    );
}

function ResultStat({ label, value }: { label: string; value: string }) {
    return (
        <div style={{ textAlign: "center" }}>
            <div style={{ color: "#F7F3E3", fontSize: "1.6rem", fontWeight: 700 }}>{value}</div>
            <div style={{ color: "#706677", fontSize: "0.7rem", marginTop: "2px" }}>{label}</div>
        </div>
    );
}
