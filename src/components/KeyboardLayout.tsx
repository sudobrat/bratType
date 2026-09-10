
import { createContext, useContext } from "react";

const HighlightContext = createContext<string[] | undefined>(undefined);

const u = (val: number) => `${val * 44 + (val - 1) * 6}px`;

const Key = ({ top, bottom, label, unit = 1, isDark = false }: any) => {
    const highlightKeys = useContext(HighlightContext);
    const hasHighlightKeys = highlightKeys !== undefined;
    let isHighlighted = false;

    if (hasHighlightKeys && highlightKeys.length > 0) {
        const check = (val?: string) => {
            if (!val) return false;
            return highlightKeys.includes(val) || highlightKeys.includes(val.toLowerCase()) || highlightKeys.includes(val.toUpperCase());
        };
        if (check(label) || check(top) || check(bottom)) {
            isHighlighted = true;
        }
    }

    let bg = isDark ? "#141414" : "#1C1C1C";
    let border = "1px solid #2A2A2A";
    let opacity = hasHighlightKeys ? (isHighlighted ? 1 : 0.3) : 1;

    if (isHighlighted) {
        bg = "#1A1525";
        border = "1px solid #C678DD";
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: u(unit),
                height: "44px",
                background: bg,
                border: border,
                borderRadius: "4px",
                padding: "4px",
                boxSizing: "border-box",
                userSelect: "none",
                opacity: opacity,
                transition: "all 0.2s",
            }}>
            {label !== undefined ? (
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: isHighlighted ? "#C678DD" : (isDark ? "#706677" : "#F7F3E3") }}>{label}</span>
            ) : (
                <>
                    <span style={{ color: isHighlighted ? "#C678DD" : "#706677", fontSize: "0.7rem", lineHeight: 1 }}>{top}</span>
                    <span style={{ color: isHighlighted ? "#F7F3E3" : "#F7F3E3", fontSize: "0.85rem", lineHeight: 1, marginTop: "4px" }}>{bottom}</span>
                </>
            )}
        </div>
    );
};

export default function KeyboardLayout({ highlightKeys, style }: { highlightKeys?: string[], style?: React.CSSProperties }) {
    return (
        <HighlightContext.Provider value={highlightKeys}>
            <div
                style={{
                    background: "#0C0C0C",
                    border: "1px solid #2A2A2A",
                    borderRadius: "8px",
                    padding: "16px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    width: "max-content",
                    ...style,
                }}>
            {/* Row 1 */}
            <div style={{ display: "flex", gap: "6px" }}>
                <Key top="~" bottom="$" />
                <Key top="%" bottom="&" />
                <Key top="7" bottom="[" />
                <Key top="5" bottom="{" />
                <Key top="3" bottom="}" />
                <Key top="1" bottom="(" />
                <Key top="9" bottom="=" />
                <Key top="0" bottom="*" />
                <Key top="2" bottom=")" />
                <Key top="4" bottom="+" />
                <Key top="6" bottom="]" />
                <Key top="8" bottom="!" />
                <Key top="`" bottom="#" />
                <Key label="Caps Lock" unit={2} isDark />
            </div>

            {/* Row 2 */}
            <div style={{ display: "flex", gap: "6px" }}>
                <Key label="Tab" unit={1.5} isDark />
                <Key top=":" bottom=";" />
                <Key top="<" bottom="," />
                <Key top=">" bottom="." />
                <Key label="P" />
                <Key label="Y" />
                <Key label="F" />
                <Key label="G" />
                <Key label="C" />
                <Key label="R" />
                <Key label="L" />
                <Key top="?" bottom="/" />
                <Key top="^" bottom="@" />
                <Key top="|" bottom="\\" unit={1.5} />
            </div>

            {/* Row 3 */}
            <div style={{ display: "flex", gap: "6px" }}>
                <Key label="Backspace" unit={1.75} isDark />
                <Key label="A" />
                <Key label="O" />
                <Key label="E" />
                <Key label="U" />
                <Key label="I" />
                <Key label="D" />
                <Key label="H" />
                <Key label="T" />
                <Key label="N" />
                <Key label="S" />
                <Key top="-" bottom="=" />
                <Key label="Enter" unit={2.25} isDark />
            </div>

            {/* Row 4 */}
            <div style={{ display: "flex", gap: "6px" }}>
                <Key label="Shift" unit={2.25} isDark />
                <Key top='"' bottom="'" />
                <Key label="Q" />
                <Key label="J" />
                <Key label="K" />
                <Key label="X" />
                <Key label="B" />
                <Key label="M" />
                <Key label="W" />
                <Key label="V" />
                <Key label="Z" />
                <Key label="Shift" unit={2.75} isDark />
            </div>

            {/* Row 5 */}
            <div style={{ display: "flex", gap: "6px" }}>
                <Key label="Ctrl" unit={1.25} isDark />
                <Key label="Win" unit={1.25} isDark />
                <Key label="Alt" unit={1.25} isDark />
                <Key label="" unit={6.25} />
                <Key label="Alt Gr" unit={1.25} isDark />
                <Key label="Win" unit={1.25} isDark />
                <Key label="Menu" unit={1.25} isDark />
                <Key label="Ctrl" unit={1.25} isDark />
            </div>
            
            <div style={{ color: "#706677", fontSize: "0.7rem", textAlign: "center", marginTop: "12px", fontFamily: "'JetBrains Mono', monospace" }}>
                <span style={{ color: "#C678DD" }}>Caps Lock</span> and <span style={{ color: "#4EC994" }}>Backspace</span> are swapped
            </div>
        </div>
        </HighlightContext.Provider>
    );
}
