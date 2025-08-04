import { ScanResults } from '@/types/bias-scanner';

export const exportToCSV = (results: ScanResults): void => {
  const headers = [
    'File Name',
    'File Path', 
    'Language',
    'Total Elements',
    'Biased Elements',
    'Bias Percentage',
    'Estimated Fix Time (seconds)',
    'Last Scanned'
  ];

  const rows = results.files.map(file => [
    file.name,
    file.path,
    file.language,
    file.totalElements.toString(),
    file.biasedElements.toString(),
    file.biasPercentage.toFixed(2),
    file.estimatedFixTime.toString(),
    file.lastScanned.toISOString()
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  downloadFile(csvContent, `bias-scan-results-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
};

export const exportToJSON = (results: ScanResults): void => {
  const jsonContent = JSON.stringify(results, null, 2);
  downloadFile(
    jsonContent, 
    `bias-scan-results-${new Date().toISOString().split('T')[0]}.json`, 
    'application/json'
  );
};

export const exportDetailedCSV = (results: ScanResults): void => {
  const headers = [
    'File Name',
    'File Path',
    'Language',
    'Line Number',
    'Column',
    'Occurrence Type',
    'Biased Term',
    'Term Category',
    'Term Severity',
    'Context',
    'Content'
  ];

  const rows: string[][] = [];
  
  results.files.forEach(file => {
    if (file.occurrences.length === 0) {
      // Add a row for files with no biased terms
      rows.push([
        file.name,
        file.path,
        file.language,
        '',
        '',
        '',
        '',
        '',
        '',
        'No biased terms found',
        ''
      ]);
    } else {
      file.occurrences.forEach(occurrence => {
        rows.push([
          file.name,
          file.path,
          file.language,
          occurrence.line.toString(),
          occurrence.column.toString(),
          occurrence.type,
          occurrence.biasedTerm.term,
          occurrence.biasedTerm.category,
          occurrence.biasedTerm.severity,
          occurrence.context,
          occurrence.content
        ]);
      });
    }
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  downloadFile(
    csvContent, 
    `bias-scan-detailed-${new Date().toISOString().split('T')[0]}.csv`, 
    'text/csv'
  );
};

const downloadFile = (content: string, filename: string, contentType: string): void => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};