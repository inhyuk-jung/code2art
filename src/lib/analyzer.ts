import * as Babel from '@babel/standalone';

export interface CodeMetrics {
    complexity: number; // 0.0 to 1.0
    cohesion: number;   // 0.0 to 1.0
    consistency: number;// 0.0 to 1.0
    coupling: number;   // 0.0 to 1.0
    depth: number;      // 0.0 to 1.0 (Nesting depth)
    readability: number; // 0.0 to 1.0 (Naming descriptiveness)
    sentiment: number;  // 0.0 to 1.0 (Positive vs Negative comments/keywords)
    paradigm: 'oop' | 'fp' | 'procedural';
    linesOfCode: number;
    raw: {
        branches: number;
        functions: number;
        magicNumbers: number;
        importsAndGlobals: number;
        maxDepth: number;
        avgNameLength: number;
        sentimentScore: number;
        oopScore: number;
        fpScore: number;
    };
}

// A simple AST walker
function walk(node: any, visitor: Record<string, (node: any) => void>) {
    if (!node) return;
    if (Array.isArray(node)) {
        node.forEach(n => walk(n, visitor));
        return;
    }
    if (typeof node === 'object' && typeof node.type === 'string') {
        if (visitor[node.type]) {
            visitor[node.type](node);
        }
        for (const key in node) {
            if (key !== 'loc' && key !== 'tokens' && key !== 'comments' && key !== 'leadingComments' && key !== 'innerComments' && key !== 'trailingComments') {
                walk(node[key], visitor);
            }
        }
    }
}

import { SupportedLanguage } from '@/components/CodeEditor';

export function analyzeCode(code: string, language: SupportedLanguage): CodeMetrics {
    const lines = code.split('\n').length;
    let branches = 0;
    let functions = 0;
    let magicNumbers = 0;
    let importsAndGlobals = 0;
    let maxDepth = 0;

    // For Readability
    let nameLengthSum = 0;
    let nameCount = 0;

    // For Sentiment
    const positiveWords = ['good', 'great', 'awesome', 'nice', 'clean', 'wow', 'perfect', 'yay'];
    const negativeWords = ['bad', 'hack', 'shit', 'fuck', 'todo', 'fixme', 'ugly', 'wtf', 'temp', 'error'];
    let sentimentScore = 0; // Starts neutral, + for positive, - for negative words in code

    // For Paradigm
    let oopScore = 0;
    let fpScore = 0;

    // Sentiment Heuristic (Naive regex scan over whole code)
    const lowerCode = code.toLowerCase();
    positiveWords.forEach(w => { sentimentScore += (lowerCode.match(new RegExp('\\b' + w + '\\b', 'g')) || []).length; });
    negativeWords.forEach(w => { sentimentScore -= (lowerCode.match(new RegExp('\\b' + w + '\\b', 'g')) || []).length; });

    if (!code.trim()) {
        return {
            complexity: 0.5, cohesion: 0.5, consistency: 0.5, coupling: 0.5,
            depth: 0.0, readability: 0.5, sentiment: 0.5, paradigm: 'procedural',
            linesOfCode: lines,
            raw: { branches: 0, functions: 0, magicNumbers: 0, importsAndGlobals: 0, maxDepth: 0, avgNameLength: 0, sentimentScore: 0, oopScore: 0, fpScore: 0 }
        };
    }

    if (language === 'javascript' || language === 'typescript') {
        try {
            // @ts-ignore: parse is available in the actual module but sometimes missing in types
            const result = Babel.transform(code, {
                presets: ['typescript', 'react'],
                filename: 'source.tsx',
                ast: true
            });

            if (result && result.ast) {
                // To track depth
                let currentDepth = 0;

                const enterNode = () => { currentDepth++; if (currentDepth > maxDepth) maxDepth = currentDepth; };
                const exitNode = () => { currentDepth--; };

                // Custom walk to track depth
                function walkWithDepth(node: any, visitor: Record<string, (node: any) => void>) {
                    if (!node) return;
                    if (Array.isArray(node)) {
                        node.forEach(n => walkWithDepth(n, visitor));
                        return;
                    }
                    if (typeof node === 'object' && typeof node.type === 'string') {
                        // Increase depth for block statements
                        let isBlock = node.type === 'BlockStatement' || node.type === 'IfStatement' || node.type === 'ForStatement' || node.type === 'WhileStatement';
                        if (isBlock) enterNode();

                        if (visitor[node.type]) {
                            visitor[node.type](node);
                        }
                        for (const key in node) {
                            if (key !== 'loc' && key !== 'tokens' && key !== 'comments' && key !== 'leadingComments' && key !== 'innerComments' && key !== 'trailingComments') {
                                walkWithDepth(node[key], visitor);
                            }
                        }

                        if (isBlock) exitNode();
                    }
                }

                walkWithDepth(result.ast, {
                    IfStatement: () => branches++,
                    ForStatement: () => branches++,
                    WhileStatement: () => branches++,
                    SwitchStatement: () => branches++,
                    FunctionDeclaration: (node) => { functions++; },
                    ArrowFunctionExpression: () => { functions++; fpScore++; }, // Arrow functions bump FP
                    FunctionExpression: () => functions++,
                    ImportDeclaration: () => importsAndGlobals++,
                    NumericLiteral: (node) => {
                        if (node.value !== 0 && node.value !== 1 && node.value !== -1) {
                            magicNumbers++;
                        }
                    },
                    Identifier: (node) => {
                        if (node.name === 'window' || node.name === 'document' || node.name === 'global') {
                            importsAndGlobals++;
                        }
                        nameLengthSum += node.name.length;
                        nameCount++;
                    },
                    ClassDeclaration: () => oopScore += 5,
                    ThisExpression: () => oopScore++,
                    CallExpression: (node) => {
                        if (node.callee && node.callee.property && node.callee.property.name) {
                            const name = node.callee.property.name;
                            if (['map', 'reduce', 'filter', 'flatMap'].includes(name)) fpScore += 2;
                        }
                    }
                });
            }
        } catch (err) {
            console.error("Failed to parse JS/TS code:", err);
            // Fallback heuristics
            branches = (code.match(/if\s*\(|for\s*\(|while\s*\(|switch\s*\(/g) || []).length;
            functions = (code.match(/function\s+\w+|\w+\s*=>/g) || []).length;
            importsAndGlobals = (code.match(/import\s+|require\(/g) || []).length;
        }
    } else if (language === 'python') {
        branches = (code.match(/elif\s+|if\s+|for\s+|while\s+|match\s+|case\s+/g) || []).length;
        functions = (code.match(/def\s+\w+|class\s+\w+/g) || []).length;
        importsAndGlobals = (code.match(/import\s+|from\s+|global\s+|nonlocal\s+/g) || []).length;
    } else if (language === 'java' || language === 'csharp' || language === 'cpp') {
        branches = (code.match(/if\s*\(|else\s+if\s*\(|for\s*\(|while\s*\(|switch\s*\(|case\s+/g) || []).length;
        functions = (code.match(/(public|private|protected)?\s*\w+\s+\w+\s*\([^)]*\)\s*\{/g) || []).length;
        importsAndGlobals = (code.match(/import\s+|using\s+|#include\s+/g) || []).length;
    } else if (language === 'php') {
        branches = (code.match(/if\s*\(|elseif\s*\(|for\s*\(|foreach\s*\(|while\s*\(|switch\s*\(|case\s+/g) || []).length;
        functions = (code.match(/function\s+\w+\s*\(/g) || []).length;
        importsAndGlobals = (code.match(/require_once|require|include_once|include|use\s+|namespace\s+/g) || []).length;
    } else if (language === 'ruby') {
        branches = (code.match(/elsif|if\s+|unless\s+|for\s+|while\s+|case\s+|when\s+/g) || []).length;
        functions = (code.match(/def\s+\w+|class\s+\w+|module\s+\w+/g) || []).length;
        importsAndGlobals = (code.match(/require\s+|require_relative\s+|include\s+|extend\s+/g) || []).length;
    } else if (language === 'go') {
        branches = (code.match(/if\s+|for\s+|switch\s+|case\s+|select\s+/g) || []).length;
        functions = (code.match(/func\s+(?:\([^)]+\)\s+)?\w+\s*\(/g) || []).length;
        importsAndGlobals = (code.match(/import\s+(?:\([^)]+\)|"[^"]+")/g) || []).length;
    } else if (language === 'swift') {
        branches = (code.match(/if\s+|guard\s+|for\s+|while\s+|switch\s+|case\s+/g) || []).length;
        functions = (code.match(/func\s+\w+|class\s+\w+|struct\s+\w+|enum\s+\w+/g) || []).length;
        importsAndGlobals = (code.match(/import\s+/g) || []).length;
    } else if (language === 'kotlin') {
        branches = (code.match(/if\s*\(|else\s+if\s*\(|for\s*\(|while\s*\(|when\s*\(/g) || []).length;
        functions = (code.match(/fun\s+\w+|class\s+\w+|interface\s+\w+/g) || []).length;
        importsAndGlobals = (code.match(/import\s+|package\s+/g) || []).length;
    } else if (language === 'rust') {
        branches = (code.match(/if\s+|else\s+if\s+|for\s+|while\s+|match\s+|loop\s+/g) || []).length;
        functions = (code.match(/fn\s+\w+|impl\s+|struct\s+\w+|enum\s+\w+/g) || []).length;
        importsAndGlobals = (code.match(/use\s+|mod\s+|extern\s+crate\s+/g) || []).length;
    } else if (language === 'sql') {
        branches = (code.match(/CASE|WHEN|IF|ELSE|WHILE/gi) || []).length;
        functions = (code.match(/CREATE\s+(?:PROCEDURE|FUNCTION|VIEW|TABLE)/gi) || []).length;
        importsAndGlobals = (code.match(/JOIN|USE|DATABASE/gi) || []).length;
    } else if (language === 'html' || language === 'css') {
        // Less logic-driven, different heuristic meaning
        branches = (code.match(/class=|id=|href=|src=|:|@media|@keyframes|@supports/g) || []).length;
        functions = (code.match(/<\w+|[.#\w]+\s*\{/g) || []).length; // Tags or CSS blocks
        importsAndGlobals = (code.match(/<link|<script|@import|url\(/g) || []).length;
    }

    // Common numeric literals fallback for non-JS languages
    if (language !== 'javascript' && language !== 'typescript') {
        magicNumbers = (code.match(/\b\d+\b/g) || []).length;
        if (magicNumbers > 0) magicNumbers = Math.max(0, magicNumbers - (code.match(/\b0\b|\b1\b|-1\b/g) || []).length);

        // Regex fallback for naming
        const potentialNames = code.match(/[a-zA-Z_]\w*/g) || [];
        potentialNames.forEach(n => { nameLengthSum += n.length; });
        nameCount = potentialNames.length;

        // Regex fallback for depth string measuring indented spaces
        const indents = code.match(/^[ \t]+/gm) || [];
        let maxIndent = 1;
        indents.forEach(ind => { if (ind.length > maxIndent) maxIndent = ind.length; });
        maxDepth = Math.max(maxDepth, Math.floor(maxIndent / 4));

        // Regex fallback for paradigm
        oopScore += (code.match(/class\s+|public\s+|private\s+|this\.|self\./g) || []).length;
        fpScore += (code.match(/map\(|reduce\(|filter\(|=>|->/g) || []).length;
    }

    // Normalizations
    const complexityRatio = Math.min(branches / Math.max(lines, 1), 0.3);
    const normalizedComplexity = complexityRatio / 0.3;

    const expectedFunctions = lines / 15;
    const cohesionRatio = Math.min(functions / Math.max(expectedFunctions, 1), 1.0);
    const normalizedCohesion = functions === 0 ? 0.2 : cohesionRatio;

    const magicRatio = Math.min(magicNumbers / Math.max(lines, 1), 0.1);
    const normalizedConsistency = Math.max(1.0 - (magicRatio / 0.1), 0.0);

    const couplingRatio = Math.min(importsAndGlobals / Math.max(lines, 1), 0.1);
    const normalizedCoupling = couplingRatio / 0.1;

    // Depth Normalization (max 10 depth)
    const normalizedDepth = Math.min(maxDepth / 10, 1.0);

    // Readability (Avg name length, ideal 5~15 chars)
    const avgNameLength = nameCount > 0 ? nameLengthSum / nameCount : 0;
    let normalizedReadability = 0.5;
    if (avgNameLength > 0) {
        if (avgNameLength < 5) normalizedReadability = Math.max(0, avgNameLength / 5); // 0.0~1.0
        else if (avgNameLength > 20) normalizedReadability = Math.max(0, 1.0 - ((avgNameLength - 20) / 20)); // decays
        else normalizedReadability = 1.0;
    }

    // Sentiment (-10 to 10 -> 0.0 to 1.0)
    const normalizedSentiment = Math.max(0.0, Math.min(1.0, (sentimentScore + 5) / 10));

    // Paradigm Eval
    let paradigm: 'oop' | 'fp' | 'procedural' = 'procedural';
    if (oopScore > fpScore && oopScore > 2) paradigm = 'oop';
    else if (fpScore > oopScore && fpScore > 2) paradigm = 'fp';

    return {
        complexity: normalizedComplexity,
        cohesion: normalizedCohesion,
        consistency: normalizedConsistency,
        coupling: normalizedCoupling,
        depth: normalizedDepth,
        readability: normalizedReadability,
        sentiment: normalizedSentiment,
        paradigm,
        linesOfCode: lines,
        raw: {
            branches,
            functions,
            magicNumbers,
            importsAndGlobals,
            maxDepth,
            avgNameLength,
            sentimentScore,
            oopScore,
            fpScore
        }
    };
}
