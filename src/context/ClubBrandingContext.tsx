
import React, { createContext, useContext, useEffect, useState } from "react";

type ClubConfig = {
  club_name: string;
  club_logo: string;
  accent_color: string;
  home_banner_image: string;
};

const DEFAULT: ClubConfig = {
  club_name: "Idea Incubator MGIT",
  club_logo: "",
  accent_color: "#059669",
  home_banner_image: ""
};

const ClubBrandingContext = createContext<ClubConfig>(DEFAULT);

export function useClubBranding() {
  return useContext(ClubBrandingContext);
}

export const ClubBrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ClubConfig>(DEFAULT);

  useEffect(() => {
    // Fetch from file (future: support DB/config API)
    fetch("/src/club_config.json")
      .then(r => r.json())
      .then(setConfig)
      .catch(() => setConfig(DEFAULT));
  }, []);

  return (
    <ClubBrandingContext.Provider value={config}>{children}</ClubBrandingContext.Provider>
  );
};
