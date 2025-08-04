import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Copy, 
  Eye, 
  AlertTriangle, 
  Clock, 
  File,
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScanResults, FileAnalysis } from '@/types/bias-scanner';
import { formatDuration } from '@/lib/utils';

interface ResultsTableProps {
  results: ScanResults | null;
  onViewFile: (file: FileAnalysis) => void;
  onExport: (format: 'csv' | 'json') => void;
}

type SortField = 'name' | 'biasPercentage' | 'biasedElements' | 'estimatedFixTime' | 'language';
type SortDirection = 'asc' | 'desc';

export const ResultsTable: React.FC<ResultsTableProps> = ({
  results,
  onViewFile,
  onExport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [biasFilter, setBiasFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('biasPercentage');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const filteredAndSortedFiles = useMemo(() => {
    if (!results) return [];

    let filtered = results.files.filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           file.path.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLanguage = languageFilter === 'all' || file.language === languageFilter;
      
      const matchesBias = biasFilter === 'all' || 
                         (biasFilter === 'high' && file.biasPercentage > 10) ||
                         (biasFilter === 'medium' && file.biasPercentage > 5 && file.biasPercentage <= 10) ||
                         (biasFilter === 'low' && file.biasPercentage > 0 && file.biasPercentage <= 5) ||
                         (biasFilter === 'none' && file.biasPercentage === 0);

      return matchesSearch && matchesLanguage && matchesBias;
    });

    filtered.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'name') {
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [results, searchTerm, languageFilter, biasFilter, sortField, sortDirection]);

  const uniqueLanguages = useMemo(() => {
    if (!results) return [];
    return [...new Set(results.files.map(f => f.language))].sort();
  }, [results]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />;
  };

  const getBiasLevelColor = (percentage: number) => {
    if (percentage === 0) return 'text-success';
    if (percentage <= 5) return 'text-success';
    if (percentage <= 10) return 'text-warning';
    return 'text-destructive';
  };

  const getBiasLevelBg = (percentage: number) => {
    if (percentage === 0) return 'bg-success/20';
    if (percentage <= 5) return 'bg-success/20';
    if (percentage <= 10) return 'bg-warning/20';
    return 'bg-destructive/20';
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  if (!results) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <File className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Files Scanned</h3>
          <p className="text-muted-foreground">
            Upload some code files to start scanning for potential bias.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Scan Results
            </CardTitle>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span>{results.scannedFiles} files scanned</span>
              <span>{results.totalOccurrences} biased terms found</span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatDuration(results.estimatedTotalTime)} estimated fix time
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onExport('csv')}
            >
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onExport('json')}
            >
              <Download className="mr-2 h-4 w-4" />
              JSON
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => copyToClipboard(JSON.stringify(results, null, 2))}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <Select value={languageFilter} onValueChange={setLanguageFilter}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Filter by language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {uniqueLanguages.map(lang => (
                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={biasFilter} onValueChange={setBiasFilter}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Filter by bias level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="high">High (&gt;10%)</SelectItem>
              <SelectItem value="medium">Medium (5-10%)</SelectItem>
              <SelectItem value="low">Low (0-5%)</SelectItem>
              <SelectItem value="none">No Bias (0%)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleSort('name')}
                      className="h-auto p-0 font-medium"
                    >
                      File Name {getSortIcon('name')}
                    </Button>
                  </th>
                  <th className="text-left p-4 font-medium">Language</th>
                  <th className="text-left p-4 font-medium">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleSort('biasPercentage')}
                      className="h-auto p-0 font-medium"
                    >
                      Bias Level {getSortIcon('biasPercentage')}
                    </Button>
                  </th>
                  <th className="text-left p-4 font-medium">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleSort('biasedElements')}
                      className="h-auto p-0 font-medium"
                    >
                      Occurrences {getSortIcon('biasedElements')}
                    </Button>
                  </th>
                  <th className="text-left p-4 font-medium">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleSort('estimatedFixTime')}
                      className="h-auto p-0 font-medium"
                    >
                      Fix Time {getSortIcon('estimatedFixTime')}
                    </Button>
                  </th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedFiles.map((file, index) => (
                  <tr 
                    key={file.path} 
                    className="border-t hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{file.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {file.path}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="font-mono text-xs">
                        {file.language}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${getBiasLevelColor(file.biasPercentage)}`}>
                            {file.biasPercentage.toFixed(1)}%
                          </span>
                          <div className={`px-2 py-1 rounded text-xs ${getBiasLevelBg(file.biasPercentage)} ${getBiasLevelColor(file.biasPercentage)}`}>
                            {file.biasPercentage === 0 ? 'Clean' :
                             file.biasPercentage <= 5 ? 'Low' :
                             file.biasPercentage <= 10 ? 'Medium' : 'High'}
                          </div>
                        </div>
                        {file.biasPercentage > 0 && (
                          <Progress 
                            value={Math.min(file.biasPercentage, 100)} 
                            className="h-2 w-24"
                          />
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium">{file.biasedElements}</span>
                      <span className="text-muted-foreground text-sm">
                        /{file.totalElements}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">
                        {formatDuration(file.estimatedFixTime)}
                      </span>
                    </td>
                    <td className="p-4">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onViewFile(file)}
                        disabled={file.biasedElements === 0}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredAndSortedFiles.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No files match the current filters.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};