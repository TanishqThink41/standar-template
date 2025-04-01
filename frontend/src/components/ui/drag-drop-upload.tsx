import { useState, useCallback, useEffect } from 'react';
import { Upload, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDropzone } from 'react-dropzone';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface DragDropUploadProps {
  onFileUploaded?: (fileName: string) => void;
  onViewFile?: () => void;
  onAddWorkflow?: () => void;
  selectedFileName?: string;
}

type UploadState = 'idle' | 'uploading' | 'complete' | 'error';

export function DragDropUpload({ onFileUploaded, onViewFile, onAddWorkflow, selectedFileName }: DragDropUploadProps) {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();
  
  useEffect(() => {
    if (selectedFileName) {
      setFileName(selectedFileName);
      setUploadState('complete');
    }
  }, [selectedFileName]);

  const simulateUpload = useCallback((file: File) => {
    setFileName(file.name);
    setUploadState('uploading');
    setUploadProgress(0);

    const intervalId = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(intervalId);
          setUploadState('complete');
          if (onFileUploaded) onFileUploaded(file.name);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(intervalId);
  }, [onFileUploaded]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      toast({
        title: "Upload failed",
        description: "Please select a valid file",
        variant: "destructive"
      });
      return;
    }

    const file = acceptedFiles[0];
    simulateUpload(file);
  }, [simulateUpload, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls', '.xlsx', '.xlsm']
    },
    maxFiles: 1
  });

  const handleBrowseClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from triggering the parent's onClick
    document.getElementById('fileInput')?.click();
  };

  if (uploadState === 'idle') {
    return (
      <div className="z-10 rounded-lg border border-white/20 bg-white/5 p-6 text-center w-64 flex flex-col items-center justify-center">
        <div 
          {...getRootProps()} 
          className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
        >
          <input {...getInputProps()} id="fileInput" />
          <div className="bg-blue-500/40 rounded-full p-3 mb-3">
            <ArrowUp className="text-white w-6 h-6" />
          </div>
          <p className="text-white mb-1 text-sm">Drag and Drop your file</p>
          <p className="text-white text-xs mb-4">or</p>
          <Button 
            onClick={handleBrowseClick}
            size="sm"
            variant="outline"
            className="bg-white text-gray-700 hover:bg-gray-100 px-6 py-1 rounded-full text-sm"
          >
            Browse
          </Button>
        </div>
      </div>
    );
  }
  
  if (uploadState === 'uploading') {
    return (
      <div className="z-10 rounded-lg border border-white/20 bg-white/5 p-6 w-64">
        <div className="text-center mb-3">
          <p className="text-white text-lg font-medium mb-1">{fileName}</p>
          <p className="text-white text-sm">Converting into standard format...</p>
        </div>
        <div className="bg-white/10 rounded-full h-2 mb-1">
          <div 
            className="bg-green-400 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
        <p className="text-right text-white text-xs">{uploadProgress}%</p>
      </div>
    );
  }
  
  return (
    <div className="z-10 rounded-lg border border-white/20 bg-white/5 p-6 w-64">
      <div className="text-center mb-4">
        <p className="text-white text-lg font-medium mb-1">{fileName}</p>
        <p className="text-white text-sm">Standard format conversion done</p>
      </div>
      <div className="flex flex-col gap-2">
        <Button 
          variant="outline" 
          onClick={onViewFile}
          className="bg-white/20 text-white hover:bg-white/30 border-0"
          size="sm"
        >
          View file
        </Button>
        <Button 
          onClick={onAddWorkflow}
          className="bg-white text-blue-600 hover:bg-gray-100 border-0"
          size="sm"
        >
          Add workflow
        </Button>
      </div>
    </div>
  );
}
