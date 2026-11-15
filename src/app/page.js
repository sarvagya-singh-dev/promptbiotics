'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  FileJson,
  CheckCircle2,
  Brain,
  Stethoscope,
  Shield,
  AlertCircle,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Logo } from './components/Logo';

// --- UTILS & HOOKS ---
const useTypewriter = (text, speed = 20, delay = 0) => {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed, started]);

  return displayedText;
};

// --- VISUAL COMPONENTS ---

const SectionLabel = ({ number, title }) => (
  <div className="flex items-center gap-2 mb-6">
    <span className="text-[var(--color-accent)] font-mono text-xs uppercase tracking-widest">{number}</span>
    <span className="text-[var(--color-telemetrySlate)] text-xs font-mono uppercase tracking-widest">{title}</span>
  </div>
);

const GlassCard = ({ children, className }) => (
  <div className={`bg-[var(--color-glass-trench)] border border-[var(--color-subtle-ridge)] rounded-[var(--radius-card)] p-6 ${className}`}>
    {children}
  </div>
);

const Stat = ({ label, value, sub }) => (
  <div>
    <div className="text-3xl font-bold text-[var(--color-text)] mb-1 tracking-tighter">{value}</div>
    <div className="text-[var(--color-accent)] font-mono text-xs uppercase tracking-widest">{label}</div>
    <div className="text-[var(--color-telemetrySlate)] text-[var(--text-xs)] mt-1">{sub}</div>
  </div>
);

// --- HEADER (Responsive Navbar) ---
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '#how-it-works', label: 'How it works' },
    { href: '#safety', label: 'Safety' },
    { href: '#confidence', label: 'Confidence' },
    { href: '/auth/signup', label: 'Start demo', isCta: true }
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-md transition-colors"
    >
      <div className="px-6 md:px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors"
        >
          <Logo size="md" />
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-[var(--text-xs)] font-mono uppercase">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => {
                setIsOpen(false);
                router.push(link.href);
              }}
              className={`text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors ${
                link.isCta
                  ? 'px-4 py-2 rounded-[var(--radius-control)] border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-black'
                  : ''
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Theme Toggle + Mobile Menu */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2 rounded-[var(--radius-control)] border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-50 bg-[var(--color-bg)]/90 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="md:hidden fixed inset-y-0 right-0 z-50 w-full md:w-80 bg-[var(--color-surface)] border-l border-[var(--color-border)] flex flex-col"
          >
            <div className="p-6 border-b border-[var(--color-border)]">
              <h3 className="font-bold text-[var(--color-text)] text-lg">Navigation</h3>
            </div>
            <nav className="flex-1 px-6 py-4 space-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => {
                    setIsOpen(false);
                    router.push(link.href);
                  }}
                  className={`text-left py-3 rounded-[var(--radius-control)] text-[var(--color-text)] font-mono text-sm ${
                    link.isCta
                      ? 'bg-[var(--color-accent)] text-black'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// --- FOOTER ---
const Footer = () => (
  <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] mt-auto">
    <div className="px-6 md:px-12 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-2 md:col-span-1">
          <Logo size="md" />
          <p className="text-[var(--color-telemetrySlate)] text-[var(--text-sm)] leading-relaxed max-w-xs">
            Real-time drug-nutrient interaction checking for T2DM, hypertension, and CKD patients.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-[var(--color-text)] mb-4 text-sm uppercase tracking-widest">Product</h4>
          <ul className="space-y-3 text-[var(--color-telemetrySlate)] text-[var(--text-xs)]">
            <li><a href="#" className="hover:text-[var(--color-text)] transition-colors">How it works</a></li>
            <li><a href="#" className="hover:text-[var(--color-text)] transition-colors">Safety guardrails</a></li>
            <li><a href="#" className="hover:text-[var(--color-text)] transition-colors">Confidence scoring</a></li>
            <li><a href="#" className="hover:text-[var(--color-text)] transition-colors">Pricing</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-[var(--color-text)] mb-4 text-sm uppercase tracking-widest">Company</h4>
          <ul className="space-y-3 text-[var(--color-telemetrySlate)] text-[var(--text-xs)]">
            <li><a href="#" className="hover:text-[var(--color-text)] transition-colors">About</a></li>
            <li><a href="https://drive.google.com/file/d/1rg1I4-He-EgzCPeyVw7RZdr-Nkgiaesw/view?usp=sharing" className="hover:text-[var(--color-text)] transition-colors">Research paper</a></li>
            <li><a href="#" className="hover:text-[var(--color-text)] transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-[var(--color-text)] transition-colors">Privacy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-[var(--color-text)] mb-4 text-sm uppercase tracking-widest">Legal</h4>
          <ul className="space-y-3 text-[var(--color-telemetrySlate)] text-[var(--text-xs)]">
            <li><a href="#" className="hover:text-[var(--color-text)] transition-colors">Terms of service</a></li>
            <li><a href="#" className="hover:text-[var(--color-text)] transition-colors">Disclaimer</a></li>
            <li><a href="#" className="hover:text-[var(--color-text)] transition-colors">FDA status</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[var(--color-telemetrySlate)] text-[var(--text-xs)]">
          PromptBiotics is a clinical decision support tool. Not a substitute for professional medical advice.
        </p>
        <div className="flex items-center gap-6 text-[var(--text-xs)] text-[var(--color-telemetrySlate)]">
          <span>v2.4.0</span>
          <span>&#169; 2026 PromptBiotics</span>
        </div>
      </div>
    </div>
  </footer>
);

// --- HERO SECTION (Wedge-First: specific claim, not product) ---
const Hero = () => {
  const router = useRouter();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <section className="pt-24 pb-16 px-6 md:px-12 relative border-b border-[var(--color-subtle-ridge)]">
      <div className="max-w-4xl mx-auto">
        <div className="inline-block border border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-3 py-1 font-mono text-[var(--text-xs)] mb-6">
          RESEARCH PREVIEW
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-6 text-[var(--color-text)]">
          PROMPT <br />
          <span className="text-[var(--color-telemetrySlate)]">BIOTICS.</span>
        </h1>

        <p className="text-[var(--text-lg)] text-[var(--color-text-muted)] max-w-2xl leading-relaxed mb-10">
          Real-time drug-nutrient interaction checking for Type 2 Diabetes, Hypertension, and CKD patients.
          We catch <strong className="text-[var(--color-text)]">Lisinopril + potassium</strong> before the prescription is signed, not after the lab results come back.
        </p>

        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={() => router.push('/auth/signup')}
            className="bg-[var(--color-accent)] text-black px-8 py-4 font-bold font-mono text-xs uppercase rounded-[var(--radius-control)] hover:opacity-90 transition-opacity"
          >
            Start Demo
          </button>
          <a href="https://drive.google.com/file/d/1rg1I4-He-EgzCPeyVw7RZdr-Nkgiaesw/view?usp=sharing" className="border border-[var(--color-border)] text-[var(--color-text)] px-8 py-4 font-mono text-xs uppercase rounded-[var(--radius-control)] hover:bg-[var(--color-surface)] transition-colors" target="_blank" rel="noopener noreferrer">
            Read the Paper
          </a>
        </div>

        <div className="mt-12 flex items-center gap-6 text-[var(--text-xs)] font-mono text-[var(--color-telemetrySlate)]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3 text-[var(--color-accent)]" />
            <span>98.5% safety recall</span>
          </div>
          <div className="w-px h-4 bg-[var(--color-border)]" />
          <div className="flex items-center gap-2">
            <span>298k+ USDA items</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- HOW IT WORKS (architecture from the paper) ---
const HowItWorks = () => (
  <section id="how-it-works" className="py-24 px-6 md:px-12 border-b border-[var(--color-subtle-ridge)]">
    <div className="max-w-4xl mx-auto">
      <SectionLabel number="01" title="SYSTEM ARCHITECTURE" />
      <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-12">Five components, one pipeline.</h2>

      <div className="grid md:grid-cols-3 gap-8">
        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-5 h-5 text-[var(--color-accent)]" />
            <span className="font-bold text-[var(--color-text)]">Fine-tuned LLM</span>
          </div>
          <p className="text-[var(--color-telemetrySlate)] text-[var(--text-sm)] leading-relaxed">
            Gemini 2.0 Flash fine-tuned on 3,847 clinical-nutritional examples via Google Cloud Vertex AI.
          </p>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <FileJson className="w-5 h-5 text-[var(--color-accent)]" />
            <span className="font-bold text-[var(--color-text)]">Confidence scoring</span>
          </div>
          <p className="text-[var(--color-telemetrySlate)] text-[var(--text-sm)] leading-relaxed">
            Multi-dimensional score across model confidence, coherence, medical validity, and safety.
          </p>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-[var(--color-accent)]" />
            <span className="font-bold text-[var(--color-text)]">Safety assessment</span>
          </div>
          <p className="text-[var(--color-telemetrySlate)] text-[var(--text-sm)] leading-relaxed">
            Rule-based checks for drug interactions, contraindications, and inappropriate dosages.
          </p>
        </GlassCard>
      </div>

      <div className="mt-16">
        <div className="bg-[var(--color-glass-trench)] border border-[var(--color-subtle-ridge)] rounded-[var(--radius-card)] p-8 md:p-12">
          <h3 className="font-bold text-[var(--color-text)] mb-6 text-lg">The data pipeline</h3>
          <ol className="space-y-4 text-[var(--color-text-muted)] text-[var(--text-sm)] leading-relaxed list-decimal list-inside md:list-outside">
            <li>
              <span className="font-bold text-[var(--color-text)]">USDA FoodData Central</span> - 298,476 food items with micronutrient profiles (potassium, sodium, fiber).
            </li>
            <li>
              <span className="font-bold text-[var(--color-text)]">Medical diet recommendations</span> - evidence-based guidance for 15 chronic conditions from Kaggle clinical datasets.
            </li>
            <li>
              <span className="font-bold text-[var(--color-text)]">Training corpus</span> - 3,847 question-answer pairs combining patient profiles with clinical-nutritional responses.
            </li>
          </ol>
        </div>
      </div>
    </div>
  </section>
);

// --- WHAT IT CHECKS (drug-nutrient interactions) ---
const SafetyChecks = () => (
  <section id="safety" className="py-24 px-6 md:px-12 border-b border-[var(--color-subtle-ridge)] bg-[var(--color-glass-trench)]">
    <div className="max-w-4xl mx-auto">
      <SectionLabel number="02" title="SAFETY GUARDRAILS" />
      <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-12">Deterministic safety checks run alongside the AI.</h2>

      <p className="text-[var(--color-telemetrySlate)] max-w-xl mb-12">
        Generic models hallucinate dosages. Our rules engine runs parallel to the model and flags:
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 border border-[var(--color-subtle-ridge)] rounded-[var(--radius-card)]">
          <div className="w-10 h-10 rounded-[var(--radius-control)] bg-[#EF4444]/10 flex items-center justify-center mb-4">
            <AlertCircle className="w-5 h-5 text-[#EF4444]" />
          </div>
          <h4 className="font-bold text-[var(--color-text)] mb-2">Drug-nutrient interactions</h4>
          <p className="text-[var(--color-telemetrySlate)] text-[var(--text-sm)]">
            Lisinopril + high potassium (hyperkalemia risk). Warfarin + vitamin K.
          </p>
        </div>
        <div className="p-6 border border-[var(--color-subtle-ridge)] rounded-[var(--radius-card)]">
          <div className="w-10 h-10 rounded-[var(--radius-control)] bg-[#EF4444]/10 flex items-center justify-center mb-4">
            <AlertCircle className="w-5 h-5 text-[#EF4444]" />
          </div>
          <h4 className="font-bold text-[var(--color-text)] mb-2">Contraindications</h4>
          <p className="text-[var(--color-telemetrySlate)] text-[var(--text-sm)]">
            CKD + potassium supplements. ACE inhibitors + potassium.
          </p>
        </div>
        <div className="p-6 border border-[var(--color-subtle-ridge)] rounded-[var(--radius-card)]">
          <div className="w-10 h-10 rounded-[var(--radius-control)] bg-[#EF4444]/10 flex items-center justify-center mb-4">
            <AlertCircle className="w-5 h-5 text-[#EF4444]" />
          </div>
          <h4 className="font-bold text-[var(--color-text)] mb-2">Dosage validation</h4>
          <p className="text-[var(--color-telemetrySlate)] text-[var(--text-sm)]">
            Dosage hallucinations caught before reaching the patient.
          </p>
        </div>
      </div>

      <div className="mt-12 p-6 border border-[var(--color-subtle-ridge)] rounded-[var(--radius-card)] bg-[var(--color-bg)]">
        <h4 className="font-bold text-[var(--color-text)] mb-2">Recall: 98.5%</h4>
        <p className="text-[var(--color-telemetrySlate)] text-[var(--text-sm)]">
          Of 65 unsafe responses in the test set, the safety system flagged 64. One false negative (SSRI + triptan interaction not in database). False positive rate: 3.2%.
        </p>
      </div>
    </div>
  </section>
);

// --- CONFIDENCE SCORING ---
const ConfidenceScoring = () => (
  <section id="confidence" className="py-24 px-6 md:px-12 border-b border-[var(--color-subtle-ridge)]">
    <div className="max-w-4xl mx-auto">
      <SectionLabel number="03" title="CONFIDENCE QUANTIFICATION" />
      <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-12">Every response gets a confidence score.</h2>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <p className="text-[var(--color-telemetrySlate)] mb-8">
            The system scores responses across four dimensions, weighted equally:
          </p>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-[var(--radius-control)] bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center shrink-0">1</div>
              <div>
                <h4 className="font-bold text-[var(--color-text)] mb-1">Model confidence</h4>
                <p className="text-[var(--color-telemetrySlate)] text-[var(--text-sm)]">
                  Response length, temperature, and sampling parameters approximate prediction uncertainty.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-[var(--radius-control)] bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center shrink-0">2</div>
              <div>
                <h4 className="font-bold text-[var(--color-text)] mb-1">Response coherence</h4>
                <p className="text-[var(--color-telemetrySlate)] text-[var(--text-sm)]">
                  Completeness, vocabulary diversity, medical terminology density, and query relevance.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-[var(--radius-control)] bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center shrink-0">3</div>
              <div>
                <h4 className="font-bold text-[var(--color-text)] mb-1">Medical validity</h4>
                <p className="text-[var(--color-telemetrySlate)] text-[var(--text-sm)]">
                  Domain-specific terminology and patient-specific appropriateness (age, pregnancy, CKD).
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-[var(--radius-control)] bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center shrink-0">4</div>
              <div>
                <h4 className="font-bold text-[var(--color-text)] mb-1">Safety</h4>
                <p className="text-[var(--color-telemetrySlate)] text-[var(--text-sm)]">
                  Rule-based checks for dangerous combinations, contraindications, and inappropriate dosages.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-glass-trench)] border border-[var(--color-subtle-ridge)] rounded-[var(--radius-card)] p-8 md:p-12">
          <h4 className="font-bold text-[var(--color-text)] mb-6 text-lg">Overall confidence: 0.78</h4>
          <div className="space-y-4 text-[var(--color-text-muted)] text-[var(--text-sm)]">
            <div className="flex justify-between">
              <span>Mean confidence</span>
              <span className="font-mono text-[var(--color-text)]">0.783</span>
            </div>
            <div className="flex justify-between">
              <span>Safety recall</span>
              <span className="font-mono text-[var(--color-text)]">98.5%</span>
            </div>
            <div className="flex justify-between">
              <span>False positive rate</span>
              <span className="font-mono text-[var(--color-text)]">3.2%</span>
            </div>
            <div className="flex justify-between">
              <span>Validation perplexity</span>
              <span className="font-mono text-[var(--color-text)]">2.37 vs 3.92 base</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// --- SYSTEM CONSOLE ---
const SystemConsole = () => {
  const logs = [
    { text: "INITIALIZING PROMPT_BIOTICS KERNEL...", color: "text-[var(--color-telemetrySlate)]", delay: 0 },
    { text: "> LOAD MODULE: Gemini 2.0 Flash (Vertex AI)", color: "text-[var(--color-accent)]", delay: 800 },
    { text: "> LOAD DATASET: USDA FoodData Central (298,476 items)", color: "text-[var(--color-accent)]", delay: 1600 },
    { text: "> USER QUERY: 'Meal plan for T2DM + Hypertension taking Lisinopril'", color: "text-[var(--color-text)]", delay: 2800 },
    { text: "  [ANALYSIS] Retrieving AHA Guidelines...", color: "text-[var(--color-telemetrySlate)]", delay: 3800 },
    { text: "  [SAFETY CHECK] Detecting Drug-Nutrient Interaction...", color: "text-[var(--color-anomaly)]", delay: 4800 },
    { text: "  ! WARNING: Lisinopril + High Potassium (Hyperkalemia Risk)", color: "text-[var(--color-anomaly)]", delay: 5800 },
    { text: "  [ADJUSTMENT] Reducing Banana/Spinach portions in plan.", color: "text-[var(--color-accent)]", delay: 6800 },
    { text: "> GENERATING RESPONSE (Confidence: 0.78)...", color: "text-[var(--color-accent)]", delay: 7800 },
    { text: "READY.", color: "text-[var(--color-accent)]", delay: 9000 },
  ];

  return (
    <div className="w-full bg-[var(--color-obsidianDeep)] border border-[var(--color-subtle-ridge)] rounded-[var(--radius-card)] overflow-hidden font-mono text-xs md:text-sm shadow-[var(--shadow-card)]">
      <div className="bg-[var(--color-glass-trench)] border border-[var(--color-subtle-ridge)] px-4 py-2 border-b border-[var(--color-subtle-ridge)] flex justify-between items-center">
        <span className="text-[var(--color-telemetrySlate)]">live_inference_log.sh</span>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--color-anomaly)]" />
          <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
          <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
        </div>
      </div>
      <div className="p-6 h-[400px] overflow-y-auto space-y-3">
        {logs.map((log, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className={`text-[var(--text-xs)] font-mono opacity-80 ${log.color}`}>{log.text}</span>
            <span className="opacity-0">_</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const LogEntry = ({ log }) => {
  const text = useTypewriter(log.text, 20, log.delay);
  return (
    <div className="text-[var(--color-text)]">
      {text}
      {text.length === log.text.length && <span className="opacity-0">_</span>}
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <SafetyChecks />
        <ConfidenceScoring />
        <section className="py-24 px-6 md:px-12 border-b border-[var(--color-subtle-ridge)]">
          <div className="max-w-2xl mx-auto text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-6">Ready to stop missing interactions?</h2>
            <p className="text-[var(--color-telemetrySlate)] mb-10">Join clinics using PromptBiotics for T2DM, hypertension, and CKD care.</p>
            <button
              onClick={() => router.push('/auth/signup')}
              className="bg-[var(--color-accent)] text-black px-10 py-4 font-bold font-mono text-xs uppercase rounded-[var(--radius-control)] hover:opacity-90 transition-opacity"
            >
              Start Free Trial
            </button>
          </div>
        </section>
        <SystemConsole />
      </main>
      <Footer />
    </div>
  );
}
