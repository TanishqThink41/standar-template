import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import Frame1000004231 from "@/assets/Frame1000004231.jpg";

import { DragDropUpload } from "@/components/ui/drag-drop-upload";
import { FileCard } from "@/components/ui/file-card";
import { WorkflowCard } from "@/components/ui/workflow-card";
import { FileUploadDialog } from "@/components/file-upload-dialog";
import { FileViewer } from "@/components/file-viewer";
// import { WorkflowEditor } from "@/components/workflow-editor";
import { FileIcon, Cloud, Upload, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardCanvas from "./DashboardCanvas";

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

// Mock data for workflows to match image2
const mockWorkflows = [
  { id: 1, name: "Workflow 01", createdAt: new Date("2025-03-26T00:00:00.000Z"), userId: 1 },
  { id: 2, name: "Workflow 02", createdAt: new Date("2025-01-13T00:00:00.000Z"), userId: 1 },
  { id: 3, name: "Workflow 03", createdAt: new Date("2025-01-10T00:00:00.000Z"), userId: 1 },
  { id: 4, name: "Workflow 05", createdAt: new Date("2024-11-15T00:00:00.000Z"), userId: 1 },
  { id: 5, name: "Workflow 015", createdAt: new Date("2025-03-26T00:00:00.000Z"), userId: 1 },
  { id: 6, name: "Workflow 056", createdAt: new Date("2025-03-26T00:00:00.000Z"), userId: 1 },
  { id: 7, name: "Workflow 01564", createdAt: new Date("2025-03-26T00:00:00.000Z"), userId: 1 },
];

export default function Dashboard() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [fileViewerOpen, setFileViewerOpen] = useState(false);
  const [workflowEditorOpen, setWorkflowEditorOpen] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [activeTab, setActiveTab] = useState<string>("data");
  const navigate = useNavigate()
  
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
    navigate("/workflow", {
        state: { key: "value", user: "John Doe" }, // Example state
    });
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
        {/* Main Dashboard Card with gradient background and imported stars image */}
        <div 
          className="bg-gradient-to-r from-[#1E54E9] to-[#9C37FD] text-white rounded-lg mb-6 relative overflow-hidden p-6 min-h-[220px]"
          style={{
            backgroundImage: `url(${Frame1000004231})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center relative z-10">
            <div className="z-10 mb-6 md:mb-0">
              <h1 className="text-5xl font-bold leading-tight">
                Automate<br/>
                your<br/>
                workflow
              </h1>
            </div>
            
            {/* Upload Section - Styled to match image */}
            {uploadedFileName ? (
              <DragDropUpload 
                onFileUploaded={handleFileUploaded}
                onViewFile={handleViewFile}
                onAddWorkflow={handleAddWorkflow}
                selectedFileName={uploadedFileName}
              />
            ) : (
              <div className="bg-white/10 border border-white/20 rounded-lg p-6 text-center w-72 flex flex-col items-center justify-center">
                {/* Cloud icon with upload arrow - matching the attached image */}
                <div className="mb-3 relative">
                  <div className="bg-white rounded-full p-4 w-16 h-16 flex items-center justify-center">
                    <div className="text-blue-600">
                      <Cloud className="h-8 w-8" />
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="mt-1">
                          <Upload className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-white mb-1 text-sm">Drag and Drop your file</p>
                <p className="text-white text-xs mb-4">or</p>
                <button
                  className="bg-white text-gray-700 hover:bg-gray-100 px-8 py-2 rounded-full font-medium"
                  onClick={() => setUploadDialogOpen(true)}
                >
                  Browse
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* History Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">History</h2>
          
          {/* Tabs - Styled to match image2 */}
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
                      <tr key={workflow.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                        <td className="py-3 px-4 text-gray-700">{index + 1}.</td>
                        <td className="py-3 px-4 text-gray-700 flex items-center">
                          <div className="flex-shrink-0 w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center mr-2">
                            <FileIcon className="h-3.5 w-3.5 text-white" />
                          </div>
                          {workflow.name}
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-sm">
                          {new Date(workflow.createdAt).toLocaleDateString('en-GB')}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => {
                              setWorkflowEditorOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
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
    </div>
  );
}