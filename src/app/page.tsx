import { JournalEditor } from "@/components/journal/journal-editor";
import { TaskList } from "@/components/tasks/task-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <main className="container mx-auto py-4 sm:py-8 px-3 sm:px-4">
      <Tabs defaultValue="journal" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-8">
          <TabsTrigger value="journal">日记</TabsTrigger>
          <TabsTrigger value="tasks">任务</TabsTrigger>
        </TabsList>
        
        <TabsContent value="journal">
          <JournalEditor />
        </TabsContent>
        
        <TabsContent value="tasks">
          <TaskList />
        </TabsContent>
      </Tabs>
    </main>
  );
}
