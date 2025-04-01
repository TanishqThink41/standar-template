import { ArrowLeft, UserCircle, PlusCircle, Database, Bot, BarChartHorizontal, SquareCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface WorkflowEditorProps {
  open: boolean;
  onClose: () => void;
  workflowName?: string;
  fileName?: string;
}

export function WorkflowEditor({ 
  open, 
  onClose, 
  workflowName = "Workflow 01",
  fileName = "Payroll Payments Client.xlsm" 
}: WorkflowEditorProps) {
  const [agentComponents, setAgentComponents] = useState([
    { id: 1, name: "Agent_01" },
    { id: 2, name: "Agent_02" }
  ]);
  
  const [showSaveToast, setShowSaveToast] = useState(false);

  useEffect(() => {
    if (showSaveToast) {
      const timer = setTimeout(() => {
        setShowSaveToast(false);
        onClose();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [showSaveToast, onClose]);

  const addAgent = () => {
    const newId = agentComponents.length + 1;
    setAgentComponents([...agentComponents, { id: newId, name: `Agent_${newId < 10 ? '0' + newId : newId}` }]);
  };

  const handleSave = () => {
    setShowSaveToast(true);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="bg-white w-full h-full flex flex-col overflow-hidden">
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/10 mr-4"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold">{workflowName}</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/20 text-white hover:bg-white/30"
            >
              <UserCircle className="h-5 w-5" />
            </Button>
          </div>
        </header>
        
        <div className="flex-grow flex">
          {/* Left Sidebar */}
          <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-medium mb-4 text-gray-800">Input Field</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-md flex items-center justify-center">
                    <Database className="h-4 w-4 text-white" />
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-700 hover:bg-gray-100 p-1 h-auto"
                  >
                    Add data
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-700 hover:bg-gray-100 p-1 h-auto"
                  >
                    Add agent
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-500 rounded-md flex items-center justify-center">
                    <BarChartHorizontal className="h-4 w-4 text-white" />
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-700 hover:bg-gray-100 p-1 h-auto"
                  >
                    Add reporting agent
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-md flex items-center justify-center">
                    <SquareCode className="h-4 w-4 text-white" />
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-700 hover:bg-gray-100 p-1 h-auto"
                  >
                    Add function
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-auto p-4">
              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
          
          {/* Main Workflow Area */}
          <div 
            className="flex-grow p-6 relative overflow-auto"
            style={{
              backgroundSize: "20px 20px",
              backgroundImage: `
                linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
              `
            }}
          >
            {/* Agent Component */}
            <div className="mb-6 flex items-start gap-2">
              {agentComponents.map((agent) => (
                <div
                  key={agent.id}
                  className="bg-white border border-gray-200 rounded-md shadow-sm p-3 w-48"
                >
                  <div className="text-sm font-medium mb-2 pb-2 border-b border-gray-100 flex items-center">
                    <div className="w-4 h-4 bg-blue-600 rounded-sm mr-2"></div>
                    {agent.name}
                  </div>
                  <div className="h-12 flex items-center justify-center text-xs text-gray-500">
                    No input parameters
                  </div>
                </div>
              ))}
              
              <Button
                size="icon"
                className="bg-blue-600 text-white hover:bg-blue-700 rounded-full h-8 w-8"
                onClick={addAgent}
              >
                <PlusCircle className="h-5 w-5" />
              </Button>
            </div>
            
            {/* File Connection */}
            <div className="flex items-center mb-6">
              <div className="w-1 bg-blue-600 h-16 ml-6"></div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-md shadow-sm p-3 w-48 ml-5">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 bg-green-600 rounded-sm mr-2"></div>
                <div className="text-sm font-medium">Input Data</div>
              </div>
              <div className="text-xs text-gray-500">
                {fileName}
              </div>
            </div>
          </div>
        </div>
        
        {showSaveToast && (
          <div className="absolute bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg">
            Workflow saved successfully!
          </div>
        )}
      </div>
    </div>
  );
}