'use client';

import { useState } from 'react';
import CodeEditor, { SupportedLanguage, ArtStyle } from '@/components/CodeEditor';
import { motion } from 'framer-motion';
import { analyzeCode, CodeMetrics } from '@/lib/analyzer';
import AiGenerator from '@/components/AiGenerator';

export default function Home() {
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
  const [language, setLanguage] = useState<SupportedLanguage>('typescript');
  const [artStyle, setArtStyle] = useState<ArtStyle>('auto');

  // API 키 상태 (보안을 위해 초기값은 빈 문자열)
  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [aiProvider, setAiProvider] = useState<'openai' | 'gemini'>('gemini');

  const apiKey = aiProvider === 'openai' ? openaiKey : geminiKey;
  const setApiKey = aiProvider === 'openai' ? setOpenaiKey : setGeminiKey;

  const handleAnalyze = async () => {
    setStatus('analyzing');

    // Simulate slight delay to show Cody thinking
    setTimeout(() => {
      const result = analyzeCode(code, language);
      setMetrics(result);
      setStatus('success');
    }, 1500);
  };

  return (
    <main className="min-h-screen p-8 md:p-24 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FFB5A7] rounded-full blur-[100px] opacity-30 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#Fcd5ce] rounded-full blur-[100px] opacity-30 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 relative z-10"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-3 tracking-tight">
          Is My Code <span className="text-primary italic">Art?</span>
        </h1>
        <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto">
          Transform your code into a masterpiece.
          <br />
          <span className="font-bold text-sm">100% Local Processing. Zero Server Uploads.</span>
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
              {/* 
              <ArtCanvas metrics={metrics} artStyle={artStyle} />

              {/* Docent Commentary 
              <div className="w-full max-w-2xl mt-6 p-6 bg-[#f8f9fa] border-l-4 border-primary neo-box-sm">
                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <span className="text-xl">🎨</span> AI 도슨트 오디오 가이드
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed italic">
                  "{
                    (() => {
                      const prefix =
                        artStyle === 'bauhaus' ? '바우하우스 기하학으로 재해석된 이 작품은 ' :
                          artStyle === 'vangogh' ? '반 고흐의 소용돌이치는 붓터치로 완성된 이 캔버스는 ' :
                            artStyle === 'monet' ? '모네의 빛의 번짐으로 녹아든 이 인상파 작품은 ' :
                              artStyle === 'dali' ? '달리의 꿈 같은 초현실적 세계관으로 표현된 이 작품은 ' :
                                artStyle === 'rothko' ? '로스코의 명상적인 색면으로 구성된 이 작품은 ' :
                                  '바스키아의 날것 에너지로 폭발하는 이 신표현주의 작품은 ';

                      let mainComment = '';
                      if (metrics.complexity > 0.7 && metrics.cohesion < 0.4) {
                        mainComment = '개발자의 혼란스러운 내면과 스파게티처럼 얽힌 비즈니스 로직의 고뇌를 강렬하게 표현하고 있습니다.';
                      } else if (metrics.complexity < 0.3 && metrics.consistency > 0.8) {
                        mainComment = '완벽하게 정제된 클린 코드의 평온함과 숨결 같은 미니멀리즘을 캔버스 위에 구현했습니다.';
                      } else if (metrics.coupling > 0.6) {
                        mainComment = '수많은 외부 의존성에 짓눌린 현대 소프트웨어 아키텍처의 위태로운 연결성을 조형적으로 폭로합니다.';
                      } else {
                        mainComment = '논리와 직관이 교차하는 지점에서 탄생한, 코드라는 텍스트 이면의 구조적 아름다움을 은유적으로 보여줍니다.';
                      }

                      return prefix + mainComment;
                    })()
                  }"
                </p>
              </div> 
              */}

              {/* AI Image Generation Box — FIRST */}
              <AiGenerator
                metrics={metrics}
                artStyle={artStyle}
                apiKey={apiKey}
                aiProvider={aiProvider}
                setApiKey={setApiKey}
                setAiProvider={setAiProvider}
                autoGenerateOnLoad={!!apiKey}
              />

              {/* Code Metrics — collapsed by default */}
              <details className="w-full max-w-2xl mt-2">
                <summary className="cursor-pointer text-xs font-bold text-gray-400 uppercase tracking-wide hover:text-gray-600 transition-colors select-none">
                  ▸ 코드 분석 메트릭스 (Code Metrics)
                </summary>
                <div className="mt-3 p-4 bg-white/80 neo-box-sm text-sm">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div><strong>복잡도:</strong> {metrics.complexity.toFixed(2)}<br /><span className="text-gray-500">(분기문 {metrics.raw.branches}개)</span></div>
                    <div><strong>응집도:</strong> {metrics.cohesion.toFixed(2)}<br /><span className="text-gray-500">(함수 {metrics.raw.functions}개)</span></div>
                    <div><strong>일관성:</strong> {metrics.consistency.toFixed(2)}<br /><span className="text-gray-500">(매직넘버 {metrics.raw.magicNumbers}개)</span></div>
                    <div><strong>결합도:</strong> {metrics.coupling.toFixed(2)}<br /><span className="text-gray-500">(외부 참조 {metrics.raw.importsAndGlobals}개)</span></div>
                    <div><strong>중첩도:</strong> {metrics.depth.toFixed(2)}<br /><span className="text-gray-500">(최대 뎁스 {metrics.raw.maxDepth})</span></div>
                    <div><strong>가독성:</strong> {metrics.readability.toFixed(2)}<br /><span className="text-gray-500">(네이밍 {metrics.raw.avgNameLength.toFixed(1)}자)</span></div>
                    <div><strong>감정:</strong> {metrics.sentiment.toFixed(2)}<br /><span className="text-gray-500">(감성 점수 {metrics.raw.sentimentScore})</span></div>
                    <div><strong>패러다임:</strong> <span className="uppercase">{metrics.paradigm}</span><br /><span className="text-gray-500">(OOP {metrics.raw.oopScore} / FP {metrics.raw.fpScore})</span></div>
                    <div className="col-span-2 lg:col-span-4 mt-1 border-t border-gray-200 pt-2">
                      <strong>총 코드 라인 수:</strong> {metrics.linesOfCode}
                    </div>
                  </div>
                </div>
              </details>

              <div className="flex justify-center mt-6 space-x-4">
                <button
                  onClick={() => { setStatus('idle'); setMetrics(null); }}
                  className="neo-box-sm px-6 py-2 bg-white hover:bg-gray-100 font-bold"
                >
                  다른 코드 분석하기
                </button>
              </div>
            </motion.div>
          ) : (
            <CodeEditor
              code={code}
              setCode={setCode}
              language={language}
              setLanguage={setLanguage}
              artStyle={artStyle}
              setArtStyle={setArtStyle}
              apiKey={apiKey}
              setApiKey={setApiKey}
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
