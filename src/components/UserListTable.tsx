
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type User = {
  id: string;
  name: string;
  email: string;
  credits: number;
  status: string;
  joinDate: string;
};

interface Props {
  users: User[];
  selectedId: string | null;
  setSelectedId: (id: string) => void;
  minCredits: number;
}

const UserListTable: React.FC<Props> = ({ users, selectedId, setSelectedId, minCredits }) => {
  return (
    <Table className="w-full border rounded-xl overflow-hidden shadow mb-2">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Credits</TableHead>
          <TableHead>Joined</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow
            key={user.id}
            className={`${selectedId === user.id ? "bg-emerald-200/40 font-semibold" : ""} cursor-pointer`}
            onClick={() => setSelectedId(user.id)}
          >
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <span className={user.status === "active" ? "text-emerald-700 font-bold" : "text-red-600 font-bold"}>
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </span>
            </TableCell>
            <TableCell>
              <span className={user.credits >= minCredits ? "text-emerald-800" : "text-red-600 font-bold"}>
                {user.credits}
              </span>
            </TableCell>
            <TableCell>{user.joinDate}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserListTable;
