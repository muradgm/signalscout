import type {
  GenerateOutreachInput,
  GeneratedOutreachDraft,
  OutreachGenerator,
} from '@signalscout/core';

const replaceWholeWord = (
  value: string,
  pattern: RegExp,
  replacement: string,
): string => value.replace(pattern, replacement);

const tightenSubject = (subject: string, input: GenerateOutreachInput): string => {
  let nextSubject = subject.trim();

  if (
    input.signals.outreachFit === 'good' &&
    /trust and booking/i.test(nextSubject)
  ) {
    nextSubject = `Quick thought on booking at ${input.lead.companyName}`;
  }

  return nextSubject;
};

const tightenBody = (body: string, input: GenerateOutreachInput): string => {
  if (input.signals.outreachFit !== 'good') {
    return body.trim();
  }

  let nextBody = body.trim();

  nextBody = replaceWholeWord(
    nextBody,
    /the long-standing local trust and family feel/gi,
    'the long-standing local presence and family feel',
  );
  nextBody = replaceWholeWord(
    nextBody,
    /the long-standing local trust/gi,
    'the long-standing local presence',
  );
  nextBody = replaceWholeWord(
    nextBody,
    /What stood out is that/gi,
    'My main thought is that',
  );
  nextBody = replaceWholeWord(
    nextBody,
    /a bit softer than it should/gi,
    'a little softer than it should',
  );
  nextBody = replaceWholeWord(
    nextBody,
    /That usually means some people are probably convinced, but not nudged quite enough to book\./gi,
    'So someone who already feels good about the practice may still not get pushed quite enough to book.',
  );
  nextBody = replaceWholeWord(
    nextBody,
    /If helpful, I can send over a few very specific changes I(?:['’]|â€™)d test first\./gi,
    "If useful, I can send over 2 or 3 specific changes I'd test first.",
  );

  return nextBody;
};

const tightenReasoning = (
  reasoning: string,
  input: GenerateOutreachInput,
): string => {
  if (input.signals.outreachFit !== 'good') {
    return reasoning.trim();
  }

  return reasoning
    .replace(/strong trust-building material/gi, 'strong trust material')
    .trim();
};

export class OutreachPolishingLayer implements OutreachGenerator {
  constructor(private readonly delegate: OutreachGenerator) {}

  async generate(
    input: GenerateOutreachInput,
  ): Promise<GeneratedOutreachDraft> {
    const draft = await this.delegate.generate(input);

    return {
      ...draft,
      subject: draft.subject === null ? null : tightenSubject(draft.subject, input),
      body: draft.body === null ? null : tightenBody(draft.body, input),
      reasoning: tightenReasoning(draft.reasoning, input),
    };
  }
}
