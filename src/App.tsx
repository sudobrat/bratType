import { useState } from "react";
import InstallPage from "./pages/InstallPage";
import LearnPage from "./pages/LearnPage";
import PracticePage from "./pages/PracticePage";
import KeyboardLayout from "./components/KeyboardLayout";

type Tab = "install" | "learn" | "practice";

export default function App() {
    const [tab, setTab] = useState<Tab>("practice");
    const [showLayout, setShowLayout] = useState(false);

    return (
        <div
            className="min-h-full flex flex-col"
            style={{ background: "#0C0C0C", fontFamily: "'JetBrains Mono', monospace" }}>
            <header style={{ borderBottom: "1px solid #2A2A2A" }}>
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span
                            style={{ color: "#4EC994", fontSize: "1.1rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
                            brat<span style={{ color: "#F7F3E3" }}>Type</span>
                        </span>
                        <span style={{ color: "#706677", fontSize: "0.7rem", paddingTop: "2px" }}>v1.0</span>
                    </div>
                    <nav className="flex items-center gap-1 relative">
                        <div
                            onMouseEnter={() => setShowLayout(true)}
                            onMouseLeave={() => setShowLayout(false)}
                            style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "0.78rem",
                                padding: "6px 14px",
                                borderRadius: "4px",
                                color: "#706677",
                                cursor: "default",
                                transition: "all 0.15s",
                            }}>
                            00_layout
                            {showLayout && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "100%",
                                        right: 0,
                                        zIndex: 50,
                                        marginTop: "12px",
                                    }}>
                                    <KeyboardLayout />
                                </div>
                            )}
                        </div>
                        {(["install", "learn", "practice"] as Tab[]).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: "0.78rem",
                                    padding: "6px 14px",
                                    borderRadius: "4px",
                                    border: "none",
                                    cursor: "pointer",
                                    transition: "all 0.15s",
                                    background: tab === t ? "#1C1C1C" : "transparent",
                                    color: tab === t ? "#F7F3E3" : "#706677",
                                    fontWeight: tab === t ? 600 : 400,
                                }}>
                                {t === "install" ? "01_install" : t === "learn" ? "02_learn" : "03_practice"}
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                {tab === "install" && <InstallPage />}
                {tab === "learn" && <LearnPage />}
                {tab === "practice" && <PracticePage />}
            </main>

            <footer style={{ borderTop: "1px solid #2A2A2A", padding: "14px 24px" }}>
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <span style={{ color: "#706677", fontSize: "0.7rem" }}>bratType — custom layout trainer</span>
                    <a
                        href="https://github.com/sudobrat/Programming-Dvorak-Layout"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "#706677", fontSize: "0.7rem", textDecoration: "none" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#F7F3E3")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#706677")}>
                        github ↗
                    </a>
                </div>
            </footer>
        </div>
    );
}
