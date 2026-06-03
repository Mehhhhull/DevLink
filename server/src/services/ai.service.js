import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/config.js";

const genAI = new GoogleGenerativeAI(config.GOOGLE_GENAI_API_KEY);

async function runJudge(prompt) {
  try {
    if (!config.GOOGLE_GENAI_API_KEY) {
      throw new Error("Google GenAI API key is not configured");
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    let responseText = response.text();
    
    // Clean up markdown formatting from AI response
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Parse JSON response
    return JSON.parse(responseText);

  } catch (error) {
    console.error("Judge Error:", error);
    return {
      error: true,
      message: error.message,
      score: 5,
      criteria: "error", 
      strengths: [],
      weaknesses: [],
      judgeReasoning: `Error: ${error.message}`,
      improvementSuggestions: []
    };
  }
}

async function evaluateInnovation(idea) {
  return runJudge(`Rate this hackathon idea for innovation (1-10): ${idea}

Respond with this JSON format:
{
  "criteria": "innovation",
  "score": 7,
  "strengths": ["creative approach"],
  "weaknesses": ["needs more detail"], 
  "judgeReasoning": "Brief explanation",
  "improvementSuggestions": ["add unique features"]
}`);
}

async function evaluateFeasibility(idea) {
  return runJudge(`Rate this hackathon idea for feasibility (1-10): ${idea}

Respond with this JSON format:
{
  "criteria": "feasibility", 
  "score": 6,
  "strengths": ["realistic scope"],
  "weaknesses": ["time constraints"],
  "risks": ["technical complexity"],
  "judgeReasoning": "Brief explanation",
  "improvementSuggestions": ["simplify features"]
}`);
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
  try {
    const scores = {};
    
    Object.entries(results).forEach(([key, evaluation]) => {
      if (evaluation && !evaluation.error && typeof evaluation.score === 'number' && evaluation.score > 0) {
        scores[key] = evaluation.score;
      } else {
        scores[key] = 5; // Default fallback
      }
    });

    const overallScore = (
      scores.innovation * 0.25 +
      scores.feasibility * 0.25 +
      scores.technical * 0.20 +
      scores.appeal * 0.20 +
      scores.scope * 0.10
    ).toFixed(1);

    return overallScore;
  } catch (error) {
    console.error("Error calculating overall score:", error);
    return "5.0";
  }
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