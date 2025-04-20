import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ExtractedTask } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 从日记内容中提取任务
export function extractTasksFromContent(content: string): ExtractedTask[] {
  const tasks: ExtractedTask[] = [];
  
  // 匹配"今天我要做..."、"明天计划..."等模式
  const regex = /(今天|明天|下周|这周|本周|最近)(?:我要|我想|计划|打算|需要)(.*?)(?:。|！|\.|!|$)/g;
  
  let match;
  while ((match = regex.exec(content)) !== null) {
    const timeIndicator = match[1];
    const taskContent = match[2].trim();
    
    if (taskContent) {
      // 根据时间指示词设置截止日期
      let deadline = new Date();
      switch (timeIndicator) {
        case '明天':
          deadline.setDate(deadline.getDate() + 1);
          break;
        case '下周':
          deadline.setDate(deadline.getDate() + 7);
          break;
        case '这周':
        case '本周':
          // 设置为本周五
          const day = deadline.getDay();
          const daysUntilFriday = day <= 5 ? 5 - day : 5 + 7 - day;
          deadline.setDate(deadline.getDate() + daysUntilFriday);
          break;
        case '最近':
          deadline.setDate(deadline.getDate() + 3);
          break;
        // 默认为今天
      }
      
      tasks.push({
        title: taskContent,
        description: `从日记中提取: "${match[0]}"`,
        deadline,
        selected: true
      });
    }
  }
  
  return tasks;
}

// 格式化日期显示
export function formatDate(date?: Date): string {
  if (!date) return '';
  
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// 简单的情绪分析（在没有AI API的情况下使用）
export function analyzeEmotion(content: string): string {
  const positiveWords = ['开心', '快乐', '高兴', '满意', '喜欢', '爱', '感谢', '感恩', '成功', '希望'];
  const negativeWords = ['难过', '伤心', '焦虑', '担心', '害怕', '生气', '失望', '沮丧', '压力', '痛苦'];
  const neutralWords = ['思考', '计划', '考虑', '决定', '认为', '觉得', '想', '感觉'];
  
  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;
  
  positiveWords.forEach(word => {
    const regex = new RegExp(word, 'g');
    const matches = content.match(regex);
    if (matches) positiveCount += matches.length;
  });
  
  negativeWords.forEach(word => {
    const regex = new RegExp(word, 'g');
    const matches = content.match(regex);
    if (matches) negativeCount += matches.length;
  });
  
  neutralWords.forEach(word => {
    const regex = new RegExp(word, 'g');
    const matches = content.match(regex);
    if (matches) neutralCount += matches.length;
  });
  
  if (positiveCount > negativeCount && positiveCount > neutralCount) {
    return '积极';
  } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
    return '消极';
  } else if (neutralCount > positiveCount && neutralCount > negativeCount) {
    return '中立';
  } else {
    return '中立';
  }
}

// 生成随机ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// 计算任务完成率
export function calculateTaskCompletionRate(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  
  const completedTasks = tasks.filter(task => task.isCompleted);
  return (completedTasks.length / tasks.length) * 100;
}

// 确定是否应该提醒任务
export function shouldRemindTask(task: Task, now: Date): boolean {
  if (task.isCompleted || !task.deadline) return false;
  
  const timeDiff = task.deadline.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);
  
  // 如果任务已过期，不再提醒
  if (hoursDiff < 0) return false;
  
  // 如果任务在1小时内到期，每15分钟提醒一次
  if (hoursDiff <= 1) {
    // 检查最后一次提醒是否在15分钟前
    const lastReminder = task.reminderTimes && task.reminderTimes.length > 0 
      ? task.reminderTimes[task.reminderTimes.length - 1] 
      : null;
    
    if (!lastReminder) return true;
    
    const minutesSinceLastReminder = (now.getTime() - lastReminder.getTime()) / (1000 * 60);
    return minutesSinceLastReminder >= 15;
  }
  
  // 如果任务在今天到期，每小时提醒一次
  if (hoursDiff <= 24) {
    const lastReminder = task.reminderTimes && task.reminderTimes.length > 0 
      ? task.reminderTimes[task.reminderTimes.length - 1] 
      : null;
    
    if (!lastReminder) return true;
    
    const hoursSinceLastReminder = (now.getTime() - lastReminder.getTime()) / (1000 * 60 * 60);
    return hoursSinceLastReminder >= 1;
  }
  
  // 如果任务在明天到期，上午和下午各提醒一次
  if (hoursDiff <= 48) {
    const lastReminder = task.reminderTimes && task.reminderTimes.length > 0 
      ? task.reminderTimes[task.reminderTimes.length - 1] 
      : null;
    
    if (!lastReminder) return true;
    
    const currentHour = now.getHours();
    const lastReminderHour = lastReminder.getHours();
    
    // 如果现在是上午(6-12点)，且上次提醒不是在今天上午，则提醒
    if (currentHour >= 6 && currentHour < 12) {
      return !(lastReminder.getDate() === now.getDate() && lastReminderHour >= 6 && lastReminderHour < 12);
    }
    
    // 如果现在是下午(12-18点)，且上次提醒不是在今天下午，则提醒
    if (currentHour >= 12 && currentHour < 18) {
      return !(lastReminder.getDate() === now.getDate() && lastReminderHour >= 12 && lastReminderHour < 18);
    }
  }
  
  return false;
}
