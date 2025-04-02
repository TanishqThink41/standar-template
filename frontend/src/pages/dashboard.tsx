import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Star1, Star2, Star3 } from "@/components/icons/stars";
import { DragDropUpload } from "@/components/ui/drag-drop-upload";
import { FileCard } from "@/components/ui/file-card";
import { WorkflowCard } from "@/components/ui/workflow-card";
import { FileUploadDialog } from "@/components/file-upload-dialog";
import { FileViewer } from "@/components/file-viewer";
import { WorkflowEditor } from "@/components/workflow-editor";
import { FileIcon } from "lucide-react";

// Mock data for the files
const mockFiles = [
  { id: 1, name: "client_payments.csv", type: "csv", status: "converted", createdAt: new Date("2025-03-26T00:00:00.000Z"), userId: 1 },
  { id: 2, name: "payroll_records.csv", type: "csv", status: "converted", createdAt: new Date("2025-01-13T00:00:00.000Z"), userId: 1 },
  { id: 3, name: "salary_disbursement.csv", type: "csv", status: "converted", createdAt: new Date("2025-01-10T00:00:00.000Z"), userId: 1 },
  { id: 4, name: "bank_transactions.csv", type: "csv", status: "converted", createdAt: new Date("2024-11-15T00:00:00.000Z"), userId: 1 },
  { id: 5, name: "loan_repayments.csv", type: "csv", status: "converted", createdAt: new Date("2025-03-26T00:00:00.000Z"), userId: 1 },
  { id: 6, name: "invoice_tracker.csv", type: "csv", status: "converted", createdAt: new Date("2025-03-26T00:00:00.000Z"), userId: 1 },
  { id: 7, name: "client_payments.csv", type: "csv", status: "converted", createdAt: new Date("2025-03-26T00:00:00.000Z"), userId: 1 },
];

// Mock data for workflows
const mockWorkflows = [
  { id: 1, name: "Payroll Processing", createdAt: new Date("2025-03-28T12:30:00.000Z"), userId: 1 },
  { id: 2, name: "Invoice Generator", createdAt: new Date("2025-03-25T09:15:00.000Z"), userId: 1 },
  { id: 3, name: "Tax Calculation", createdAt: new Date("2025-03-20T14:45:00.000Z"), userId: 1 },
  { id: 4, name: "Report Automation", createdAt: new Date("2025-03-15T11:20:00.000Z"), userId: 1 },
  { id: 5, name: "Client Onboarding", createdAt: new Date("2025-03-10T10:00:00.000Z"), userId: 1 },
];

export default function Dashboard() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [fileViewerOpen, setFileViewerOpen] = useState(false);
  const [workflowEditorOpen, setWorkflowEditorOpen] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [activeTab, setActiveTab] = useState<string>("data");
  
  // Use the mock data instead of the API data
  const files = mockFiles;
  const workflows = mockWorkflows;

  const handleFileUploaded = (fileName: string) => {
    setUploadedFileName(fileName);
  };

  const handleViewFile = () => {
    setFileViewerOpen(true);
  };

  const handleAddWorkflow = () => {
    setWorkflowEditorOpen(true);
  };

  const handleFileSelected = (fileName: string) => {
    setUploadedFileName(fileName);
    // Simulate a file upload process - in a real app this would be an actual upload
    setTimeout(() => {
      handleFileUploaded(fileName);
    }, 500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-grow container mx-auto p-4 md:px-6">
        {/* Main Dashboard Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg mb-6 relative overflow-hidden p-6">
            <div className="absolute inset-0 z-0">
              <div className="w-full h-full bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20" />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center relative z-10">
              <div className="z-10 mb-6 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  Automate<br/>
                  your<br/>
                  workflow
                </h1>
              </div>
              
              {/* Upload Section */}
              {uploadedFileName ? (
                <DragDropUpload 
                  onFileUploaded={handleFileUploaded}
                  onViewFile={handleViewFile}
                  onAddWorkflow={handleAddWorkflow}
                  selectedFileName={uploadedFileName}
                />
              ) : (
                <div className="bg-blue-500/20 border border-white/20 rounded-lg p-4 text-center w-64 flex flex-col items-center justify-center">
                  <div className="bg-white/20 rounded-full p-3 mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                  </div>
                  <p className="text-white mb-1 text-sm">Drag and Drop your file</p>
                  <p className="text-white text-xs mb-4">or</p>
                  <button
                    className="bg-white text-gray-700 hover:bg-gray-100 px-6 py-1 rounded-full text-sm"
                    onClick={() => setUploadDialogOpen(true)}
                  >
                    Browse
                  </button>
                </div>
              )}
            </div>
            
            {/* Stars decoration */}
            <div className="absolute top-4 left-5">
              <Star1 />
            </div>
            <div className="absolute top-20 left-36">
              <Star2 />
            </div>
            <div className="absolute top-20 left-80 md:top-36 md:left-96">
              <Star3 />
            </div>
        </div>
        
        {/* History Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">History</h2>
          
          {/* Tabs */}
          <div className="mb-6">
            <div className="flex space-x-1 mb-4">
              <button
                onClick={() => setActiveTab("data")}
                className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "data" 
                    ? "bg-blue-100 text-blue-800" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Data
              </button>
              <button
                onClick={() => setActiveTab("workflow")}
                className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "workflow" 
                    ? "bg-blue-100 text-blue-800" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Work flow
              </button>
            </div>
            
            {activeTab === "data" && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-gray-50">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-left font-medium text-gray-500 w-12">#</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500">File Name</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500">Date</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500 w-16">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file, index) => (
                      <tr key={file.id} className="border-b border-gray-200 hover:bg-gray-100">
                        <td className="py-3 px-4 text-gray-700">{index + 1}.</td>
                        <td className="py-3 px-4 text-gray-700 flex items-center">
                          <div className="flex-shrink-0 w-5 h-5 bg-green-600 rounded-sm flex items-center justify-center mr-2">
                            <FileIcon className="h-3.5 w-3.5 text-white" />
                          </div>
                          <span>{file.name}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-sm">
                          {new Date(file.createdAt).toLocaleDateString('en-GB')}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => {
                              setUploadedFileName(file.name);
                              setFileViewerOpen(true);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                              <polyline points="15 3 21 3 21 9"></polyline>
                              <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === "workflow" && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-left font-medium text-gray-500 w-12">#</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500">Workflow Name</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500">Date</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500 w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workflows.map((workflow, index) => (
                      <WorkflowCard 
                        key={workflow.id} 
                        workflow={workflow} 
                        index={index} 
                        onAction={() => {
                          setWorkflowEditorOpen(true);
                        }}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Dialogs and overlays */}
      <FileUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onFileSelected={handleFileSelected}
      />
      
      <FileViewer
        open={fileViewerOpen}
        onClose={() => setFileViewerOpen(false)}
        fileName={uploadedFileName}
      />
      
      <WorkflowEditor
        open={workflowEditorOpen}
        onClose={() => setWorkflowEditorOpen(false)}
        fileName={uploadedFileName}
      />
    </div>
  );
}
