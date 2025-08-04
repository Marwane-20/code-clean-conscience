import { JavaScriptParser } from './javascript-parser';
import { SupportedLanguage } from '@/types/bias-scanner';

export class TypeScriptParser extends JavaScriptParser {
  language: SupportedLanguage = 'typescript';
  extensions = ['.ts', '.tsx'];

  parseCode(content: string) {
    const lines = this.splitIntoLines(content);
    
    // Remove comments and type annotations for identifier extraction
    const withoutComments = this.removeCommentsAndTypes(content);
    
    return {
      identifiers: this.extractTSIdentifiers(withoutComments),
      strings: this.extractStrings(content),
      comments: this.extractTSComments(content),
      lines
    };
  }

  private removeCommentsAndTypes(content: string): string {
    return content
      .replace(/\/\*[\s\S]*?\*\//g, '') // Multi-line comments
      .replace(/\/\/.*$/gm, '') // Single-line comments
      .replace(/:\s*[a-zA-Z_$][a-zA-Z0-9_$<>|\[\]]*\s*=/g, ' = ') // Type annotations
      .replace(/:\s*[a-zA-Z_$][a-zA-Z0-9_$<>|\[\]]*\s*;/g, ';'); // Property types
  }

  private extractTSIdentifiers(content: string): string[] {
    const jsIdentifiers = super['extractJSIdentifiers'](content);
    
    const tsPatterns = [
      /interface\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g, // Interface declarations
      /type\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g, // Type aliases
      /enum\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g, // Enum declarations
      /namespace\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g // Namespace declarations
    ];

    const tsIdentifiers: string[] = [];
    
    tsPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        if (match[1] && !this.isKeyword(match[1])) {
          tsIdentifiers.push(match[1]);
        }
      }
    });

    return [...new Set([...jsIdentifiers, ...tsIdentifiers])];
  }

  private extractTSComments(content: string): string[] {
    const singleLine = this.extractSingleLineComments(content, '//');
    const multiLine = this.extractMultiLineComments(content, '/\\*', '\\*/');
    return [...singleLine, ...multiLine];
  }

  protected isKeyword(identifier: string): boolean {
    const tsKeywords = [
      'abstract', 'any', 'as', 'asserts', 'bigint', 'boolean', 'constructor',
      'declare', 'get', 'infer', 'intrinsic', 'is', 'keyof', 'module',
      'namespace', 'never', 'readonly', 'require', 'number', 'object',
      'set', 'string', 'symbol', 'type', 'undefined', 'unique', 'unknown',
      'from', 'global', 'of', 'satisfies'
    ];
    return super.isKeyword(identifier) || tsKeywords.includes(identifier.toLowerCase());
  }
}