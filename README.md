# Code Bias Scanner 🛡️

A modern web application for detecting and eliminating biased language in codebases. Built with React, TypeScript, and advanced language parsing to help create more inclusive software.

![Code Bias Scanner Preview](https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=400&fit=crop)

## ✨ Features

- **🔍 Multi-Language Support**: Analyzes JavaScript, TypeScript, Python, Java, C#, C++, Go, Rust, PHP, Ruby, Swift, and Kotlin
- **⚡ Fast Analysis**: Quickly scan thousands of files with detailed reporting
- **🎯 Customizable Detection**: Configure bias terms, categories, and severity levels
- **📊 Detailed Reports**: Get line-by-line analysis with improvement suggestions
- **💾 Export Options**: Export results as CSV or JSON for further analysis
- **🌙 Dark Mode**: Beautiful dark and light theme support
- **♿ Accessibility**: Full keyboard navigation and screen reader support
- **📱 Responsive**: Works perfectly on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Modern web browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/code-bias-scanner.git
cd code-bias-scanner
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📖 How to Use

### 1. Select Files to Scan

- **Drag & Drop**: Drag files or folders directly onto the scanner area
- **File Browser**: Click "Select Files" to choose individual files
- **Folder Selection**: Click "Select Folder" to analyze entire directories

### 2. Configure Settings (Optional)

Click the Settings button to customize:

- **Bias Terms**: Add, remove, or modify detected terms
- **Categories**: Organize terms by type (Gender, Race, Hierarchy, Age, Other)
- **Severity Levels**: Assign High, Medium, or Low priority
- **Scan Options**: Choose what to analyze (identifiers, strings, comments)
- **Case Sensitivity**: Toggle exact vs. case-insensitive matching

### 3. Review Results

The results table shows:

- **File Path**: Location and name of each analyzed file
- **Language**: Detected programming language
- **Bias Percentage**: Percentage of potentially biased elements
- **Occurrences**: Total number of flagged terms
- **Fix Time**: Estimated time to address issues

### 4. Examine Details

Click on any file to open the detailed viewer:

- **Code Preview**: Syntax-highlighted code with biased terms marked
- **Line Numbers**: Easy navigation to specific issues
- **Suggestions**: Alternative terms for each flagged item
- **Context**: See exactly where each term appears

### 5. Export Reports

Export your findings in multiple formats:

- **CSV Summary**: Basic statistics for spreadsheet analysis
- **Detailed CSV**: Complete line-by-line breakdown
- **JSON**: Full data including suggestions and metadata

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + O` | Open file dialog |
| `Ctrl + S` | Open settings |
| `Ctrl + E` | Export results |
| `Escape` | Close dialogs |
| `Tab` | Navigate interface |
| `Enter` | Activate focused element |

## 🏗️ Architecture

### Project Structure

```
src/
├── components/
│   ├── ui/                    # Reusable UI components (shadcn/ui)
│   └── bias-scanner/          # Application-specific components
│       ├── file-scanner.tsx   # File upload and selection
│       ├── bias-settings.tsx  # Configuration panel
│       ├── results-table.tsx  # Results display and sorting
│       ├── file-viewer.tsx    # Detailed file analysis
│       ├── export-utils.ts    # Export functionality
│       ├── help-dialog.tsx    # User guide and documentation
│       └── keyboard-shortcuts-help.tsx
├── lib/
│   ├── bias-scanner.ts        # Core scanning logic
│   ├── parsers/               # Language-specific parsers
│   │   ├── base-parser.ts     # Abstract parser interface
│   │   ├── javascript-parser.ts
│   │   ├── typescript-parser.ts
│   │   ├── python-parser.ts
│   │   └── index.ts           # Parser factory
│   └── utils.ts               # Utility functions
├── hooks/
│   ├── use-keyboard-shortcuts.ts
│   └── use-toast.ts           # Toast notifications
├── types/
│   └── bias-scanner.ts        # TypeScript definitions
└── pages/
    └── Index.tsx              # Main application page
```

### Core Components

#### BiasScanner Class (`src/lib/bias-scanner.ts`)

The main scanning engine that:
- Coordinates file analysis across multiple languages
- Manages scan settings and configuration
- Aggregates results and calculates metrics
- Handles error recovery and progress tracking

#### Language Parsers (`src/lib/parsers/`)

Modular parsers for different programming languages:
- **Base Parser**: Abstract interface defining parsing contract
- **JavaScript/TypeScript**: ES6+ syntax support with AST parsing
- **Python**: Full Python 3 syntax with AST analysis
- **Extensible**: Easy to add new language support

#### UI Components (`src/components/bias-scanner/`)

- **FileScanner**: Handles file selection with drag-and-drop
- **BiasSettings**: Configuration interface for customizing detection
- **ResultsTable**: Sortable, searchable results with filtering
- **FileViewer**: Detailed analysis with syntax highlighting
- **Export Utils**: Multiple export formats with data transformation

### Design System

Built on a comprehensive design system using:

- **Tailwind CSS**: Utility-first styling with semantic tokens
- **shadcn/ui**: High-quality, accessible component library
- **CSS Custom Properties**: Consistent theming and dark mode support
- **HSL Color System**: Flexible color manipulation and variants

Key design tokens:
```css
--primary: 262 83% 58%      /* Main brand color */
--background: 0 0% 100%     /* Base background */
--foreground: 222 84% 5%    /* Primary text */
--muted: 210 40% 98%        /* Subtle backgrounds */
--border: 214 32% 91%       /* Border colors */
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
npm run format       # Format code with Prettier

# Testing
npm run test         # Run unit tests
npm run test:coverage # Run tests with coverage
npm run test:watch   # Watch mode for tests
```

### Adding New Language Support

1. Create a new parser in `src/lib/parsers/`:

```typescript
import { BaseParser, ParsedCode } from './base-parser';

export class NewLanguageParser extends BaseParser {
  language = 'newlang' as const;
  extensions = ['.newext'];

  parseCode(content: string): ParsedCode {
    // Implement language-specific parsing
    return {
      identifiers: [],
      strings: [],
      comments: [],
      lines: content.split('\n')
    };
  }
}
```

2. Register in `src/lib/parsers/index.ts`:

```typescript
import { NewLanguageParser } from './newlang-parser';

// Add to PARSERS array
export const PARSERS = [
  // ... existing parsers
  new NewLanguageParser(),
];
```

### Customizing Bias Detection

The application comes with sensible defaults, but you can customize:

**Default Bias Terms**: Edit `src/lib/bias-scanner.ts`
```typescript
export const defaultBiasedTerms: BiasedTerm[] = [
  {
    id: 'custom-1',
    term: 'problematic-term',
    category: 'hierarchy',
    severity: 'high',
    suggestions: ['alternative1', 'alternative2']
  },
  // ... more terms
];
```

**Detection Logic**: Modify scanning behavior in `BiasScanner.scanFile()`

## 🧪 Testing

### Test Coverage

- **Unit Tests**: Core logic and utilities
- **Component Tests**: UI components and interactions
- **Integration Tests**: End-to-end scanning workflows
- **Accessibility Tests**: WCAG compliance verification

### Running Tests

```bash
# All tests
npm run test

# With coverage report
npm run test:coverage

# Watch mode for development
npm run test:watch

# Specific test file
npm run test -- file-scanner.test.tsx
```

## 🔧 Configuration

### Environment Variables

```bash
VITE_APP_TITLE="Code Bias Scanner"
VITE_DEFAULT_THEME="light"
VITE_MAX_FILE_SIZE="10485760"  # 10MB
```

### Build Configuration

The application uses Vite for building with:
- **TypeScript**: Full type checking and IntelliSense
- **ESLint**: Code quality and consistency
- **Prettier**: Automatic code formatting
- **Tailwind CSS**: Utility-first styling
- **PostCSS**: CSS processing and optimization

## 📊 Performance

### Optimization Features

- **Lazy Loading**: Components loaded on demand
- **Code Splitting**: Automatic bundle optimization
- **Tree Shaking**: Unused code elimination
- **Compression**: Gzip/Brotli compression support
- **Caching**: Aggressive browser caching strategies

### Benchmarks

Typical performance on modern hardware:
- **1,000 files**: ~2-5 seconds
- **10,000 files**: ~15-30 seconds
- **Memory usage**: ~50-100MB for large projects
- **Bundle size**: ~500KB compressed

## ♿ Accessibility

### WCAG 2.1 AA Compliance

- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: NVDA, JAWS, VoiceOver support
- **High Contrast**: Meets contrast requirements
- **Focus Management**: Clear visual focus indicators
- **Semantic HTML**: Proper heading structure and landmarks
- **ARIA Labels**: Comprehensive labeling for assistive technologies

### Accessibility Features

- **Skip Links**: Quick navigation to main content
- **Keyboard Shortcuts**: Efficient keyboard-only operation
- **Color Independence**: Information not conveyed by color alone
- **Reduced Motion**: Respects user motion preferences
- **Zoom Support**: Works at 200%+ zoom levels

## 🌍 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Ensure all tests pass: `npm run test`
5. Commit with conventional commits: `git commit -m "feat: add amazing feature"`
6. Push to your fork: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines

- **Code Style**: Follow existing patterns and ESLint rules
- **Testing**: Add tests for new features and bug fixes
- **Documentation**: Update docs for user-facing changes
- **Performance**: Consider impact on large codebases
- **Accessibility**: Maintain WCAG 2.1 AA compliance

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui**: Beautiful, accessible component library
- **Lucide**: Comprehensive icon set
- **Tailwind CSS**: Utility-first CSS framework
- **React**: Powerful UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server

## 📚 Related Projects

- [inclusive-naming](https://github.com/aiven/inclusive-naming-tool) - CLI tool for inclusive naming
- [alex](https://github.com/get-alex/alex) - Text analysis for insensitive writing
- [textlint](https://github.com/textlint/textlint) - Pluggable text linting tool

## 🆘 Support

- **Documentation**: [GitHub Pages](https://your-username.github.io/code-bias-scanner)
- **Issues**: [GitHub Issues](https://github.com/your-username/code-bias-scanner/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/code-bias-scanner/discussions)
- **Email**: support@codebiasscanner.dev

---

<div align="center">

**[Website](https://codebiasscanner.dev)** • **[Documentation](https://docs.codebiasscanner.dev)** • **[GitHub](https://github.com/your-username/code-bias-scanner)**

Made with ❤️ for inclusive software development

</div>
