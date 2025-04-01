import { GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Workflow } from '@shared/schema';
import { formatDate } from '@/lib/utils';

interface WorkflowCardProps {
  workflow: Workflow;
  index: number;
  onAction?: (workflow: Workflow) => void;
}

export function WorkflowCard({ workflow, index, onAction }: WorkflowCardProps) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4 text-gray-700">{index + 1}.</td>
      <td className="py-3 px-4 text-gray-700 flex items-center">
        <div className="flex-shrink-0 w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center mr-2">
          <GitBranch className="h-3.5 w-3.5 text-white" />
        </div>
        <span>{workflow.name}</span>
      </td>
      <td className="py-3 px-4 text-gray-500 text-sm">
        {formatDate(workflow.createdAt)}
      </td>
      <td className="py-3 px-4">
        <Button 
          variant="ghost" 
          className="text-gray-400 hover:text-red-500 hover:bg-gray-50 p-1"
          onClick={() => onAction && onAction(workflow)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </Button>
      </td>
    </tr>
  );
}
