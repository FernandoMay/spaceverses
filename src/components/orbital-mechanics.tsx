"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Satellite, 
  Route, 
  Zap, 
  Brain, 
  Users, 
  TrendingUp,
  RefreshCw,
  Play,
  Pause,
  Settings,
  Globe,
  Target,
  Activity,
  Shield,
  Clock,
  Zap as Bolt,
  Check
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from "recharts"

interface Satellite {
  id: string
  name: string
  type: "leo" | "meo" | "geo" | "polar"
  altitude: number
  inclination: number
  longitude: number
  latitude: number
  velocity: number
  status: "active" | "inactive" | "maintenance"
  fuel: number
  power: number
  temperature: number
  lastUpdate: string
}

interface Route {
  id: string
  from: string
  to: string
  distance: number
  duration: number
  efficiency: number
  satellites: string[]
  cost: number
  carbonFootprint: number
  status: "optimal" | "suboptimal" | "critical"
}

interface OptimizationResult {
  routes: Route[]
  efficiency: number
  fuelSaved: number
  timeSaved: number
  recommendations: string[]
}

const generateMockSatellites = (): Satellite[] => [
  {
    id: "sat-1",
    name: "Starlink-1001",
    type: "leo",
    altitude: 550,
    inclination: 53,
    longitude: -74.006,
    latitude: 40.7128,
    velocity: 7.5,
    status: "active",
    fuel: 85,
    power: 92,
    temperature: -20,
    lastUpdate: "2024-01-15T10:30:00Z"
  },
  {
    id: "sat-2",
    name: "GPS-IIF-1",
    type: "meo",
    altitude: 20200,
    inclination: 55,
    longitude: -118.2437,
    latitude: 34.0522,
    velocity: 3.87,
    status: "active",
    fuel: 72,
    power: 88,
    temperature: -15,
    lastUpdate: "2024-01-15T10:25:00Z"
  },
  {
    id: "sat-3",
    name: "GOES-16",
    type: "geo",
    altitude: 35786,
    inclination: 0.1,
    longitude: -75.0,
    latitude: 0.0,
    velocity: 3.07,
    status: "active",
    fuel: 68,
    power: 95,
    temperature: -10,
    lastUpdate: "2024-01-15T10:35:00Z"
  },
  {
    id: "sat-4",
    name: "Sentinel-1A",
    type: "polar",
    altitude: 693,
    inclination: 98.18,
    longitude: 0.0,
    latitude: 90.0,
    velocity: 7.45,
    status: "maintenance",
    fuel: 45,
    power: 78,
    temperature: -25,
    lastUpdate: "2024-01-15T09:45:00Z"
  }
]

const generateMockRoutes = (): Route[] => [
  {
    id: "route-1",
    from: "New York",
    to: "London",
    distance: 5585,
    duration: 45,
    efficiency: 94,
    satellites: ["sat-1", "sat-3"],
    cost: 0.12,
    carbonFootprint: 2.1,
    status: "optimal"
  },
  {
    id: "route-2",
    from: "Tokyo",
    to: "San Francisco",
    distance: 8276,
    duration: 78,
    efficiency: 87,
    satellites: ["sat-2", "sat-1"],
    cost: 0.18,
    carbonFootprint: 3.2,
    status: "suboptimal"
  },
  {
    id: "route-3",
    from: "Sydney",
    to: "Cape Town",
    distance: 11023,
    duration: 120,
    efficiency: 76,
    satellites: ["sat-4", "sat-3", "sat-2"],
    cost: 0.25,
    carbonFootprint: 4.5,
    status: "critical"
  }
]

const generateOrbitalData = (satellite: Satellite, time: number) => {
  const angle = (time * satellite.velocity * 0.01) % 360
  const radians = (angle * Math.PI) / 180
  
  return {
    time,
    x: Math.cos(radians) * satellite.altitude / 1000,
    y: Math.sin(radians) * satellite.altitude / 1000,
    z: Math.sin(radians * 0.5) * satellite.altitude / 2000
  }
}

export default function OrbitalMechanics() {
  const [satellites, setSatellites] = useState<Satellite[]>(generateMockSatellites())
  const [routes, setRoutes] = useState<Route[]>(generateMockRoutes())
  const [selectedSatellite, setSelectedSatellite] = useState<Satellite | null>(null)
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationTime, setSimulationTime] = useState(0)
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null)
  const [orbitalData, setOrbitalData] = useState<any[]>([])

  const simulationRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isSimulating) {
      simulationRef.current = setInterval(() => {
        setSimulationTime(prev => prev + 1)
        
        // Generate orbital data for visualization
        const newOrbitalData = satellites.map(sat => generateOrbitalData(sat, simulationTime))
        setOrbitalData(newOrbitalData)
      }, 100)
    } else {
      if (simulationRef.current) {
        clearInterval(simulationRef.current)
      }
    }

    return () => {
      if (simulationRef.current) {
        clearInterval(simulationRef.current)
      }
    }
  }, [isSimulating, simulationTime, satellites])

  const handleOptimizeRoutes = async () => {
    setIsOptimizing(true)
    
    // Simulate AI optimization
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const optimizedRoutes = routes.map(route => ({
      ...route,
      efficiency: Math.min(route.efficiency + Math.random() * 10, 98),
      duration: Math.max(route.duration * 0.9, 30),
      cost: route.cost * 0.85,
      status: route.efficiency > 90 ? "optimal" : route.efficiency > 80 ? "suboptimal" : "critical"
    }))

    const result: OptimizationResult = {
      routes: optimizedRoutes,
      efficiency: 92.5,
      fuelSaved: 15.7,
      timeSaved: 23.4,
      recommendations: [
        "Re-route satellite SAT-4 for better coverage",
        "Increase power allocation to GPS-IIF-1",
        "Implement predictive maintenance for GOES-16"
      ]
    }

    setRoutes(optimizedRoutes)
    setOptimizationResult(result)
    setIsOptimizing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "optimal":
        return "bg-green-600"
      case "inactive":
      case "suboptimal":
        return "bg-yellow-600"
      case "maintenance":
      case "critical":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getSatelliteTypeColor = (type: string) => {
    switch (type) {
      case "leo": return "bg-blue-600"
      case "meo": return "bg-green-600"
      case "geo": return "bg-purple-600"
      case "polar": return "bg-orange-600"
      default: return "bg-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
          <Satellite className="relative h-10 w-10 text-orange-400" />
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Orbital Mechanics & Satellite Optimization
          </h2>
          <p className="text-slate-300 mt-1">
            AI-Powered Route Optimization and Satellite Management
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-orange-600">
            <Globe className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="satellites" className="data-[state=active]:bg-blue-600">
            <Satellite className="w-4 h-4 mr-2" />
            Satellites
          </TabsTrigger>
          <TabsTrigger value="routes" className="data-[state=active]:bg-green-600">
            <Route className="w-4 h-4 mr-2" />
            Routes
          </TabsTrigger>
          <TabsTrigger value="optimization" className="data-[state=active]:bg-purple-600">
            <Brain className="w-4 h-4 mr-2" />
            AI Optimization
          </TabsTrigger>
          <TabsTrigger value="blockchain" className="data-[state=active]:bg-cyan-600">
            <Shield className="w-4 h-4 mr-2" />
            Blockchain
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-orange-400">Active Satellites</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {satellites.filter(s => s.status === "active").length}
                </div>
                <p className="text-sm text-slate-400 mt-2">
                  of {satellites.length} total satellites
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-blue-400">Route Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {Math.round(routes.reduce((sum, route) => sum + route.efficiency, 0) / routes.length)}%
                </div>
                <Progress 
                  value={routes.reduce((sum, route) => sum + route.efficiency, 0) / routes.length} 
                  className="mt-2 h-2 bg-slate-700"
                />
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-green-400">Fuel Saved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {optimizationResult?.fuelSaved.toFixed(1) || "0.0"}%
                </div>
                <p className="text-sm text-slate-400 mt-2">
                  through AI optimization
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-purple-400">Simulation Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {simulationTime}s
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    onClick={() => setIsSimulating(!isSimulating)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isSimulating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setSimulationTime(0)}
                    className="bg-slate-700/50 border-slate-600"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orbital Visualization */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Globe className="w-5 h-5" />
                Orbital Visualization
              </CardTitle>
              <CardDescription className="text-slate-300">
                Real-time satellite positions and orbital paths
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-96 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border border-slate-600 rounded-lg overflow-hidden">
                {/* Earth */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full shadow-2xl">
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                </div>

                {/* Orbital paths */}
                {satellites.map((satellite, index) => (
                  <div
                    key={satellite.id}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-slate-600 rounded-full"
                    style={{
                      width: `${(satellite.altitude / 100) * 2}px`,
                      height: `${(satellite.altitude / 100) * 2}px`,
                      borderColor: getSatelliteTypeColor(satellite.type).replace("bg-", "")
                    }}
                  />
                ))}

                {/* Satellites */}
                {orbitalData.map((data, index) => {
                  const satellite = satellites[index]
                  if (!satellite) return null

                  return (
                    <div
                      key={satellite.id}
                      className={`absolute w-4 h-4 rounded-full cursor-pointer transition-all hover:scale-125 ${
                        selectedSatellite?.id === satellite.id ? 'ring-2 ring-yellow-400' : ''
                      } ${getSatelliteTypeColor(satellite.type)}`}
                      style={{
                        left: `calc(50% + ${data.x}px)`,
                        top: `calc(50% + ${data.y}px)`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      onClick={() => setSelectedSatellite(satellite)}
                    >
                      {satellite.status === "active" && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Satellites Tab */}
        <TabsContent value="satellites" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Satellite List */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Satellite className="w-5 h-5" />
                  Satellite Fleet
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Monitor and manage satellite assets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {satellites.map((satellite) => (
                    <div
                      key={satellite.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                        selectedSatellite?.id === satellite.id
                          ? 'border-blue-400 bg-blue-600/20'
                          : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                      }`}
                      onClick={() => setSelectedSatellite(satellite)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${getSatelliteTypeColor(satellite.type)}`} />
                        <div className="flex-1">
                          <div className="font-medium text-white">{satellite.name}</div>
                          <div className="text-sm text-slate-400 uppercase">{satellite.type}</div>
                        </div>
                        <Badge className={getStatusColor(satellite.status)}>
                          {satellite.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Satellite Details */}
            <Card className="bg-slate-800/50 border-slate-700 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <Settings className="w-5 h-5" />
                  Satellite Details
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Detailed information and telemetry data
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedSatellite ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-full ${getSatelliteTypeColor(selectedSatellite.type)}`} />
                      <div>
                        <h3 className="text-xl font-bold text-white">{selectedSatellite.name}</h3>
                        <p className="text-slate-300 uppercase">{selectedSatellite.type} Satellite</p>
                      </div>
                      <Badge className={getStatusColor(selectedSatellite.status)}>
                        {selectedSatellite.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm text-slate-400">Altitude</div>
                        <div className="text-lg font-semibold text-white">{selectedSatellite.altitude} km</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-slate-400">Velocity</div>
                        <div className="text-lg font-semibold text-white">{selectedSatellite.velocity} km/s</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-slate-400">Inclination</div>
                        <div className="text-lg font-semibold text-white">{selectedSatellite.inclination}°</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-slate-400">Temperature</div>
                        <div className="text-lg font-semibold text-white">{selectedSatellite.temperature}°C</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Fuel Level</span>
                          <span className="text-white">{selectedSatellite.fuel}%</span>
                        </div>
                        <Progress value={selectedSatellite.fuel} className="h-2 bg-slate-700" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Power Output</span>
                          <span className="text-white">{selectedSatellite.power}%</span>
                        </div>
                        <Progress value={selectedSatellite.power} className="h-2 bg-slate-700" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-slate-400">Last Update</div>
                        <div className="text-white">
                          {new Date(selectedSatellite.lastUpdate).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-400">Current Position</Label>
                        <div className="text-white mt-1">
                          {selectedSatellite.latitude.toFixed(4)}°N, {selectedSatellite.longitude.toFixed(4)}°W
                        </div>
                      </div>
                      <div>
                        <Label className="text-slate-400">Signal Strength</Label>
                        <div className="text-white mt-1">
                          {selectedSatellite.status === "active" ? "Strong" : "Weak"}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Satellite className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Select a satellite to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Routes Tab */}
        <TabsContent value="routes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Route List */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <Route className="w-5 h-5" />
                  Communication Routes
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Active satellite communication paths
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {routes.map((route) => (
                    <div
                      key={route.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                        selectedRoute?.id === route.id
                          ? 'border-green-400 bg-green-600/20'
                          : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                      }`}
                      onClick={() => setSelectedRoute(route)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-white">
                          {route.from} → {route.to}
                        </div>
                        <Badge className={getStatusColor(route.status)}>
                          {route.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-slate-400">Distance:</span>
                          <span className="text-white ml-1">{route.distance}km</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Duration:</span>
                          <span className="text-white ml-1">{route.duration}ms</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Efficiency:</span>
                          <span className="text-white ml-1">{route.efficiency}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Route Details */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                  <Target className="w-5 h-5" />
                  Route Analysis
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Detailed route performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedRoute ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Route className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {selectedRoute.from} → {selectedRoute.to}
                        </h3>
                        <p className="text-slate-300">Communication Route</p>
                      </div>
                      <Badge className={getStatusColor(selectedRoute.status)}>
                        {selectedRoute.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm text-slate-400">Distance</div>
                        <div className="text-lg font-semibold text-white">{selectedRoute.distance} km</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-slate-400">Duration</div>
                        <div className="text-lg font-semibold text-white">{selectedRoute.duration} ms</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-slate-400">Efficiency</div>
                        <div className="text-lg font-semibold text-white">{selectedRoute.efficiency}%</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-slate-400">Cost</div>
                        <div className="text-lg font-semibold text-white">${selectedRoute.cost}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-sm text-slate-400">Satellite Path</div>
                      <div className="flex gap-2">
                        {selectedRoute.satellites.map((satId, index) => {
                          const satellite = satellites.find(s => s.id === satId)
                          return (
                            <div key={satId} className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full ${satellite ? getSatelliteTypeColor(satellite.type) : 'bg-gray-600'}`} />
                              <span className="text-white text-sm">{satellite?.name || satId}</span>
                              {index < selectedRoute.satellites.length - 1 && (
                                <span className="text-slate-400">→</span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Carbon Footprint</span>
                          <span className="text-white">{selectedRoute.carbonFootprint} kg CO₂</span>
                        </div>
                        <Progress value={Math.min(selectedRoute.carbonFootprint * 10, 100)} className="h-2 bg-slate-700" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Signal Quality</span>
                          <span className="text-white">{selectedRoute.efficiency > 90 ? "Excellent" : selectedRoute.efficiency > 80 ? "Good" : "Fair"}</span>
                        </div>
                        <Progress value={selectedRoute.efficiency} className="h-2 bg-slate-700" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Route className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Select a route to view analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Optimization Tab */}
        <TabsContent value="optimization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Optimization Controls */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                  <Brain className="w-5 h-5" />
                  AI Optimization
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Neural network route optimization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleOptimizeRoutes}
                  disabled={isOptimizing}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isOptimizing ? (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Optimize Routes
                    </>
                  )}
                </Button>

                {optimizationResult && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Overall Efficiency</span>
                      <span className="text-green-400">{optimizationResult.efficiency}%</span>
                    </div>
                    <Progress value={optimizationResult.efficiency} className="h-2 bg-slate-700" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Fuel Saved</span>
                      <span className="text-blue-400">{optimizationResult.fuelSaved}%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Time Saved</span>
                      <span className="text-orange-400">{optimizationResult.timeSaved}%</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="bg-slate-800/50 border-slate-700 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <TrendingUp className="w-5 h-5" />
                  AI Recommendations
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Machine learning-powered optimization suggestions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {optimizationResult ? (
                  <div className="space-y-4">
                    {optimizationResult.recommendations.map((recommendation, index) => (
                      <Alert key={index} className="bg-green-600/20 border-green-500">
                        <AlertDescription className="text-green-300">
                          <div className="flex items-center gap-2">
                            <Brain className="w-4 h-4" />
                            {recommendation}
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Run optimization to see AI recommendations</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Activity className="w-5 h-5" />
                  Route Efficiency Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={routes.map((route, index) => ({ index, efficiency: route.efficiency }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="index" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                      labelStyle={{ color: "#f1f5f9" }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="efficiency" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-400">
                  <Shield className="w-5 h-5" />
                  Cost vs Efficiency Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={routes.map(route => ({ cost: route.cost, efficiency: route.efficiency }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="cost" stroke="#94a3b8" />
                    <YAxis dataKey="efficiency" stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                      labelStyle={{ color: "#f1f5f9" }}
                    />
                    <Scatter 
                      dataKey="efficiency" 
                      fill="#f97316"
                      fillOpacity={0.6}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Blockchain Governance Tab */}
        <TabsContent value="blockchain" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Blockchain Overview */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-400">
                  <Shield className="w-5 h-5" />
                  Governance Overview
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Proof-of-Orbital-Work (PoOW) consensus
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Network Status</span>
                    <Badge className="bg-green-600">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Consensus</span>
                    <span className="text-cyan-400">PoOW</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Block Height</span>
                    <span className="text-white">#12,847</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Validators</span>
                    <span className="text-white">24</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-slate-400">Network Hashrate</div>
                  <div className="text-lg font-semibold text-white">2.47 TH/s</div>
                  <Progress value={87} className="h-2 bg-slate-700" />
                </div>

                <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                  <Shield className="w-4 h-4 mr-2" />
                  View Blockchain Explorer
                </Button>
              </CardContent>
            </Card>

            {/* Smart Contracts */}
            <Card className="bg-slate-800/50 border-slate-700 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                  <Users className="w-5 h-5" />
                  Smart Contracts
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Decentralized satellite management contracts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Satellite className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-white">SatelliteRegistry</div>
                          <div className="text-sm text-slate-400">0x742d...8f3a</div>
                        </div>
                      </div>
                      <div className="text-sm text-slate-300">
                        Manages satellite ownership and telemetry data integrity
                      </div>
                    </div>

                    <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                          <Route className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-white">RouteOptimizer</div>
                          <div className="text-sm text-slate-400">0x9a1b...2c4d</div>
                        </div>
                      </div>
                      <div className="text-sm text-slate-300">
                        Automated route optimization and resource allocation
                      </div>
                    </div>

                    <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                          <Brain className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-white">AIGovernance</div>
                          <div className="text-sm text-slate-400">0x3c7e...9f1a</div>
                        </div>
                      </div>
                      <div className="text-sm text-slate-300">
                        AI model training and decision governance
                      </div>
                    </div>

                    <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-white">ResourceToken</div>
                          <div className="text-sm text-slate-400">0x5f2d...7b8c</div>
                        </div>
                      </div>
                      <div className="text-sm text-slate-300">
                        Token-based resource management and trading
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Activity className="w-5 h-5" />
                Recent Transactions
              </CardTitle>
              <CardDescription className="text-slate-300">
                Latest blockchain transactions and governance actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Route Optimization</div>
                      <div className="text-sm text-slate-400">NYC → London route optimized</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-400">Confirmed</div>
                    <div className="text-xs text-slate-400">2 min ago</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Satellite className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Satellite Registration</div>
                      <div className="text-sm text-slate-400">Starlink-1002 added to network</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-400">Confirmed</div>
                    <div className="text-xs text-slate-400">5 min ago</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-white">AI Model Update</div>
                      <div className="text-sm text-slate-400">Neural network weights updated</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-400">Confirmed</div>
                    <div className="text-xs text-slate-400">8 min ago</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Resource Transfer</div>
                      <div className="text-sm text-slate-400">1000 ORB tokens transferred</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-yellow-400">Pending</div>
                    <div className="text-xs text-slate-400">1 min ago</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Governance Proposals */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-400">
                <Users className="w-5 h-5" />
                Governance Proposals
              </CardTitle>
              <CardDescription className="text-slate-300">
                Community governance and voting system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-400">Active</span>
                    </div>
                    <span className="text-sm text-slate-400">Ends in 2 days</span>
                  </div>
                  <h4 className="font-medium text-white mb-2">Increase Satellite Coverage in Pacific Region</h4>
                  <p className="text-sm text-slate-300 mb-3">
                    Proposal to deploy 3 additional LEO satellites to improve coverage in the Asia-Pacific region
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="text-slate-400">For:</span>
                        <span className="text-green-400 ml-1">67.3%</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-400">Against:</span>
                        <span className="text-red-400 ml-1">32.7%</span>
                      </div>
                    </div>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Vote
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-sm text-yellow-400">Discussion</span>
                    </div>
                    <span className="text-sm text-slate-400">Voting starts in 3 days</span>
                  </div>
                  <h4 className="font-medium text-white mb-2">Update AI Optimization Algorithm</h4>
                  <p className="text-sm text-slate-300 mb-3">
                    Implement new neural network architecture for improved route optimization efficiency
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-400">
                      15 comments • 8 participants
                    </div>
                    <Button size="sm" variant="outline" className="bg-slate-700/50 border-slate-600">
                      Discuss
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}