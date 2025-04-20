"use client"

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EmotionBadge } from "@/components/journal/emotion-badge";
import { TaskExtractor } from "@/components/journal/task-extractor";
import { useJournal } from "@/hooks/use-journal-tasks";
import { useEffect, useRef, useState } from "react";

export function JournalEditor() {
  const { 
    currentEntry, 
    setCurrentEntry, 
    saveEntry, 
    saving, 
    lastSaved,
    getTodayEntry
  } = useJournal();
  
  const [emotion, setEmotion] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // 加载今天的日记（如果存在）
  useEffect(() => {
    const todayEntry = getTodayEntry();
    if (todayEntry) {
      setCurrentEntry(todayEntry.content);
      setEmotion(todayEntry.emotionLabel || null);
    }
  }, [getTodayEntry, setCurrentEntry]);
  
  // 处理保存
  const handleSave = async () => {
    const entry = await saveEntry();
    if (entry?.emotionLabel) {
      setEmotion(entry.emotionLabel);
    }
  };
  
  // 随机提示功能
  const getRandomPrompt = () => {
    const prompts = [
      "今天有什么让你感到开心的事情？",
      "你今天遇到了什么挑战？你是如何应对的？",
      "有什么事情你一直想做但总是拖延？",
      "今天你学到了什么新东西？",
      "你对明天有什么期待？",
      "今天你做了什么对自己或他人有帮助的事？",
      "有什么事情让你感到困扰？你打算如何解决？",
      "今天你感到最有成就感的事情是什么？",
      "你今天的心情如何？是什么导致了这种情绪？",
      "有什么任务你今天必须完成？"
    ];
    
    const randomIndex = Math.floor(Math.random() * prompts.length);
    return prompts[randomIndex];
  };
  
  // 插入随机提示
  const insertRandomPrompt = () => {
    const prompt = getRandomPrompt();
    const currentText = currentEntry;
    
    if (currentText.trim()) {
      setCurrentEntry(`${currentText}\n\n${prompt}\n`);
    } else {
      setCurrentEntry(`${prompt}\n`);
    }
    
    // 聚焦文本区域
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <h1 className="text-2xl font-semibold">今日随记</h1>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={insertRandomPrompt}
            className="text-sm h-9"
            size="sm"
          >
            随机提示
          </Button>
          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            {lastSaved && (
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                上次保存: {lastSaved.toLocaleTimeString()}
              </p>
            )}
            <Button 
              onClick={handleSave} 
              disabled={saving || !currentEntry.trim()}
              className="text-sm h-9"
              size="sm"
            >
              {saving ? '保存中...' : '保存'}
            </Button>
          </div>
        </div>
      </div>
      
      {/* 情绪标签显示 */}
      {emotion && (
        <div className="mb-2">
          <EmotionBadge emotion={emotion} />
        </div>
      )}
      
      {/* 输入框 */}
      <div className="relative">
        <Textarea
          ref={textareaRef}
          className="min-h-[200px] sm:min-h-[300px] text-base sm:text-lg resize-none p-3 sm:p-4"
          placeholder="今天有什么想法？记录下来吧..."
          value={currentEntry}
          onChange={(e) => setCurrentEntry(e.target.value)}
        />
      </div>
      
      {/* 任务提取器 */}
      <TaskExtractor 
        content={currentEntry} 
        journalEntryId={getTodayEntry()?.id}
      />
    </div>
  );
}
