import React, { useState, useCallback } from "react";
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

const nodeTypes = {
    fileNode: FileNode,
    processingNode: ProcessingNode,
  };
  

const DashboardCanvas: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

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
  

  return (
    <div className="flex h-screen">
      <Sidebar onDragStart={onDragStart} />
      <div className="w-3/4 h-screen" onDrop={onDrop} onDragOver={(e) => e.preventDefault()}>
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
  );
};

export default DashboardCanvas;
