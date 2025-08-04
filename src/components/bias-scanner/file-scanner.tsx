import React, { useCallback, useState } from 'react';
import { Upload, FileText, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FileScannerProps {
  onFilesSelected: (files: File[]) => void;
  isScanning: boolean;
}

export const FileScanner: React.FC<FileScannerProps> = ({ 
  onFilesSelected, 
  isScanning 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files).filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      const supportedExtensions = [
        '.js', '.jsx', '.ts', '.tsx', '.py', '.pyw', '.pyi',
        '.java', '.cs', '.cpp', '.c', '.go', '.rs', '.php', 
        '.rb', '.swift', '.kt', '.txt', '.md'
      ];
      return supportedExtensions.includes(extension);
    });

    if (fileArray.length > 0) {
      onFilesSelected(fileArray);
    }
  }, [onFilesSelected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    e.target.value = ''; // Reset input
  }, [handleFileSelect]);

  return (
    <Card className={cn(
      "border-2 border-dashed transition-all duration-300",
      isDragOver ? "border-primary bg-primary/5" : "border-border",
      isScanning && "opacity-50 pointer-events-none"
    )}>
      <CardContent 
        className="p-8 text-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
            isDragOver ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            {isDragOver ? <FolderOpen size={32} /> : <Upload size={32} />}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {isScanning ? 'Scanning Files...' : 'Select Code Files to Scan'}
            </h3>
            <p className="text-muted-foreground max-w-md">
              Drop files here or click to browse. Supports JavaScript, TypeScript, Python, 
              Java, C#, and more programming languages.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="default" 
              disabled={isScanning}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <FileText className="mr-2 h-4 w-4" />
              Select Files
            </Button>
            
            <Button 
              variant="outline" 
              disabled={isScanning}
              onClick={() => document.getElementById('folder-input')?.click()}
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              Select Folder
            </Button>
          </div>

          <input
            id="file-input"
            type="file"
            multiple
            className="hidden"
            accept=".js,.jsx,.ts,.tsx,.py,.pyw,.pyi,.java,.cs,.cpp,.c,.go,.rs,.php,.rb,.swift,.kt,.txt,.md"
            onChange={handleFileInput}
          />
          
          <input
            id="folder-input"
            type="file"
            // @ts-ignore - webkitdirectory is not in TypeScript types but works in modern browsers
            webkitdirectory="true"
            className="hidden"
            onChange={handleFileInput}
          />

          <div className="text-xs text-muted-foreground">
            Supported: .js, .jsx, .ts, .tsx, .py, .java, .cs, .cpp, .c, .go, .rs, .php, .rb, .swift, .kt
          </div>
        </div>
      </CardContent>
    </Card>
  );
};