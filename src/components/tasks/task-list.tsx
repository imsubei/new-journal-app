"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskCard } from "@/components/tasks/task-card";
import { useTasks } from "@/hooks/use-journal-tasks";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Task } from "@/lib/types";

export function TaskList() {
  const { 
    getIncompleteTasks, 
    getCompletedTasks, 
    getTodayTasks, 
    getUpcomingTasks, 
    getOverdueTasks,
    addTask
  } = useTasks();
  
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");
  
  const incompleteTasks = getIncompleteTasks();
  const completedTasks = getCompletedTasks();
  const todayTasks = getTodayTasks();
  const upcomingTasks = getUpcomingTasks();
  const overdueTasks = getOverdueTasks();
  
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'isCompleted'> = {
      title: newTaskTitle,
      description: newTaskDescription || undefined,
      deadline: newTaskDeadline ? new Date(newTaskDeadline) : undefined,
    };
    
    addTask(taskData);
    
    // 重置表单
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskDeadline("");
    setIsAddingTask(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <h2 className="text-2xl font-semibold">任务列表</h2>
        <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
          <DialogTrigger asChild>
            <Button size="sm" className="text-sm h-9">
              <PlusIcon className="mr-1 h-4 w-4" />
              添加任务
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>添加新任务</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">任务标题</Label>
                <Input 
                  id="title" 
                  placeholder="输入任务标题" 
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">任务描述 (可选)</Label>
                <Textarea 
                  id="description" 
                  placeholder="输入任务描述" 
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">截止日期 (可选)</Label>
                <Input 
                  id="deadline" 
                  type="datetime-local" 
                  value={newTaskDeadline}
                  onChange={(e) => setNewTaskDeadline(e.target.value)}
                />
              </div>
              <Button onClick={handleAddTask} className="w-full">
                创建任务
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="incomplete" className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-4">
          <TabsTrigger value="incomplete" className="text-xs sm:text-sm">
            待完成 ({incompleteTasks.length})
          </TabsTrigger>
          <TabsTrigger value="today" className="text-xs sm:text-sm">
            今日 ({todayTasks.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="text-xs sm:text-sm">
            即将到期 ({upcomingTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs sm:text-sm">
            已完成 ({completedTasks.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="incomplete">
          {overdueTasks.length > 0 && (
            <Card className="mb-4 border-red-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-red-600">已逾期任务</CardTitle>
              </CardHeader>
              <CardContent>
                {overdueTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </CardContent>
            </Card>
          )}
          
          {incompleteTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              没有待完成的任务
            </div>
          ) : (
            incompleteTasks
              .filter(task => !overdueTasks.some(t => t.id === task.id))
              .map((task) => (
                <TaskCard key={task.id} task={task} />
              ))
          )}
        </TabsContent>
        
        <TabsContent value="today">
          {todayTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              今天没有到期的任务
            </div>
          ) : (
            todayTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="upcoming">
          {upcomingTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              近期没有即将到期的任务
            </div>
          ) : (
            upcomingTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {completedTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              没有已完成的任务
            </div>
          ) : (
            completedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
