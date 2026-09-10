const steps = [
    {
        num: "01",
        title: "Download the layout file",
        desc: "Get the .klc (Keyboard Layout Creator) file from the GitHub repository below.",
        code: null,
    },
    {
        num: "02",
        title: "Install Microsoft Keyboard Layout Creator",
        desc: "Download MSKLC from Microsoft's official site if you don't have it already.",
        code: null,
    },
    {
        num: "03",
        title: "Load and build the layout",
        desc: "Open MSKLC → File → Load Source File → select the .klc file → Project → Build DLL and Setup Package.",
        code: null,
    },
    {
        num: "04",
        title: "Run the installer",
        desc: "Navigate to the generated folder and run setup.exe as Administrator.",
        code: "setup.exe",
    },
    {
        num: "05",
        title: "Activate the layout in Windows",
        desc: "Settings → Time & Language → Language → your language → Options → Add a keyboard → select the new layout.",
        code: null,
    },
    {
        num: "06",
        title: "Switch layouts",
        desc: "Use Win + Space to toggle between your default layout and the brat layout.",
        code: "Win + Space",
    },
];

export default function InstallPage() {
    return (
        <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="mb-12">
                <div style={{ color: "#706677", fontSize: "0.75rem", marginBottom: "8px", letterSpacing: "0.1em" }}>
                    SECTION 01
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
                    install the
                    <br />
                    <span style={{ color: "#4EC994" }}>brat layout</span>
                </h1>
                <p style={{ color: "#706677", fontSize: "0.85rem", maxWidth: "480px", lineHeight: 1.7 }}>
                    A custom keyboard layout optimized for programming ergonomics. Follow the steps below to get it
                    running on Windows.
                </p>
            </div>

            <div
                style={{
                    background: "#141414",
                    border: "1px solid #2A2A2A",
                    borderRadius: "6px",
                    padding: "20px 24px",
                    marginBottom: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                }}>
                <div>
                    <div style={{ color: "#706677", fontSize: "0.72rem", marginBottom: "4px" }}>REPOSITORY</div>
                    <div style={{ color: "#F7F3E3", fontSize: "0.88rem" }}>
                        github.com/sudobrat/Programming-Dvorak-Layout
                    </div>
                </div>
                <a
                    href="https://github.com/sudobrat/Programming-Dvorak-Layout"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        background: "#4EC994",
                        color: "#0C0C0C",
                        padding: "8px 20px",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#5DDBA5")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#4EC994")}>
                    view on github ↗
                </a>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {steps.map((step, i) => (
                    <div
                        key={step.num}
                        style={{
                            display: "grid",
                            gridTemplateColumns: "48px 1fr",
                            gap: "24px",
                            padding: "24px 0",
                            borderBottom: i < steps.length - 1 ? "1px solid #1C1C1C" : "none",
                        }}>
                        <div style={{ color: "#4EC994", fontSize: "0.75rem", fontWeight: 700, paddingTop: "3px" }}>
                            {step.num}
                        </div>
                        <div>
                            <div
                                style={{ color: "#F7F3E3", fontSize: "0.92rem", fontWeight: 600, marginBottom: "6px" }}>
                                {step.title}
                            </div>
                            <div style={{ color: "#706677", fontSize: "0.82rem", lineHeight: 1.6 }}>{step.desc}</div>
                            {step.code && (
                                <code
                                    style={{
                                        display: "inline-block",
                                        marginTop: "8px",
                                        background: "#1C1C1C",
                                        border: "1px solid #2A2A2A",
                                        color: "#E5C07B",
                                        padding: "3px 10px",
                                        borderRadius: "3px",
                                        fontSize: "0.8rem",
                                    }}>
                                    {step.code}
                                </code>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div
                style={{
                    marginTop: "40px",
                    background: "#141414",
                    border: "1px solid #2A2A2A",
                    borderRadius: "6px",
                    padding: "20px 24px",
                }}>
                <div style={{ color: "#706677", fontSize: "0.72rem", marginBottom: "8px", letterSpacing: "0.08em" }}>
                    REQUIREMENTS
                </div>
                <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                    {["Windows 10 / 11", "MSKLC 1.4+", "Admin privileges", "~5 minutes"].map((req) => (
                        <span
                            key={req}
                            style={{
                                color: "#F7F3E3",
                                fontSize: "0.8rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                            }}>
                            <span style={{ color: "#4EC994" }}>✓</span> {req}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
