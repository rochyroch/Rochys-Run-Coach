import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ManualData, TrainingPlan, RecoveryPlan, ProgressAnalysis, RecentRunAnalysis } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

const trainingSystemInstruction = `You are an AI assistant that functions as an expert running coach for Rochys Run Coach.
Your SOLE function is to generate a personalized training plan in a valid, parseable JSON format based on user-provided criteria.
The response MUST be ONLY the JSON object. Do not include any text, conversation, or markdown characters like \`\`\`json\`\`\` before or after the JSON object.
The JSON you output MUST be perfectly valid and parseable. Ensure there are no syntax errors, trailing commas, or extraneous characters.

The JSON object must conform to this TypeScript interface:
interface TrainingPlan {
  title: string; // e.g., "8-Week Half Marathon Training Plan for Sub-2 Hours"
  overview: string; // A detailed overview of the plan's philosophy and what the runner should expect.
  weeks: {
    week: number;
    summary: string; // A brief summary of the week's focus.
    days: {
      day: string; // "Monday", "Tuesday", etc.
      activity: string; // e.g., "Easy Run", "Intervals", "Rest", "Long Run", "Cross-Training"
      details: string; // Specifics of the workout. e.g., "5km at a conversational pace", "6x400m at 5k pace with 400m recovery jogs"
    }[];
  }[];
}
`;

const recoverySystemInstruction = `You are an AI assistant that functions as an expert physical therapist and stretching coach for Rochys Run Coach.
Your SOLE function is to generate a personalized recovery or stretching routine in a valid, parseable JSON format based on user-provided criteria.
The response MUST be ONLY the JSON object. Do not include any text, conversation, or markdown characters like \`\`\`json\`\`\` before or after the JSON object.
The JSON you output MUST be perfectly valid and parseable. Ensure there are no syntax errors, trailing commas, or extraneous characters.

The JSON object must conform to this TypeScript interface:
interface RecoveryPlan {
  title: string; // e.g., "Post-Run Hamstring Recovery"
  overview: string; // A detailed overview of the routine's benefits and when to perform it.
  routines: {
    name: string; // "Cat-Cow Stretch"
    description: string; // Detailed instructions on how to perform the stretch.
    duration: string; // e.g. "2 sets of 30 seconds"
  }[];
}
`;

const progressSystemInstruction = `You are an AI assistant that functions as an expert running coach for Rochys Run Coach, specializing in performance analysis.
Your SOLE function is to analyze a series of running data screenshots and generate a progress analysis in a valid, parseable JSON format.
You must identify key trends in performance. Specifically look for changes in:
- **Pace:** Has it improved, declined, or stayed the same? By how much? Be specific with numbers if possible (e.g., pace improved from 5:30/km to 5:15/km).
- **Distance:** Is the user running longer, shorter, or similar distances?
- **Duration:** How has the time spent running changed?
- **Heart Rate:** If visible, analyze heart rate trends. Is the user's heart rate lower for similar efforts, indicating improved fitness?
- **Consistency:** Analyze the frequency of runs if multiple dates are visible.
For each trend you identify, create an insight. Your observations should be specific and data-driven (e.g., "Your average pace has improved by 15 seconds per kilometer."). Your recommendations should be actionable and tailored to the observation (e.g., "To continue improving your pace, consider incorporating 4x800m interval runs once a week.").
The response MUST be ONLY the JSON object. Do not include any text, conversation, or markdown characters like \`\`\`json\`\`\` before or after the JSON object.
The JSON you output MUST be perfectly valid and parseable. Ensure there are no syntax errors, trailing commas, or extraneous characters.

The JSON object must conform to this TypeScript interface:
interface ProgressAnalysis {
  title: string; // e.g., "Your Progress Analysis: Last 4 Runs"
  summary: string; // A general summary of the user's progress, commenting on overall trends.
  insights: {
    trend: 'improvement' | 'decline' | 'stagnation' | 'mixed';
    observation: string; // e.g., "Your average pace has improved by 15 seconds per kilometer over the last 4 runs."
    recommendation: string; // e.g., "To continue this trend, focus on incorporating one tempo run per week."
  }[];
}
`;

const recentRunSystemInstruction = `You are an AI assistant that functions as an expert running coach for Rochys Run Coach.
Your SOLE function is to analyze a screenshot of a single running activity and provide feedback on the performance in a valid, parseable JSON format.
Identify key metrics from the image, such as Pace, Distance, Cadence, Time, Heart Rate, etc. For each metric you find, provide the value you extracted and a brief, encouraging, and constructive feedback on it.
The response MUST be ONLY the JSON object. Do not include any text, conversation, or markdown characters like \`\`\`json\`\`\` before or after the JSON object.
The JSON you output MUST be perfectly valid and parseable.

The JSON object must conform to this TypeScript interface:
interface RecentRunAnalysis {
    title: string; // e.g., "Analysis of Your Recent 10k Run"
    overallSummary: string; // A general summary of the run quality, combining insights from all metrics.
    metrics: {
        metric: string; // e.g., "Pace", "Distance", "Cadence", "Time", "Heart Rate"
        value: string; // The value extracted from the image. e.g., "5:30 min/km", "10.2 km", "175 spm"
        feedback: string; // Constructive feedback on this specific metric. e.g., "Your pace was consistent and strong for this distance.", "Excellent cadence for an easy run, this helps with efficiency and reducing injury risk."
    }[];
}
`;


const cleanAndParseJson = <T,>(text: string): T => {
    let jsonStr = text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    try {
        return JSON.parse(jsonStr) as T;
    } catch (e) {
        console.error("Failed to parse JSON response:", jsonStr);
        throw new Error("AI response was not in the expected format. Please try again.");
    }
};

export const analyzeRunDataFromImage = async (base64Image: string, goal: string, weeksToRace: number): Promise<TrainingPlan> => {
  const userPrompt = `Based on the attached screenshot of run data, create a ${weeksToRace}-week training plan for this goal: "${goal}".`;

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };

  const textPart = { text: userPrompt };

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: model,
    contents: { parts: [imagePart, textPart] },
    config: {
        systemInstruction: trainingSystemInstruction,
        responseMimeType: "application/json",
    }
  });

  return cleanAndParseJson<TrainingPlan>(response.text);
};


export const generatePlanFromText = async (manualData: ManualData, goal: string, weeksToRace: number): Promise<TrainingPlan> => {
    const userPrompt = `Based on the following runner data, create a ${weeksToRace}-week training plan.
    - Runner Data: ${JSON.stringify(manualData)}
    - Goal: "${goal}"
    - Weeks to Race: ${weeksToRace}`;
  
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: model,
    contents: userPrompt,
    config: {
        systemInstruction: trainingSystemInstruction,
        responseMimeType: "application/json",
    }
  });

  return cleanAndParseJson<TrainingPlan>(response.text);
};

export const generateRecoveryRoutine = async (focusArea: string, specificMuscle: string): Promise<RecoveryPlan> => {
    const userPrompt = `Create a recovery and stretching routine.
    - Focus Area: ${focusArea}
    - Specific Muscle/Area (if any): ${specificMuscle || 'None specified'}`;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: userPrompt,
        config: {
            systemInstruction: recoverySystemInstruction,
            responseMimeType: "application/json",
        }
    });

    return cleanAndParseJson<RecoveryPlan>(response.text);
};

export const analyzeProgressFromImages = async (base64Images: string[]): Promise<ProgressAnalysis> => {
  const userPrompt = `Analyze my running progress based on the following run screenshots provided in order. Identify trends in my performance (like pace, distance, heart rate etc.), explain what these trends mean, and provide specific, actionable recommendations for my future training. Structure your analysis in the specified JSON format.`;

  const textPart = { text: userPrompt };
  const imageParts = base64Images.map(img => ({
    inlineData: {
      mimeType: 'image/jpeg',
      data: img,
    },
  }));

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: model,
    contents: { parts: [textPart, ...imageParts] },
    config: {
        systemInstruction: progressSystemInstruction,
        responseMimeType: "application/json",
    }
  });

  return cleanAndParseJson<ProgressAnalysis>(response.text);
};

export const analyzeRecentRunImage = async (base64Image: string): Promise<RecentRunAnalysis> => {
  const userPrompt = `Analyze the attached screenshot of my recent run and provide feedback on my performance.`;

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };

  const textPart = { text: userPrompt };

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: model,
    contents: { parts: [imagePart, textPart] },
    config: {
        systemInstruction: recentRunSystemInstruction,
        responseMimeType: "application/json",
    }
  });

  return cleanAndParseJson<RecentRunAnalysis>(response.text);
};