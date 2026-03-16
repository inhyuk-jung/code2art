import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
    try {
        const { prompt, apiKey } = await req.json();

        if (!apiKey) {
            return NextResponse.json({ error: 'API key is required' }, { status: 400 });
        }

        const openai = new OpenAI({ apiKey: apiKey.trim() });

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 600,
        });

        return NextResponse.json({ choices: response.choices });
    } catch (err: any) {
        const message = err?.error?.message ?? err?.message ?? '도슨트 생성 실패';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
