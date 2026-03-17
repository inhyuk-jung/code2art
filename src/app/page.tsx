'use client';

import { useState } from 'react';
import CodeEditor, { SupportedLanguage, ArtStyle } from '@/components/CodeEditor';
import { motion } from 'framer-motion';
import { analyzeCode, CodeMetrics } from '@/lib/analyzer';
import AiGenerator from '@/components/AiGenerator';
import { useLocale } from '@/context/LocaleContext';
import { Globe } from 'lucide-react';

export default function Home() {
  const { t, language, setLanguage } = useLocale();
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'success' | 'error'>('idle');
  const [metrics, setMetrics] = useState<CodeMetrics | null>(null);

  const sampleBeautifulCode = `/**
 * ✨ The Fibonacci Spira: A Symphony of Geometry
 * Analytically balanced, structurally cohesive, and aesthetically pure.
 */
class GeometricOrchestrator {
  private readonly phi = (1 + Math.sqrt(5)) / 2;
  private elements: Map<string, number[]> = new Map();

  constructor(private readonly seed: number) {
    this.initializeHarmonics();
  }

  /**
   * Generates a recursive pattern based on golden ratio growth.
   */
  public compose(depth: number = 8): string {
    return Array.from({ length: depth })
      .map((_, i) => this.calculateResonance(i))
      .filter(val => val > 0.1)
      .map(r => \`Resonance point at \${r.toFixed(4)}\`)
      .join('\\n');
  }

  private initializeHarmonics(): void {
    for (let i = 0; i < 5; i++) {
        const energy = Math.pow(this.phi, i) * this.seed;
        this.elements.set(\`layer_\${i}\`, [energy, energy / 2]);
    }
  }

  private calculateResonance(index: number): number {
    const base = this.elements.get(\`layer_\${index % 5}\`)?.[0] || 1;
    return (Math.sin(index * this.phi) + 1) * base;
  }
}

// Instantiate the artistry
const catalyst = new GeometricOrchestrator(Math.PI);
console.log(catalyst.compose(12));
`;

  const [code, setCode] = useState(sampleBeautifulCode);
  const [language_code, setLanguageCode] = useState<SupportedLanguage>('typescript');
  const [artStyle, setArtStyle] = useState<ArtStyle>('auto');

  const hasGemini = !!process.env.NEXT_PUBLIC_GEMINI_KEY;
  const hasOpenAI = !!process.env.NEXT_PUBLIC_OPENAI_KEY;

  const [aiProvider, setAiProvider] = useState<'openai' | 'gemini'>(hasGemini ? 'gemini' : 'openai');

  const handleAnalyze = async () => {
    setStatus('analyzing');

    setTimeout(() => {
      const result = analyzeCode(code, language_code);
      setMetrics(result);
      setStatus('success');
    }, 1500);
  };

  return (
    <main className="min-h-screen p-8 md:p-24 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FFB5A7] rounded-full blur-[100px] opacity-30 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#Fcd5ce] rounded-full blur-[100px] opacity-30 pointer-events-none" />

      {/* Language Toggle */}
      <div className="absolute top-8 right-8 z-50">
        <button
          onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
          className="neo-box-sm px-4 py-2 bg-white/80 hover:bg-white flex items-center gap-2 font-bold text-sm tracking-tight transition-all"
        >
          <Globe size={16} className="text-primary" />
          <span className={language === 'ko' ? 'text-primary' : 'text-gray-400'}>KO</span>
          <span className="text-gray-200">|</span>
          <span className={language === 'en' ? 'text-primary' : 'text-gray-400'}>EN</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 relative z-10"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-3 tracking-tight">
          Is My Code <span className="text-primary italic">Art?</span>
        </h1>
        <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto">
          {t('nav.description')}
          <br />
          <span className="font-bold text-sm">{t('nav.footer')}</span>
        </p>
      </motion.div>

      <div className="w-full max-w-3xl flex flex-col gap-8 items-center relative z-10">

        {/* Editor / Canvas */}
        <div className="w-full flex flex-col justify-center">
          {status === 'success' && metrics ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full h-full flex flex-col items-center"
            >
              {/* AI Image Generation Box — FIRST */}
              <AiGenerator
                metrics={metrics}
                artStyle={artStyle}
                aiProvider={aiProvider}
                setAiProvider={setAiProvider}
                autoGenerateOnLoad={true}
              />

              {/* Code Metrics — collapsed by default */}
              <details className="w-full max-w-2xl mt-2">
                <summary className="cursor-pointer text-xs font-bold text-gray-400 uppercase tracking-wide hover:text-gray-600 transition-colors select-none">
                  ▸ {t('metrics.title')}
                </summary>
                <div className="mt-3 p-4 bg-white/80 neo-box-sm text-sm">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div><strong>{t('metrics.complexity')}:</strong> {metrics.complexity.toFixed(2)}<br /><span className="text-gray-500">({t('metrics.branches')} {metrics.raw.branches})</span></div>
                    <div><strong>{t('metrics.cohesion')}:</strong> {metrics.cohesion.toFixed(2)}<br /><span className="text-gray-500">({t('metrics.functions')} {metrics.raw.functions})</span></div>
                    <div><strong>{t('metrics.consistency')}:</strong> {metrics.consistency.toFixed(2)}<br /><span className="text-gray-500">({t('metrics.magicNumbers')} {metrics.raw.magicNumbers})</span></div>
                    <div><strong>{t('metrics.coupling')}:</strong> {metrics.coupling.toFixed(2)}<br /><span className="text-gray-500">({t('metrics.imports')} {metrics.raw.importsAndGlobals})</span></div>
                    <div><strong>{t('metrics.depth')}:</strong> {metrics.depth.toFixed(2)}<br /><span className="text-gray-500">({t('metrics.maxDepth')} {metrics.raw.maxDepth})</span></div>
                    <div><strong>{t('metrics.readability')}:</strong> {metrics.readability.toFixed(2)}<br /><span className="text-gray-500">({t('metrics.naming')} {metrics.raw.avgNameLength.toFixed(1)})</span></div>
                    <div><strong>{t('metrics.sentiment')}:</strong> {metrics.sentiment.toFixed(2)}<br /><span className="text-gray-500">({t('metrics.sentimentScore')} {metrics.raw.sentimentScore})</span></div>
                    <div><strong>{t('metrics.paradigm')}:</strong> <span className="uppercase">{metrics.paradigm}</span><br /><span className="text-gray-500">(OOP {metrics.raw.oopScore} / FP {metrics.raw.fpScore})</span></div>
                    <div className="col-span-2 lg:col-span-4 mt-1 border-t border-gray-200 pt-2">
                      <strong>{t('metrics.lines')}:</strong> {metrics.linesOfCode}
                    </div>
                  </div>
                </div>
              </details>

              <div className="flex justify-center mt-6 space-x-4">
                <button
                  onClick={() => { setStatus('idle'); setMetrics(null); }}
                  className="neo-box-sm px-6 py-2 bg-white hover:bg-gray-100 font-bold"
                >
                  {t('result.back')}
                </button>
              </div>
            </motion.div>
          ) : (
            <CodeEditor
              code={code}
              setCode={setCode}
              language={language_code}
              setLanguage={setLanguageCode}
              artStyle={artStyle}
              setArtStyle={setArtStyle}
              aiProvider={aiProvider}
              setAiProvider={setAiProvider}
              onAnalyze={handleAnalyze}
              isAnalyzing={status === 'analyzing'}
            />
          )}
        </div>
      </div>
    </main>
  );
}
