export enum AppState {
  Welcome,
  ImageUpload,
  ManualInput,
  Generating,
  PlanReady,
  Recovery,
  Progress,
  RecentRunUpload,
}

export interface ManualData {
  age: string;
  height: string;
  weight: string;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced' | '';
  recentRun: string; // e.g., "10k in 55 minutes"
}

export interface TrainingDay {
  day: string; // e.g., "Monday"
  activity: string; // e.g., "Easy Run", "Intervals", "Rest"
  details: string; // e.g., "5km at a conversational pace", "6x400m at 5k pace with 400m recovery jogs"
}

export interface TrainingWeek {
  week: number;
  summary: string; // e.g., "Focus on building aerobic base."
  days: TrainingDay[];
}

export interface TrainingPlan {
  title: string; // e.g., "12-Week Marathon Training Plan"
  overview: string; // A brief overview of the plan's philosophy.
  weeks: TrainingWeek[];
}

export interface RecoveryRoutine {
    name: string;
    description: string;
    duration: string;
}

export interface RecoveryPlan {
    title: string;
    overview: string;
    routines: RecoveryRoutine[];
}

export interface ProgressInsight {
  trend: 'improvement' | 'decline' | 'stagnation' | 'mixed';
  observation: string; // e.g., "Your average pace has improved by 15 seconds per kilometer over the last 4 runs."
  recommendation: string; // e.g., "To continue this trend, focus on incorporating one tempo run per week."
}

export interface ProgressAnalysis {
  title: string; // e.g., "Your Progress Analysis: Last 4 Runs"
  summary: string; // A general summary of the user's progress.
  insights: ProgressInsight[];
}

export interface RunMetricFeedback {
    metric: string; // e.g., "Pace", "Distance", "Cadence", "Time"
    value: string; // e.g., "5:30 min/km", "10.2 km", "175 spm"
    feedback: string; // e.g., "Your pace was consistent...", "Excellent cadence for an easy run..."
}

export interface RecentRunAnalysis {
    title: string; // e.g., "Analysis of Your Recent Run"
    overallSummary: string; // A general summary of the run quality.
    metrics: RunMetricFeedback[];
}