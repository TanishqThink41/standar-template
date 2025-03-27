
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { templates, themes } from '@/lib/templates';
import { Template, Theme } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ImagePlus } from 'lucide-react';
import { toast } from 'sonner';
import { handleImageUpload } from '@/lib/export';

interface ToolPanelProps {
  onSelectTemplate: (templateId: string) => void;
  onSelectTheme: (themeId: string) => void;
  currentTheme: string;
  onAddCustomTheme?: (themeId: string, backgroundImage: string) => void;
}

const ToolPanel: React.FC<ToolPanelProps> = ({
  onSelectTemplate,
  onSelectTheme,
  currentTheme,
  onAddCustomTheme
}) => {
  const [customThemes, setCustomThemes] = useState<Theme[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleCustomThemeImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, (base64) => {
        const themeCount = customThemes.length + 1;
        const newThemeId = `theme-${themeCount}`;
        const newTheme: Theme = {
          id: newThemeId,
          name: `Custom Theme ${themeCount}`,
          primary: themes[0].primary,
          secondary: themes[0].secondary,
          background: themes[0].background,
          text: themes[0].text,
          backgroundImage: base64
        };
        
        setCustomThemes([...customThemes, newTheme]);
        
        if (onAddCustomTheme) {
          onAddCustomTheme(newThemeId, base64);
        }
        
        toast.success('Custom theme added');
      });
    }
  };

  return (
    <div className="border-l border-gray-200 h-full bg-gray-50 flex flex-col">
      <div className="p-4 flex-grow overflow-hidden flex flex-col">
        <Tabs defaultValue="templates" className="flex flex-col h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="themes">Themes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates" className="mt-4 animate-fade-in flex-grow overflow-hidden">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="grid grid-cols-2 gap-3 pr-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="overflow-hidden rounded-md border border-gray-200 bg-white hover:border-primary/60 hover:shadow-md transition-all duration-200 cursor-pointer hover-scale"
                    onClick={() => onSelectTemplate(template.id)}
                  >
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={template.thumbnail} 
                        alt={template.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="p-2">
                      <h3 className="text-xs font-medium">{template.name}</h3>
                      <p className="text-[10px] text-gray-500 truncate">{template.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="themes" className="mt-4 animate-fade-in flex-grow overflow-hidden">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="grid grid-cols-1 gap-4 pr-4">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 p-6 border-dashed border-2"
                  onClick={triggerImageUpload}
                >
                  <ImagePlus size={20} />
                  <span>Add New Theme</span>
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleCustomThemeImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                
                {/* Custom themes first */}
                {customThemes.map((theme) => (
                  <ThemeOption 
                    key={theme.id}
                    theme={theme}
                    isSelected={currentTheme === theme.id}
                    onClick={() => onSelectTheme(theme.id)}
                    isCustom={true}
                  />
                ))}
                
                {/* Default themes */}
                {themes.map((theme) => (
                  <ThemeOption 
                    key={theme.id}
                    theme={theme}
                    isSelected={currentTheme === theme.id}
                    onClick={() => onSelectTheme(theme.id)}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface ThemeOptionProps {
  theme: Theme;
  isSelected: boolean;
  onClick: () => void;
  isCustom?: boolean;
}

const ThemeOption: React.FC<ThemeOptionProps> = ({ 
  theme, 
  isSelected, 
  onClick,
  isCustom = false
}) => {
  return (
    <div 
      className={cn(
        "p-3 rounded-md cursor-pointer transition-all duration-200",
        isSelected 
          ? "ring-2 ring-primary/60 ring-offset-2" 
          : "border border-gray-200 hover:border-primary/40"
      )}
      style={{ 
        backgroundColor: theme.background,
        backgroundImage: theme.backgroundImage ? `url(${theme.backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 
          className={cn(
            "text-sm font-medium",
            isCustom && "bg-white/80 px-2 py-1 rounded"
          )}
          style={{ color: theme.text }}
        >
          {theme.name}
        </h3>
        
        {isSelected && (
          <div className="h-4 w-4 rounded-full bg-primary/80"></div>
        )}
      </div>
      
      <div className="flex space-x-2">
        <div 
          className="h-6 w-6 rounded-full"
          style={{ backgroundColor: theme.primary }}
        ></div>
        <div 
          className="h-6 w-6 rounded-full"
          style={{ backgroundColor: theme.secondary }}
        ></div>
        <div 
          className="h-6 w-6 rounded-full"
          style={{ backgroundColor: theme.text }}
        ></div>
      </div>
    </div>
  );
};

export default ToolPanel;
