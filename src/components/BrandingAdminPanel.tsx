
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useClubBranding } from "@/context/ClubBrandingContext";

const BrandingAdminPanel: React.FC = () => {
  const config = useClubBranding();
  return (
    <Card className="max-w-xl mx-auto my-10">
      <CardContent>
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl font-bold mb-2">Club Branding Settings</h2>
          <div>
            <label className="font-semibold text-sm">Club Name</label>
            <Input value={config.club_name} readOnly />
          </div>
          <div>
            <label className="font-semibold text-sm">Logo URL</label>
            <Input value={config.club_logo} readOnly />
          </div>
          <div>
            <label className="font-semibold text-sm">Accent Color</label>
            <Input value={config.accent_color} readOnly />
          </div>
          <div>
            <label className="font-semibold text-sm">Home Banner</label>
            <Input value={config.home_banner_image} readOnly />
          </div>
          <div>
            <Button disabled variant="secondary">Save (Coming Soon)</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandingAdminPanel;
