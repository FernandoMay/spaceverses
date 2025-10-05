"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { 
  Globe, 
  Star, 
  Satellite, 
  Zap, 
  RotateCcw, 
  Play, 
  Pause,
  Settings,
  Maximize,
  Minimize,
  Eye,
  Cube,
  Label
} from "lucide-react"

interface SpaceObject {
  id: string
  type: "planet" | "star" | "satellite" | "asteroid" | "station"
  x: number
  y: number
  z: number
  size: number
  color: string
  rotation: number
  rotationSpeed: number
  orbitRadius: number
  orbitSpeed: number
  orbitAngle: number
}

interface Camera3D {
  x: number
  y: number
  z: number
  rotationX: number
  rotationY: number
  rotationZ: number
  zoom: number
}

export default function Space3DEnvironment() {
  const [objects, setObjects] = useState<SpaceObject[]>([])
  const [camera, setCamera] = useState<Camera3D>({
    x: 0,
    y: 0,
    z: -500,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    zoom: 1
  })
  const [isPlaying, setIsPlaying] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedObject, setSelectedObject] = useState<SpaceObject | null>(null)
  const [showGrid, setShowGrid] = useState(true)
  const [showOrbits, setShowOrbits] = useState(true)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()
  const starsRef = useRef<Array<{id: number, x: number, y: number, size: number, opacity: number}>>([])

  useEffect(() => {
    // Initialize space objects
    const initialObjects: SpaceObject[] = [
      {
        id: "sun",
        type: "star",
        x: 0,
        y: 0,
        z: 0,
        size: 50,
        color: "#FDB813",
        rotation: 0,
        rotationSpeed: 0.5,
        orbitRadius: 0,
        orbitSpeed: 0,
        orbitAngle: 0
      },
      {
        id: "earth",
        type: "planet",
        x: 150,
        y: 0,
        z: 0,
        size: 20,
        color: "#4A90E2",
        rotation: 0,
        rotationSpeed: 2,
        orbitRadius: 150,
        orbitSpeed: 1,
        orbitAngle: 0
      },
      {
        id: "mars",
        type: "planet",
        x: 220,
        y: 0,
        z: 0,
        size: 15,
        color: "#CD5C5C",
        rotation: 0,
        rotationSpeed: 1.8,
        orbitRadius: 220,
        orbitSpeed: 0.8,
        orbitAngle: 45
      },
      {
        id: "satellite-1",
        type: "satellite",
        x: 170,
        y: 0,
        z: 0,
        size: 5,
        color: "#C0C0C0",
        rotation: 0,
        rotationSpeed: 5,
        orbitRadius: 20,
        orbitSpeed: 3,
        orbitAngle: 0
      },
      {
        id: "station",
        type: "station",
        x: 180,
        y: 20,
        z: 10,
        size: 8,
        color: "#FFFFFF",
        rotation: 0,
        rotationSpeed: 1,
        orbitRadius: 30,
        orbitSpeed: 2,
        orbitAngle: 90
      }
    ]
    setObjects(initialObjects)

    // Initialize stars
    const stars = []
    for (let i = 0; i < 100; i++) {
      stars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.7 + 0.3
      })
    }
    starsRef.current = stars

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      // Clean up any remaining event listeners
      document.removeEventListener('mousemove', () => {})
      document.removeEventListener('mouseup', () => {})
    }
  }, [])

  useEffect(() => {
    if (isPlaying) {
      let animationFrameId: number
      
      const animate = () => {
        setObjects(prev => prev.map(obj => {
          let newObj = { ...obj }
          
          // Update rotation
          newObj.rotation += newObj.rotationSpeed
          
          // Update orbital position
          if (obj.orbitRadius > 0) {
            newObj.orbitAngle += obj.orbitSpeed
            const parent = prev.find(o => o.id === (obj.type === "satellite" || obj.type === "station" ? "earth" : "sun"))
            if (parent) {
              newObj.x = parent.x + Math.cos(newObj.orbitAngle * Math.PI / 180) * obj.orbitRadius
              newObj.y = parent.y + Math.sin(newObj.orbitAngle * Math.PI / 180) * obj.orbitRadius
            }
          }
          
          return newObj
        }))
        
        animationFrameId = requestAnimationFrame(animate)
      }
      
      animationFrameId = requestAnimationFrame(animate)
      animationRef.current = animationFrameId
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying])

  const project3D = (x: number, y: number, z: number): { x: number, y: number, scale: number } => {
    // Apply camera transformations
    const cosX = Math.cos(camera.rotationX)
    const sinX = Math.sin(camera.rotationX)
    const cosY = Math.cos(camera.rotationY)
    const sinY = Math.sin(camera.rotationY)
    
    // Translate relative to camera
    const dx = x - camera.x
    const dy = y - camera.y
    const dz = z - camera.z
    
    // Rotate around Y axis
    const x1 = dx * cosY - dz * sinY
    const z1 = dx * sinY + dz * cosY
    
    // Rotate around X axis
    const y1 = dy * cosX - z1 * sinX
    const z2 = dy * sinX + z1 * cosX
    
    // Perspective projection
    const perspective = 800
    const scale = (perspective / (perspective + z2)) * camera.zoom
    
    return {
      x: x1 * scale,
      y: y1 * scale,
      scale
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startY = e.clientY
    const startRotationY = camera.rotationY
    const startRotationX = camera.rotationX

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const deltaY = moveEvent.clientY - startY
      
      setCamera(prev => ({
        ...prev,
        rotationY: startRotationY + deltaX * 0.01,
        rotationX: startRotationX + deltaY * 0.01
      }))
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    
    // Store cleanup function
    const cleanup = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    // Return cleanup function for manual cleanup if needed
    return cleanup
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setCamera(prev => ({
      ...prev,
      zoom: Math.max(0.1, Math.min(3, prev.zoom * delta))
    }))
  }

  const getObjectIcon = (type: string) => {
    switch (type) {
      case "star": return <Star className="w-4 h-4" />
      case "planet": return <Globe className="w-4 h-4" />
      case "satellite": return <Satellite className="w-4 h-4" />
      case "station": return <Cube className="w-4 h-4" />
      default: return <div className="w-4 h-4 rounded-full bg-gray-400" />
    }
  }

  const resetCamera = () => {
    setCamera({
      x: 0,
      y: 0,
      z: -500,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      zoom: 1
    })
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-900' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">3D Space Environment</h3>
          <p className="text-slate-300">Interactive 3D visualization of space objects</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            size="sm"
            onClick={resetCamera}
            className="bg-slate-700/50 border-slate-600"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            onClick={toggleFullscreen}
            className="bg-slate-700/50 border-slate-600"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 3D Viewport */}
        <Card className="bg-slate-800/50 border-slate-700 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-400">
              <Eye className="w-5 h-5" />
              3D Viewport
            </CardTitle>
            <CardDescription className="text-slate-300">
              Click and drag to rotate • Scroll to zoom
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              ref={containerRef}
              className="relative w-full h-96 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border border-slate-600 rounded-lg overflow-hidden cursor-move"
              onMouseDown={handleMouseDown}
              onWheel={handleWheel}
            >
              {/* Grid */}
              {showGrid && (
                <div className="absolute inset-0 opacity-20">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={`h-${i}`} className="absolute w-full h-px bg-white" style={{ top: `${i * 5}%` }} />
                  ))}
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={`v-${i}`} className="absolute h-full w-px bg-white" style={{ left: `${i * 5}%` }} />
                  ))}
                </div>
              )}

              {/* Orbital paths */}
              {showOrbits && objects.map(obj => {
                if (obj.orbitRadius === 0) return null
                const parent = objects.find(o => o.id === (obj.type === "satellite" || obj.type === "station" ? "earth" : "sun"))
                if (!parent) return null
                
                const parentPos = project3D(parent.x, parent.y, parent.z)
                const orbitPoints = []
                for (let angle = 0; angle < 360; angle += 10) {
                  const x = parent.x + Math.cos(angle * Math.PI / 180) * obj.orbitRadius
                  const y = parent.y + Math.sin(angle * Math.PI / 180) * obj.orbitRadius
                  const pos = project3D(x, y, 0)
                  orbitPoints.push(pos)
                }
                
                return (
                  <svg key={`orbit-${obj.id}`} className="absolute inset-0 pointer-events-none">
                    <path
                      d={`M ${orbitPoints.map(p => `${p.x + 200},${p.y + 200}`).join(' L ')}`}
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="1"
                    />
                  </svg>
                )
              })}

              {/* Space objects */}
              {objects.map(obj => {
                const pos = project3D(obj.x, obj.y, obj.z)
                const isVisible = pos.scale > 0
                
                if (!isVisible) return null
                
                return (
                  <div
                    key={obj.id}
                    className={`absolute cursor-pointer transition-all hover:scale-110 ${
                      selectedObject?.id === obj.id ? 'ring-2 ring-yellow-400' : ''
                    }`}
                    style={{
                      left: pos.x + 200,
                      top: pos.y + 200,
                      width: obj.size * pos.scale,
                      height: obj.size * pos.scale,
                      transform: `translate(-50%, -50%) rotate(${obj.rotation}deg)`,
                      zIndex: Math.floor(pos.scale * 100)
                    }}
                    onClick={() => setSelectedObject(obj)}
                  >
                    <div
                      className="w-full h-full rounded-full shadow-lg"
                      style={{
                        backgroundColor: obj.color,
                        boxShadow: obj.type === "star" ? `0 0 ${obj.size * pos.scale}px ${obj.color}` : 'none'
                      }}
                    />
                    {obj.type === "station" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-1/2 h-1 bg-white/80 transform rotate-45" />
                        <div className="w-1/2 h-1 bg-white/80 transform -rotate-45" />
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Stars background */}
              {starsRef.current.map(star => (
                <div
                  key={`star-${star.id}`}
                  className="absolute bg-white rounded-full"
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                    opacity: star.opacity,
                    animation: `twinkle ${2 + Math.random() * 3}s infinite`
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Controls Panel */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-400">
              <Settings className="w-5 h-5" />
              Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-400">Zoom</Label>
              <Slider
                value={[camera.zoom]}
                onValueChange={([value]) => setCamera(prev => ({ ...prev, zoom: value }))}
                min={[0.1]}
                max={[3]}
                step={[0.1]}
                className="w-full"
              />
              <div className="text-xs text-slate-400 text-center">{camera.zoom.toFixed(1)}x</div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Show Grid</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowGrid(!showGrid)}
                  className={`w-12 h-6 p-0 ${showGrid ? 'bg-blue-600' : 'bg-slate-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full transition-transform ${showGrid ? 'translate-x-3' : 'translate-x-0'}`} />
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Show Orbits</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowOrbits(!showOrbits)}
                  className={`w-12 h-6 p-0 ${showOrbits ? 'bg-blue-600' : 'bg-slate-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full transition-transform ${showOrbits ? 'translate-x-3' : 'translate-x-0'}`} />
                </Button>
              </div>
            </div>

            {selectedObject && (
              <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="flex items-center gap-2 mb-2">
                  {getObjectIcon(selectedObject.type)}
                  <span className="font-medium text-white capitalize">{selectedObject.type}</span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>Size: {selectedObject.size} units</div>
                  <div>Distance: {Math.round(Math.sqrt(selectedObject.x**2 + selectedObject.y**2 + selectedObject.z**2))} units</div>
                  <div>Rotation: {selectedObject.rotation.toFixed(1)}°</div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-slate-300">Objects in Scene</h4>
              <div className="space-y-1">
                {objects.map(obj => (
                  <div key={obj.id} className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 capitalize">{obj.type}</span>
                    <Badge variant="secondary" className="text-xs bg-slate-700">
                      {objects.filter(o => o.type === obj.type).length}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}