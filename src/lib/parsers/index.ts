import { JavaScriptParser } from './javascript-parser';
import { TypeScriptParser } from './typescript-parser';
import { PythonParser } from './python-parser';
import { SupportedLanguage, LanguageParser } from '@/types/bias-scanner';

export class ParserFactory {
  private static parsers: Map<SupportedLanguage, LanguageParser> = new Map();
  
  static {
    this.parsers.set('javascript', new JavaScriptParser());
    this.parsers.set('typescript', new TypeScriptParser());
    this.parsers.set('python', new PythonParser());
  }

  static getParser(language: SupportedLanguage): LanguageParser | null {
    return this.parsers.get(language) || null;
  }

  static getParserByExtension(extension: string): LanguageParser | null {
    for (const parser of this.parsers.values()) {
      if (parser.extensions.includes(extension.toLowerCase())) {
        return parser;
      }
    }
    return null;
  }

  static detectLanguage(filename: string, content?: string): SupportedLanguage {
    const extension = '.' + filename.split('.').pop()?.toLowerCase() || '';
    
    const parser = this.getParserByExtension(extension);
    if (parser) {
      return parser.language;
    }

    // Fallback detection based on content
    if (content) {
      if (content.includes('def ') || content.includes('import ')) {
        return 'python';
      }
      if (content.includes('function ') || content.includes('const ')) {
        return 'javascript';
      }
      if (content.includes('interface ') || content.includes('type ')) {
        return 'typescript';
      }
    }

    return 'text';
  }

  static getSupportedExtensions(): string[] {
    const extensions: string[] = [];
    for (const parser of this.parsers.values()) {
      extensions.push(...parser.extensions);
    }
    return [...new Set(extensions)];
  }
}

export * from './base-parser';
export * from './javascript-parser';
export * from './typescript-parser';
export * from './python-parser';