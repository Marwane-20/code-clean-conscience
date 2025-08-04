import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BiasedTerm, ScanSettings } from '@/types/bias-scanner';
import { defaultBiasedTerms } from '@/lib/bias-scanner';

interface BiasSettingsProps {
  settings: ScanSettings;
  onSettingsChange: (settings: ScanSettings) => void;
}

export const BiasSettings: React.FC<BiasSettingsProps> = ({
  settings,
  onSettingsChange
}) => {
  const [editingTerm, setEditingTerm] = useState<string | null>(null);
  const [newTerm, setNewTerm] = useState<Partial<BiasedTerm>>({
    term: '',
    category: 'other',
    severity: 'medium'
  });
  const [isAddingTerm, setIsAddingTerm] = useState(false);

  const handleAddTerm = () => {
    if (!newTerm.term?.trim()) return;
    
    const term: BiasedTerm = {
      id: Date.now().toString(),
      term: newTerm.term.trim(),
      category: newTerm.category || 'other',
      severity: newTerm.severity || 'medium',
      suggestions: []
    };

    onSettingsChange({
      ...settings,
      biasedTerms: [...settings.biasedTerms, term]
    });

    setNewTerm({ term: '', category: 'other', severity: 'medium' });
    setIsAddingTerm(false);
  };

  const handleDeleteTerm = (id: string) => {
    onSettingsChange({
      ...settings,
      biasedTerms: settings.biasedTerms.filter(term => term.id !== id)
    });
  };

  const handleEditTerm = (updatedTerm: BiasedTerm) => {
    onSettingsChange({
      ...settings,
      biasedTerms: settings.biasedTerms.map(term => 
        term.id === updatedTerm.id ? updatedTerm : term
      )
    });
    setEditingTerm(null);
  };

  const resetToDefaults = () => {
    onSettingsChange({
      ...settings,
      biasedTerms: defaultBiasedTerms
    });
  };

  const getSeverityColor = (severity: BiasedTerm['severity']) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'outline';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getCategoryColor = (category: BiasedTerm['category']) => {
    switch (category) {
      case 'gender': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'race': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'hierarchy': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      case 'age': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Bias Detection Settings
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetToDefaults}
          >
            Reset to Defaults
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Scan Options */}
        <div className="space-y-4">
          <h4 className="font-medium">Scan Options</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="include-identifiers">Scan Identifiers</Label>
              <Switch
                id="include-identifiers"
                checked={settings.includeIdentifiers}
                onCheckedChange={(checked) => 
                  onSettingsChange({ ...settings, includeIdentifiers: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="include-strings">Scan Strings</Label>
              <Switch
                id="include-strings"
                checked={settings.includeStrings}
                onCheckedChange={(checked) => 
                  onSettingsChange({ ...settings, includeStrings: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="include-comments">Scan Comments</Label>
              <Switch
                id="include-comments"
                checked={settings.includeComments}
                onCheckedChange={(checked) => 
                  onSettingsChange({ ...settings, includeComments: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="case-sensitive">Case Sensitive</Label>
              <Switch
                id="case-sensitive"
                checked={settings.caseSensitive}
                onCheckedChange={(checked) => 
                  onSettingsChange({ ...settings, caseSensitive: checked })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time-per-fix">Time per Fix (seconds)</Label>
            <Input
              id="time-per-fix"
              type="number"
              min="1"
              max="3600"
              value={settings.timePerFix}
              onChange={(e) => 
                onSettingsChange({ 
                  ...settings, 
                  timePerFix: parseInt(e.target.value) || 30 
                })
              }
            />
          </div>
        </div>

        <Separator />

        {/* Biased Terms */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Biased Terms ({settings.biasedTerms.length})</h4>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsAddingTerm(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Term
            </Button>
          </div>

          {/* Add new term */}
          {isAddingTerm && (
            <Card className="border-dashed">
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Input
                    placeholder="Term"
                    value={newTerm.term}
                    onChange={(e) => setNewTerm({ ...newTerm, term: e.target.value })}
                  />
                  
                  <Select
                    value={newTerm.category}
                    onValueChange={(value) => 
                      setNewTerm({ ...newTerm, category: value as BiasedTerm['category'] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gender">Gender</SelectItem>
                      <SelectItem value="race">Race</SelectItem>
                      <SelectItem value="hierarchy">Hierarchy</SelectItem>
                      <SelectItem value="age">Age</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={newTerm.severity}
                    onValueChange={(value) => 
                      setNewTerm({ ...newTerm, severity: value as BiasedTerm['severity'] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddTerm}>
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setIsAddingTerm(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Terms list */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {settings.biasedTerms.map((term) => (
              <div 
                key={term.id} 
                className="flex items-center justify-between p-3 border rounded-lg bg-card"
              >
                {editingTerm === term.id ? (
                  <EditTermForm 
                    term={term} 
                    onSave={handleEditTerm}
                    onCancel={() => setEditingTerm(null)}
                  />
                ) : (
                  <>
                    <div className="flex items-center gap-3 flex-1">
                      <span className="font-mono bg-muted px-2 py-1 rounded text-sm">
                        {term.term}
                      </span>
                      <Badge className={getCategoryColor(term.category)}>
                        {term.category}
                      </Badge>
                      <Badge variant={getSeverityColor(term.severity)}>
                        {term.severity}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setEditingTerm(term.id)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDeleteTerm(term.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EditTermForm: React.FC<{
  term: BiasedTerm;
  onSave: (term: BiasedTerm) => void;
  onCancel: () => void;
}> = ({ term, onSave, onCancel }) => {
  const [editedTerm, setEditedTerm] = useState(term);

  return (
    <div className="flex items-center gap-3 flex-1">
      <Input
        value={editedTerm.term}
        onChange={(e) => setEditedTerm({ ...editedTerm, term: e.target.value })}
        className="font-mono"
      />
      
      <Select
        value={editedTerm.category}
        onValueChange={(value) => 
          setEditedTerm({ ...editedTerm, category: value as BiasedTerm['category'] })
        }
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="gender">Gender</SelectItem>
          <SelectItem value="race">Race</SelectItem>
          <SelectItem value="hierarchy">Hierarchy</SelectItem>
          <SelectItem value="age">Age</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={editedTerm.severity}
        onValueChange={(value) => 
          setEditedTerm({ ...editedTerm, severity: value as BiasedTerm['severity'] })
        }
      >
        <SelectTrigger className="w-28">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Button size="sm" onClick={() => onSave(editedTerm)}>
          <Save className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};