"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Building, 
  Users, 
  Bed, 
  Utensils, 
  Activity, 
  Wrench, 
  Leaf,
  Shield,
  Zap,
  Droplets,
  Thermometer,
  Plus,
  RotateCcw,
  Download,
  Share2,
  Move,
  Trash2
} from "lucide-react"

interface HabitatModule {
  id: string
  type: string
  name: string
  icon: React.ReactNode
  color: string
  minSize: number
  description: string
  required: boolean
}

interface HabitatArea {
  id: string
  moduleId: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
}

interface HabitatDesign {
  id: string
  name: string
  shape: "cylindrical" | "spherical" | "modular" | "inflatable"
  dimensions: {
    diameter: number
    height: number
    levels: number
  }
  crewSize: number
  missionDuration: number
  areas: HabitatArea[]
  totalVolume: number
  utilizedVolume: number
}

const habitatModules: HabitatModule[] = [
  {
    id: "sleep",
    type: "sleep",
    name: "Crew Quarters",
    icon: <Bed className="w-4 h-4" />,
    color: "bg-blue-500",
    minSize: 20,
    description: "Sleeping quarters for crew members",
    required: true
  },
  {
    id: "galley",
    type: "food",
    name: "Galley/Mess",
    icon: <Utensils className="w-4 h-4" />,
    color: "bg-green-500",
    minSize: 15,
    description: "Food preparation and dining area",
    required: true
  },
  {
    id: "medbay",
    type: "medical",
    name: "Medical Bay",
    icon: <Shield className="w-4 h-4" />,
    color: "bg-red-500",
    minSize: 25,
    description: "Medical care and health monitoring",
    required: true
  },
  {
    id: "exercise",
    type: "recreation",
    name: "Exercise Area",
    icon: <Activity className="w-4 h-4" />,
    color: "bg-orange-500",
    minSize: 30,
    description: "Physical exercise equipment",
    required: true
  },
  {
    id: "workshop",
    type: "maintenance",
    name: "Workshop",
    icon: <Wrench className="w-4 h-4" />,
    color: "bg-yellow-500",
    minSize: 20,
    description: "Equipment maintenance and repair",
    required: true
  },
  {
    id: "hydroponics",
    type: "life_support",
    name: "Hydroponics",
    icon: <Leaf className="w-4 h-4" />,
    color: "bg-emerald-500",
    minSize: 15,
    description: "Plant growth and food production",
    required: false
  },
  {
    id: "power",
    type: "systems",
    name: "Power Systems",
    icon: <Zap className="w-4 h-4" />,
    color: "bg-purple-500",
    minSize: 10,
    description: "Power generation and distribution",
    required: true
  },
  {
    id: "water",
    type: "life_support",
    name: "Water Recycling",
    icon: <Droplets className="w-4 h-4" />,
    color: "bg-cyan-500",
    minSize: 8,
    description: "Water purification and recycling",
    required: true
  },
  {
    id: "thermal",
    type: "systems",
    name: "Thermal Control",
    icon: <Thermometer className="w-4 h-4" />,
    color: "bg-indigo-500",
    minSize: 12,
    description: "Temperature regulation systems",
    required: true
  }
]

const defaultDesign: HabitatDesign = {
  id: "default",
  name: "New Habitat Design",
  shape: "cylindrical",
  dimensions: {
    diameter: 8,
    height: 6,
    levels: 2
  },
  crewSize: 4,
  missionDuration: 30,
  areas: [],
  totalVolume: 0,
  utilizedVolume: 0
}

export default function HabitatCreator() {
  const [design, setDesign] = useState<HabitatDesign>(defaultDesign)
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [selectedArea, setSelectedArea] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Calculate total volume based on shape and dimensions
    let volume = 0
    switch (design.shape) {
      case "cylindrical":
        volume = Math.PI * Math.pow(design.dimensions.diameter / 2, 2) * design.dimensions.height
        break
      case "spherical":
        volume = (4/3) * Math.PI * Math.pow(design.dimensions.diameter / 2, 3)
        break
      case "modular":
        volume = design.dimensions.diameter * design.dimensions.diameter * design.dimensions.height
        break
      case "inflatable":
        volume = Math.PI * Math.pow(design.dimensions.diameter / 2, 2) * design.dimensions.height * 0.8
        break
    }
    
    const utilizedVolume = design.areas.reduce((sum, area) => sum + (area.width * area.height), 0)
    
    setDesign(prev => ({
      ...prev,
      totalVolume: Math.round(volume),
      utilizedVolume: Math.round(utilizedVolume)
    }))
  }, [design.shape, design.dimensions, design.areas])

  const handleAddArea = (moduleId: string) => {
    const habitatModule = habitatModules.find(m => m.id === moduleId)
    if (!habitatModule) return

    const newArea: HabitatArea = {
      id: `area-${Date.now()}`,
      moduleId,
      x: 50,
      y: 50,
      width: Math.max(habitatModule.minSize, 30),
      height: Math.max(habitatModule.minSize, 30),
      rotation: 0
    }

    setDesign(prev => ({
      ...prev,
      areas: [...prev.areas, newArea]
    }))
  }

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!selectedModule || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const habitatModule = habitatModules.find(m => m.id === selectedModule)
    if (!habitatModule) return

    const newArea: HabitatArea = {
      id: `area-${Date.now()}`,
      moduleId: selectedModule,
      x: x - 15,
      y: y - 15,
      width: Math.max(habitatModule.minSize, 30),
      height: Math.max(habitatModule.minSize, 30),
      rotation: 0
    }

    setDesign(prev => ({
      ...prev,
      areas: [...prev.areas, newArea]
    }))

    setSelectedModule(null)
  }

  const handleAreaMouseDown = (e: React.MouseEvent, areaId: string) => {
    e.stopPropagation()
    const area = design.areas.find(a => a.id === areaId)
    if (!area || !canvasRef.current) return

    setSelectedArea(areaId)
    setIsDragging(true)

    const rect = canvasRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left - area.x,
      y: e.clientY - rect.top - area.y
    })
  }

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedArea || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - dragOffset.x
    const y = e.clientY - rect.top - dragOffset.y

    setDesign(prev => ({
      ...prev,
      areas: prev.areas.map(area =>
        area.id === selectedArea
          ? { ...area, x: Math.max(0, Math.min(x, 400 - area.width)), y: Math.max(0, Math.min(y, 300 - area.height)) }
          : area
      )
    }))
  }

  const handleCanvasMouseUp = () => {
    setIsDragging(false)
    setSelectedArea(null)
  }

  const handleDeleteArea = (areaId: string) => {
    setDesign(prev => ({
      ...prev,
      areas: prev.areas.filter(area => area.id !== areaId)
    }))
  }

  const handleValidateDesign = () => {
    const requiredModules = habitatModules.filter(m => m.required)
    const missingModules = requiredModules.filter(module => 
      !design.areas.some(area => area.moduleId === module.id)
    )

    if (missingModules.length > 0) {
      return {
        valid: false,
        message: `Missing required modules: ${missingModules.map(m => m.name).join(", ")}`
      }
    }

    const volumeUtilization = (design.utilizedVolume / design.totalVolume) * 100
    if (volumeUtilization > 85) {
      return {
        valid: false,
        message: "Habitat is over capacity. Reduce module sizes or increase habitat dimensions."
      }
    }

    return {
      valid: true,
      message: "Design is valid and meets all requirements!"
    }
  }

  const validation = handleValidateDesign()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
          <Building className="relative h-10 w-10 text-green-400" />
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Space Habitat Creator
          </h2>
          <p className="text-slate-300 mt-1">
            NASA Space Apps Challenge - Interactive Habitat Design Tool
          </p>
        </div>
      </div>

      <Tabs defaultValue="design" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="design" className="data-[state=active]:bg-green-600">
            <Building className="w-4 h-4 mr-2" />
            Design
          </TabsTrigger>
          <TabsTrigger value="modules" className="data-[state=active]:bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Modules
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
            <Users className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Design Tab */}
        <TabsContent value="design" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Habitat Configuration */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <Building className="w-5 h-5" />
                  Habitat Configuration
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Configure basic habitat parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="habitat-name">Habitat Name</Label>
                  <Input
                    id="habitat-name"
                    value={design.name}
                    onChange={(e) => setDesign(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-2 bg-slate-700/50 border-slate-600"
                  />
                </div>

                <div>
                  <Label htmlFor="habitat-shape">Habitat Shape</Label>
                  <Select 
                    value={design.shape} 
                    onValueChange={(value: any) => setDesign(prev => ({ ...prev, shape: value }))}
                  >
                    <SelectTrigger className="mt-2 bg-slate-700/50 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cylindrical">Cylindrical</SelectItem>
                      <SelectItem value="spherical">Spherical</SelectItem>
                      <SelectItem value="modular">Modular</SelectItem>
                      <SelectItem value="inflatable">Inflatable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="diameter">Diameter (m)</Label>
                    <Input
                      id="diameter"
                      type="number"
                      value={design.dimensions.diameter}
                      onChange={(e) => setDesign(prev => ({
                        ...prev,
                        dimensions: { ...prev.dimensions, diameter: Number(e.target.value) }
                      }))}
                      className="mt-2 bg-slate-700/50 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (m)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={design.dimensions.height}
                      onChange={(e) => setDesign(prev => ({
                        ...prev,
                        dimensions: { ...prev.dimensions, height: Number(e.target.value) }
                      }))}
                      className="mt-2 bg-slate-700/50 border-slate-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="crew-size">Crew Size</Label>
                    <Input
                      id="crew-size"
                      type="number"
                      value={design.crewSize}
                      onChange={(e) => setDesign(prev => ({ ...prev, crewSize: Number(e.target.value) }))}
                      className="mt-2 bg-slate-700/50 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mission-duration">Mission Duration (days)</Label>
                    <Input
                      id="mission-duration"
                      type="number"
                      value={design.missionDuration}
                      onChange={(e) => setDesign(prev => ({ ...prev, missionDuration: Number(e.target.value) }))}
                      className="mt-2 bg-slate-700/50 border-slate-600"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Design Canvas */}
            <Card className="bg-slate-800/50 border-slate-700 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Move className="w-5 h-5" />
                  Habitat Layout
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Click and drag to arrange habitat modules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-slate-400">
                        Volume: {design.utilizedVolume}m³ / {design.totalVolume}m³
                      </span>
                      <Progress 
                        value={(design.utilizedVolume / design.totalVolume) * 100} 
                        className="h-2 w-32 bg-slate-700"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setDesign(prev => ({ ...prev, areas: [] }))}
                      className="bg-slate-700/50 border-slate-600"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  </div>

                  <div 
                    ref={canvasRef}
                    className="relative w-full h-96 bg-slate-700/30 border-2 border-dashed border-slate-600 rounded-lg overflow-hidden"
                    onClick={handleCanvasClick}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                  >
                    {design.areas.map((area) => {
                      const habitatModule = habitatModules.find(m => m.id === area.moduleId)
                      if (!habitatModule) return null

                      return (
                        <div
                          key={area.id}
                          className={`absolute ${habitatModule.color} border-2 border-white/50 rounded cursor-move flex items-center justify-center text-white font-medium text-sm transition-all hover:scale-105 ${selectedArea === area.id ? 'ring-2 ring-yellow-400' : ''}`}
                          style={{
                            left: area.x,
                            top: area.y,
                            width: area.width,
                            height: area.height,
                            transform: `rotate(${area.rotation}deg)`
                          }}
                          onMouseDown={(e) => handleAreaMouseDown(e, area.id)}
                        >
                          <div className="text-center">
                            <div className="mb-1">{habitatModule.icon}</div>
                            <div className="text-xs">{habitatModule.name}</div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-600 hover:bg-red-700"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteArea(area.id)
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )
                    })}

                    {selectedModule && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="text-white text-center">
                          <Move className="w-8 h-8 mx-auto mb-2" />
                          <p>Click to place {habitatModules.find(m => m.id === selectedModule)?.name}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <Alert className={validation.valid ? "bg-green-600/20 border-green-500" : "bg-red-600/20 border-red-500"}>
                    <AlertDescription className={validation.valid ? "text-green-300" : "text-red-300"}>
                      {validation.message}
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Modules Tab */}
        <TabsContent value="modules" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Plus className="w-5 h-5" />
                Habitat Modules
              </CardTitle>
              <CardDescription className="text-slate-300">
                Click on a module to add it to your habitat design
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {habitatModules.map((module) => (
                  <div
                    key={module.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
                      selectedModule === module.id 
                        ? 'border-blue-400 bg-blue-600/20' 
                        : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                    }`}
                    onClick={() => setSelectedModule(module.id)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 ${module.color} rounded-lg flex items-center justify-center text-white`}>
                        {module.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{module.name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={`text-xs ${module.required ? 'bg-red-600' : 'bg-gray-600'}`}>
                            {module.required ? 'Required' : 'Optional'}
                          </Badge>
                          <span className="text-xs text-slate-400">Min: {module.minSize}m²</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300">{module.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-green-400">Space Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {Math.round((design.utilizedVolume / design.totalVolume) * 100)}%
                </div>
                <Progress 
                  value={(design.utilizedVolume / design.totalVolume) * 100} 
                  className="mt-2 h-2 bg-slate-700"
                />
                <p className="text-sm text-slate-400 mt-2">
                  {design.utilizedVolume}m³ of {design.totalVolume}m³ used
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-blue-400">Modules Placed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{design.areas.length}</div>
                <p className="text-sm text-slate-400 mt-2">
                  {habitatModules.filter(m => m.required).length} required modules
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-purple-400">Crew Capacity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{design.crewSize}</div>
                <p className="text-sm text-slate-400 mt-2">
                  {design.missionDuration} day mission
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-orange-400">Design Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {validation.valid ? "A+" : "C"}
                </div>
                <p className="text-sm text-slate-400 mt-2">
                  {validation.valid ? "Excellent design" : "Needs improvement"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Users className="w-5 h-5" />
                Module Distribution
              </CardTitle>
              <CardDescription className="text-slate-300">
                Breakdown of habitat modules by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(
                  design.areas.reduce((acc, area) => {
                    const habitatModule = habitatModules.find(m => m.id === area.moduleId)
                    if (habitatModule) {
                      acc[habitatModule.type] = (acc[habitatModule.type] || 0) + 1
                    }
                    return acc
                  }, {} as Record<string, number>)
                ).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-white capitalize">{type.replace("_", " ")}</span>
                    <Badge className="bg-purple-600">{count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}