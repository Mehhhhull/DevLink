import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/config.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load knowledge base
let knowledgeBase = null;
try {
  const knowledgePath = path.join(__dirname, '../data/knowledge.json');
  const knowledgeData = fs.readFileSync(knowledgePath, 'utf8');
  knowledgeBase = JSON.parse(knowledgeData);
  console.log(`Loaded knowledge base with ${knowledgeBase.winningProjects.length} winning projects`);
} catch (error) {
  console.error('Failed to load knowledge base:', error);
  knowledgeBase = { winningProjects: [] };
}

// Helper function to get relevant winning projects for context
function getRelevantProjects(criteria, projectType = null) {
  if (!knowledgeBase || !knowledgeBase.winningProjects) return [];
  
  let projects = knowledgeBase.winningProjects;
  
  // Filter by project type if specified
  if (projectType) {
    projects = projects.filter(p => 
      p.category.toLowerCase().includes(projectType.toLowerCase()) ||
      p.techStack.some(tech => tech.toLowerCase().includes(projectType.toLowerCase()))
    );
  }
  
  // Sort by criteria score and return top 3-5 examples
  return projects
    .sort((a, b) => (b.scores[criteria] || 0) - (a.scores[criteria] || 0))
    .slice(0, Math.min(5, projects.length))
    .map(p => ({
      name: p.name,
      hackathon: p.hackathon,
      category: p.category,
      description: p.description,
      score: p.scores[criteria],
      winningFactors: p.winningFactors[criteria] || [],
      keyFeatures: p.keyFeatures.slice(0, 2), 
      demoImpact: p.demoImpact
    }));
}

const genAI = new GoogleGenerativeAI(config.GOOGLE_GENAI_API_KEY);

async function runJudge(prompt) {
  try {
    if (!config.GOOGLE_GENAI_API_KEY) {
      throw new Error("Google GenAI API key is not configured");
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text().trim();
    
    // Safely parse the direct JSON response
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
  const relevantProjects = getRelevantProjects('innovation');
  console.log('🔍 Innovation evaluation - Found relevant projects:', relevantProjects.map(p => p.name));
  
  return runJudge(`You are an MLH Hackathon Judge evaluating INNOVATION.

REFERENCE: Here are examples of HIGHLY INNOVATIVE winning projects (scores 8-10):

${relevantProjects.map(p => `
• ${p.name} (${p.hackathon}) - Score: ${p.score}/10
  Category: ${p.category}
  What made it innovative: ${p.winningFactors.join(' ')}
  Key features: ${p.keyFeatures.join(', ')}
`).join('\n')}

PROJECT IDEA TO EVALUATE:
${idea}

Compare this idea against the winning examples above. Evaluate:
- Novelty and creativity
- Unique approach to problem-solving  
- How different it is from existing solutions
- Technical or conceptual breakthroughs

Use the reference projects as benchmarks for scoring (8-10 = highly innovative like examples above).

OUTPUT JSON:
{
  "criteria": "innovation",
  "score": 0,
  "strengths": [],
  "weaknesses": [],
  "judgeReasoning": "",
  "improvementSuggestions": [],
  "comparedTo": "Reference winning projects with similar innovation patterns"
}`);
}

async function evaluateFeasibility(idea) {
  const relevantProjects = getRelevantProjects('feasibility');
  
  return runJudge(`You are an MLH Hackathon Judge evaluating FEASIBILITY.

REFERENCE: Here are examples of HIGHLY FEASIBLE winning projects (scores 8-10):

${relevantProjects.map(p => `
• ${p.name} (${p.hackathon}) - Score: ${p.score}/10
  Category: ${p.category}
  Why it was feasible: ${p.winningFactors.join(' ')}
  Execution approach: ${p.keyFeatures.join(', ')}
`).join('\n')}

PROJECT IDEA TO EVALUATE:
${idea}

Compare against the winning examples above. Evaluate:
- Can this be built in 24-48 hours?
- Realistic scope for hackathon timeframe
- Available tools and technologies
- Team skill requirements
- Risk factors and complexity

Use the reference projects as benchmarks for scoring.

OUTPUT JSON:
{
  "criteria": "feasibility",
  "score": 0,
  "strengths": [],
  "weaknesses": [],
  "risks": [],
  "judgeReasoning": "",
  "improvementSuggestions": [],
  "comparedTo": "Reference winning projects with proven feasibility"
}`);
}

async function evaluateTechnical(idea) {
  const relevantProjects = getRelevantProjects('technical');

  return runJudge(`You are an MLH Hackathon Judge evaluating TECHNICAL DEPTH.

REFERENCE: Here are examples of TECHNICALLY IMPRESSIVE winning projects (scores 8-10):

${relevantProjects.map(p => `
• ${p.name} (${p.hackathon}) - Score: ${p.score}/10
  Tech Stack: ${p.category}
  Technical achievements: ${p.winningFactors.join(' ')}
  Complex features: ${p.keyFeatures.join(', ')}
`).join('\n')}

PROJECT IDEA TO EVALUATE:
${idea}

Compare against the winning examples above. Evaluate:
- Engineering complexity and sophistication
- Architecture and system design
- Backend/AI/infrastructure challenges
- Technical innovation and depth
- Implementation difficulty

Use the reference projects as benchmarks for scoring.

OUTPUT JSON:
{
 "criteria":"technical",
 "score":0,
 "strengths":[],
 "weaknesses":[],
 "technicalRisks":[],
 "judgeReasoning":"",
 "improvementSuggestions":[],
 "comparedTo":"Reference winning projects with similar technical complexity"
}`);
}

async function evaluateAppeal(idea) {
  const relevantProjects = getRelevantProjects('appeal');

  return runJudge(`You are an MLH Hackathon Judge evaluating JUDGE APPEAL.

REFERENCE: Here are examples of HIGHLY APPEALING winning projects (scores 8-10):

${relevantProjects.map(p => `
• ${p.name} (${p.hackathon}) - Score: ${p.score}/10
  Category: ${p.category}
  Why judges loved it: ${p.winningFactors.join(' ')}
  Demo impact: ${p.demoImpact}
`).join('\n')}

PROJECT IDEA TO EVALUATE:
${idea}

Compare against the winning examples above. Evaluate:
- Wow factor and excitement level
- Demo potential and presentation impact
- Judge engagement and memorability
- Market interest and practical value
- Visual and interactive appeal

Use the reference projects as benchmarks for scoring.

OUTPUT JSON:
{
 "criteria":"appeal",
 "score":0,
 "strengths":[],
 "weaknesses":[],
 "audienceReactionPrediction":"",
 "judgeReasoning":"",
 "improvementSuggestions":[],
 "comparedTo":"Reference winning projects with proven judge appeal"
}`);
}

async function evaluateScope(idea) {
  const relevantProjects = getRelevantProjects('scope');

  return runJudge(`You are an MLH Hackathon Judge evaluating PROJECT SCOPE.

REFERENCE: Here are examples of PERFECTLY SCOPED winning projects (scores 8-10):

${relevantProjects.map(p => `
• ${p.name} (${p.hackathon}) - Score: ${p.score}/10
  Category: ${p.category}
  Perfect scope because: ${p.winningFactors.join(' ')}
  Focused features: ${p.keyFeatures.join(', ')}
`).join('\n')}

PROJECT IDEA TO EVALUATE:
${idea}

Compare against the winning examples above. Evaluate:
- Is this the right size for a hackathon MVP?
- Feature balance and priority
- Scope boundaries and focus
- Hackathon time constraints
- Realistic deliverable expectations

Use the reference projects as benchmarks for scoring.

OUTPUT JSON:
{
 "criteria":"scope",
 "score":0,
 "strengths":[],
 "weaknesses":[],
 "scopeIssues":[],
 "judgeReasoning":"",
 "improvementSuggestions":[],
 "comparedTo":"Reference winning projects with optimal hackathon scope"
}`);
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
  const topProjects = knowledgeBase?.winningProjects?.slice(0, 3) || [];

  return runJudge(`You are the HEAD MLH HACKATHON JUDGE providing final evaluation.

CONTEXT: Here are some Grand Prize winning projects for reference:
${topProjects.map(p => `
• ${p.name} (${p.hackathon}) - ${p.placement}
  Overall excellence: Innovation ${p.scores.innovation}, Technical ${p.scores.technical}, Appeal ${p.scores.appeal}
  Winning edge: ${p.demoImpact}
`).join('\n')}

CURRENT PROJECT EVALUATION RESULTS:
${JSON.stringify(results, null, 2)}

Based on the individual scores and comparing to winning project patterns, generate your final verdict.

OUTPUT JSON:
{
 "overallVerdict":"",
 "winningProbability":"",
 "biggestStrength":"",
 "biggestWeakness":"",
 "topImprovements":[],
 "comparedToWinners":"How this compares to typical MLH winning projects"
}`);
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