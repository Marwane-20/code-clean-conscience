import { LanguageParser, SupportedLanguage } from '@/types/bias-scanner';

export abstract class BaseParser implements LanguageParser {
  abstract language: SupportedLanguage;
  abstract extensions: string[];
  
  abstract parseCode(content: string): {
    identifiers: string[];
    strings: string[];
    comments: string[];
    lines: string[];
  };

  protected extractStrings(content: string): string[] {
    const strings: string[] = [];
    const patterns = [
      /"([^"\\]|\\.)*"/g,  // Double quotes
      /'([^'\\]|\\.)*'/g,  // Single quotes
      /`([^`\\]|\\.)*`/g   // Template literals
    ];

    patterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        strings.push(...matches.map(m => m.slice(1, -1))); // Remove quotes
      }
    });

    return strings;
  }

  protected extractSingleLineComments(content: string, commentPrefix: string): string[] {
    const regex = new RegExp(`${commentPrefix}(.*)$`, 'gm');
    const matches = content.match(regex);
    return matches ? matches.map(m => m.replace(commentPrefix, '').trim()) : [];
  }

  protected extractMultiLineComments(content: string, startToken: string, endToken: string): string[] {
    const regex = new RegExp(`${startToken}([\\s\\S]*?)${endToken}`, 'g');
    const matches = content.match(regex);
    return matches ? matches.map(m => 
      m.replace(startToken, '').replace(endToken, '').trim()
    ) : [];
  }

  protected extractIdentifiers(content: string, identifierPattern: RegExp): string[] {
    const matches = content.match(identifierPattern);
    return matches ? [...new Set(matches)] : [];
  }

  protected splitIntoLines(content: string): string[] {
    return content.split('\n');
  }
}