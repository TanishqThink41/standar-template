import React, { useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";

const FileNode: React.FC<NodeProps> = ({ id, data }) => {
  const [file, setFile] = useState<File | null>(data.file || null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const uploadedFile = event.target.files[0];
      setFile(uploadedFile);
      data.updateNodeData(id, { file: uploadedFile });
    }
  };

  return (
    <div className="p-3 bg-white border rounded shadow">
      <input type="file" onChange={handleFileUpload} />
      {file && <p className="text-sm mt-1">{file.name}</p>}
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default FileNode;
