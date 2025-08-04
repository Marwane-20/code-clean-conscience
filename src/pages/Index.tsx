import React, { useState, useCallback } from 'react';
import { Code, Shield, Zap, Github, Settings, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BiasScanner, defaultScanSettings } from '@/lib/bias-scanner';
import { FileScanner } from '@/components/bias-scanner/file-scanner';
import { BiasSettings } from '@/components/bias-scanner/bias-settings';
import { ResultsTable } from '@/components/bias-scanner/results-table';
import { FileViewer } from '@/components/bias-scanner/file-viewer';
import { exportToCSV, exportToJSON, exportDetailedCSV } from '@/components/bias-scanner/export-utils';
import { ScanSettings, ScanResults, FileAnalysis } from '@/types/bias-scanner';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { KeyboardShortcutsHelp } from '@/components/bias-scanner/keyboard-shortcuts-help';
import { HelpDialog } from '@/components/bias-scanner/help-dialog';

const Index = () => {
  const [settings, setSettings] = useState<ScanSettings>(defaultScanSettings);
  const [results, setResults] = useState<ScanResults | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileAnalysis | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { toast } = useToast();

  const scanner = new BiasScanner(settings);

  React.useEffect(() => {
    scanner.updateSettings(settings);
  }, [settings]);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onEscape: () => {
      if (selectedFile) setSelectedFile(null);
      if (showSettings) setShowSettings(false);
    },
    onCtrlS: () => setShowSettings(!showSettings),
    onCtrlO: () => document.getElementById('file-input')?.click(),
    onCtrlE: () => results && handleExport('csv'),
  });

  const handleFilesSelected = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    setIsScanning(true);
    try {
      const scanResults = await scanner.scanFiles(files);
      setResults(scanResults);
      
      toast({
        title: "Scan Complete",
        description: `Scanned ${scanResults.scannedFiles} files and found ${scanResults.totalOccurrences} potential bias occurrences.`,
      });
    } catch (error) {
      console.error('Scan error:', error);
      toast({
        title: "Scan Error",
        description: "An error occurred while scanning files. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  }, [scanner, toast]);

  const handleExport = useCallback((format: 'csv' | 'json') => {
    if (!results) return;

    try {
      if (format === 'csv') {
        exportToCSV(results);
      } else {
        exportToJSON(results);
      }
      
      toast({
        title: "Export Successful",
        description: `Results exported as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      toast({
        title: "Export Error",
        description: "Failed to export results. Please try again.",
        variant: "destructive"
      });
    }
  }, [results, toast]);

  const handleViewFile = useCallback((file: FileAnalysis) => {
    setSelectedFile(file);
  }, []);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Code Bias Scanner
                </h1>
                <p className="text-muted-foreground text-sm">
                  Detect and eliminate bias in your codebase
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <KeyboardShortcutsHelp />
              <HelpDialog />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
                title="Toggle dark mode"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                title="Scanner settings (Ctrl+S)"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a 
                  href="https://github.com/your-repo/code-bias-scanner" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          {!results && !showSettings && (
            <div className="text-center space-y-6 py-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Zap className="h-4 w-4" />
                Powered by Advanced Language Parsing
              </div>
              
              <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                  Build More 
                  <span className="bg-gradient-primary bg-clip-text text-transparent"> Inclusive</span><br />
                  Software
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Automatically scan your codebase for potentially biased language in identifiers, 
                  strings, and comments. Get actionable insights and suggestions for improvement.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
                <Card className="text-center p-6 border-0 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
                  <Code className="h-8 w-8 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Multi-Language Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Supports JavaScript, TypeScript, Python, Java, C#, and more
                  </p>
                </Card>
                
                <Card className="text-center p-6 border-0 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20">
                  <Shield className="h-8 w-8 mx-auto mb-4 text-success" />
                  <h3 className="font-semibold mb-2">Configurable Detection</h3>
                  <p className="text-sm text-muted-foreground">
                    Customize bias terms, categories, and scanning preferences
                  </p>
                </Card>
                
                <Card className="text-center p-6 border-0 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
                  <Zap className="h-8 w-8 mx-auto mb-4 text-warning" />
                  <h3 className="font-semibold mb-2">Instant Results</h3>
                  <p className="text-sm text-muted-foreground">
                    Get immediate feedback with detailed reports and fix suggestions
                  </p>
                </Card>
              </div>
            </div>
          )}

          {/* Settings Panel */}
          {showSettings && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Scanner Configuration</h2>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSettings(false)}
                >
                  Done
                </Button>
              </div>
              <BiasSettings 
                settings={settings} 
                onSettingsChange={setSettings}
              />
            </div>
          )}

          {/* File Scanner */}
          {!showSettings && (
            <FileScanner 
              onFilesSelected={handleFilesSelected}
              isScanning={isScanning}
            />
          )}

          {/* Scanning Status */}
          {isScanning && (
            <Card>
              <CardContent className="py-8">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-4 py-2 rounded-full">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    Scanning files for bias...
                  </div>
                  <p className="text-muted-foreground">
                    This may take a few moments depending on the number and size of files.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {results && !showSettings && (
            <ResultsTable 
              results={results}
              onViewFile={handleViewFile}
              onExport={handleExport}
            />
          )}
        </div>
      </main>

      {/* File Viewer Modal */}
      <FileViewer 
        file={selectedFile}
        isOpen={!!selectedFile}
        onClose={() => setSelectedFile(null)}
      />

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">Code Bias Scanner</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Built with modern web technologies to help create more inclusive software. 
              Open source and privacy-focused - all scanning happens in your browser.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Documentation
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                GitHub
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Report Issue
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;