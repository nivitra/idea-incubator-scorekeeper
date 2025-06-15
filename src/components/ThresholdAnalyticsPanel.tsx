
import React from "react";
import { Table, TableHead, TableRow, TableHeader, TableCell, TableBody } from "@/components/ui/table";
import { Info } from "lucide-react";

interface UserAnalytics {
  id: string;
  name: string;
  credits: number;
  threshold: number;
  status: "active" | "soft-disabled" | "disabled";
}

interface ThresholdAnalyticsPanelProps {
  data: UserAnalytics[];
  globalThreshold: number;
  buffer: number;
  visible: boolean;
  onClose: () => void;
}

export const ThresholdAnalyticsPanel: React.FC<ThresholdAnalyticsPanelProps> = ({
  data,
  globalThreshold,
  buffer,
  visible,
  onClose,
}) => {
  if (!visible) return null;
  const above = data.filter((u) => u.credits >= u.threshold + buffer);
  const near = data.filter((u) => u.credits < u.threshold + buffer && u.credits >= u.threshold);
  const soft = data.filter((u) => u.status === "soft-disabled");
  const below = data.filter((u) => u.status === "disabled");

  return (
    <div className="fixed z-[51] inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white shadow-xl border rounded-xl max-w-xl w-full p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-4 text-lg font-bold text-gray-500 hover:text-gray-800">×</button>
        <h2 className="text-xl font-bold mb-3">Credit Threshold Analytics</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-emerald-100 p-3 rounded-lg">
            <div className="font-bold text-emerald-900">{above.length}</div>
            <div className="text-xs">Above Safe Buffer</div>
          </div>
          <div className="bg-yellow-100 p-3 rounded-lg">
            <div className="font-bold text-yellow-900">{near.length}</div>
            <div className="text-xs">Near Threshold (Buffer: {buffer})</div>
          </div>
          <div className="bg-orange-100 p-3 rounded-lg">
            <div className="font-bold text-orange-900">{soft.length}</div>
            <div className="text-xs">Soft-Disabled</div>
          </div>
          <div className="bg-red-100 p-3 rounded-lg">
            <div className="font-bold text-red-900">{below.length}</div>
            <div className="text-xs">Fully Disabled</div>
          </div>
        </div>
        <div className="mb-3 flex items-center gap-2 text-muted-foreground text-sm">
          <Info size={16} />
          <span>
            Buffer zone: users within buffer ({buffer}) above their minimum threshold are at risk.
          </span>
        </div>
        <Table className="text-xs">
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Min Threshold</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(u => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.credits}</TableCell>
                <TableCell>{u.threshold}</TableCell>
                <TableCell>
                  <span className={
                    u.status === "active" ? "text-emerald-700" :
                      u.status === "soft-disabled" ? "text-orange-600" :
                        "text-red-700"
                  }>{u.status.replace("-", " ")}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
