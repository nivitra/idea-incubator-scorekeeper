
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface HistoryItem {
  ts: string;
  amount: number;
  reason: string;
  by: string;
}

const CreditHistoryTable: React.FC<{ history: HistoryItem[] }> = ({ history }) => {
  return (
    <div>
      <div className="text-lg font-semibold mb-2">Credit History</div>
      <Table className="w-full border rounded-xl overflow-hidden text-xs">
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((item, i) => (
            <TableRow key={i}>
              <TableCell>{new Date(item.ts).toLocaleString()}</TableCell>
              <TableCell className={item.amount > 0 ? "text-emerald-700 font-bold" : item.amount < 0 ? "text-red-600 font-bold" : "text-muted-foreground"}>
                {item.amount > 0 ? "+" : ""}
                {item.amount}
              </TableCell>
              <TableCell>{item.reason}</TableCell>
              <TableCell>{item.by}</TableCell>
            </TableRow>
          ))}
          {history.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="italic text-muted-foreground text-center py-3">
                No credit history yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CreditHistoryTable;
