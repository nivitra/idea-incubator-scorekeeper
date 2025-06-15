
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ThresholdConfigPanelProps {
  globalThreshold: number;
  setGlobalThreshold: (val: number) => void;
  buffer: number;
  setBuffer: (val: number) => void;
  users: {
    id: string;
    name: string;
    email: string;
    minThreshold?: number;
  }[];
  setUserThreshold: (id: string, v: number | undefined) => void;
  resetAll: () => void;
  visible: boolean;
  onClose: () => void;
}

const ThresholdConfigPanel: React.FC<ThresholdConfigPanelProps> = ({
  globalThreshold,
  setGlobalThreshold,
  buffer,
  setBuffer,
  users,
  setUserThreshold,
  resetAll,
  visible,
  onClose,
}) => {
  if (!visible) return null;
  return (
    <div className="fixed z-50 inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white border shadow-lg rounded-xl max-w-lg w-full p-7 relative">
        <button onClick={onClose} className="absolute top-3 right-4 text-lg text-gray-500 hover:text-gray-800 font-bold">×</button>
        <h2 className="text-xl font-bold mb-3">Credit Threshold Settings</h2>
        <div className="mb-5 flex gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Global Min Credits</label>
            <Input
              type="number"
              value={globalThreshold}
              min={0}
              max={100}
              onChange={e => setGlobalThreshold(Number(e.target.value))}
              className="w-28"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Warning Buffer</label>
            <Input
              type="number"
              value={buffer}
              min={1}
              max={globalThreshold}
              onChange={e => setBuffer(Number(e.target.value))}
              className="w-20"
            />
          </div>
        </div>
        <div className="mb-2 font-semibold text-sm">Per-User Overrides</div>
        <div className="max-h-52 overflow-y-auto border rounded-lg p-2 bg-muted">
          {users.map((user) => (
            <div className="flex items-center gap-2 mb-2" key={user.id}>
              <span className="w-32 truncate">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
              <Input
                type="number"
                min={0}
                max={100}
                className="w-20"
                value={user.minThreshold ?? ""}
                placeholder={"(Global: " + globalThreshold + ")"}
                onChange={e => {
                  const v = e.target.value === "" ? undefined : Number(e.target.value);
                  setUserThreshold(user.id, v);
                }}
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setUserThreshold(user.id, undefined)}
                className="ml-2"
              >
                Reset
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-between gap-3">
          <Button type="button" onClick={resetAll} variant="destructive">
            Reset All to Defaults
          </Button>
          <Button type="button" onClick={onClose} variant="primary">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThresholdConfigPanel;
