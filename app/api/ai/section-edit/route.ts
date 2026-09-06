import { NextRequest, NextResponse } from 'next/server';
import { getAIProvider } from '@/lib/ai/factory';

export async function POST(req: NextRequest) {
  try {
    const { action, text, articleTitle, categoryName } = await req.json();

    if (!text || !action) {
      return NextResponse.json({ error: 'Text selection and action are required' }, { status: 400 });
    }

    const { provider } = await getAIProvider();

    let prompt = '';
    switch (action) {
      case 'Rewrite':
        prompt = `Rewrite the following section cleanly with professional technical authority:\n\n${text}`;
        break;
      case 'Shorten':
        prompt = `Shorten the following section while retaining all technical facts and steps:\n\n${text}`;
        break;
      case 'Expand':
        prompt = `Expand the following technical section with actionable steps, hardware/software details, and practical examples:\n\n${text}`;
        break;
      case 'Make More Technical':
        prompt = `Enhance the technical depth of this section with precise terminology, architecture references, and performance metrics:\n\n${text}`;
        break;
      case 'Make Easier to Understand':
        prompt = `Simplify the wording of this section so a non-technical reader can easily follow:\n\n${text}`;
        break;
      case 'Improve Clarity':
        prompt = `Improve the sentence structure, flow, and clarity of this section:\n\n${text}`;
        break;
      case 'Fix Grammar':
        prompt = `Fix all grammar, punctuation, and syntax errors in this text:\n\n${text}`;
        break;
      case 'Generate Example':
        prompt = `Add a practical code snippet or real-world technical step example to illustrate this section:\n\n${text}`;
        break;
      case 'Generate Table':
        prompt = `Convert or augment key comparative data from this text into a Markdown table:\n\n${text}`;
        break;
      default:
        prompt = `Refine and improve the following text section:\n\n${text}`;
    }

    const response = await provider.generateText(prompt);
    return NextResponse.json({ success: true, text: response.text });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Section edit failed' }, { status: 500 });
  }
}
