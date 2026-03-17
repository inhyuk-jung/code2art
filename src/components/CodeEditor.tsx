'use client';

import { useState } from 'react';
import { Play, Sparkles, ChevronDown, Wand2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CodeMetrics } from '@/lib/analyzer';
import { useLocale } from '@/context/LocaleContext';

export type SupportedLanguage =
    | 'javascript'
    | 'python'
    | 'java'
    | 'csharp'
    | 'cpp'
    | 'php'
    | 'ruby'
    | 'go'
    | 'swift'
    | 'kotlin'
    | 'rust'
    | 'typescript'
    | 'sql'
    | 'html'
    | 'css';

export type BaseArtStyle = 'kandinsky' | 'vangogh' | 'monet' | 'dali' | 'basquiat';
export type ArtStyle = BaseArtStyle | 'auto';

interface StyleInfo {
    label: Record<string, string>;
    artist: string;
    movement: Record<string, string>;
    description: Record<string, string>;
    keywords: Record<string, string>;
    imageUrl: string;
    palette: string[];
    isAuto?: boolean;
}

export const ART_STYLE_INFO: Record<ArtStyle, StyleInfo> = {
    auto: {
        label: { ko: '자동 선택', en: 'Auto Selection' },
        artist: 'Code2Art AI',
        movement: { ko: '코드 분석 기반 자동 매칭', en: 'Auto-matching based on code analysis' },
        description: {
            ko: '코드의 복잡도, 감정, 패러다임 등 8개 지표를 종합 분석하여 가장 적합한 화풍을 자동으로 선택합니다.',
            en: 'Automatically selects the most suitable art style by analyzing 8 metrics including complexity, sentiment, and paradigm.'
        },
        keywords: { ko: '자동 · AI 매칭 · 코드 성격', en: 'Auto · AI Matching · Code DNA' },
        imageUrl: '',
        palette: ['#E63946', '#F4D03F', '#85C1AE', '#1E3A5F', '#1C1C1C'],
        isAuto: true
    },
    kandinsky: {
        label: { ko: '바실리 칸딘스키', en: 'Wassily Kandinsky' },
        artist: 'Wassily Kandinsky',
        movement: { ko: '추상미술 (Abstract Art)', en: 'Abstract Art' },
        description: {
            ko: '점·선·면의 상호작용과 색채의 음악적 울림. 기하학적 형태와 선의 리듬이 어우러진 순수 추상.',
            en: 'The interaction of points, lines, and planes with musical resonances of color. Pure abstraction with geometric forms and linear rhythms.'
        },
        keywords: { ko: '추상 · 리듬 · 점선면 · 음악적', en: 'Abstract · Rhythm · Geometry · Musical' },
        imageUrl: 'https://img.wikioo.org/ADC/Art-ImgScreen-2.nsf/O/A-5ZKCWA/$FILE/Wassily-kandinsky-yellow-red-blue.Jpg',
        palette: ['#E63946', '#457B9D', '#F4D03F', '#1D3557', '#FFFFFF']
    },
    vangogh: {
        label: { ko: '반 고흐', en: 'Van Gogh' },
        artist: 'Vincent van Gogh',
        movement: { ko: '후기인상주의 (Post-Impressionism)', en: 'Post-Impressionism' },
        description: {
            ko: '굵고 소용돌이치는 붓터치와 강렬한 보색 대비. 격정적인 감정이 캔버스를 뒤흔는 표현.',
            en: 'Thick, swirling brushstrokes and intense complementary color contrasts. Expression where turbulent emotions shake the canvas.'
        },
        keywords: { ko: '소용돌이 · 임파스토 · 보색 · 감정', en: 'Swirls · Impasto · Complementary · Emotion' },
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/400px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
        palette: ['#1E3A5F', '#2E8BC0', '#F4D03F', '#C0392B', '#145A32']
    },
    monet: {
        label: { ko: '모네', en: 'Monet' },
        artist: 'Claude Monet',
        movement: { ko: '인상주의 (Impressionism)', en: 'Impressionism' },
        description: {
            ko: '빛의 떨림과 색채의 번짐. 윤곽이 흐릿하고 따뜻한 빛의 산란이 화면을 감싸는 부드러운 화풍.',
            en: 'The trembling of light and bleeding of colors. A soft style where blurred outlines and warm light scattering envelop the screen.'
        },
        keywords: { ko: '빛의 번짐 · 파스텔 · 물결 · 대기감', en: 'Light Bleed · Pastel · Waves · Atmospheric' },
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg/400px-Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg',
        palette: ['#85C1AE', '#A9CCE3', '#FAD7A0', '#7FB3D3', '#F9E4B7']
    },
    dali: {
        label: { ko: '달리', en: 'Dalí' },
        artist: 'Salvador Dalí',
        movement: { ko: '초현실주의 (Surrealism)', en: 'Surrealism' },
        description: {
            ko: '사실적인 묘사 기법으로 논리를 거스르는 꿈의 풍경을 구현. 시간과 공간이 녹아내리는 기이한 구도.',
            en: 'Implementing dreamscapes that defy logic with realistic depiction techniques. Strange compositions where time and space melt away.'
        },
        keywords: { ko: '꿈 · 왜곡 · 정밀 · 초현실', en: 'Dreams · Distortion · Precision · Surreal' },
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/d/dd/The_Persistence_of_Memory.jpg',
        palette: ['#D4AC0D', '#935116', '#1A5276', '#7D6608', '#2E4057']
    },
    basquiat: {
        label: { ko: '바스키아', en: 'Basquiat' },
        artist: 'Jean-Michel Basquiat',
        movement: { ko: '신표현주의 (Neo-Expressionism)', en: 'Neo-Expressionism' },
        description: {
            ko: '낙서와 크라운, 해골, 글자 파편이 뒤섞인 원색의 폭발. 거칠고 날것의 도시 에너지를 담은 화풍.',
            en: 'An explosion of primary colors mixed with graffiti, crowns, skulls, and text fragments. A style capturing raw, rough urban energy.'
        },
        keywords: { ko: '낙서 · 원색 · 크라운 · 거칠음 · 날것', en: 'Graffiti · Primaries · Crown · Raw · Urban' },
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f6/Untitled1982Basquiat.jpg',
        palette: ['#E74C3C', '#F39C12', '#27AE60', '#2980B9', '#1C1C1C']
    }
};

/**
 * Resolves 'auto' to the most fitting BaseArtStyle based on code metrics.
 * Uses a prioritized decision matrix reflecting the "Artist DNA" of the code.
 */
export function resolveAutoStyle(metrics: CodeMetrics): BaseArtStyle {
    const { complexity: cp, consistency: cs, sentiment: st, coupling: cl, cohesion: ch, readability: rd, depth: dp, paradigm: pd } = metrics;

    // 1. Basquiat (Chaos & Raw Energy)
    // - Extreme complexity or a mess of low-consistency spaghetti
    if (cp > 0.8) return 'basquiat';
    if (cp > 0.65 && cs < 0.35 && rd < 0.4) return 'basquiat';

    // 2. Kandinsky (Geometric Order & Absolute Abstraction)
    // - Highly structured, consistent, and minimalist code
    if (cp < 0.4 && cs > 0.7 && rd > 0.7) return 'kandinsky';
    if (cs > 0.85 && cp < 0.5) return 'kandinsky';

    // 3. Dalí (Surrealism & Infinite Flow)
    // - High connectivity, functional data pipelines, or extreme nesting depth
    if (pd === 'fp' && cl > 0.5 && dp > 0.4) return 'dali';
    if (cl > 0.7 && ch < 0.4) return 'dali';
    if (dp > 0.8) return 'dali';

    // 4. Monet (Soft Impressionism & Luminous Serenity)
    // - Readable, high-level, and "pleasant" code flow
    if (st > 0.6 && rd > 0.65 && cp < 0.55) return 'monet';
    if (st > 0.8 && rd > 0.5) return 'monet';

    // 5. Van Gogh (Passionate Intensity & Rhythmic Energy)
    // - Default for energetic or complex code that still maintains rhythmic consistency
    return 'vangogh';
}

/**
 * Internal helper: shows image or palette fallback gracefully
 */
function StyleImage({ url, label, palette }: { url: string; label: string; palette: string[] }) {
    const [failed, setFailed] = useState(false);
    if (!url || failed) {
        return (
            <div className="w-full h-full flex flex-col relative">
                {palette.map((c, i) => (
                    <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-xs font-bold bg-black/40 px-2 py-0.5 rounded">{label}</span>
                </div>
            </div>
        );
    }
    return (
        <img
            src={url}
            alt={label}
            className="w-full h-full object-cover"
            onError={() => setFailed(true)}
        />
    );
}

interface CodeEditorProps {
    code: string;
    setCode: (code: string) => void;
    language: SupportedLanguage;
    setLanguage: (lang: SupportedLanguage) => void;
    artStyle: ArtStyle;
    setArtStyle: (style: ArtStyle) => void;
    aiProvider: 'openai' | 'gemini';
    setAiProvider: (provider: 'openai' | 'gemini') => void;
    onAnalyze: () => void;
    isAnalyzing: boolean;
}

export default function CodeEditor({
    code, setCode,
    language, setLanguage,
    artStyle, setArtStyle,
    aiProvider, setAiProvider,
    onAnalyze, isAnalyzing
}: CodeEditorProps) {
    const { t, language: locale } = useLocale();
    const [showStylePicker, setShowStylePicker] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const selectedStyle = ART_STYLE_INFO[artStyle];

    const hasGemini = !!process.env.NEXT_PUBLIC_GEMINI_KEY;
    const hasOpenAI = !!process.env.NEXT_PUBLIC_OPENAI_KEY;

    const handleAnalyzeClick = () => {
        setError(null);
        if (!hasGemini && !hasOpenAI) {
            setError(t('error.no_model'));
            return;
        }
        onAnalyze();
    };

    return (
        <div className="w-full flex flex-col gap-4">
            {/* Top Row: Language + Analyze Button */}
            <div className="flex flex-col md:flex-row gap-4 mb-2">
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                    className="neo-box-sm px-4 py-2 bg-white focus:outline-none cursor-pointer text-sm font-bold flex-1"
                >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="csharp">C#</option>
                    <option value="cpp">C++</option>
                    <option value="php">PHP</option>
                    <option value="ruby">Ruby</option>
                    <option value="go">Go</option>
                    <option value="swift">Swift</option>
                    <option value="kotlin">Kotlin</option>
                    <option value="rust">Rust</option>
                    <option value="sql">SQL</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                </select>

                {/* Art Style Trigger Button */}
                <button
                    onClick={() => setShowStylePicker(!showStylePicker)}
                    className="neo-box-sm px-4 py-2 bg-white focus:outline-none cursor-pointer text-sm font-bold flex-1 flex items-center justify-between gap-2 hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            {selectedStyle.palette.slice(0, 4).map((c, i) => (
                                <div key={i} className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: c }} />
                            ))}
                        </div>
                        <span>🎨 {selectedStyle.label[locale]} ({selectedStyle.movement[locale].split(' (')[0]})</span>
                    </div>
                    <ChevronDown size={14} className={`transition-transform ${showStylePicker ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* Style Picker Modal */}
            <AnimatePresence>
                {showStylePicker && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="w-full bg-white neo-box p-4 border-2 border-primary"
                    >
                        <p className="text-xs font-bold text-gray-400 uppercase mb-3">{t('editor.style.description')}</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {(Object.entries(ART_STYLE_INFO) as [ArtStyle, StyleInfo][]).map(([key, info]) => (
                                <button
                                    key={key}
                                    onClick={() => { setArtStyle(key); setShowStylePicker(false); }}
                                    className={`flex flex-col rounded-lg border-2 overflow-hidden text-left transition-all hover:shadow-md ${artStyle === key ? 'border-primary shadow-md' : 'border-gray-200'}`}
                                >
                                    {/* Preview Image */}
                                    <div className="relative w-full h-28 bg-gray-100 overflow-hidden">
                                        <StyleImage url={info.imageUrl} label={info.label[locale]} palette={info.palette} />
                                        {artStyle === key && (
                                            <div className="absolute top-1 right-1 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                                ✓
                                            </div>
                                        )}
                                        {/* Palette preview bar at bottom */}
                                        <div className="absolute bottom-0 left-0 right-0 flex h-2">
                                            {info.palette.map((c, i) => (
                                                <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                                            ))}
                                        </div>
                                    </div>
                                    {/* Info */}
                                    <div className="p-2">
                                        <p className="font-bold text-sm text-gray-800">{info.label[locale]}</p>
                                        <p className="text-xs text-gray-400 mb-1">{info.artist}</p>
                                        <p className="text-xs text-gray-600 leading-tight line-clamp-2">{info.description[locale]}</p>
                                        <p className="text-xs text-primary font-medium mt-1">{info.keywords[locale]}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Code Textarea */}
            <div className="relative group">
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={t('editor.placeholder')}
                    className="w-full h-80 p-6 bg-white neo-box font-mono text-sm md:text-base resize-none focus:outline-none placeholder:text-gray-400"
                    spellCheck="false"
                />
                <div className="absolute top-2 left-2 w-2 h-2 bg-primary rounded-full" />
                <div className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full" />
            </div>

            {/* Bottom Row: AI Model Selection + Generate Button */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-2">
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    <select
                        value={aiProvider}
                        onChange={(e) => setAiProvider(e.target.value as 'openai' | 'gemini')}
                        className="neo-box-sm px-3 py-2 text-sm bg-white cursor-pointer font-bold"
                    >
                        {hasGemini && <option value="gemini">{t('editor.model.gemini')}</option>}
                        {hasOpenAI && <option value="openai">{t('editor.model.openai')}</option>}
                        {!hasGemini && !hasOpenAI && <option value="">{t('editor.model.none')}</option>}
                    </select>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!code.trim() || isAnalyzing}
                    onClick={handleAnalyzeClick}
                    className="neo-box bg-primary flex-shrink-0 w-full md:w-auto text-primary-foreground px-8 py-4 font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#ffafa0] disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {isAnalyzing ? (
                        <Sparkles className="animate-spin" />
                    ) : (
                        <Play className="group-hover:translate-x-1 transition-transform" />
                    )}
                    {isAnalyzing ? t('editor.analyzing') : t('editor.analyze')}
                </motion.button>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative text-red-500 text-xs font-bold p-3 bg-red-50 border-2 border-red-200 rounded-lg flex items-center gap-2 mt-2"
                >
                    <span>⚠️ {error}</span>
                    <button onClick={() => setError(null)} className="ml-auto text-red-300 hover:text-red-500">
                        <X size={14} />
                    </button>
                </motion.div>
            )}
        </div>
    );
}
