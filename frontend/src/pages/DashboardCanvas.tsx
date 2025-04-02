import React, { useState, useCallback } from "react";
import { ArrowLeft, UserCircle, PlusCircle, Database, Bot, BarChartHorizontal, SquareCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactFlow, {
  Background,
  addEdge,
  useEdgesState,
  useNodesState,
  Connection,
  Edge,
  Node
} from "reactflow";
import "reactflow/dist/style.css";
import { nanoid } from "nanoid";
import Sidebar from "@/components/DashboardCanvas/Sidebar";
import FileNode from "@/components/DashboardCanvas/FileNode";
import ProcessingNode from "@/components/DashboardCanvas/ProcessingNode";
import { useNavigate } from "react-router-dom";



interface WorkflowEditorProps {
  open: boolean;
  onClose: () => void;
  // fileName?: string;
}

const nodeTypes = {
  fileNode: FileNode,
  processingNode: ProcessingNode,
};


const DashboardCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [workflowName, setWorkflowName] = useState("New Workflow");
  const navigate = useNavigate()

  const updateNodeData = (id: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => (node.id === id ? { ...node, data: { ...node.data, ...newData } } : node))
    );
  };

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds));

    const sourceNode = nodes.find((n) => n.id === params.source);
    if (sourceNode?.data?.file) {
      updateNodeData(params.target!, { file: sourceNode.data.file });
    }
  }, [nodes]);

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData("application/reactflow");
    const position = { x: event.clientX - 100, y: event.clientY - 50 };

    if (type === "file") {
      setNodes((nds) => [
        ...nds,
        { id: nanoid(), type: "fileNode", position, data: { updateNodeData } },
      ]);
    } else if (type === "processing") {
      setNodes((nds) => [
        ...nds,
        { id: nanoid(), type: "processingNode", position, data: { updateNodeData } },
      ]);
    }
  };


  if (!open) return null;
  return (
    <div className="flex h-screen flex-col">
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="text-white hover:bg-white/10 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">{workflowName}</h1>
          </div>
          <button 
            className="rounded-full bg-white p-1"
            onClick={() => navigate('/auth')}
          >
            <UserCircle className="h-6 w-6 text-blue-600" />
          </button>
        </div>
      </header>
      <div className="flex">
        <Sidebar onDragStart={onDragStart} />
        <div className="w-3/4 h-[calc(100vh-64px)]" onDrop={onDrop} onDragOver={(e) => e.preventDefault()}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
          >
            <Background />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default DashboardCanvas;
