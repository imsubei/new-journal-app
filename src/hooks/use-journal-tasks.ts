import { JournalEntry, Task } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { extractTasksFromContent, analyzeEmotion } from "@/lib/utils";

export function useJournal() {
  const { 
    journalEntries, 
    addJournalEntry, 
    updateJournalEntry,
    deleteJournalEntry 
  } = useAppStore();
  
  const [currentEntry, setCurrentEntry] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // 自动保存功能
  useEffect(() => {
    if (currentEntry.trim() && currentEntry.length > 10) {
      const timer = setTimeout(() => {
        saveEntry();
      }, 3000); // 3秒后自动保存
      
      return () => clearTimeout(timer);
    }
  }, [currentEntry]);
  
  // 保存日记
  const saveEntry = async () => {
    if (!currentEntry.trim()) return;
    
    setSaving(true);
    
    try {
      // 简单情绪分析
      const emotionLabel = analyzeEmotion(currentEntry);
      
      // 保存日记
      const entry = addJournalEntry(currentEntry, emotionLabel);
      
      // 更新状态
      setLastSaved(new Date());
      
      // 返回创建的日记条目
      return entry;
    } catch (error) {
      console.error("保存日记时出错:", error);
    } finally {
      setSaving(false);
    }
  };
  
  // 获取今天的日记
  const getTodayEntry = (): JournalEntry | undefined => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return journalEntries.find(entry => {
      const entryDate = new Date(entry.createdAt);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });
  };
  
  return {
    currentEntry,
    setCurrentEntry,
    saveEntry,
    saving,
    lastSaved,
    journalEntries,
    getTodayEntry,
    updateJournalEntry,
    deleteJournalEntry
  };
}

export function useTasks() {
  const { 
    tasks, 
    addTask, 
    updateTask, 
    deleteTask, 
    toggleTaskCompletion,
    addTaskReminder 
  } = useAppStore();
  
  // 从日记中提取任务
  const extractTasksFromJournal = (content: string) => {
    return extractTasksFromContent(content);
  };
  
  // 创建从日记中提取的任务
  const createTasksFromJournal = (extractedTasks: ReturnType<typeof extractTasksFromContent>, journalEntryId?: string) => {
    const createdTasks: Task[] = [];
    
    extractedTasks.forEach(task => {
      if (task.selected) {
        const newTask = addTask({
          title: task.title,
          description: task.description,
          deadline: task.deadline,
          journalEntryId
        });
        
        createdTasks.push(newTask);
      }
    });
    
    return createdTasks;
  };
  
  // 获取未完成的任务
  const getIncompleteTasks = () => {
    return tasks.filter(task => !task.isCompleted);
  };
  
  // 获取已完成的任务
  const getCompletedTasks = () => {
    return tasks.filter(task => task.isCompleted);
  };
  
  // 获取今天到期的任务
  const getTodayTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return tasks.filter(task => {
      if (!task.deadline) return false;
      
      const deadline = new Date(task.deadline);
      return deadline >= today && deadline < tomorrow;
    });
  };
  
  // 获取即将到期的任务（未来7天内）
  const getUpcomingTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return tasks.filter(task => {
      if (!task.deadline) return false;
      
      const deadline = new Date(task.deadline);
      return deadline >= today && deadline < nextWeek && !task.isCompleted;
    });
  };
  
  // 获取过期任务
  const getOverdueTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tasks.filter(task => {
      if (!task.deadline) return false;
      
      const deadline = new Date(task.deadline);
      return deadline < today && !task.isCompleted;
    });
  };
  
  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    addTaskReminder,
    extractTasksFromJournal,
    createTasksFromJournal,
    getIncompleteTasks,
    getCompletedTasks,
    getTodayTasks,
    getUpcomingTasks,
    getOverdueTasks
  };
}
