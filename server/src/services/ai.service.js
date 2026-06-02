import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

async function runJudge(prompt) {
  try {

    const response =
      await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

    return JSON.parse(response.text());

  }

  catch (error) {

    console.error("Judge Error:", error);

    return {
      error: true,
      message: error.message,
    };
  }
}

async function evaluateInnovation(idea) {

  return runJudge(`

You are an expert MLH Hackathon Judge evaluating ONLY INNOVATION.

PROJECT IDEA:
${idea}

Evaluate:
- Originality
- Differentiation
- Creative problem solving
- Uniqueness

OUTPUT JSON:

{
 "criteria":"innovation",
 "score":0,
 "strengths":[],
 "weaknesses":[],
 "judgeReasoning":"",
 "improvementSuggestions":[]
}

`);
}

async function evaluateFeasibility(idea) {

  return runJudge(`

You are an MLH Hackathon Judge evaluating ONLY FEASIBILITY.

PROJECT IDEA:
${idea}

Evaluate:
- Technical feasibility
- Build realism
- Deployment practicality
- Constraints
- Risks

OUTPUT JSON:

{
 "criteria":"feasibility",
 "score":0,
 "strengths":[],
 "weaknesses":[],
 "risks":[],
 "judgeReasoning":"",
 "improvementSuggestions":[]
}

`);
}

async function evaluateTechnical(idea) {

  return runJudge(`

You are an MLH Hackathon Judge evaluating ONLY TECHNICAL DEPTH.

PROJECT IDEA:
${idea}

Evaluate:
- Engineering complexity
- Architecture
- Backend / AI depth
- Infrastructure challenge

OUTPUT JSON:

{
 "criteria":"technical",
 "score":0,
 "strengths":[],
 "weaknesses":[],
 "technicalRisks":[],
 "judgeReasoning":"",
 "improvementSuggestions":[]
}

`);
}

async function evaluateAppeal(idea) {

  return runJudge(`

You are an MLH Hackathon Judge evaluating ONLY JUDGE APPEAL.

PROJECT IDEA:
${idea}

Evaluate:
- Wow factor
- Demo quality
- User excitement
- Memorability
- Market interest

OUTPUT JSON:

{
 "criteria":"appeal",
 "score":0,
 "strengths":[],
 "weaknesses":[],
 "audienceReactionPrediction":"",
 "judgeReasoning":"",
 "improvementSuggestions":[]
}

`);
}

async function evaluateScope(idea) {

  return runJudge(`

You are an MLH Hackathon Judge evaluating ONLY PROJECT SCOPE.

PROJECT IDEA:
${idea}

Evaluate:
- MVP realism
- Feature balance
- Scope size
- Hackathon suitability

OUTPUT JSON:

{
 "criteria":"scope",
 "score":0,
 "strengths":[],
 "weaknesses":[],
 "scopeIssues":[],
 "judgeReasoning":"",
 "improvementSuggestions":[]
}

`);
}

function calculateOverallScore(results) {

  return (

    results.innovation.score * 0.25 +

    results.feasibility.score * 0.25 +

    results.technical.score * 0.20 +

    results.appeal.score * 0.20 +

    results.scope.score * 0.10

  ).toFixed(1);
}

async function generateHeadJudgeSummary(results) {

  return runJudge(`

You are the HEAD MLH HACKATHON JUDGE.

Here are individual evaluations:

${JSON.stringify(results,null,2)}

Generate final review.

OUTPUT JSON:

{
 "overallVerdict":"",
 "winningProbability":"",
 "biggestStrength":"",
 "biggestWeakness":"",
 "topImprovements":[]
}

`);
}

async function evaluateHackathonIdea(idea) {

  const [

    innovation,
    feasibility,
    technical,
    appeal,
    scope,

  ] = await Promise.all([

    evaluateInnovation(idea),

    evaluateFeasibility(idea),

    evaluateTechnical(idea),

    evaluateAppeal(idea),

    evaluateScope(idea),

  ]);

  const evaluations = {

    innovation,
    feasibility,
    technical,
    appeal,
    scope,

  };

  const overallScore =
    calculateOverallScore(evaluations);

  const summary =
    await generateHeadJudgeSummary({
      ...evaluations,
      overallScore,
    });

  return {

    overallScore,

    evaluations,

    summary,

  };
}

export { evaluateHackathonIdea };