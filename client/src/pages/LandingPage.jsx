import { Link } from "react-router-dom";
import {
  MapPinned, FilePlus2, ListChecks, ShieldCheck, AlertTriangle, History,
  Route, Radar, Activity, ArrowRight,
} from "lucide-react";
import AnimatedCounter from "../components/AnimatedCounter.jsx";

const STEPS = [
  { n: "Detect", desc: "Live map surfaces potholes, hazards, and accident-prone stretches as they're reported.", icon: Radar },
  { n: "Report", desc: "Snap a photo, pin the spot, and describe the issue in under a minute.", icon: FilePlus2 },
  { n: "Track", desc: "Follow your complaint from Submitted through to Resolved with a clear timeline.", icon: ListChecks },
  { n: "Travel Safely", desc: "Get routed around known hazards with a live route safety score.", icon: Route },
];

const FEATURES = [
  { title: "Pothole Detection", desc: "Severity-ranked markers pulled from citizen reports and road sensors.", icon: AlertTriangle },
  { title: "Road History", desc: "Multi-year condition trends, repairs, and incident charts per road.", icon: History },
  { title: "Smart Complaints", desc: "Structured reports with photo evidence and a trackable status timeline.", icon: ListChecks },
  { title: "Real-Time Location", desc: "One-tap GPS pinning for fast, accurate issue reporting.", icon: MapPinned },
  { title: "Alternative Routes", desc: "Automatic hazard-aware rerouting with a side-by-side safety comparison.", icon: Route },
  { title: "Safety Monitoring", desc: "A live safety score for your commute, built from real incident data.", icon: Activity },
];

const STATS = [
  { value: 1250, suffix: "+", label: "Issues Reported" },
  { value: 980, suffix: "+", label: "Issues Resolved" },
  { value: 320, suffix: "+", label: "Roads Monitored" },
  { value: 4500, suffix: "+", label: "Users" },
];

export default function LandingPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-signal-dark dark:text-signal-light bg-signal/10 rounded-full px-3 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
              Live across Mumbai · Navi Mumbai · Thane
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.08] tracking-tight mb-6">
              Smarter Roads.
              <br />
              Safer Journeys.
            </h1>
            <p className="text-base sm:text-lg text-asphalt-900/65 dark:text-mist-100/65 max-w-lg mb-9">
              Report potholes, monitor road conditions, explore road history, and find safer routes — all in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/map" className="btn-primary">
                Explore Map <ArrowRight size={16} />
              </Link>
              <Link to="/report" className="btn-secondary">
                Report a Road Issue
              </Link>
            </div>
          </div>

          {/* Signature visual: an animated route line stitching across a hazard field */}
          <div className="relative h-72 sm:h-96">
            <svg viewBox="0 0 480 360" className="w-full h-full">
              <defs>
                <linearGradient id="roadFade" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#17B890" />
                  <stop offset="100%" stopColor="#2F6FED" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="480" height="360" rx="28" className="fill-asphalt-900 dark:fill-asphalt-800" />
              {/* faint grid */}
              {Array.from({ length: 8 }).map((_, i) => (
                <line key={`v${i}`} x1={i * 60} y1="0" x2={i * 60} y2="360" stroke="#5FDCB8" opacity="0.06" />
              ))}
              {Array.from({ length: 6 }).map((_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 60} x2="480" y2={i * 60} stroke="#5FDCB8" opacity="0.06" />
              ))}
              {/* route path */}
              <path
                d="M40 300 C 120 300, 130 180, 200 170 S 300 90, 340 90 S 420 60, 440 40"
                fill="none"
                stroke="url(#roadFade)"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M40 300 C 120 300, 130 180, 200 170 S 300 90, 340 90 S 420 60, 440 40"
                fill="none"
                stroke="white"
                strokeOpacity="0.6"
                strokeWidth="1.5"
                strokeDasharray="2 10"
                strokeLinecap="round"
                className="animate-dash-move"
              />
              {/* hazard markers along the route */}
              {[
                { cx: 150, cy: 250, color: "#E13B3B" },
                { cx: 250, cy: 140, color: "#F2A93B" },
                { cx: 360, cy: 78, color: "#8B5CF6" },
              ].map((h, i) => (
                <g key={i}>
                  <circle cx={h.cx} cy={h.cy} r="16" fill={h.color} opacity="0.18" className="animate-pulse-ring" style={{ transformOrigin: `${h.cx}px ${h.cy}px` }} />
                  <circle cx={h.cx} cy={h.cy} r="6" fill={h.color} stroke="white" strokeWidth="2" />
                </g>
              ))}
              {/* start/end */}
              <circle cx="40" cy="300" r="6" fill="#17B890" stroke="white" strokeWidth="2" />
              <circle cx="440" cy="40" r="7" fill="#2F6FED" stroke="white" strokeWidth="2" />
              <text x="20" y="330" fill="#8E9BB3" fontSize="11" fontFamily="monospace">START</text>
              <text x="400" y="28" fill="#8E9BB3" fontSize="11" fontFamily="monospace">DEST</text>
            </svg>
            <div className="absolute -bottom-4 -left-4 card px-4 py-3 flex items-center gap-3 animate-float-slow">
              <ShieldCheck size={18} className="text-signal" />
              <div>
                <p className="text-xs text-asphalt-900/45 dark:text-mist-100/45 leading-none mb-1">Route Safety Score</p>
                <p className="font-display font-bold text-sm">91% Safe</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <h2 className="font-display font-bold text-2xl sm:text-3xl mb-2">How it works</h2>
        <p className="text-asphalt-900/55 dark:text-mist-100/55 mb-10">From spotting a hazard to a safer commute, in four steps.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((s, i) => (
            <div key={s.n} className="card p-6 relative">
              <span className="font-mono text-xs text-asphalt-900/30 dark:text-mist-100/30">0{i + 1}</span>
              <div className="w-11 h-11 rounded-xl bg-signal/10 text-signal-dark dark:text-signal-light flex items-center justify-center my-3">
                <s.icon size={20} />
              </div>
              <h3 className="font-display font-semibold mb-1.5">{s.n}</h3>
              <p className="text-sm text-asphalt-900/55 dark:text-mist-100/55">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-white dark:bg-asphalt-900/40 border-y border-asphalt-900/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <h2 className="font-display font-bold text-2xl sm:text-3xl mb-2">Key features</h2>
          <p className="text-asphalt-900/55 dark:text-mist-100/55 mb-10">Everything a modern road-safety platform needs.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="card p-6 hover:-translate-y-0.5 hover:shadow-glow transition-all duration-200">
                <div className="w-11 h-11 rounded-xl bg-route/10 text-route flex items-center justify-center mb-4">
                  <f.icon size={20} />
                </div>
                <h3 className="font-display font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm text-asphalt-900/55 dark:text-mist-100/55">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map((s) => (
            <div key={s.label} className="text-center card py-8">
              <p className="font-display font-bold text-3xl sm:text-4xl text-signal-dark dark:text-signal-light">
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </p>
              <p className="text-xs sm:text-sm text-asphalt-900/55 dark:text-mist-100/55 mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-24">
        <div className="card p-10 sm:p-14 text-center bg-gradient-to-br from-signal/10 via-transparent to-route/10">
          <h2 className="font-display font-bold text-2xl sm:text-3xl mb-3">Ready to make your commute safer?</h2>
          <p className="text-asphalt-900/60 dark:text-mist-100/60 mb-7 max-w-md mx-auto">
            Create a free account and start reporting, tracking, and routing around road hazards today.
          </p>
          <Link to="/register" className="btn-primary inline-flex">
            Get started <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
