import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
    try {
        const { prompt, apiKey } = await req.json();

        if (!apiKey) {
            return NextResponse.json({ error: 'API key is required' }, { status: 400 });
        }

        const openai = new OpenAI({ apiKey: apiKey.trim() });

        const response = await openai.images.generate({
            model: 'dall-e-3',
            prompt,
            n: 1,
            size: '1024x1024',
        });

        return NextResponse.json({ data: response.data });
    } catch (err: any) {
        const message = err?.error?.message ?? err?.message ?? '이미지 생성 실패';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
