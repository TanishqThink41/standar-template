
import React, { useState } from 'react';
import Navbar from '@/components/powerpoint/Navbar';
import SlidePreview from '@/components/powerpoint/SlidePreview';
import SlideList from '@/components/powerpoint/SlideList';
import ToolPanel from '@/components/powerpoint/ToolPanel';
import TemplateSelector from '@/components/powerpoint/TemplateSelector';
import { usePresentation } from '@/hooks/usePresentation';
import { themes } from '@/lib/templates';
import { exportToPptx } from '@/lib/export';
import { Button } from '@/components/powerpoint/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  PlayCircle,
  Edit,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/powerpoint/ui/scroll-area';
import { v4 as uuidv4 } from 'uuid';
import { CustomTheme, TableData, Theme } from '@/lib/types';

const PowerPoint = () => {
  const {
    presentation,
    currentSlide,
    currentSlideIndex,
    isEditing,
    setCurrentSlideIndex,
    setIsEditing,
    addSlide,
    deleteSlide,
    updateSlideContent,
    moveSlide,
    updatePresentationTitle,
    setTheme,
    resetPresentation,
    addCustomTheme,
  } = usePresentation();
  
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [customThemes, setCustomThemes] = useState<Theme[]>([]);
  
  // Find current theme - either from default themes or custom themes
  const getTheme = (themeId: string): Theme => {
    const defaultTheme = themes.find((t) => t.id === themeId);
    if (defaultTheme) return defaultTheme;
    
    const custom = customThemes.find((t) => t.id === themeId);
    return custom || themes[0];
  };
  
  const currentTheme = getTheme(presentation.theme);
  
  const handleSelectTemplate = (templateId: string) => {
    addSlide(templateId);
  };
  
  const handleSelectTheme = (themeId: string) => {
    setTheme(themeId);
  };
  
  const handleExport = () => {
    exportToPptx(presentation, customThemes);
  };
  
  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };
  
  const handleNextSlide = () => {
    if (currentSlideIndex < presentation.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handleAddTable = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
    
    const newTable: TableData = {
      headers: ['Header 1', 'Header 2', 'Header 3'],
      rows: [
        ['Cell 1', 'Cell 2', 'Cell 3'],
        ['Cell 4', 'Cell 5', 'Cell 6']
      ]
    };
    
    updateSlideContent(currentSlideIndex, { table: newTable });
  };
  
  const handleAddTextBox = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
    
    const existingContent = currentSlide.content.content || '';
    const newContent = existingContent + '<p>New text box content</p>';
    
    updateSlideContent(currentSlideIndex, { content: newContent });
  };

  const handleAddCustomTheme = (themeId: string, backgroundImage: string) => {
    // Create new theme based on default theme but with background image
    const baseTheme = themes[0];
    const newTheme: Theme = {
      ...baseTheme,
      id: themeId,
      name: `Custom Theme ${customThemes.length + 1}`,
      backgroundImage
    };
    
    setCustomThemes([...customThemes, newTheme]);
    addCustomTheme(themeId, backgroundImage);
    
    // Auto-select the new theme
    setTheme(themeId);
  };
  
  React.useEffect(() => {
    // Whenever presentation.customThemes changes, update our local state
    if (presentation.customThemes) {
      const updatedCustomThemes = presentation.customThemes.map((customTheme) => {
        // Create a full Theme object from the CustomTheme data
        return {
          ...themes[0], // Use default theme as base
          id: customTheme.id,
          name: `Custom Theme ${customTheme.id.split('-')[1] || ''}`,
          backgroundImage: customTheme.backgroundImage
        };
      });
      
      setCustomThemes(updatedCustomThemes);
    }
  }, [presentation.customThemes]);
  
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPresentationMode) {
        if (e.key === 'ArrowRight' || e.key === ' ') {
          handleNextSlide();
        } else if (e.key === 'ArrowLeft') {
          handlePrevSlide();
        } else if (e.key === 'Escape') {
          setIsPresentationMode(false);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresentationMode, currentSlideIndex, presentation.slides.length]);

  const getSlideBackgroundStyle = () => {
    if (currentTheme.backgroundImage) {
      return {
        backgroundColor: currentTheme.background,
        backgroundImage: `url(${currentTheme.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    return { backgroundColor: currentTheme.background };
  };
  
  if (isPresentationMode) {
    return (
      <div 
        className="fixed inset-0 bg-black flex items-center justify-center"
        style={getSlideBackgroundStyle()}
      >
        <div className="absolute top-4 left-4 flex items-center gap-2 z-10 animate-fade-in">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPresentationMode(false)}
            className="text-gray-400 hover:text-gray-200"
          >
            <ArrowLeft size={20} />
          </Button>
          <span className="text-gray-400">
            Slide {currentSlideIndex + 1} of {presentation.slides.length}
          </span>
        </div>
        
        <div className="animate-fade-in">
          <SlidePreview 
            slide={currentSlide} 
            theme={currentTheme}
            scale={1.2}
          />
        </div>
        
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 animate-fade-in">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevSlide}
            disabled={currentSlideIndex === 0}
            className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md"
          >
            <ArrowLeft size={20} />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextSlide}
            disabled={currentSlideIndex === presentation.slides.length - 1}
            className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md"
          >
            <ArrowRight size={20} />
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar 
        presentation={presentation}
        onTitleChange={updatePresentationTitle}
        onNewPresentation={resetPresentation}
        onExport={handleExport}
        onAddTable={handleAddTable}
        onAddTextBox={handleAddTextBox}
      />
      
      <div className="flex flex-1 mt-16">
        <div className="w-60 h-full">
          <SlideList
            slides={presentation.slides}
            currentIndex={currentSlideIndex}
            theme={currentTheme}
            onSelectSlide={setCurrentSlideIndex}
            onAddSlide={() => setIsTemplateDialogOpen(true)}
            onDeleteSlide={deleteSlide}
            onMoveSlide={moveSlide}
          />
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="h-12 border-b border-gray-200 flex items-center px-4 justify-between glass">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className={cn(
                  "flex items-center gap-1",
                  isEditing ? "text-primary" : ""
                )}
              >
                <Edit size={16} />
                <span>{isEditing ? "Editing" : "Edit"}</span>
              </Button>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevSlide}
                disabled={currentSlideIndex === 0}
                className="h-8 w-8"
              >
                <ChevronLeft size={16} />
              </Button>
              
              <span className="text-sm">
                {currentSlideIndex + 1} / {presentation.slides.length}
              </span>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextSlide}
                disabled={currentSlideIndex === presentation.slides.length - 1}
                className="h-8 w-8"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
            
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPresentationMode(true)}
                className="flex items-center gap-1"
              >
                <PlayCircle size={16} />
                <span>Present</span>
              </Button>
            </div>
          </div>
          
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 flex items-center justify-center bg-gray-100 overflow-auto p-6">
              <div className="slide-shadow">
                <SlidePreview 
                  slide={currentSlide} 
                  theme={currentTheme}
                  scale={0.9}
                  isEditable={isEditing}
                  onContentChange={(content) => updateSlideContent(currentSlideIndex, content)}
                />
              </div>
            </div>
            
            <div className="w-60 h-full">
              <ScrollArea className="h-full">
                <ToolPanel
                  onSelectTemplate={handleSelectTemplate}
                  onSelectTheme={handleSelectTheme}
                  currentTheme={presentation.theme}
                  onAddCustomTheme={handleAddCustomTheme}
                  customThemes={customThemes}
                />
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
      
      <TemplateSelector
        isOpen={isTemplateDialogOpen}
        onClose={() => setIsTemplateDialogOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
};

export default PowerPoint;
