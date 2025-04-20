// 定义应用中使用的类型

export interface User {
  id: string;
  name?: string;
  email: string;
  settings?: UserSettings;
}

export interface UserSettings {
  theme?: string;
  reminderPreference?: 'high' | 'medium' | 'low';
  aiAnalysisEnabled?: boolean;
}

export interface JournalEntry {
  id: string;
  userId: string;
  content: string;
  emotionLabel?: string;
  theme?: string;
  aiAnalysis?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline?: Date;
  isCompleted: boolean;
  reminderTimes?: Date[];
  journalEntryId?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeeklyReport {
  id: string;
  userId: string;
  weekStart: Date;
  weekEnd: Date;
  emotionStats: Record<string, number>;
  themeSummary?: string;
  taskCompletionRate: number;
  insights?: string[];
}

export interface ExtractedTask {
  title: string;
  description?: string;
  deadline?: Date;
  selected?: boolean;
}
