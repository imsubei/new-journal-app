"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAppStore } from "@/lib/store";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Download, Upload, Trash2 } from "lucide-react";

export function DataManagement() {
  const { exportData, importData, clearAllData } = useAppStore();
  const [importText, setImportText] = useState("");
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  // 处理数据导出
  const handleExport = () => {
    const jsonData = exportData();
    
    // 创建下载链接
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `anti-procrastination-data-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // 清理
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };
  
  // 处理数据导入
  const handleImport = () => {
    if (!importText.trim()) {
      setImportStatus("error");
      return;
    }
    
    const success = importData(importText);
    setImportStatus(success ? "success" : "error");
    
    if (success) {
      // 重置输入框
      setImportText("");
      
      // 3秒后重置状态
      setTimeout(() => {
        setImportStatus("idle");
      }, 3000);
    }
  };
  
  // 处理清除所有数据
  const handleClearData = () => {
    clearAllData();
    setShowClearConfirm(false);
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">数据管理</h2>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleExport}
        >
          <Download className="h-4 w-4" />
          导出数据
        </Button>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              导入数据
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>导入数据</DialogTitle>
              <DialogDescription>
                粘贴之前导出的JSON数据以恢复您的日记和任务。
              </DialogDescription>
            </DialogHeader>
            
            <Textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='粘贴JSON数据，格式如: {"journalEntries": [...], "tasks": [...]}'
              className="min-h-[200px]"
            />
            
            {importStatus === "success" && (
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <AlertTitle>导入成功</AlertTitle>
                <AlertDescription>
                  您的数据已成功导入。
                </AlertDescription>
              </Alert>
            )}
            
            {importStatus === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>导入失败</AlertTitle>
                <AlertDescription>
                  无法导入数据。请确保JSON格式正确。
                </AlertDescription>
              </Alert>
            )}
            
            <DialogFooter>
              <Button onClick={handleImport}>导入</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
          <DialogTrigger asChild>
            <Button 
              variant="destructive" 
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              清除所有数据
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>确认清除数据</DialogTitle>
              <DialogDescription>
                此操作将永久删除所有日记和任务数据，且无法恢复。
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowClearConfirm(false)}>
                取消
              </Button>
              <Button variant="destructive" onClick={handleClearData}>
                确认清除
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
