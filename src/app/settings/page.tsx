import { DataManagement } from "@/components/settings/data-management";

export default function SettingsPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">设置</h1>
      
      <div className="space-y-8">
        <DataManagement />
      </div>
    </main>
  );
}
