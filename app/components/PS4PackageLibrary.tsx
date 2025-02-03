"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Wifi, Package, Gamepad2, Search } from 'lucide-react';

interface PackageItem {
  id: number;
  title: string;
  version: string;
  size: string;
  pkgUrl: string;
  imageUrl: string;
  contentId: string;
}

const PS4PackageLibrary = () => {
  const [ps4IP, setPS4IP] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  // Example package library - in real use, this would come from your backend
  const [packages] = useState<PackageItem[]>([
    {
      id: 1,
      title: "Game Example 1",
      version: "1.00",
      size: "45.2 GB",
      pkgUrl: "https://download.akirabox.com/uploads/users/Q2WVGrBgGkx7/cog4r2zR38QRvetkEde-[SuperPSX]-The.Sims.4-CUSA09209-USA-Game-(5.05+)-PS4.pkg",
      imageUrl: "/api/placeholder/120/68",
      contentId: "UP1234-CUSA12345_00-GAMEEXAMPLE00001"
    },
    {
      id: 2,
      title: "Game Example 2",
      version: "1.02",
      size: "32.1 GB",
      pkgUrl: "https://download.akirabox.com/uploads/users/Q2WVGrBgGkx7/coQ3X7L5QPraTdWcude-[SuperPSX]-The.Sims.4-CUSA09209-USA-Update-v1.95-(9.00+)-PS4.pkg",
      imageUrl: "/api/placeholder/120/68",
      contentId: "UP1234-CUSA12346_00-GAMEEXAMPLE00002"
    },
  ]);

  const scanForPS4 = async () => {
    setStatus('Scanning network for PS4...');
    try {
      // In real implementation, this would scan the network
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPS4IP('192.168.1.100');
      setStatus('PS4 found!');
    } catch (error) {
      setError('Failed to find PS4: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const installPackage = async (pkg: PackageItem) => {
    if (!ps4IP) {
      setError('Please connect to a PS4 first');
      return;
    }

    setStatus(`Preparing to install ${pkg.title}...`);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStatus(`Successfully started installation of ${pkg.title}`);
    } catch (error) {
      setError(`Failed to install ${pkg.title}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.contentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-6 w-6" />
            PS4 Package Library
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="PS4 IP Address"
                  value={ps4IP}
                  onChange={(e) => setPS4IP(e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={scanForPS4}
                  className="flex items-center gap-2"
                >
                  <Wifi className="h-4 w-4" />
                  Scan
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search packages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
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
        {filteredPackages.map(pkg => (
          <Card key={pkg.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <img
                  src={pkg.imageUrl}
                  alt={pkg.title}
                  className="w-32 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{pkg.title}</h3>
                  <div className="text-sm text-gray-500">
                    <p>Version: {pkg.version}</p>
                    <p>Size: {pkg.size}</p>
                    <p className="font-mono text-xs">{pkg.contentId}</p>
                  </div>
                </div>
                <Button
                  onClick={() => installPackage(pkg)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Install
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PS4PackageLibrary;