import React from 'react';
import { HelpCircle, Code, Shield, Zap, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export const HelpDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <HelpCircle className="h-4 w-4 mr-2" />
          Help
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col" aria-describedby="help-description">
        <DialogHeader>
          <DialogTitle>Code Bias Scanner - User Guide</DialogTitle>
          <p id="help-description" className="text-sm text-muted-foreground">
            Learn how to use the Code Bias Scanner effectively to identify and fix biased language in your codebase.
          </p>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="scanning">Scanning</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-y-auto mt-4">
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    What is Code Bias Scanner?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Code Bias Scanner is a tool designed to help developers identify and eliminate 
                    potentially biased language in their codebases. It analyzes source code files 
                    to detect terms that may be considered biased or non-inclusive.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <Code className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h4 className="font-semibold">Multi-Language</h4>
                      <p className="text-sm text-muted-foreground">
                        Supports JavaScript, TypeScript, Python, Java, C#, and more
                      </p>
                    </div>
                    
                    <div className="text-center p-4 border rounded-lg">
                      <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h4 className="font-semibold">Fast Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        Quickly scan thousands of files with detailed reporting
                      </p>
                    </div>
                    
                    <div className="text-center p-4 border rounded-lg">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h4 className="font-semibold">Detailed Reports</h4>
                      <p className="text-sm text-muted-foreground">
                        Get line-by-line analysis with improvement suggestions
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="scanning" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>How to Scan Files</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Badge variant="outline" className="flex-shrink-0">1</Badge>
                      <div>
                        <h4 className="font-medium">Select Files or Folders</h4>
                        <p className="text-sm text-muted-foreground">
                          Use the file scanner to select individual files or entire folders. 
                          You can drag and drop files directly onto the scanner area.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Badge variant="outline" className="flex-shrink-0">2</Badge>
                      <div>
                        <h4 className="font-medium">Automatic Analysis</h4>
                        <p className="text-sm text-muted-foreground">
                          The scanner automatically detects file types and parses them using 
                          language-specific analyzers to extract identifiers, strings, and comments.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Badge variant="outline" className="flex-shrink-0">3</Badge>
                      <div>
                        <h4 className="font-medium">View Results</h4>
                        <p className="text-sm text-muted-foreground">
                          Results are displayed in a sortable table showing bias percentage, 
                          occurrence counts, and estimated fix times for each file.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Supported File Types:</h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cs', 
                        '.cpp', '.c', '.go', '.rs', '.php', '.rb', '.swift', '.kt'
                      ].map(ext => (
                        <Badge key={ext} variant="secondary" className="text-xs font-mono">
                          {ext}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="results" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Understanding Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">File Analysis Table</h4>
                      <ul className="space-y-2 text-sm">
                        <li><strong>File Name:</strong> The path and name of the analyzed file</li>
                        <li><strong>Language:</strong> Detected programming language</li>
                        <li><strong>Bias %:</strong> Percentage of biased elements found</li>
                        <li><strong>Occurrences:</strong> Total number of biased terms detected</li>
                        <li><strong>Fix Time:</strong> Estimated time to address all issues</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Severity Levels</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-destructive text-destructive-foreground">High</Badge>
                          <span className="text-sm">Terms that should be replaced immediately</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-warning text-warning-foreground">Medium</Badge>
                          <span className="text-sm">Terms that should be reviewed and considered for replacement</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-success text-success-foreground">Low</Badge>
                          <span className="text-sm">Terms that may need context-dependent review</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Export Options</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>CSV:</strong> Summary data for spreadsheet analysis</li>
                        <li>• <strong>JSON:</strong> Complete data including all occurrences and suggestions</li>
                        <li>• <strong>Detailed CSV:</strong> Line-by-line breakdown of all findings</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customizing Scan Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Bias Terms Management</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Add, remove, or modify the list of terms that the scanner looks for. 
                        Each term can be categorized and assigned a severity level.
                      </p>
                      <div className="space-y-2 text-sm">
                        <div><strong>Categories:</strong> Gender, Race, Hierarchy, Age, Other</div>
                        <div><strong>Severity:</strong> High, Medium, Low</div>
                        <div><strong>Suggestions:</strong> Alternative terms to replace biased language</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Scan Options</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Include Identifiers:</strong> Scan variable names, function names, etc.</li>
                        <li>• <strong>Include Strings:</strong> Scan string literals and text content</li>
                        <li>• <strong>Include Comments:</strong> Scan code comments and documentation</li>
                        <li>• <strong>Case Sensitive:</strong> Whether to match terms exactly or ignore case</li>
                        <li>• <strong>Time Per Fix:</strong> Estimated seconds needed to fix each occurrence</li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">💡 Pro Tips</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Start with default settings and adjust based on your codebase</li>
                        <li>• Add domain-specific terms relevant to your project</li>
                        <li>• Use case-insensitive matching for broader detection</li>
                        <li>• Regular reviews help maintain an inclusive codebase</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};