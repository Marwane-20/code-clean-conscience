import { BaseParser } from './base-parser';
import { SupportedLanguage } from '@/types/bias-scanner';

export class PythonParser extends BaseParser {
  language: SupportedLanguage = 'python';
  extensions = ['.py', '.pyw', '.pyi'];

  parseCode(content: string) {
    const lines = this.splitIntoLines(content);
    
    // Remove comments and strings for identifier extraction
    const withoutComments = this.removeComments(content);
    
    return {
      identifiers: this.extractPythonIdentifiers(withoutComments),
      strings: this.extractPythonStrings(content),
      comments: this.extractPythonComments(content),
      lines
    };
  }

  private removeComments(content: string): string {
    return content
      .replace(/"""[\s\S]*?"""/g, '') // Triple-quoted strings (docstrings)
      .replace(/'''[\s\S]*?'''/g, '') // Triple-quoted strings (docstrings)
      .replace(/#.*$/gm, ''); // Single-line comments
  }

  private extractPythonIdentifiers(content: string): string[] {
    const patterns = [
      /(?:def|class)\s+([a-zA-Z_][a-zA-Z0-9_]*)/g, // Function and class definitions
      /([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g, // Variable assignments
      /for\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+in/g, // For loop variables
      /except\s+\w+\s+as\s+([a-zA-Z_][a-zA-Z0-9_]*)/g, // Exception variables
      /with\s+.+\s+as\s+([a-zA-Z_][a-zA-Z0-9_]*)/g, // Context manager variables
      /import\s+([a-zA-Z_][a-zA-Z0-9_.]*)/g, // Import statements
      /from\s+[a-zA-Z_][a-zA-Z0-9_.]*\s+import\s+([a-zA-Z_][a-zA-Z0-9_,\s]*)/g, // From imports
      /\.([a-zA-Z_][a-zA-Z0-9_]*)/g, // Attribute access
      /([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g // Function calls
    ];

    const identifiers: string[] = [];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        if (match[1] && !this.isPythonKeyword(match[1])) {
          // Handle comma-separated imports
          if (match[1].includes(',')) {
            const parts = match[1].split(',').map(p => p.trim());
            identifiers.push(...parts);
          } else {
            identifiers.push(match[1]);
          }
        }
      }
    });

    return [...new Set(identifiers)];
  }

  private extractPythonStrings(content: string): string[] {
    const strings: string[] = [];
    const patterns = [
      /"""([\s\S]*?)"""/g, // Triple-quoted strings
      /'''([\s\S]*?)'''/g, // Triple-quoted strings
      /"([^"\\]|\\.)*"/g,  // Double quotes
      /'([^'\\]|\\.)*'/g,  // Single quotes
      /f"([^"\\]|\\.)*"/g, // F-strings double
      /f'([^'\\]|\\.)*'/g, // F-strings single
      /r"([^"\\]|\\.)*"/g, // Raw strings double
      /r'([^'\\]|\\.)*'/g  // Raw strings single
    ];

    patterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        strings.push(...matches.map(m => {
          // Remove quotes and prefixes
          return m.replace(/^[frbFRB]*['"]/, '').replace(/['"]$/, '');
        }));
      }
    });

    return strings;
  }

  private extractPythonComments(content: string): string[] {
    const singleLine = this.extractSingleLineComments(content, '#');
    const docstrings = this.extractMultiLineComments(content, '"""', '"""')
      .concat(this.extractMultiLineComments(content, "'''", "'''"));
    return [...singleLine, ...docstrings];
  }

  protected isPythonKeyword(identifier: string): boolean {
    const keywords = [
      'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await',
      'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except',
      'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is',
      'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try',
      'while', 'with', 'yield'
    ];
    return keywords.includes(identifier);
  }
}