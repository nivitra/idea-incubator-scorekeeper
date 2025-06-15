
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit } from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  credits: number;
  status: string;
  joinDate: string;
  minThreshold?: number;
};

interface Props {
  users: User[];
  selectedId: string | null;
  setSelectedId: (id: string) => void;
  minCredits: number;
  showThreshold?: boolean;
  setUserThreshold?: (id: string, v: number | undefined) => void;
}

const UserListTable: React.FC<Props> = ({
  users,
  selectedId,
  setSelectedId,
  minCredits,
  showThreshold,
  setUserThreshold,
}) => {
  return (
    <Table className="w-full border rounded-xl overflow-hidden shadow mb-2">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          {showThreshold && <TableHead>Min Threshold</TableHead>}
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
            {showThreshold && (
              <TableCell>
                {setUserThreshold ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={user.minThreshold ?? ""}
                      min={0}
                      max={100}
                      className="border rounded px-1 py-1 w-14 text-center text-xs"
                      onChange={e =>
                        setUserThreshold(
                          user.id,
                          e.target.value === "" ? undefined : Number(e.target.value)
                        )
                      }
                      placeholder={minCredits + ""}
                    />
                    <button
                      type="button"
                      className="text-xs text-muted-foreground hover:text-destructive"
                      title="Reset to global"
                      onClick={e => {
                        e.stopPropagation();
                        setUserThreshold(user.id, undefined);
                      }}
                    >
                      <Edit size={13} />
                    </button>
                  </div>
                ) : (
                  <span>{user.minThreshold !== undefined ? user.minThreshold : minCredits}</span>
                )}
              </TableCell>
            )}
            <TableCell>
              <span className={
                user.status === "active"
                  ? "text-emerald-700 font-bold"
                  : user.status === "soft-disabled"
                    ? "text-orange-700 font-bold"
                    : "text-red-600 font-bold"
              }>
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </span>
            </TableCell>
            <TableCell>
              <span className={
                user.credits >= (user.minThreshold ?? minCredits)
                  ? "text-emerald-800"
                  : user.status === "soft-disabled"
                    ? "text-orange-700 font-bold"
                    : "text-red-600 font-bold"
              }>
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
