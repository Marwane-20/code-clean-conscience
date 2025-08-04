import { 
  BiasedTerm, 
  CodeOccurrence, 
  FileAnalysis, 
  ScanSettings, 
  ScanResults 
} from '@/types/bias-scanner';
import { ParserFactory } from './parsers';

export class BiasScanner {
  private settings: ScanSettings;

  constructor(settings: ScanSettings) {
    this.settings = settings;
  }

  updateSettings(settings: ScanSettings) {
    this.settings = settings;
  }

  async scanFiles(files: File[]): Promise<ScanResults> {
    const startTime = Date.now();
    const fileAnalyses: FileAnalysis[] = [];
    let totalOccurrences = 0;
    let estimatedTotalTime = 0;

    for (const file of files) {
      try {
        const analysis = await this.scanFile(file);
        fileAnalyses.push(analysis);
        totalOccurrences += analysis.biasedElements;
        estimatedTotalTime += analysis.estimatedFixTime;
      } catch (error) {
        console.error(`Error scanning file ${file.name}:`, error);
        // Add failed file with zero results
        fileAnalyses.push({
          path: file.name,
          name: file.name,
          language: 'text',
          totalElements: 0,
          biasedElements: 0,
          biasPercentage: 0,
          estimatedFixTime: 0,
          occurrences: [],
          lastScanned: new Date()
        });
      }
    }

    const scanDuration = Date.now() - startTime;

    return {
      totalFiles: files.length,
      scannedFiles: fileAnalyses.length,
      totalOccurrences,
      estimatedTotalTime,
      files: fileAnalyses,
      scanDuration,
      timestamp: new Date()
    };
  }

  private async scanFile(file: File): Promise<FileAnalysis> {
    const content = await this.readFileContent(file);
    const language = ParserFactory.detectLanguage(file.name, content);
    const parser = ParserFactory.getParser(language);
    
    if (!parser) {
      // Fallback for unsupported languages
      return this.scanTextFile(file, content);
    }

    const parsed = parser.parseCode(content);
    const occurrences: CodeOccurrence[] = [];
    let totalElements = 0;

    // Scan identifiers
    if (this.settings.includeIdentifiers) {
      totalElements += parsed.identifiers.length;
      for (const identifier of parsed.identifiers) {
        const biasedTerm = this.findBiasedTerm(identifier);
        if (biasedTerm) {
          occurrences.push(...this.findOccurrencesInLines(
            identifier, 
            parsed.lines, 
            'identifier', 
            biasedTerm
          ));
        }
      }
    }

    // Scan strings
    if (this.settings.includeStrings) {
      totalElements += parsed.strings.length;
      for (const string of parsed.strings) {
        const biasedTerms = this.findBiasedTermsInText(string);
        for (const biasedTerm of biasedTerms) {
          occurrences.push(...this.findOccurrencesInLines(
            string, 
            parsed.lines, 
            'string', 
            biasedTerm
          ));
        }
      }
    }

    // Scan comments
    if (this.settings.includeComments) {
      totalElements += parsed.comments.length;
      for (const comment of parsed.comments) {
        const biasedTerms = this.findBiasedTermsInText(comment);
        for (const biasedTerm of biasedTerms) {
          occurrences.push(...this.findOccurrencesInLines(
            comment, 
            parsed.lines, 
            'comment', 
            biasedTerm
          ));
        }
      }
    }

    const biasedElements = occurrences.length;
    const biasPercentage = totalElements > 0 ? (biasedElements / totalElements) * 100 : 0;
    const estimatedFixTime = biasedElements * this.settings.timePerFix;

    return {
      path: file.name,
      name: file.name,
      language,
      totalElements,
      biasedElements,
      biasPercentage,
      estimatedFixTime,
      occurrences,
      lastScanned: new Date()
    };
  }

  private async scanTextFile(file: File, content: string): Promise<FileAnalysis> {
    const lines = content.split('\n');
    const occurrences: CodeOccurrence[] = [];
    const words = content.split(/\s+/);
    let totalElements = words.length;

    for (const word of words) {
      const biasedTerms = this.findBiasedTermsInText(word);
      for (const biasedTerm of biasedTerms) {
        occurrences.push(...this.findOccurrencesInLines(
          word, 
          lines, 
          'string', 
          biasedTerm
        ));
      }
    }

    const biasedElements = occurrences.length;
    const biasPercentage = totalElements > 0 ? (biasedElements / totalElements) * 100 : 0;
    const estimatedFixTime = biasedElements * this.settings.timePerFix;

    return {
      path: file.name,
      name: file.name,
      language: 'text',
      totalElements,
      biasedElements,
      biasPercentage,
      estimatedFixTime,
      occurrences,
      lastScanned: new Date()
    };
  }

  private async readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  private findBiasedTerm(text: string): BiasedTerm | null {
    const searchText = this.settings.caseSensitive ? text : text.toLowerCase();
    
    return this.settings.biasedTerms.find(term => {
      const termText = this.settings.caseSensitive ? term.term : term.term.toLowerCase();
      return searchText.includes(termText);
    }) || null;
  }

  private findBiasedTermsInText(text: string): BiasedTerm[] {
    const searchText = this.settings.caseSensitive ? text : text.toLowerCase();
    
    return this.settings.biasedTerms.filter(term => {
      const termText = this.settings.caseSensitive ? term.term : term.term.toLowerCase();
      return searchText.includes(termText);
    });
  }

  private findOccurrencesInLines(
    searchText: string, 
    lines: string[], 
    type: CodeOccurrence['type'],
    biasedTerm: BiasedTerm
  ): CodeOccurrence[] {
    const occurrences: CodeOccurrence[] = [];
    const searchPattern = this.settings.caseSensitive ? searchText : searchText.toLowerCase();

    lines.forEach((line, index) => {
      const lineText = this.settings.caseSensitive ? line : line.toLowerCase();
      const termText = this.settings.caseSensitive ? biasedTerm.term : biasedTerm.term.toLowerCase();
      
      if (lineText.includes(searchPattern) && searchPattern.includes(termText)) {
        const column = lineText.indexOf(searchPattern);
        
        occurrences.push({
          type,
          line: index + 1,
          column,
          content: searchText,
          context: line.trim(),
          biasedTerm
        });
      }
    });

    return occurrences;
  }
}

export const defaultBiasedTerms: BiasedTerm[] = [
  { id: '1', term: 'man', category: 'gender', severity: 'medium', suggestions: ['person', 'individual'] },
  { id: '2', term: 'woman', category: 'gender', severity: 'medium', suggestions: ['person', 'individual'] },
  { id: '3', term: 'male', category: 'gender', severity: 'medium', suggestions: ['user', 'participant'] },
  { id: '4', term: 'female', category: 'gender', severity: 'medium', suggestions: ['user', 'participant'] },
  { id: '5', term: 'master', category: 'hierarchy', severity: 'high', suggestions: ['main', 'primary', 'leader'] },
  { id: '6', term: 'slave', category: 'hierarchy', severity: 'high', suggestions: ['worker', 'replica', 'follower'] },
  { id: '7', term: 'blacklist', category: 'race', severity: 'high', suggestions: ['blocklist', 'denylist'] },
  { id: '8', term: 'whitelist', category: 'race', severity: 'high', suggestions: ['allowlist', 'safelist'] },
  { id: '9', term: 'king', category: 'gender', severity: 'medium', suggestions: ['leader', 'ruler'] },
  { id: '10', term: 'queen', category: 'gender', severity: 'medium', suggestions: ['leader', 'ruler'] },
  { id: '11', term: 'boy', category: 'age', severity: 'low', suggestions: ['child', 'youth'] },
  { id: '12', term: 'girl', category: 'age', severity: 'low', suggestions: ['child', 'youth'] }
];

export const defaultScanSettings: ScanSettings = {
  biasedTerms: defaultBiasedTerms,
  timePerFix: 30, // 30 seconds per occurrence
  includeStrings: true,
  includeComments: true,
  includeIdentifiers: true,
  caseSensitive: false
};