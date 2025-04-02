import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
  RefreshCw,
  Search,
  Folder,
  Cloud,
  HardDrive,
  Music,
  Image,
  Video,
  Laptop,
  FileSpreadsheet,
  X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileSelected: (fileName: string) => void;
}

export function FileUploadDialog({ 
  open, 
  onOpenChange,
  onFileSelected 
}: FileUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState("Payroll Payments Client.xlsm");
  const { toast } = useToast();

  const handleOpen = () => {
    if (selectedFile) {
      onFileSelected(selectedFile);
      onOpenChange(false);
      toast({
        title: "File opened",
        description: `Successfully opened ${selectedFile}`,
      });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-[600px] overflow-hidden border border-gray-200">
        <div className="flex justify-between items-center p-3 border-b border-gray-200">
          <h2 className="text-base font-medium">Open</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="text-gray-500 hover:bg-gray-100 h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex space-x-2 px-4 pt-3 mb-2">
          <Button variant="ghost" size="icon" className="p-1 text-gray-600 hover:bg-gray-100">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="p-1 text-gray-600 hover:bg-gray-100">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="p-1 text-gray-600 hover:bg-gray-100">
            <ChevronUp className="h-4 w-4" />
          </Button>
          
          <div className="relative flex-grow">
            <div className="flex items-center bg-gray-50 border border-gray-300 rounded px-2 py-1">
              <Folder className="h-4 w-4 text-gray-600 mr-2" />
              <span className="text-sm text-gray-700 truncate">Documents</span>
            </div>
          </div>
          
          <Button variant="ghost" size="icon" className="p-1 text-gray-600 hover:bg-gray-100">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="p-1 text-gray-600 hover:bg-gray-100">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex px-4">
          <div className="w-1/3 pr-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Favorites</div>
            <ul className="space-y-1">
              <FavoriteItem icon={<Cloud className="h-4 w-4" />} label="OneDrive" />
              <FavoriteItem icon={<HardDrive className="h-4 w-4" />} label="This PC" />
              <FavoriteItem icon={<Folder className="h-4 w-4" />} label="Desktop" />
              <FavoriteItem icon={<Folder className="h-4 w-4" />} label="Documents" active />
              <FavoriteItem icon={<Folder className="h-4 w-4" />} label="Downloads" />
              <FavoriteItem icon={<Music className="h-4 w-4" />} label="Music" />
              <FavoriteItem icon={<Image className="h-4 w-4" />} label="Pictures" />
              <FavoriteItem icon={<Video className="h-4 w-4" />} label="Videos" />
              <FavoriteItem icon={<Laptop className="h-4 w-4" />} label="Windows (C:)" />
            </ul>
          </div>
          
          <div className="w-2/3">
            <div className="bg-white border border-gray-200 rounded">
              <div className="flex py-1.5 px-3 border-b border-gray-200 bg-gray-50">
                <div className="w-1/2 text-sm font-medium text-gray-700">Name</div>
                <div className="w-1/4 text-sm font-medium text-gray-700">Date modified</div>
                <div className="w-1/4 text-sm font-medium text-gray-700">Type</div>
              </div>
              <div className="max-h-56 overflow-y-auto">
                <div 
                  className="flex items-center py-2 px-3 bg-blue-50 border-b border-gray-100 cursor-pointer"
                  onClick={() => setSelectedFile("Payroll Payments Client.xlsm")}
                >
                  <div className="w-1/2 flex items-center">
                    <FileSpreadsheet className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm text-gray-700">Payroll Payments Client.xlsm</span>
                  </div>
                  <div className="w-1/4 text-sm text-gray-600">2025/03/26 9:37</div>
                  <div className="w-1/4 text-sm text-gray-600">Excel</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center p-4 border-t border-gray-200 mt-4">
          <div className="flex items-center">
            <span className="text-xs text-gray-700 mr-2">File name:</span>
            <Input 
              value={selectedFile}
              onChange={(e) => setSelectedFile(e.target.value)}
              className="h-8 w-64 text-sm"
            />
          </div>
          <div className="flex space-x-2 items-center">
            <span className="text-xs text-gray-700">All Files (**)</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8"
            >
              Cancel
            </Button>
            <Button 
              size="sm"
              onClick={handleOpen}
              className="h-8 bg-blue-600 hover:bg-blue-700"
            >
              Open
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FavoriteItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function FavoriteItem({ icon, label, active }: FavoriteItemProps) {
  return (
    <li className={`flex items-center py-1 px-2 text-sm text-gray-700 rounded cursor-pointer ${active ? 'bg-gray-100' : 'hover:bg-gray-100'}`}>
      <span className="text-gray-500 mr-2">{icon}</span>
      <span>{label}</span>
    </li>
  );
}