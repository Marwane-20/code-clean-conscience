import { BaseParser } from './base-parser';
import { SupportedLanguage } from '@/types/bias-scanner';

export class JavaScriptParser extends BaseParser {
  language: SupportedLanguage = 'javascript';
  extensions = ['.js', '.jsx', '.mjs'];

  parseCode(content: string) {
    const lines = this.splitIntoLines(content);
    
    // Remove comments for identifier extraction
    const withoutComments = this.removeComments(content);
    
    return {
      identifiers: this.extractJSIdentifiers(withoutComments),
      strings: this.extractStrings(content),
      comments: this.extractJSComments(content),
      lines
    };
  }

  private removeComments(content: string): string {
    return content
      .replace(/\/\*[\s\S]*?\*\//g, '') // Multi-line comments
      .replace(/\/\/.*$/gm, ''); // Single-line comments
  }

  private extractJSIdentifiers(content: string): string[] {
    const patterns = [
      /\b(?:var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g, // Variable declarations
      /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g, // Function declarations
      /class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g, // Class declarations
      /\.([a-zA-Z_$][a-zA-Z0-9_$]*)/g, // Property access
      /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, // Object properties
      /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g // Function calls
    ];

    const identifiers: string[] = [];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        if (match[1] && !this.isKeyword(match[1])) {
          identifiers.push(match[1]);
        }
      }
    });

    return [...new Set(identifiers)];
  }

  private extractJSComments(content: string): string[] {
    const singleLine = this.extractSingleLineComments(content, '//');
    const multiLine = this.extractMultiLineComments(content, '/\\*', '\\*/');
    return [...singleLine, ...multiLine];
  }

  protected isKeyword(identifier: string): boolean {
    const keywords = [
      'abstract', 'arguments', 'await', 'boolean', 'break', 'byte', 'case', 'catch',
      'char', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do',
      'double', 'else', 'enum', 'eval', 'export', 'extends', 'false', 'final',
      'finally', 'float', 'for', 'function', 'goto', 'if', 'implements', 'import',
      'in', 'instanceof', 'int', 'interface', 'let', 'long', 'native', 'new',
      'null', 'package', 'private', 'protected', 'public', 'return', 'short',
      'static', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws',
      'transient', 'true', 'try', 'typeof', 'var', 'void', 'volatile', 'while',
      'with', 'yield'
    ];
    return keywords.includes(identifier.toLowerCase());
  }
}