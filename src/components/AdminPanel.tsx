import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { VillaManager } from './VillaManager';
import { BulletinManager } from '../components/BulletinManager';
import { BookingManager } from '../components/BookingManager';
import { Home, FileText, Calendar, BarChart3, Settings } from 'lucide-react';
import { LogoutButton } from "../components/LogoutButton";

interface AdminPanelProps {
  onBackToSite: () => void;
}

export function AdminPanel({ onBackToSite }: AdminPanelProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <Button variant="outline" onClick={onBackToSite}>
              <Home className="w-4 h-4 mr-2" />
              Back to Site
            </Button>
            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Admin Panel</h2>
          <p className="text-gray-600">Manage your resort's villas, bookings, and bulletin board from here.</p>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
            <TabsTrigger value="bookings" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Bookings</span>
            </TabsTrigger>
            <TabsTrigger value="villas" className="flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span>Villas</span>
            </TabsTrigger>
            <TabsTrigger value="bulletins" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Bulletins</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <BookingManager />
          </TabsContent>

          <TabsContent value="villas">
            <VillaManager />
          </TabsContent>

          <TabsContent value="bulletins">
            <BulletinManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}