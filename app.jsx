/* ============================================================
   app.jsx — mounts the Tweaks panel and applies choices to the
   vanilla landing page (CSS vars, copy, stampede speed, tape).
   ============================================================ */
const { useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "headline": "Every ticker. One click.",
  "accent": "#4ade80",
  "speed": 1,
  "tape": false,
  "showFree": true
}/*EDITMODE-END*/;

// accent presets — every accent shares chroma/lightness family, hue varies
const ACCENTS = {
  "#4ade80": { a: "#4ade80", a2: "#16a34a", deep: "#15803d", glow: "rgba(74,222,128,0.55)",  soft: "rgba(74,222,128,0.12)" },
  "#fbbf24": { a: "#fbbf24", a2: "#d97706", deep: "#b45309", glow: "rgba(251,191,36,0.50)",  soft: "rgba(251,191,36,0.12)" },
  "#38bdf8": { a: "#38bdf8", a2: "#2563eb", deep: "#1d4ed8", glow: "rgba(56,189,248,0.50)",  soft: "rgba(56,189,248,0.12)" },
  "#c084fc": { a: "#c084fc", a2: "#7c3aed", deep: "#6d28d9", glow: "rgba(192,132,252,0.50)", soft: "rgba(192,132,252,0.12)" }
};

// known headlines -> [lead, emphasised tail]
const HEADLINES = {
  "Every ticker. One click.": ["Every ticker.", "One click."],
  "Know what they said. Without watching.": ["Know what they said.", "Without watching."],
  "The signal, not the noise.": ["The signal,", "not the noise."],
  "Finance YouTube, decoded in 10 seconds.": ["Finance YouTube,", "decoded in 10s."]
};

function splitHeadline(str) {
  if (HEADLINES[str]) return HEADLINES[str];
  const parts = str.split(/(?<=\.)\s+/);
  if (parts.length >= 2) return [parts.slice(0, -1).join(" "), parts[parts.length - 1]];
  const words = str.trim().split(/\s+/);
  if (words.length > 2) { const tail = words.slice(-2).join(" "); return [words.slice(0, -2).join(" "), tail]; }
  return ["", str];
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    const root = document.documentElement;
    const ac = ACCENTS[t.accent] || ACCENTS["#4ade80"];
    root.style.setProperty("--accent", ac.a);
    root.style.setProperty("--accent-2", ac.a2);
    root.style.setProperty("--accent-deep", ac.deep);
    root.style.setProperty("--accent-glow", ac.glow);
    root.style.setProperty("--accent-soft", ac.soft);
    root.style.setProperty("--spd", t.speed);

    const h1 = document.querySelector(".hero h1");
    if (h1) {
      const [lead, tail] = splitHeadline(t.headline);
      h1.innerHTML = (lead ? lead + "<br>" : "") + '<span class="em">' + tail + "</span>";
    }

    const hero = document.querySelector(".hero");
    if (hero) hero.classList.toggle("show-tape", !!t.tape);

    document.querySelectorAll("[data-free]").forEach((el) => {
      el.style.display = t.showFree ? "" : "none";
    });
  }, [t]);

  return (
    <TweaksPanel>
      <TweakSection label="Stampede" />
      <TweakSlider
        label="Charge speed"
        value={t.speed} min={0.3} max={2.5} step={0.1} unit="×"
        onChange={(v) => setTweak("speed", v)}
      />
      <TweakToggle
        label="Ticker tape"
        value={t.tape}
        onChange={(v) => setTweak("tape", v)}
      />

      <TweakSection label="Headline" />
      <TweakSelect
        label="Preset"
        value={HEADLINES[t.headline] ? t.headline : "custom"}
        options={[...Object.keys(HEADLINES), "custom"]}
        onChange={(v) => { if (v !== "custom") setTweak("headline", v); }}
      />
      <TweakText
        label="Custom"
        value={t.headline}
        onChange={(v) => setTweak("headline", v)}
      />

      <TweakSection label="Brand" />
      <TweakColor
        label="Accent"
        value={t.accent}
        options={Object.keys(ACCENTS)}
        onChange={(v) => setTweak("accent", v)}
      />
      <TweakToggle
        label="Show 'free beta' badge"
        value={t.showFree}
        onChange={(v) => setTweak("showFree", v)}
      />
    </TweaksPanel>
  );
}

const mount = document.getElementById("tweaks-root");
ReactDOM.createRoot(mount).render(<App />);
