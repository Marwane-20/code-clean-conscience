export interface BiasedTerm {
  id: string;
  term: string;
  category: 'gender' | 'race' | 'hierarchy' | 'age' | 'other';
  severity: 'low' | 'medium' | 'high';
  suggestions?: string[];
}

export interface CodeOccurrence {
  type: 'identifier' | 'string' | 'comment';
  line: number;
  column: number;
  content: string;
  context: string;
  biasedTerm: BiasedTerm;
}

export interface FileAnalysis {
  path: string;
  name: string;
  language: string;
  totalElements: number;
  biasedElements: number;
  biasPercentage: number;
  estimatedFixTime: number; // in seconds
  occurrences: CodeOccurrence[];
  lastScanned: Date;
}

export interface ScanSettings {
  biasedTerms: BiasedTerm[];
  timePerFix: number; // seconds per occurrence
  includeStrings: boolean;
  includeComments: boolean;
  includeIdentifiers: boolean;
  caseSensitive: boolean;
}

export interface ScanResults {
  totalFiles: number;
  scannedFiles: number;
  totalOccurrences: number;
  estimatedTotalTime: number;
  files: FileAnalysis[];
  scanDuration: number;
  timestamp: Date;
}

export type SupportedLanguage = 
  | 'javascript' 
  | 'typescript' 
  | 'python' 
  | 'java' 
  | 'csharp' 
  | 'cpp' 
  | 'c' 
  | 'go' 
  | 'rust' 
  | 'php' 
  | 'ruby' 
  | 'swift' 
  | 'kotlin'
  | 'text';

export interface LanguageParser {
  language: SupportedLanguage;
  extensions: string[];
  parseCode: (content: string) => {
    identifiers: string[];
    strings: string[];
    comments: string[];
    lines: string[];
  };
}