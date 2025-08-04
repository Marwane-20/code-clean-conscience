import React from 'react';
import { Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const shortcuts = [
  { keys: ['Ctrl', 'O'], description: 'Open file dialog' },
  { keys: ['Ctrl', 'S'], description: 'Open settings' },
  { keys: ['Ctrl', 'E'], description: 'Export results' },
  { keys: ['Escape'], description: 'Close dialogs' },
  { keys: ['Tab'], description: 'Navigate interface' },
  { keys: ['Enter'], description: 'Activate focused element' },
];

export const KeyboardShortcutsHelp: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Keyboard className="h-4 w-4 mr-2" />
          Shortcuts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md" aria-describedby="shortcuts-description">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <p id="shortcuts-description" className="text-sm text-muted-foreground">
            Use these keyboard shortcuts to navigate the application efficiently.
          </p>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{shortcut.description}</span>
                <div className="flex items-center gap-1">
                  {shortcut.keys.map((key, keyIndex) => (
                    <React.Fragment key={keyIndex}>
                      <Badge variant="outline" className="text-xs font-mono">
                        {key}
                      </Badge>
                      {keyIndex < shortcut.keys.length - 1 && (
                        <span className="text-muted-foreground text-xs">+</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <Separator />
          
          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">Accessibility:</p>
            <ul className="space-y-1 ml-2">
              <li>• Use Tab to navigate between interactive elements</li>
              <li>• Use Enter or Space to activate buttons</li>
              <li>• Use arrow keys in tables and lists</li>
              <li>• Screen readers are fully supported</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};