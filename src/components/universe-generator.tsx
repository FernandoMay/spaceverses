"use client"

import { useState, useEffect, useRef, useCallback, memo } from "react"
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
  Globe, 
  Sparkles, 
  Star, 
  Zap, 
  RefreshCw, 
  Download,
  Share2,
  Eye,
  Settings,
  Hash,
  TreePine,
  Waves,
  Mountain,
  Users
} from "lucide-react"

interface CelestialBody {
  id: string
  name: string
  type: "star" | "planet" | "moon" | "asteroid" | "nebula"
  x: number
  y: number
  size: number
  color: string
  temperature: number
  mass: number
  distance: number
  orbitalPeriod: number
  hasLife: boolean
  biodiversity: number
  atmosphere: string
  resources: string[]
}

interface Galaxy {
  id: string
  name: string
  seed: string
  type: "spiral" | "elliptical" | "irregular" | "dwarf"
  size: number
  starCount: number
  bodies: CelestialBody[]
  age: number
  metallicity: number
}

interface GenerationParams {
  galaxySize: number
  starDensity: number
  planetProbability: number
  lifeProbability: number
  complexity: number
  fractalIterations: number
}

const generateSeed = () => Math.random().toString(36).substring(2, 15)

const hashFromString = (str: string): number => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

const mandelbrot = (x: number, y: number, maxIterations: number): number => {
  let real = x
  let imag = y
  let realTemp

  for (let i = 0; i < maxIterations; i++) {
    realTemp = real * real - imag * imag + x
    imag = 2 * real * imag + y
    real = realTemp

    if (real * real + imag * imag > 4) {
      return i / maxIterations
    }
  }
  return 1
}

const perlinNoise = (x: number, y: number, seed: number): number => {
  const X = Math.floor(x) & 255
  const Y = Math.floor(y) & 255
  const xf = x - Math.floor(x)
  const yf = y - Math.floor(y)

  const u = fade(xf)
  const v = fade(yf)

  const a = p[X] + Y
  const aa = p[a]
  const ab = p[a + 1]
  const b = p[X + 1] + Y
  const ba = p[b]
  const bb = p[b + 1]

  return lerp(v, lerp(u, grad(p[aa], xf, yf), grad(p[ba], xf - 1, yf)),
    lerp(u, grad(p[ab], xf, yf - 1), grad(p[bb], xf - 1, yf - 1)))
}

const fade = (t: number): number => t * t * t * (t * (t * 6 - 15) + 10)

const lerp = (t: number, a: number, b: number): number => a + t * (b - a)

const grad = (hash: number, x: number, y: number): number => {
  const h = hash & 15
  const grad = 1 + (h & 7)
  return ((h & 8) ? -grad : grad) * x + ((h & 4) ? -grad : grad) * y
}

const p = new Array(512)
const permutation = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180]

for (let i = 0; i < 256; i++) {
  p[256 + i] = p[i] = permutation[i]
}

const generateGalaxy = (seed: string, params: GenerationParams): Galaxy => {
  const seedHash = hashFromString(seed)
  const random = (min: number, max: number) => {
    const x = Math.sin(seedHash++) * 10000
    return min + (x - Math.floor(x)) * (max - min)
  }

  const galaxyTypes: Galaxy["type"][] = ["spiral", "elliptical", "irregular", "dwarf"]
  const type = galaxyTypes[Math.floor(random(0, galaxyTypes.length))]

  const bodies: CelestialBody[] = []
  // Limit star count to prevent memory issues
  const maxStars = Math.min(100, Math.floor(params.starDensity * params.galaxySize))
  const starCount = Math.min(maxStars, 50) // Hard limit for safety

  // Generate stars
  for (let i = 0; i < starCount; i++) {
    const angle = random(0, 2 * Math.PI)
    const distance = random(0, params.galaxySize / 2)
    
    let x = distance * Math.cos(angle)
    let y = distance * Math.sin(angle)

    // Apply spiral pattern for spiral galaxies
    if (type === "spiral") {
      const spiralAngle = distance * 0.5
      x = distance * Math.cos(angle + spiralAngle)
      y = distance * Math.sin(angle + spiralAngle)
    }

    const star: CelestialBody = {
      id: `star-${i}`,
      name: `Star-${i + 1}`,
      type: "star",
      x,
      y,
      size: random(2, 8),
      color: `hsl(${random(0, 60)}, 100%, ${random(50, 80)}%)`,
      temperature: random(3000, 30000),
      mass: random(0.5, 50),
      distance,
      orbitalPeriod: 0,
      hasLife: false,
      biodiversity: 0,
      atmosphere: "",
      resources: []
    }

    bodies.push(star)

    // Generate planets around stars (limited to prevent memory issues)
    if (random(0, 1) < params.planetProbability && bodies.length < 200) {
      const planetCount = Math.min(3, Math.floor(random(1, 4))) // Limit planets per star
      for (let j = 0; j < planetCount; j++) {
        const planetDistance = distance + random(10, 30) // Reduced distance
        const planetAngle = angle + random(0, 2 * Math.PI)
        
        const planet: CelestialBody = {
          id: `planet-${i}-${j}`,
          name: `${star.name}-${j + 1}`,
          type: "planet",
          x: planetDistance * Math.cos(planetAngle),
          y: planetDistance * Math.sin(planetAngle),
          size: random(1, 3), // Reduced size
          color: `hsl(${random(180, 300)}, 70%, ${random(30, 60)}%)`,
          temperature: random(-200, 500),
          mass: random(0.1, 3), // Reduced mass
          distance: planetDistance,
          orbitalPeriod: random(50, 500), // Reduced period
          hasLife: random(0, 1) < params.lifeProbability,
          biodiversity: random(0, 100),
          atmosphere: random(0, 1) < 0.7 ? random(0, 1) < 0.5 ? "oxygen" : "nitrogen" : "methane",
          resources: ["water", "minerals", "gases"].filter(() => random(0, 1) < 0.4) // Reduced resources
        }

        bodies.push(planet)

        // Generate moons (limited)
        if (random(0, 1) < 0.2 && bodies.length < 250) { // Reduced probability
          const moonCount = Math.min(1, Math.floor(random(1, 2))) // Max 1 moon
          for (let k = 0; k < moonCount; k++) {
            const moonDistance = random(5, 10) // Reduced distance
            const moonAngle = planetAngle + random(0, 2 * Math.PI)
            
            const moon: CelestialBody = {
              id: `moon-${i}-${j}-${k}`,
              name: `${planet.name}-M${k + 1}`,
              type: "moon",
              x: planet.x + moonDistance * Math.cos(moonAngle),
              y: planet.y + moonDistance * Math.sin(moonAngle),
              size: random(0.5, 1.5), // Reduced size
              color: `hsl(${random(0, 360)}, 50%, ${random(40, 70)}%)`,
              temperature: random(-250, 200),
              mass: random(0.01, 0.3), // Reduced mass
              distance: moonDistance,
              orbitalPeriod: random(10, 50), // Reduced period
              hasLife: false,
              biodiversity: 0,
              atmosphere: "",
              resources: []
            }

            bodies.push(moon)
          }
        }
      }
    }
  }

  return {
    id: `galaxy-${seed}`,
    name: `Galaxy-${seed.substring(0, 8).toUpperCase()}`,
    seed,
    type,
    size: params.galaxySize,
    starCount,
    bodies,
    age: random(1, 13.8),
    metallicity: random(0.1, 2.0)
  }
}

const CelestialBodyComponent = memo(({ 
  body, 
  onClick, 
  isSelected 
}: { 
  body: CelestialBody, 
  onClick: (body: CelestialBody) => void, 
  isSelected: boolean 
}) => {
  return (
    <div
      className={`absolute rounded-full cursor-pointer transition-all hover:scale-110 ${
        isSelected ? 'ring-2 ring-yellow-400' : ''
      }`}
      style={{
        left: body.x + 200,
        top: body.y + 150,
        width: body.size * 6,
        height: body.size * 6,
        backgroundColor: body.color,
        boxShadow: body.type === "star" ? `0 0 ${body.size * 4}px ${body.color}` : 'none'
      }}
      onClick={() => onClick(body)}
    >
      {body.hasLife && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
      )}
    </div>
  )
})

CelestialBodyComponent.displayName = 'CelestialBodyComponent'

export default function UniverseGenerator() {
  const [galaxy, setGalaxy] = useState<Galaxy | null>(null)
  const [seed, setSeed] = useState(generateSeed())
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null)
  const [params, setParams] = useState<GenerationParams>({
    galaxySize: 100, // Reduced from 200
    starDensity: 0.2, // Reduced from 0.3
    planetProbability: 0.5, // Reduced from 0.7
    lifeProbability: 0.05, // Reduced from 0.1
    complexity: 0.3, // Reduced from 0.5
    fractalIterations: 3 // Reduced from 5
  })

  const canvasRef = useRef<HTMLDivElement>(null)

  const generateUniverse = useCallback(async () => {
    setIsGenerating(true)
    
    // Simulate generation time (reduced from 2000ms to 1000ms)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newGalaxy = generateGalaxy(seed, params)
    setGalaxy(newGalaxy)
    setIsGenerating(false)
  }, [seed, params])

  useEffect(() => {
    generateUniverse()
  }, []) // Only run once on mount

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (!galaxy || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Find clicked celestial body
    const clickedBody = galaxy.bodies.find(body => {
      const distance = Math.sqrt(Math.pow(body.x - x + 200, 2) + Math.pow(body.y - y + 150, 2))
      return distance <= body.size * 3
    })

    setSelectedBody(clickedBody || null)
  }, [galaxy])

  const handleBodyClick = useCallback((body: CelestialBody) => {
    setSelectedBody(body)
  }, [])

  const handleSeedChange = useCallback((newSeed: string) => {
    setSeed(newSeed)
  }, [])

  const handleParamChange = useCallback((newParams: Partial<GenerationParams>) => {
    setParams(prev => ({ ...prev, ...newParams }))
  }, [])

  const getBodyIcon = (type: string) => {
    switch (type) {
      case "star": return <Star className="w-4 h-4" />
      case "planet": return <Globe className="w-4 h-4" />
      case "moon": return <div className="w-4 h-4 rounded-full bg-gray-400" />
      default: return <div className="w-4 h-4 rounded-full bg-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
          <Globe className="relative h-10 w-10 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Universe Generator
          </h2>
          <p className="text-slate-300 mt-1">
            Procedural Space Generation with Fractal Algorithms
          </p>
        </div>
      </div>

      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="generator" className="data-[state=active]:bg-indigo-600">
            <Sparkles className="w-4 h-4 mr-2" />
            Generator
          </TabsTrigger>
          <TabsTrigger value="explorer" className="data-[state=active]:bg-purple-600">
            <Eye className="w-4 h-4 mr-2" />
            Explorer
          </TabsTrigger>
          <TabsTrigger value="params" className="data-[state=active]:bg-blue-600">
            <Settings className="w-4 h-4 mr-2" />
            Parameters
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-green-600">
            <Hash className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Generator Tab */}
        <TabsContent value="generator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Generation Controls */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-400">
                  <Sparkles className="w-5 h-5" />
                  Universe Generation
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Create procedural universes with seed-based generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="seed">Universe Seed</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="seed"
                      value={seed}
                      onChange={(e) => setSeed(e.target.value)}
                      className="bg-slate-700/50 border-slate-600"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSeed(generateSeed())}
                      className="bg-slate-700/50 border-slate-600"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={generateUniverse}
                  disabled={isGenerating}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  {isGenerating ? (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Universe
                    </>
                  )}
                </Button>

                {galaxy && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Galaxy Type</span>
                      <Badge className="bg-indigo-600">{galaxy.type}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Star Count</span>
                      <span className="text-white">{galaxy.starCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Total Bodies</span>
                      <span className="text-white">{galaxy.bodies.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Age</span>
                      <span className="text-white">{galaxy.age.toFixed(1)}B years</span>
                    </div>
                  </div>
                )}

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

            {/* Universe Visualization */}
            <Card className="bg-slate-800/50 border-slate-700 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                  <Eye className="w-5 h-5" />
                  Universe View
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Click on celestial bodies to explore their properties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div 
                    ref={canvasRef}
                    className="relative w-full h-96 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border border-slate-600 rounded-lg overflow-hidden cursor-crosshair"
                    onClick={handleCanvasClick}
                  >
                    {/* Background stars */}
                    {Array.from({ length: 100 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full opacity-50"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animation: `twinkle ${2 + Math.random() * 3}s infinite`
                        }}
                      />
                    ))}

                    {/* Celestial bodies */}
                    {galaxy?.bodies.map((body) => (
                      <CelestialBodyComponent
                        key={body.id}
                        body={body}
                        onClick={handleBodyClick}
                        isSelected={selectedBody?.id === body.id}
                      />
                    ))}
                  </div>

                  {selectedBody && (
                    <Card className="bg-slate-700/50 border-slate-600">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          {getBodyIcon(selectedBody.type)}
                          {selectedBody.name}
                        </CardTitle>
                        <CardDescription className="text-slate-300">
                          {selectedBody.type.charAt(0).toUpperCase() + selectedBody.type.slice(1)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">Temperature:</span>
                            <span className="text-white ml-2">{selectedBody.temperature.toFixed(0)}K</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Mass:</span>
                            <span className="text-white ml-2">{selectedBody.mass.toFixed(2)}M⊕</span>
                          </div>
                          {selectedBody.orbitalPeriod > 0 && (
                            <div>
                              <span className="text-slate-400">Orbital Period:</span>
                              <span className="text-white ml-2">{selectedBody.orbitalPeriod.toFixed(0)} days</span>
                            </div>
                          )}
                          {selectedBody.hasLife && (
                            <div>
                              <span className="text-slate-400">Biodiversity:</span>
                              <span className="text-green-400 ml-2">{selectedBody.biodiversity.toFixed(0)}%</span>
                            </div>
                          )}
                          {selectedBody.atmosphere && (
                            <div>
                              <span className="text-slate-400">Atmosphere:</span>
                              <span className="text-white ml-2">{selectedBody.atmosphere}</span>
                            </div>
                          )}
                          {selectedBody.resources.length > 0 && (
                            <div className="col-span-2">
                              <span className="text-slate-400">Resources:</span>
                              <div className="flex gap-1 mt-1">
                                {selectedBody.resources.map((resource, i) => (
                                  <Badge key={i} className="bg-blue-600 text-xs">
                                    {resource}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Explorer Tab */}
        <TabsContent value="explorer" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Body List */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                  <Eye className="w-5 h-5" />
                  Celestial Bodies
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Explore all generated celestial bodies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {galaxy?.bodies.map((body) => (
                    <div
                      key={body.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                        selectedBody?.id === body.id
                          ? 'border-purple-400 bg-purple-600/20'
                          : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                      }`}
                      onClick={() => setSelectedBody(body)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: body.color }}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-white">{body.name}</div>
                          <div className="text-sm text-slate-400 capitalize">{body.type}</div>
                        </div>
                        {body.hasLife && (
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Detailed View */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Hash className="w-5 h-5" />
                  Detailed Analysis
                </CardTitle>
                <CardDescription className="text-slate-300">
                  In-depth information about selected celestial body
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedBody ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-16 h-16 rounded-full"
                        style={{ backgroundColor: selectedBody.color }}
                      />
                      <div>
                        <h3 className="text-xl font-bold text-white">{selectedBody.name}</h3>
                        <p className="text-slate-300 capitalize">{selectedBody.type}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm text-slate-400">Physical Properties</div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Temperature</span>
                            <span className="text-white">{selectedBody.temperature.toFixed(0)}K</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Mass</span>
                            <span className="text-white">{selectedBody.mass.toFixed(2)}M⊕</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Size</span>
                            <span className="text-white">{selectedBody.size.toFixed(1)} units</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm text-slate-400">Orbital Data</div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Distance</span>
                            <span className="text-white">{selectedBody.distance.toFixed(0)} units</span>
                          </div>
                          {selectedBody.orbitalPeriod > 0 && (
                            <div className="flex justify-between">
                              <span>Period</span>
                              <span className="text-white">{selectedBody.orbitalPeriod.toFixed(0)} days</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {selectedBody.hasLife && (
                      <Alert className="bg-green-600/20 border-green-500">
                        <AlertDescription className="text-green-300">
                          <div className="flex items-center gap-2">
                            <TreePine className="w-4 h-4" />
                            Life detected! Biodiversity level: {selectedBody.biodiversity.toFixed(0)}%
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    {selectedBody.atmosphere && (
                      <div className="space-y-2">
                        <div className="text-sm text-slate-400">Atmosphere</div>
                        <Badge className="bg-cyan-600">{selectedBody.atmosphere}</Badge>
                      </div>
                    )}

                    {selectedBody.resources.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm text-slate-400">Available Resources</div>
                        <div className="flex flex-wrap gap-2">
                          {selectedBody.resources.map((resource, i) => (
                            <Badge key={i} className="bg-orange-600">
                              {resource}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Eye className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Select a celestial body to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Parameters Tab */}
        <TabsContent value="params" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Settings className="w-5 h-5" />
                Generation Parameters
              </CardTitle>
              <CardDescription className="text-slate-300">
                Fine-tune the procedural generation algorithms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="galaxy-size">Galaxy Size</Label>
                    <Slider
                      id="galaxy-size"
                      min={[50]}
                      max={[500]}
                      value={[params.galaxySize]}
                      onValueChange={([value]) => setParams(prev => ({ ...prev, galaxySize: value }))}
                      className="mt-2"
                    />
                    <div className="text-sm text-slate-400 mt-1">{params.galaxySize} units</div>
                  </div>

                  <div>
                    <Label htmlFor="star-density">Star Density</Label>
                    <Slider
                      id="star-density"
                      min={[0.1]}
                      max={[1.0]}
                      step={[0.1]}
                      value={[params.starDensity]}
                      onValueChange={([value]) => setParams(prev => ({ ...prev, starDensity: value }))}
                      className="mt-2"
                    />
                    <div className="text-sm text-slate-400 mt-1">{params.starDensity.toFixed(1)}</div>
                  </div>

                  <div>
                    <Label htmlFor="planet-probability">Planet Probability</Label>
                    <Slider
                      id="planet-probability"
                      min={[0.0]}
                      max={[1.0]}
                      step={[0.1]}
                      value={[params.planetProbability]}
                      onValueChange={([value]) => setParams(prev => ({ ...prev, planetProbability: value }))}
                      className="mt-2"
                    />
                    <div className="text-sm text-slate-400 mt-1">{(params.planetProbability * 100).toFixed(0)}%</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="life-probability">Life Probability</Label>
                    <Slider
                      id="life-probability"
                      min={[0.0]}
                      max={[1.0]}
                      step={[0.05]}
                      value={[params.lifeProbability]}
                      onValueChange={([value]) => setParams(prev => ({ ...prev, lifeProbability: value }))}
                      className="mt-2"
                    />
                    <div className="text-sm text-slate-400 mt-1">{(params.lifeProbability * 100).toFixed(0)}%</div>
                  </div>

                  <div>
                    <Label htmlFor="complexity">Complexity</Label>
                    <Slider
                      id="complexity"
                      min={[0.0]}
                      max={[1.0]}
                      step={[0.1]}
                      value={[params.complexity]}
                      onValueChange={([value]) => setParams(prev => ({ ...prev, complexity: value }))}
                      className="mt-2"
                    />
                    <div className="text-sm text-slate-400 mt-1">{params.complexity.toFixed(1)}</div>
                  </div>

                  <div>
                    <Label htmlFor="fractal-iterations">Fractal Iterations</Label>
                    <Slider
                      id="fractal-iterations"
                      min={[1]}
                      max={[10]}
                      value={[params.fractalIterations]}
                      onValueChange={([value]) => setParams(prev => ({ ...prev, fractalIterations: value }))}
                      className="mt-2"
                    />
                    <div className="text-sm text-slate-400 mt-1">{params.fractalIterations} iterations</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={generateUniverse}
                  disabled={isGenerating}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Apply & Regenerate
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setParams({
                    galaxySize: 200,
                    starDensity: 0.3,
                    planetProbability: 0.7,
                    lifeProbability: 0.1,
                    complexity: 0.5,
                    fractalIterations: 5
                  })}
                  className="bg-slate-700/50 border-slate-600"
                >
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-indigo-400">Total Bodies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {galaxy?.bodies.length || 0}
                </div>
                <p className="text-sm text-slate-400 mt-2">
                  Celestial objects generated
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-green-400">Life Forms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {galaxy?.bodies.filter(b => b.hasLife).length || 0}
                </div>
                <p className="text-sm text-slate-400 mt-2">
                  Bodies with life detected
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-purple-400">Star Systems</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {galaxy?.bodies.filter(b => b.type === "star").length || 0}
                </div>
                <p className="text-sm text-slate-400 mt-2">
                  Stars in the galaxy
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-orange-400">Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {galaxy?.bodies.reduce((sum, body) => sum + body.resources.length, 0) || 0}
                </div>
                <p className="text-sm text-slate-400 mt-2">
                  Total resources available
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Hash className="w-5 h-5" />
                Generation Statistics
              </CardTitle>
              <CardDescription className="text-slate-300">
                Detailed breakdown of generated universe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(
                  galaxy?.bodies.reduce((acc, body) => {
                    acc[body.type] = (acc[body.type] || 0) + 1
                    return acc
                  }, {} as Record<string, number>) || {}
                ).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-white capitalize">{type}s</span>
                    <Badge className="bg-blue-600">{count}</Badge>
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