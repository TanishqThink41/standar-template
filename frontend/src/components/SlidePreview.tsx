
import React, { useState, useRef, useEffect } from 'react';
import { Slide, Theme, TableData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Trash2, Bold, Italic, Underline, List, ListOrdered, 
  Image as ImageIcon, Table as TableIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { handleImageUpload } from '@/lib/export';

interface SlidePreviewProps {
  slide: Slide;
  theme: Theme;
  scale?: number;
  isEditable?: boolean;
  onContentChange?: (content: any) => void;
}

const SlidePreview: React.FC<SlidePreviewProps> = ({ 
  slide, 
  theme, 
  scale = 1,
  isEditable = false,
  onContentChange
}) => {
  const [activeElement, setActiveElement] = useState<string | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showFormatControls, setShowFormatControls] = useState(false);
  const [formatPosition, setFormatPosition] = useState({ top: 0, left: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Apply theme styles
  const titleStyle = {
    color: slide.content.textColor || theme.text,
  };
  
  const subtitleStyle = {
    color: slide.content.textColor || theme.text,
    opacity: 0.8,
  };
  
  const contentStyle = {
    color: slide.content.textColor || theme.text,
    opacity: 0.9,
  };
  
  const slideStyle = {
    backgroundColor: theme.background,
    transform: `scale(${scale})`,
    transformOrigin: 'center top',
    backgroundImage: slide.content.backgroundImage ? `url(${slide.content.backgroundImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  useEffect(() => {
    // Handle clicks outside the active element
    const handleClickOutside = (e: MouseEvent) => {
      if (activeElement && 
          e.target && 
          !titleRef.current?.contains(e.target as Node) && 
          !subtitleRef.current?.contains(e.target as Node) && 
          !contentRef.current?.contains(e.target as Node) &&
          !(e.target as HTMLElement).closest('.format-toolbar')) {
        handleBlur();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeElement]);
  
  const handleElementClick = (element: string, e: React.MouseEvent) => {
    if (!isEditable) return;
    
    setActiveElement(element);
    
    // Show format controls near the click position
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setFormatPosition({ 
      top: e.clientY - rect.top + 10, 
      left: e.clientX - rect.left
    });
    setShowFormatControls(true);
  };

  const handleImageClick = () => {
    if (!isEditable) return;
    fileInputRef.current?.click();
  };
  
  const handleBlur = () => {
    if (!isEditable) return;
    
    // Save the content when clicking away
    if (activeElement === 'title' && titleRef.current) {
      onContentChange?.({ title: titleRef.current.textContent || '' });
    } else if (activeElement === 'subtitle' && subtitleRef.current) {
      onContentChange?.({ subtitle: subtitleRef.current.textContent || '' });
    } else if (activeElement === 'content' && contentRef.current) {
      onContentChange?.({ content: contentRef.current.innerHTML || '' });
    }
    
    setTimeout(() => {
      setShowFormatControls(false);
      setActiveElement(null);
    }, 100);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      (e.target as HTMLElement).blur();
    }
  };
  
  const handleFormatClick = (format: string) => {
    if (!isEditable || !activeElement) return;
    
    document.execCommand(format, false);
    
    // Update content after formatting
    if (activeElement === 'content' && contentRef.current) {
      onContentChange?.({ content: contentRef.current.innerHTML || '' });
    } else if (activeElement === 'title' && titleRef.current) {
      onContentChange?.({ title: titleRef.current.innerHTML || '' });
    } else if (activeElement === 'subtitle' && subtitleRef.current) {
      onContentChange?.({ subtitle: subtitleRef.current.innerHTML || '' });
    }
  };
  
  const handleDelete = () => {
    if (!isEditable || !activeElement) return;
    
    if (activeElement === 'title') {
      onContentChange?.({ title: '', hasTitle: false });
    } else if (activeElement === 'subtitle') {
      onContentChange?.({ subtitle: '', hasSubtitle: false });
    } else if (activeElement === 'content') {
      onContentChange?.({ content: '' });
    } else if (activeElement === 'image') {
      onContentChange?.({ image: '' });
    } else if (activeElement === 'table') {
      onContentChange?.({ table: undefined });
    }
    
    setShowFormatControls(false);
    setActiveElement(null);
  };
  
  const handleTextColorChange = (color: string) => {
    if (!isEditable || !activeElement) return;
    
    document.execCommand('foreColor', false, color);
    
    // Update content after coloring
    if (activeElement === 'content' && contentRef.current) {
      onContentChange?.({ content: contentRef.current.innerHTML || '' });
    } else if (activeElement === 'title' && titleRef.current) {
      const newHtml = titleRef.current.innerHTML;
      onContentChange?.({ title: newHtml });
    } else if (activeElement === 'subtitle' && subtitleRef.current) {
      const newHtml = subtitleRef.current.innerHTML;
      onContentChange?.({ subtitle: newHtml });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditable) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        onContentChange?.({ image: base64 });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Render table if present
  const renderTable = () => {
    if (!slide.content.table) return null;
    
    return (
      <div 
        className="mt-4 overflow-hidden rounded-md border border-gray-200 relative"
        onClick={(e) => handleElementClick('table', e)}
      >
        {activeElement === 'table' && isEditable && (
          <Button 
            variant="destructive" 
            size="icon" 
            className="absolute -top-3 -right-3 h-6 w-6 rounded-full" 
            onClick={handleDelete}
          >
            <Trash2 size={12} />
          </Button>
        )}
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: theme.secondary, color: slide.content.textColor || theme.text }}>
              {slide.content.table.headers.map((header, index) => (
                <th key={index} className="p-2 text-left border-b border-gray-200">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slide.content.table.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : `bg-gray-50`}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="p-2 border-b border-gray-200" style={{ color: slide.content.textColor || theme.text }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  // Formatting toolbar that appears when an element is selected
  const renderFormatToolbar = () => {
    if (!showFormatControls || !isEditable) return null;
    
    return (
      <div 
        className="absolute bg-white p-1 shadow-md rounded-md flex gap-1 border z-50 format-toolbar"
        style={{ top: formatPosition.top, left: formatPosition.left }}
      >
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleFormatClick('bold')}>
          <Bold size={14} />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleFormatClick('italic')}>
          <Italic size={14} />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleFormatClick('underline')}>
          <Underline size={14} />
        </Button>
        
        {activeElement === 'content' && (
          <>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleFormatClick('insertUnorderedList')}>
              <List size={14} />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleFormatClick('insertOrderedList')}>
              <ListOrdered size={14} />
            </Button>
          </>
        )}
        
        <div className="mx-1 w-px h-full bg-gray-200"></div>
        
        <div className="flex gap-1">
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 bg-blue-500" 
            onClick={() => handleTextColorChange('#1e40af')}
          ></Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 bg-red-500" 
            onClick={() => handleTextColorChange('#ef4444')}
          ></Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 bg-green-500" 
            onClick={() => handleTextColorChange('#10b981')}
          ></Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 bg-purple-500" 
            onClick={() => handleTextColorChange('#8b5cf6')}
          ></Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 bg-yellow-500" 
            onClick={() => handleTextColorChange('#f59e0b')}
          ></Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 bg-black" 
            onClick={() => handleTextColorChange('#000000')}
          ></Button>
        </div>
        
        <div className="mx-1 w-px h-full bg-gray-200"></div>
        
        <Button size="icon" variant="destructive" className="h-8 w-8" onClick={handleDelete}>
          <Trash2 size={14} />
        </Button>
      </div>
    );
  };
  
  return (
    <div 
      className={cn(
        "w-[960px] h-[540px] overflow-hidden relative slide-shadow transition-all duration-300",
        isEditable ? "cursor-text" : ""
      )}
      style={slideStyle}
    >
      {/* Format toolbar */}
      {renderFormatToolbar()}
      
      {/* Slide content */}
      <div className="absolute inset-0 flex">
        {/* Left side - content */}
        <div className="w-1/2 p-12 overflow-y-auto flex flex-col">
          {slide.content.hasTitle && (slide.content.title || isEditable) ? (
            <div className="relative group">
              <h1 
                ref={titleRef}
                className={cn(
                  "text-3xl font-semibold mb-4",
                  activeElement === 'title' && isEditable ? "outline outline-2 outline-primary p-1 rounded" : ""
                )}
                style={titleStyle}
                contentEditable={isEditable}
                suppressContentEditableWarning={isEditable}
                onClick={(e) => handleElementClick('title', e)}
                onKeyDown={handleKeyDown}
                dangerouslySetInnerHTML={{ __html: slide.content.title || '' }}
              />
              
              {isEditable && activeElement !== 'title' && (
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute -right-3 top-0 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" 
                  onClick={() => {
                    onContentChange?.({ title: '', hasTitle: false });
                  }}
                >
                  <Trash2 size={12} />
                </Button>
              )}
            </div>
          ) : null}
          
          {slide.content.hasSubtitle && (slide.content.subtitle || isEditable) ? (
            <div className="relative group">
              <h2 
                ref={subtitleRef}
                className={cn(
                  "text-xl mb-6",
                  activeElement === 'subtitle' && isEditable ? "outline outline-2 outline-primary p-1 rounded" : ""
                )}
                style={subtitleStyle}
                contentEditable={isEditable}
                suppressContentEditableWarning={isEditable}
                onClick={(e) => handleElementClick('subtitle', e)}
                onKeyDown={handleKeyDown}
                dangerouslySetInnerHTML={{ __html: slide.content.subtitle || '' }}
              />
              
              {isEditable && activeElement !== 'subtitle' && (
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute -right-3 top-0 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" 
                  onClick={() => {
                    onContentChange?.({ subtitle: '', hasSubtitle: false });
                  }}
                >
                  <Trash2 size={12} />
                </Button>
              )}
            </div>
          ) : null}
          
          {slide.content.content || isEditable ? (
            <div className="relative group">
              <div
                ref={contentRef}
                className={cn(
                  "text-base rich-text-editor",
                  activeElement === 'content' && isEditable ? "outline outline-2 outline-primary p-1 rounded" : ""
                )}
                style={contentStyle}
                contentEditable={isEditable}
                suppressContentEditableWarning={isEditable}
                onClick={(e) => handleElementClick('content', e)}
                onKeyDown={handleKeyDown}
                dangerouslySetInnerHTML={{ __html: slide.content.content || '' }}
              />
              
              {isEditable && activeElement !== 'content' && (
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute -right-3 top-0 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" 
                  onClick={() => {
                    onContentChange?.({ content: '' });
                  }}
                >
                  <Trash2 size={12} />
                </Button>
              )}
            </div>
          ) : null}
          
          {renderTable()}
        </div>
        
        {/* Right side - image */}
        <div className="w-1/2 flex items-center justify-center p-6 relative">
          {slide.content.image ? (
            <div className="relative group">
              <img 
                src={slide.content.image} 
                alt="Slide visualization" 
                className="max-w-full max-h-full object-contain"
                onClick={(e) => isEditable && handleElementClick('image', e)}
              />
              
              {isEditable && (
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute -top-3 -right-3 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" 
                  onClick={() => {
                    onContentChange?.({ image: '' });
                  }}
                >
                  <Trash2 size={12} />
                </Button>
              )}
            </div>
          ) : (
            <div 
              className="flex items-center justify-center w-full h-full rounded-lg border-2 border-dashed border-gray-300 cursor-pointer"
              onClick={isEditable ? handleImageClick : undefined}
            >
              <p className="text-gray-400 text-center flex items-center gap-2">
                {isEditable ? (
                  <>
                    <ImageIcon size={18} />
                    <span>Click to add image</span>
                  </>
                ) : "No image"}
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlidePreview;
