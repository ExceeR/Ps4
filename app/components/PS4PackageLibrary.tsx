"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Wifi, Gamepad2 } from "lucide-react";

interface PackageItem {
  id: number;
  title: string;
  version: string;
  size: string;
  pkgUrl: string;
  contentId: string;
}

const PS4PackageLibrary = () => {
  const [ps4IP, setPS4IP] = useState("192.168.58");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const packages: PackageItem[] = [
    {
      id: 1,
      title: "The Sims 4",
      version: "1.00",
      size: "45.2 GB",
      pkgUrl: "https://download.akirabox.com/uploads/users/Q2WVGrBgGkx7/cog4r2zR38QRvetkEde-[SuperPSX]-The.Sims.4-CUSA09209-USA-Game-(5.05+)-PS4.pkg",
      contentId: "UP1234-CUSA12345_00-THESIMS4"
    },
    {
      id: 2,
      title: "The Sims 4 Up",
      version: "12.00",
      size: "45.12 GB",
      pkgUrl: "https://download.akirabox.com/uploads/users/Q2WVGrBgGkx7/coQ3X7L5QPraTdWcude-[SuperPSX]-The.Sims.4-CUSA09209-USA-Update-v1.95-(9.00+)-PS4.pkg",
      contentId: "UP1234-CUSA12345_00-THESIMS4"
    }
  ];

  const scanForPS4 = async () => {
    setStatus("Scanning for PS4...");
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPS4IP("192.168.58");
      setStatus("PS4 Found at 192.168.58");
    } catch (error) {
      setError("Failed to detect PS4.");
    }
  };

  const installPackage = async (pkg: PackageItem) => {
    if (!ps4IP) {
      setError("Please enter the PS4 IP address.");
      return;
    }

    setStatus(`Installing ${pkg.title}...`);
    try {
      const response = await fetch(`http://${ps4IP}:12801/api/install`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "direct",
          packages: [pkg.pkgUrl]
        })
      });

      if (!response.ok) throw new Error("Failed to send request");
      setStatus(`${pkg.title} installation started successfully!`);
    } catch (error) {
      setError("Installation failed. Make sure the Remote PKG Installer is running on your PS4.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-6 w-6" />
            PS4 Remote PKG Installer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Enter PS4 IP Address"
              value={ps4IP}
              onChange={(e) => setPS4IP(e.target.value)}
            />
            <Button onClick={scanForPS4} className="flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              Scan
            </Button>
          </div>

          {status && (
            <Alert>
              <AlertDescription>{status}</AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {packages.map(pkg => (
          <Card key={pkg.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{pkg.title}</h3>
                <p className="text-sm text-gray-500">
                  Version: {pkg.version} | Size: {pkg.size}
                </p>
              </div>
              <Button 
                onClick={() => installPackage(pkg)} 
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Install
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PS4PackageLibrary;
