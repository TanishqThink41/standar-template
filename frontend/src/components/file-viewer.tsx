import { ArrowLeft, X, Share } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileViewerProps {
  open: boolean;
  onClose: () => void;
  fileName?: string;
}

const MOCK_DATA = [
  {
    id: 1,
    date: "5/12/2022",
    description: "Coffee Shop",
    category: "Food & Dining",
    amount: "$45.28",
    account: "MILO Credit Card",
    accountNumber: "xxxx 4567",
    institution: "MILO",
    notes: "5/3/21",
    transactionDate: "5/5/22",
    transactionId: "a865495a2394aa",
  },
  {
    id: 2,
    date: "5/13/2022",
    description: "Hardware Tim",
    category: "Home & Bath",
    amount: "$125.45",
    account: "MILO Credit Card",
    accountNumber: "xxxx 4567",
    institution: "MILO",
    notes: "5/13/21",
    transactionDate: "5/15/22",
    transactionId: "hgy465d7sade",
  },
  {
    id: 3,
    date: "5/14/2022",
    description: "Apple Store",
    category: "Electronics",
    amount: "$1299.99",
    account: "MILO Credit Card",
    accountNumber: "xxxx 4567",
    institution: "MILO",
    notes: "5/14/21",
    transactionDate: "5/16/22",
    transactionId: "3245dsfgy456",
  },
  {
    id: 4,
    date: "5/15/2022",
    description: "Target Wireless",
    category: "Phone",
    amount: "$45.99",
    account: "MILO Checking",
    accountNumber: "xxxx 2345",
    institution: "MILO",
    notes: "5/15/21",
    transactionDate: "5/17/22",
    transactionId: "d6r7tdfy5654",
  },
];

export function FileViewer({ open, onClose, fileName = "Foundation Template 2021" }: FileViewerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-lg font-medium">{fileName}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-green-600 text-white border-0 hover:bg-green-700"
            >
              <Share className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20 h-8 w-8 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 max-h-[80vh] overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="border border-gray-300 p-2 text-center">#</th>
                <th className="border border-gray-300 p-2">Date</th>
                <th className="border border-gray-300 p-2">Description</th>
                <th className="border border-gray-300 p-2">Category</th>
                <th className="border border-gray-300 p-2">Amount</th>
                <th className="border border-gray-300 p-2">Account</th>
                <th className="border border-gray-300 p-2">Account #</th>
                <th className="border border-gray-300 p-2">Institution</th>
                <th className="border border-gray-300 p-2">Notes</th>
                <th className="border border-gray-300 p-2">Transaction ID</th>
                <th className="border border-gray-300 p-2">Check No.</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_DATA.map((row) => (
                <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 text-center">{row.id}</td>
                  <td className="border border-gray-300 p-2">{row.date}</td>
                  <td className="border border-gray-300 p-2">{row.description}</td>
                  <td className="border border-gray-300 p-2">{row.category}</td>
                  <td className="border border-gray-300 p-2">{row.amount}</td>
                  <td className="border border-gray-300 p-2">{row.account}</td>
                  <td className="border border-gray-300 p-2">{row.accountNumber}</td>
                  <td className="border border-gray-300 p-2">{row.institution}</td>
                  <td className="border border-gray-300 p-2">{row.notes}</td>
                  <td className="border border-gray-300 p-2">{row.transactionDate}</td>
                  <td className="border border-gray-300 p-2">{row.transactionId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
