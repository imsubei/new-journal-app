import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Task } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { useTasks } from "@/hooks/use-journal-tasks";
import { CalendarIcon, ClockIcon, TrashIcon } from "lucide-react";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { toggleTaskCompletion, deleteTask } = useTasks();
  
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && !task.isCompleted;
  
  return (
    <Card className={`mb-4 ${isOverdue ? 'border-red-300' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-2">
            <Checkbox 
              checked={task.isCompleted} 
              onCheckedChange={() => toggleTaskCompletion(task.id)}
              className="mt-1"
            />
            <div>
              <CardTitle className={`text-lg ${task.isCompleted ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </CardTitle>
              {task.description && (
                <CardDescription className={task.isCompleted ? 'text-gray-400' : ''}>
                  {task.description}
                </CardDescription>
              )}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => deleteTask(task.id)}
            className="h-8 w-8"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      {task.deadline && (
        <CardContent className="pt-0 pb-2">
          <div className={`flex items-center text-sm ${
            isOverdue ? 'text-red-600' : (task.isCompleted ? 'text-gray-400' : 'text-gray-500')
          }`}>
            <CalendarIcon className="mr-1 h-4 w-4" />
            <span>截止时间: {formatDate(new Date(task.deadline))}</span>
          </div>
        </CardContent>
      )}
      
      {task.reminderTimes && task.reminderTimes.length > 0 && (
        <CardFooter className="pt-0 text-xs text-gray-400">
          <div className="flex items-center">
            <ClockIcon className="mr-1 h-3 w-3" />
            <span>上次提醒: {formatDate(new Date(task.reminderTimes[task.reminderTimes.length - 1]))}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
