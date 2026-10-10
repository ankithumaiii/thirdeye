/**
 * Heuristic Classifier Service
 * Provides transparent, local classification of freeform bystander intervention inputs
 * Supporting both English and common Hinglish expressions.
 */

const PATTERNS = {
  Distract: [
    /\b(ask|question|direction|destination|time|clock|coffee|water|bottle|drop|spill|pretend|friend|excuse me|interrupt|table|umbrella|bus schedule)\b/i,
    /\b(dhyan bhatkao|kuch poochta|time poocho|rasta poocho|paani girao|pretend karo|dost ban ke|chai|baat shuru karo|dhyan hatao)\b/i
  ],
  Delegate: [
    /\b(call|security|police|officer|guard|librarian|conductor|driver|shopkeeper|bodega|cashier|staff|attendant|desk|help desk|intercom|dispatch|bystander|passengers|rally)\b/i,
    /\b(guard ko|security ko|police ko|dukaan wale|staff ko|librarian ko|conductor ko|madad mango|dusro ko bolo|bulao|shikayat karo)\b/i
  ],
  Document: [
    /\b(record|video|photo|picture|camera|note|write down|timestamp|log|badge|plate|carriage|car number|evidence|proof|discreetly)\b/i,
    /\b(video banao|photo kheecho|note kar|number likh|record karo|saboot|proof rakho|likh lo)\b/i
  ],
  Delay: [
    /\b(wait|hold door|stand nearby|stay close|watchful|observe|check in|afterwards|later|comfort|are you ok|are you okay|next stop|remain)\b/i,
    /\b(ruko|ruk jao|paas khade|baad mein|intezar|theek ho|halat poocho|nazar rakho|saath chalo)\b/i
  ],
  Direct: [
    /\b(stop|leave|back off|step back|step aside|shut up|don't touch|get away|blocking|firmly|confront|shout|yell|warn|give her space)\b/i,
    /\b(dur reh|chhod usko|peeche hat|chup ho|tameez se|hath mat laga|tang mat kar|ruk ja|mat karo)\b/i
  ]
};

export function classifyTextHeuristically(text, scenarioId = 'metro') {
  if (!text || typeof text !== 'string') {
    return {
      recognizedD: 'None',
      confidence: 0.1,
      source: 'heuristic',
      consequenceNarrative: 'No recognizable intervention action was detected in the submitted input.',
      actionCritique: 'The response lacked an actionable intervention method. In active harassment scenarios, deliberate clarity is vital.',
      potentialBenefits: ['Allows re-evaluating the scene'],
      potentialRisks: ['Hesitation may allow intimidation to escalate unopposed'],
      recommendedNextStep: 'Choose a clear strategy such as creating a polite distraction or enlisting a nearby bystander.'
    };
  }

  const scores = {
    Distract: 0,
    Delegate: 0,
    Document: 0,
    Delay: 0,
    Direct: 0
  };

  for (const [d, regexList] of Object.entries(PATTERNS)) {
    for (const regex of regexList) {
      const matches = text.match(new RegExp(regex, 'gi'));
      if (matches) {
        // Multi-word phrases carry more specific intent than single words
        const isPhrase = regex.source.includes(' ') || regex.source.includes('\\s');
        const weight = isPhrase ? 2.5 : 1.5;
        scores[d] += matches.length * weight;
      }
    }
  }

  // Find the highest scoring D
  let bestD = 'None';
  let highestScore = 0;
  for (const [d, score] of Object.entries(scores)) {
    if (score > highestScore) {
      highestScore = score;
      bestD = d;
    }
  }

  // Fallback defaults if score is low
  if (highestScore === 0) {
    // If text expresses speaking to the victim, default to Distract
    if (/talk|speak|look|approach|gesture/i.test(text)) {
      bestD = 'Distract';
      highestScore = 1;
    } else {
      bestD = 'None';
    }
  }

  const confidence = Math.min(0.95, Math.max(0.4, Number((0.55 + highestScore * 0.12).toFixed(2))));

  return generateHeuristicFeedback(bestD, text, scenarioId, confidence);
}

function generateHeuristicFeedback(d, userText, scenarioId, confidence) {
  const scenarioContexts = {
    metro: {
      location: 'metro carriage',
      authority: 'train operator or station security',
      distraction: 'asking about transit stops or travel times'
    },
    campus: {
      location: 'library corridor',
      authority: 'library help desk supervisor or campus safety',
      distraction: 'asking about study room bookings or academic schedules'
    },
    bus_stop: {
      location: 'curbside bus shelter',
      authority: 'corner bodega shopkeeper or transit driver',
      distraction: 'asking for the bus timetable or sharing an umbrella'
    }
  };

  const ctx = scenarioContexts[scenarioId] || scenarioContexts.metro;

  switch (d) {
    case 'Distract':
      return {
        recognizedD: 'Distract',
        confidence,
        source: 'heuristic',
        consequenceNarrative: `You casually intervene by engaging the affected person in everyday conversation in the ${ctx.location}. The aggressor pauses their intimidation, thrown off by the shift in attention.`,
        actionCritique: `Using Distraction (${ctx.distraction}) safely redirects focus away from the harasser without an aggressive confrontation.`,
        potentialBenefits: [
          'De-escalates tension without direct confrontation',
          'Gives the targeted person an easy social exit or reason to step away'
        ],
        potentialRisks: [
          'Aggressor may redirect verbal annoyance if they suspect intentional evasion'
        ],
        recommendedNextStep: 'Maintain calm conversation and help the person transition to a safer, more populated area.'
      };

    case 'Delegate':
      return {
        recognizedD: 'Delegate',
        confidence,
        source: 'heuristic',
        consequenceNarrative: `You reach out to third parties—contacting ${ctx.authority} or mobilizing nearby bystanders to observe together.`,
        actionCritique: 'Delegation spreads responsibility and brings official or collective oversight into the encounter.',
        potentialBenefits: [
          'Leverages institutional or communal authority',
          'Keeps your personal exposure low while securing trained intervention'
        ],
        potentialRisks: [
          'Assistance may take a few moments to arrive; maintain observation'
        ],
        recommendedNextStep: 'Stay in visual proximity and confirm that support personnel have engaged the situation.'
      };

    case 'Document':
      return {
        recognizedD: 'Document',
        confidence,
        source: 'heuristic',
        consequenceNarrative: `You discreetly log key details (location, timestamps, identifiers) of the incident in the ${ctx.location}.`,
        actionCritique: 'Documentation creates evidentiary accountability, but must be paired with immediate safety support.',
        potentialBenefits: [
          'Captures verifiable evidence for follow-up conduct or legal reviews',
          'Minimizes direct verbal provocation'
        ],
        potentialRisks: [
          'Documentation alone does not immediately de-escalate active physical distress'
        ],
        recommendedNextStep: 'Now that details are logged, consider a low-friction Distract action or check-in.'
      };

    case 'Delay':
      return {
        recognizedD: 'Delay',
        confidence,
        source: 'heuristic',
        consequenceNarrative: `You maintain a protective watch until the acute moment passes, then approach the affected person to check on their well-being.`,
        actionCritique: 'Delay focuses on aftercare and supporting the target once immediate physical barriers are removed.',
        potentialBenefits: [
          'Validates the victim\'s experience and restores emotional agency',
          'Avoids volatile clashes during high-friction moments'
        ],
        potentialRisks: [
          'Requires remaining alert in case the situation worsens before concluding'
        ],
        recommendedNextStep: 'Ask what support they need and respect their boundaries if they prefer privacy.'
      };

    case 'Direct':
      return {
        recognizedD: 'Direct',
        confidence,
        source: 'heuristic',
        consequenceNarrative: `You step in directly and set an unmistakable verbal boundary: demanding the harassment stop immediately.`,
        actionCritique: 'Direct intervention sets clear community standards, but elevates personal risk in confined or isolated spaces.',
        potentialBenefits: [
          'Immediately shatters the harasser\'s presumption of impunity',
          'Reassures the targeted person that someone is actively standing with them'
        ],
        potentialRisks: [
          'Significant risk of verbal counter-attack or physical escalation in confined environments'
        ],
        recommendedNextStep: 'Keep hands visible, do not invade personal space, and prepare to bring in additional bystanders.'
      };

    default:
      return {
        recognizedD: 'None',
        confidence,
        source: 'heuristic',
        consequenceNarrative: `Your action created ambiguity in the ${ctx.location}. The environment remains tense as the interaction continues without clear resolution.`,
        actionCritique: 'The entered intervention does not clearly align with one of the standard 5 Ds (Distract, Delegate, Document, Delay, Direct).',
        potentialBenefits: [
          'Provides an opportunity to reflect and choose a structured de-escalation tactic'
        ],
        potentialRisks: [
          'Unclear actions may be misinterpreted or fail to protect the affected person'
        ],
        recommendedNextStep: 'Choose a recognized strategy: create a simple distraction or delegate to nearby staff.'
      };
  }
}
