"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  Rocket, 
  Home, 
  Brain, 
  Globe, 
  Satellite, 
  Users, 
  Zap,
  Sparkles,
  Telescope,
  Building
} from "lucide-react"
import ExoplanetDetection from "@/components/exoplanet-detection"
import HabitatCreator from "@/components/habitat-creator"
import UniverseGenerator from "@/components/universe-generator"
import OrbitalMechanics from "@/components/orbital-mechanics"

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <Rocket className="relative h-12 w-12 text-purple-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Procedural Space Framework
              </h1>
              <p className="text-slate-300 mt-2">
                NASA Space Apps Challenge 2025 - AI-Powered Space Exploration
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-500">
            <Sparkles className="w-3 h-3 mr-1" />
            Blockchain-Enhanced • AI-Optimized • Procedurally Generated
          </Badge>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-600">
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="exoplanets" className="data-[state=active]:bg-blue-600">
              <Telescope className="w-4 h-4 mr-2" />
              Exoplanets
            </TabsTrigger>
            <TabsTrigger value="habitat" className="data-[state=active]:bg-green-600">
              <Building className="w-4 h-4 mr-2" />
              Habitat
            </TabsTrigger>
            <TabsTrigger value="universe" className="data-[state=active]:bg-indigo-600">
              <Globe className="w-4 h-4 mr-2" />
              Universe
            </TabsTrigger>
            <TabsTrigger value="orbital" className="data-[state=active]:bg-orange-600">
              <Satellite className="w-4 h-4 mr-2" />
              Orbital
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Challenge 1 Card */}
              <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-400">
                    <Telescope className="w-5 h-5" />
                    Exoplanet Hunter
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    AI-Powered Exoplanet Detection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Challenge Status</span>
                      <Badge className="bg-blue-600">Active</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>AI Model Accuracy</span>
                        <span>94.2%</span>
                      </div>
                      <Progress value={94.2} className="h-2 bg-slate-700" />
                    </div>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => setActiveTab("exoplanets")}
                    >
                      Start Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Challenge 2 Card */}
              <Card className="bg-slate-800/50 border-slate-700 hover:border-green-500 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-400">
                    <Building className="w-5 h-5" />
                    Habitat Creator
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Space Habitat Layout Designer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Challenge Status</span>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Designs Created</span>
                        <span>127</span>
                      </div>
                      <Progress value={75} className="h-2 bg-slate-700" />
                    </div>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => setActiveTab("habitat")}
                    >
                      Design Habitat
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Universe Generator Card */}
              <Card className="bg-slate-800/50 border-slate-700 hover:border-indigo-500 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-indigo-400">
                    <Globe className="w-5 h-5" />
                    Universe Generator
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Procedural Space Generation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Status</span>
                      <Badge className="bg-indigo-600">Ready</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Universes Generated</span>
                        <span>∞</span>
                      </div>
                      <Progress value={100} className="h-2 bg-slate-700" />
                    </div>
                    <Button 
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => setActiveTab("universe")}
                    >
                      Generate Universe
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Orbital Mechanics Card */}
              <Card className="bg-slate-800/50 border-slate-700 hover:border-orange-500 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-400">
                    <Satellite className="w-5 h-5" />
                    Orbital Mechanics
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Satellite Route Optimization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Status</span>
                      <Badge className="bg-orange-600">Active</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Routes Optimized</span>
                        <span>1,247</span>
                      </div>
                      <Progress value={88} className="h-2 bg-slate-700" />
                    </div>
                    <Button 
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      onClick={() => setActiveTab("orbital")}
                    >
                      Optimize Routes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Overview */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                  <Brain className="w-5 h-5" />
                  AI & Blockchain Integration
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Procedural Space Framework System Overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-purple-300">AI Optimization</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-center gap-2">
                        <Zap className="w-3 h-3 text-yellow-400" />
                        Neural Network Routing
                      </li>
                      <li className="flex items-center gap-2">
                        <Zap className="w-3 h-3 text-yellow-400" />
                        Predictive Maintenance
                      </li>
                      <li className="flex items-center gap-2">
                        <Zap className="w-3 h-3 text-yellow-400" />
                        Adaptive Resource Allocation
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-300">Blockchain Governance</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-center gap-2">
                        <Users className="w-3 h-3 text-green-400" />
                        Proof-of-Orbital-Work
                      </li>
                      <li className="flex items-center gap-2">
                        <Users className="w-3 h-3 text-green-400" />
                        Decentralized Control
                      </li>
                      <li className="flex items-center gap-2">
                        <Users className="w-3 h-3 text-green-400" />
                        Smart Contract Management
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-blue-300">Procedural Generation</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-blue-400" />
                        Mandelbrot-inspired Systems
                      </li>
                      <li className="flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-blue-400" />
                        Seed-based Generation
                      </li>
                      <li className="flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-blue-400" />
                        Fractal Environments
                      </li>
                    </ul>
                  </div>
                </div>
                <Separator className="my-6 bg-slate-700" />
                <div className="text-center">
                  <p className="text-sm text-slate-400">
                    Combining NASA Space Apps Challenges with cutting-edge AI, blockchain, and procedural generation
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exoplanet Detection Tab */}
          <TabsContent value="exoplanets">
            <ExoplanetDetection />
          </TabsContent>

          {/* Habitat Creator Tab */}
          <TabsContent value="habitat">
            <HabitatCreator />
          </TabsContent>

          {/* Universe Generator Tab */}
          <TabsContent value="universe">
            <UniverseGenerator />
          </TabsContent>

          {/* Orbital Mechanics Tab */}
          <TabsContent value="orbital">
            <OrbitalMechanics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}