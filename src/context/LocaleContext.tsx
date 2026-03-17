'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Language = 'ko' | 'en';

interface LocaleContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    ko: {
        'nav.title': 'Is My Code Art?',
        'nav.subtitle': '당신의 코드는 예술이 될 준비가 되었나요?',
        'nav.description': '당신의 코드는 예술적일까요? 진짜 예술.',
        'nav.footer': '100% 로컬 프로세싱. 제로 서버 업로드.',
        'editor.placeholder': '// 여기에 코드를 붙여넣으세요...',
        'editor.analyze': '작품으로 변환하기',
        'editor.analyzing': '분석 중...',
        'editor.language': '언어 선택',
        'editor.style': '화풍 선택',
        'editor.style.auto': '자동 선택',
        'editor.style.description': '코드의 구조적 DNA에 가장 잘 어울리는 화풍을 제안합니다.',
        'editor.model': 'AI 모델',
        'editor.model.gemini': 'Gemini (Flash) [추천]',
        'editor.model.openai': 'OpenAI (DALL-E 3)',
        'editor.model.none': '설정된 모델 없음',
        'metrics.title': '코드 분석 메트릭스 (Code Metrics)',
        'metrics.complexity': '복잡도',
        'metrics.cohesion': '응집도',
        'metrics.consistency': '일관성',
        'metrics.coupling': '결합도',
        'metrics.depth': '중첩도',
        'metrics.readability': '가독성',
        'metrics.sentiment': '감정',
        'metrics.paradigm': '패러다임',
        'metrics.lines': '총 코드 라인 수',
        'metrics.branches': '분기문',
        'metrics.functions': '함수',
        'metrics.magicNumbers': '매직넘버',
        'metrics.imports': '외부 참조',
        'metrics.maxDepth': '최대 뎁스',
        'metrics.naming': '네이밍 평균',
        'metrics.sentimentScore': '감성 점수',
        'result.title': '코드로 그린 나만의 작품',
        'result.docent': '도슨트 해설',
        'result.docent.loading': '작성 중...',
        'result.docent.error': '해설을 가져오지 못했습니다.',
        'result.download': '이미지 다운로드',
        'result.retry': '다시 생성하기',
        'result.back': '다른 코드 분석하기',
        'result.details': '상세 정보 (프롬프트 · 설정)',
        'result.prompt': '생성 프롬프트',
        'result.regenerate': '재생성',
        'error.no_model': '설정된 AI 모델이 없습니다. .env.local 설정을 확인해주세요.',
        'error.openai_key': 'OpenAI API Key가 설정되어 있지 않습니다.',
        'error.gemini_key': 'Gemini API Key가 설정되어 있지 않습니다.',
        'bot.phase1.label': '화풍 확정',
        'bot.phase1.sub': '어떤 화풍으로 그릴지 고르고 있어요!',
        'bot.phase2.label': '그림 그리는 중',
        'bot.phase2.sub': '열심히 작품을 완성하고 있어요!',
        'bot.phase3.label': '도슨트 작성 중',
        'bot.phase3.sub': '작품에 대한 해설을 쓰고 있어요!',
        'bot.magnificent': '정말 멋진 작품이네요! ✨',
        'bot.analyzing_text': '음... 어디 한번 볼까요...',
    },
    en: {
        'nav.title': 'Is My Code Art?',
        'nav.subtitle': 'Is your code ready to become art?',
        'nav.description': 'Is your code artistic? Real Art.',
        'nav.footer': '100% Local Processing. Zero Server Uploads.',
        'editor.placeholder': '// Paste your code here...',
        'editor.analyze': 'Turn into Art',
        'editor.analyzing': 'Analyzing...',
        'editor.language': 'Language',
        'editor.style': 'Art Style',
        'editor.style.auto': 'Auto Selection',
        'editor.style.description': 'Suggests the style that best fits the structural DNA of your code.',
        'editor.model': 'AI Model',
        'editor.model.gemini': 'Gemini (Flash) [Recommended]',
        'editor.model.openai': 'OpenAI (DALL-E 3)',
        'editor.model.none': 'No model configured',
        'metrics.title': 'Code Analysis Metrics',
        'metrics.complexity': 'Complexity',
        'metrics.cohesion': 'Cohesion',
        'metrics.consistency': 'Consistency',
        'metrics.coupling': 'Coupling',
        'metrics.depth': 'Depth',
        'metrics.readability': 'Readability',
        'metrics.sentiment': 'Sentiment',
        'metrics.paradigm': 'Paradigm',
        'metrics.lines': 'Lines of Code',
        'metrics.branches': 'Branches',
        'metrics.functions': 'Functions',
        'metrics.magicNumbers': 'Magic Numbers',
        'metrics.imports': 'Imports',
        'metrics.maxDepth': 'Max Depth',
        'metrics.naming': 'Avg Naming',
        'metrics.sentimentScore': 'Sentiment Score',
        'result.title': 'Your Code as Art',
        'result.docent': 'Docent Commentary',
        'result.docent.loading': 'Writing...',
        'result.docent.error': 'Failed to load commentary.',
        'result.download': 'Download Image',
        'result.retry': 'Retry Generation',
        'result.back': 'Analyze Another Code',
        'result.details': 'Detailed Info (Prompt · Settings)',
        'result.prompt': 'Generation Prompt',
        'result.regenerate': 'Regenerate',
        'error.no_model': 'No AI model configured. Please check your .env.local settings.',
        'error.openai_key': 'OpenAI API Key is not configured.',
        'error.gemini_key': 'Gemini API Key is not configured.',
        'bot.phase1.label': 'Confirming Style',
        'bot.phase1.sub': 'Deciding which art style fits your code!',
        'bot.phase2.label': 'Painting',
        'bot.phase2.sub': 'Bringing your code to life on the canvas!',
        'bot.phase3.label': 'Writing Docent',
        'bot.phase3.sub': 'Crafting a poetic commentary for your masterpiece!',
        'bot.magnificent': 'Magnificent! ✨',
        'bot.analyzing_text': "Hmm... Let's see...",
    }
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('ko');

    useEffect(() => {
        const saved = localStorage.getItem('language') as Language;
        if (saved && (saved === 'ko' || saved === 'en')) {
            setLanguage(saved);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const t = (key: string) => {
        return translations[language][key] || key;
    };

    return (
        <LocaleContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    const context = useContext(LocaleContext);
    if (!context) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }
    return context;
}
