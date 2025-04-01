
import React from 'react';
import { Slide, Theme } from '@/lib/types';
import { Button } from '@/components/powerpoint/ui/button';
import { cn } from '@/lib/utils';
import { Plus, Trash, ChevronUp, ChevronDown } from 'lucide-react';

interface SlideListProps {
  slides: Slide[];
  currentIndex: number;
  theme: Theme;
  onSelectSlide: (index: number) => void;
  onAddSlide: () => void;
  onDeleteSlide: (index: number) => void;
  onMoveSlide: (fromIndex: number, toIndex: number) => void;
}

const SlideList: React.FC<SlideListProps> = ({
  slides,
  currentIndex,
  theme,
  onSelectSlide,
  onAddSlide,
  onDeleteSlide,
  onMoveSlide,
}) => {
  // Generate a small preview of the slide content
  const getSlidePreview = (slide: Slide) => {
    const { content } = slide;
    let preview = '';
    
    if (content.hasTitle && content.title) {
      preview += content.title;
    }
    
    if (content.hasSubtitle && content.subtitle) {
      preview += preview ? ` - ${content.subtitle}` : content.subtitle;
    }
    
    if (!preview && content.content) {
      preview = content.content.substring(0, 30) + (content.content.length > 30 ? '...' : '');
    }
    
    return preview || 'Slide ' + (slides.indexOf(slide) + 1);
  };
  
  return (
    <div className="h-full bg-gray-50 border-r border-gray-200">
      <div className="p-4">
        <Button 
          onClick={onAddSlide}
          className="w-full flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          <span>New Slide</span>
        </Button>
      </div>
      
      <div className="px-2 overflow-y-auto h-[calc(100%-60px)]">
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className={cn(
              "p-2 mb-2 rounded-md cursor-pointer group transition-all duration-200 hover-lift",
              index === currentIndex 
                ? "bg-primary/10 border-l-4 border-primary" 
                : "bg-white border border-gray-100 hover:border-gray-200"
            )}
            onClick={() => onSelectSlide(index)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 text-sm font-medium truncate">
                <span className="text-gray-400 mr-1">{index + 1}.</span> 
                {getSlidePreview(slide)}
              </div>
              
              <div className={cn(
                "flex ml-2 space-x-1 transition-opacity",
                index === currentIndex ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveSlide(index, Math.max(0, index - 1));
                  }}
                  disabled={index === 0}
                >
                  <ChevronUp size={14} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveSlide(index, Math.min(slides.length - 1, index + 1));
                  }}
                  disabled={index === slides.length - 1}
                >
                  <ChevronDown size={14} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSlide(index);
                  }}
                >
                  <Trash size={14} />
                </Button>
              </div>
            </div>
            
            {/* Mini preview */}
            <div 
              className="mt-2 rounded overflow-hidden border border-gray-100 h-16 flex items-center justify-center bg-white"
              style={{
                backgroundImage: slide.content.image ? `url(${slide.content.image})` : 'none',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              {!slide.content.image && (
                <div className="text-[10px] text-gray-400 px-2 text-center">
                  {slide.content.hasTitle && slide.content.title ? slide.content.title : 'No preview'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlideList;
