import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { JournalEntry, Task, User } from './types';
import { generateId } from './utils';

interface AppState {
  // 用户状态
  user: User | null;
  setUser: (user: User | null) => void;
  
  // 日记状态
  journalEntries: JournalEntry[];
  addJournalEntry: (content: string, emotionLabel?: string, theme?: string, aiAnalysis?: any) => JournalEntry;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: string) => void;
  
  // 任务状态
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'isCompleted'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  addTaskReminder: (id: string) => void;
  
  // 数据导出和导入
  exportData: () => string;
  importData: (jsonData: string) => boolean;
  clearAllData: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 初始用户状态
      user: null,
      setUser: (user) => set({ user }),
      
      // 日记状态管理
      journalEntries: [],
      addJournalEntry: (content, emotionLabel, theme, aiAnalysis) => {
        const newEntry: JournalEntry = {
          id: generateId(),
          userId: 'local-user', // 本地存储时使用固定ID
          content,
          emotionLabel,
          theme,
          aiAnalysis,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        set((state) => ({
          journalEntries: [newEntry, ...state.journalEntries]
        }));
        
        return newEntry;
      },
      updateJournalEntry: (id, updates) => {
        set((state) => ({
          journalEntries: state.journalEntries.map((entry) => 
            entry.id === id ? { ...entry, ...updates, updatedAt: new Date() } : entry
          )
        }));
      },
      deleteJournalEntry: (id) => {
        set((state) => ({
          journalEntries: state.journalEntries.filter((entry) => entry.id !== id)
        }));
      },
      
      // 任务状态管理
      tasks: [],
      addTask: (taskData) => {
        const newTask: Task = {
          id: generateId(),
          userId: 'local-user', // 本地存储时使用固定ID
          isCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          reminderTimes: [],
          ...taskData
        };
        
        set((state) => ({
          tasks: [newTask, ...state.tasks]
        }));
        
        return newTask;
      },
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) => 
            task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
          )
        }));
      },
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id)
        }));
      },
      toggleTaskCompletion: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) => 
            task.id === id ? { ...task, isCompleted: !task.isCompleted, updatedAt: new Date() } : task
          )
        }));
      },
      addTaskReminder: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) => 
            task.id === id 
              ? { 
                  ...task, 
                  reminderTimes: [...(task.reminderTimes || []), new Date()],
                  updatedAt: new Date() 
                } 
              : task
          )
        }));
      },
      
      // 数据导出和导入
      exportData: () => {
        const { journalEntries, tasks } = get();
        return JSON.stringify({ journalEntries, tasks }, null, 2);
      },
      importData: (jsonData) => {
        try {
          const data = JSON.parse(jsonData);
          
          if (data.journalEntries && Array.isArray(data.journalEntries) &&
              data.tasks && Array.isArray(data.tasks)) {
            
            set({ 
              journalEntries: data.journalEntries,
              tasks: data.tasks
            });
            
            return true;
          }
          
          return false;
        } catch (error) {
          console.error('导入数据失败:', error);
          return false;
        }
      },
      clearAllData: () => {
        set({ journalEntries: [], tasks: [] });
      }
    }),
    {
      name: 'anti-procrastination-storage',
      storage: createJSONStorage(() => localStorage),
      // 选择性持久化，避免存储过大的数据
      partialize: (state) => ({
        journalEntries: state.journalEntries,
        tasks: state.tasks,
      }),
    }
  )
);
