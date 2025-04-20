"use client"

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/utils";
import { ExtractedTask } from "@/lib/types";
import { useState, useEffect } from "react";
import { useTasks } from "@/hooks/use-journal-tasks";

interface TaskExtractorProps {
  content: string;
  journalEntryId?: string;
  onTasksCreated?: () => void;
}

export function TaskExtractor({ content, journalEntryId, onTasksCreated }: TaskExtractorProps) {
  const { extractTasksFromJournal, createTasksFromJournal } = useTasks();
  const [extractedTasks, setExtractedTasks] = useState<ExtractedTask[]>([]);
  
  useEffect(() => {
    // 仅在内容变化且长度足够时分析提取任务
    if (content && content.length > 10) {
      const tasks = extractTasksFromJournal(content);
      setExtractedTasks(tasks);
    } else {
      setExtractedTasks([]);
    }
  }, [content, extractTasksFromJournal]);
  
  const handleToggleTask = (index: number) => {
    setExtractedTasks(prev => 
      prev.map((task, i) => 
        i === index ? { ...task, selected: !task.selected } : task
      )
    );
  };
  
  const handleCreateTasks = () => {
    const selectedTasks = extractedTasks.filter(task => task.selected);
    if (selectedTasks.length === 0) return;
    
    createTasksFromJournal(selectedTasks, journalEntryId);
    
    // 清空已创建的任务
    setExtractedTasks([]);
    
    // 通知父组件任务已创建
    if (onTasksCreated) {
      onTasksCreated();
    }
  };
  
  if (extractedTasks.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
      <h3 className="font-medium text-blue-800 mb-2">
        检测到可能的计划任务
      </h3>
      
      {extractedTasks.map((task, index) => (
        <div key={index} className="flex items-start mt-2">
          <Checkbox
            id={`task-${index}`}
            checked={task.selected}
            onCheckedChange={() => handleToggleTask(index)}
          />
          <div className="ml-2">
            <label htmlFor={`task-${index}`} className="text-sm font-medium">
              {task.title}
            </label>
            {task.deadline && (
              <p className="text-xs text-gray-500">
                截止时间: {formatDate(task.deadline)}
              </p>
            )}
          </div>
        </div>
      ))}
      
      <Button 
        size="sm" 
        className="mt-3"
        onClick={handleCreateTasks}
      >
        创建所选任务
      </Button>
    </div>
  );
}
