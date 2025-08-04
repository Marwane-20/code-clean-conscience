import React from 'react';
import { X, Copy, ExternalLink, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileAnalysis, CodeOccurrence } from '@/types/bias-scanner';

interface FileViewerProps {
  file: FileAnalysis | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FileViewer: React.FC<FileViewerProps> = ({
  file,
  isOpen,
  onClose
}) => {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const groupOccurrencesByLine = (occurrences: CodeOccurrence[]) => {
    const grouped = new Map<number, CodeOccurrence[]>();
    occurrences.forEach(occurrence => {
      const line = occurrence.line;
      if (!grouped.has(line)) {
        grouped.set(line, []);
      }
      grouped.get(line)!.push(occurrence);
    });
    return grouped;
  };

  const highlightBiasInText = (text: string, occurrences: CodeOccurrence[]) => {
    if (occurrences.length === 0) return text;
    
    let highlightedText = text;
    
    // Sort occurrences by column position (reverse order to maintain indices)
    const sortedOccurrences = [...occurrences].sort((a, b) => b.column - a.column);
    
    sortedOccurrences.forEach(occurrence => {
      const { content, biasedTerm } = occurrence;
      const termIndex = highlightedText.toLowerCase().indexOf(biasedTerm.term.toLowerCase());
      
      if (termIndex !== -1) {
        const before = highlightedText.substring(0, termIndex);
        const term = highlightedText.substring(termIndex, termIndex + biasedTerm.term.length);
        const after = highlightedText.substring(termIndex + biasedTerm.term.length);
        
        highlightedText = before + 
          `<mark class="bg-code-highlight text-code-bg font-semibold px-1 rounded">${term}</mark>` + 
          after;
      }
    });
    
    return highlightedText;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-success text-success-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'gender': return '⚧️';
      case 'race': return '🏃';
      case 'hierarchy': return '👑';
      case 'age': return '👶';
      default: return '⚠️';
    }
  };

  if (!file) return null;

  const groupedOccurrences = groupOccurrencesByLine(file.occurrences);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col" aria-describedby="file-viewer-description">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <span id="file-viewer-description" className="sr-only">
              File analysis viewer showing {file.name} with {file.biasedElements} biased elements found
            </span>
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-warning" />
              {file.name}
              <Badge variant="outline" className="font-mono text-xs">
                {file.language}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => copyToClipboard(JSON.stringify(file, null, 2))}
              >
                <Copy className="h-4 w-4" />
                Copy JSON
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex gap-6">
          {/* Main content area */}
          <div className="flex-1 flex flex-col space-y-4">
            {/* File stats */}
            <Card className="flex-shrink-0">
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Total Elements</div>
                    <div className="font-semibold">{file.totalElements}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Biased Elements</div>
                    <div className="font-semibold text-destructive">{file.biasedElements}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Bias Percentage</div>
                    <div className="font-semibold">{file.biasPercentage.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Fix Time</div>
                    <div className="font-semibold">{Math.ceil(file.estimatedFixTime / 60)}min</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Code preview with line numbers */}
            <Card className="flex-1 overflow-hidden">
              <CardHeader className="py-3">
                <CardTitle className="text-sm">Code Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-hidden">
                <div className="bg-code-bg text-code-text font-mono text-sm overflow-auto h-full">
                  <div className="p-4">
                    {file.occurrences.length > 0 ? (
                      <div className="space-y-0">
                        {Array.from(groupedOccurrences.entries())
                          .sort(([a], [b]) => a - b)
                          .map(([lineNumber, occurrences]) => (
                            <div key={lineNumber} className="flex">
                              <div className="text-code-comment text-right pr-4 w-12 flex-shrink-0 select-none border-r border-code-comment/20">
                                {lineNumber}
                              </div>
                              <div 
                                className="flex-1 pl-4 whitespace-pre-wrap break-all"
                                dangerouslySetInnerHTML={{
                                  __html: highlightBiasInText(occurrences[0].context, occurrences)
                                }}
                              />
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-code-comment">
                        No biased terms found in this file.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar with occurrences */}
          <div className="w-80 flex-shrink-0 space-y-4">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm">
                  Biased Terms Found ({file.occurrences.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {file.occurrences.length > 0 ? (
                    <div className="space-y-2 p-4">
                      {file.occurrences.map((occurrence, index) => (
                        <div 
                          key={index}
                          className="border rounded-lg p-3 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <Badge 
                              className={`text-xs ${getSeverityColor(occurrence.biasedTerm.severity)}`}
                            >
                              {getCategoryIcon(occurrence.biasedTerm.category)} {occurrence.biasedTerm.severity}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Line {occurrence.line}
                            </span>
                          </div>
                          
                          <div>
                            <div className="text-sm font-semibold">
                              {occurrence.biasedTerm.term}
                            </div>
                            <div className="text-xs text-muted-foreground capitalize">
                              {occurrence.biasedTerm.category} bias
                            </div>
                          </div>

                          <div className="text-xs bg-muted p-2 rounded font-mono">
                            <div className="text-muted-foreground">Context:</div>
                            <div className="truncate">{occurrence.context}</div>
                          </div>

                          {occurrence.biasedTerm.suggestions && occurrence.biasedTerm.suggestions.length > 0 && (
                            <div className="text-xs">
                              <div className="text-muted-foreground mb-1">Suggestions:</div>
                              <div className="flex flex-wrap gap-1">
                                {occurrence.biasedTerm.suggestions.map((suggestion, idx) => (
                                  <Badge 
                                    key={idx} 
                                    variant="outline" 
                                    className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground"
                                    onClick={() => copyToClipboard(suggestion)}
                                  >
                                    {suggestion}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No biased terms found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};