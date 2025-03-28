import React from "react";

interface SidebarProps {
  onDragStart: (event: React.DragEvent<HTMLDivElement>, nodeType: string) => void;
}

const Sidebar: React.FC<{ onDragStart: (event: React.DragEvent, nodeType: string) => void }> = ({ onDragStart }) => {
    return (
      <div className="w-1/4 p-4 bg-gray-100 border-r">
        <p className="font-bold mb-2">Drag to Add:</p>
        <div className="p-2 bg-white border rounded shadow cursor-grab" draggable onDragStart={(event) => onDragStart(event, "file")}>
          📂 File Node
        </div>
        <div className="p-2 mt-2 bg-white border rounded shadow cursor-grab" draggable onDragStart={(event) => onDragStart(event, "processing")}>
          🔄 Processing Node
        </div>
      </div>
    );
  };
  
  export default Sidebar;
  
