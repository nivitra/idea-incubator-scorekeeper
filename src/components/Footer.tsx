
import React from "react";

const Footer: React.FC = () => (
  <footer className="w-full flex flex-col items-center gap-1 py-4 mt-6">
    <div className="text-xs text-muted-foreground flex items-center gap-1">
      <span>
        <span className="font-semibold text-primary">npitch solutions</span>
        &nbsp;in collaboration with&nbsp;
        <span className="font-semibold text-primary">learnapart</span>
      </span>
    </div>
  </footer>
);

export default Footer;
