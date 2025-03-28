import React, { useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import axios from "axios";
import { Play } from "lucide-react"; // For Play Button Icon

const ProcessingNode: React.FC<NodeProps> = ({ id, data }) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [processedFile, setProcessedFile] = useState<Blob | null>(null);

  const handleProcess = async () => {
    if (!data.file) {
      alert("No file connected! Please link a file node.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("prompt", prompt);

    try {
      const response = await axios.post("http://localhost:8000/excel/process-excel/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob", // Expecting a file response
      });

      setProcessedFile(response.data);
      data.updateNodeData(id, { processedFile: response.data });

      alert("Processing completed! You can now download the file.");
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Failed to process file. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = () => {
    if (processedFile) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(processedFile);
      link.download = "processed_file.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="p-3 bg-white border rounded shadow relative">
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter processing instruction..."
        className="border p-2 w-full rounded text-sm"
      />

      <button
        onClick={handleProcess}
        disabled={loading}
        className="absolute top-1 right-1 p-1 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600"
      >
        {loading ? "⏳" : <Play size={16} />}
      </button>

      {processedFile && (
        <button
          onClick={downloadFile}
          className="mt-2 p-1 bg-blue-500 text-white rounded w-full"
        >
          Download Processed File
        </button>
      )}
    </div>
  );
};

export default ProcessingNode;
