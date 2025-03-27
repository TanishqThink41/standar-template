
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  Save, 
  Download, 
  FileText, 
  Image, 
  Copy, 
  MoreHorizontal,
  Table,
  AlignLeft,
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Presentation, TableData } from '@/lib/types';

interface NavbarProps {
  presentation: Presentation;
  onTitleChange: (title: string) => void;
  onNewPresentation: () => void;
  onExport: () => void;
  onAddTable?: () => void;
  onAddTextBox?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  presentation, 
  onTitleChange, 
  onNewPresentation,
  onExport,
  onAddTable,
  onAddTextBox
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(presentation.title);

  const handleTitleChange = () => {
    onTitleChange(title);
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleChange();
    }
  };

  return (
    <div className="glass fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="text-lg font-medium text-primary flex items-center gap-2">
            <FileText size={24} />
            <span>SlideCraft</span>
          </div>
          
          <div className="h-6 w-px bg-gray-200" />
          
          {isEditingTitle ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleChange}
              onKeyDown={handleTitleKeyDown}
              className="w-64 border-none text-lg font-medium animate-fade-in focus-visible:ring-0"
              autoFocus
            />
          ) : (
            <div
              onClick={() => setIsEditingTitle(true)}
              className="text-lg font-medium cursor-pointer hover:text-primary transition-colors"
            >
              {presentation.title}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {onAddTable && (
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
              onClick={onAddTable}
            >
              <Table size={16} />
              <span className="hidden sm:inline">Add Table</span>
            </Button>
          )}
          
          {onAddTextBox && (
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
              onClick={onAddTextBox}
            >
              <AlignLeft size={16} />
              <span className="hidden sm:inline">Add Text Box</span>
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
            onClick={() => {
              toast.success('Presentation saved');
            }}
          >
            <Save size={16} />
            <span className="hidden sm:inline">Save</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
            onClick={onExport}
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass">
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={onNewPresentation}
                className="flex items-center gap-2 cursor-pointer"
              >
                <FileText size={16} />
                <span>New Presentation</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  // Copy presentation content to clipboard
                  navigator.clipboard.writeText(JSON.stringify(presentation, null, 2));
                  toast.success('Copied presentation data to clipboard');
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Copy size={16} />
                <span>Copy as JSON</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
