"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  BookOpen,
  Rocket,
  Globe,
  Satellite,
  Users,
  Trophy,
  Star,
  Zap,
  Eye,
  Headphones,
  Settings,
  HelpCircle,
  CheckCircle,
  Clock,
  Minimize
} from "lucide-react"

interface LearningModule {
  id: string
  title: string
  description: string
  duration: number
  difficulty: "beginner" | "intermediate" | "advanced"
  category: string
  completed: boolean
  progress: number
  unlocked: boolean
  prerequisites: string[]
  objectives: string[]
  vrMode: boolean
}

interface VRScene {
  id: string
  name: string
  description: string
  type: "spacewalk" | "station_tour" | "planet_exploration" | "satellite_repair"
  duration: number
  difficulty: number
  completed: boolean
  achievements: string[]
}

interface UserProgress {
  level: number
  experience: number
  achievements: string[]
  totalModulesCompleted: number
  totalTimeSpent: number
  currentStreak: number
}

const learningModules: LearningModule[] = [
  {
    id: "intro-space",
    title: "Introduction to Space",
    description: "Learn the basics of space exploration and our solar system",
    duration: 15,
    difficulty: "beginner",
    category: "Basics",
    completed: false,
    progress: 0,
    unlocked: true,
    prerequisites: [],
    objectives: [
      "Identify the planets in our solar system",
      "Understand basic orbital mechanics",
      "Learn about space exploration history"
    ],
    vrMode: true
  },
  {
    id: "satellite-systems",
    title: "Satellite Communication Systems",
    description: "Explore how satellites communicate and transmit data",
    duration: 25,
    difficulty: "intermediate",
    category: "Technology",
    completed: false,
    progress: 0,
    unlocked: false,
    prerequisites: ["intro-space"],
    objectives: [
      "Understand satellite communication principles",
      "Learn about different orbit types",
      "Explore signal transmission methods"
    ],
    vrMode: true
  },
  {
    id: "iss-tour",
    title: "International Space Station Tour",
    description: "Take a virtual tour of the International Space Station",
    duration: 30,
    difficulty: "beginner",
    category: "Stations",
    completed: false,
    progress: 0,
    unlocked: true,
    prerequisites: [],
    objectives: [
      "Explore different ISS modules",
      "Learn about daily life in space",
      "Understand microgravity effects"
    ],
    vrMode: true
  },
  {
    id: "mars-colony",
    title: "Mars Colony Design",
    description: "Design and manage a hypothetical Mars colony",
    duration: 45,
    difficulty: "advanced",
    category: "Colonization",
    completed: false,
    progress: 0,
    unlocked: false,
    prerequisites: ["intro-space", "satellite-systems"],
    objectives: [
      "Design sustainable habitat systems",
      "Manage resources and life support",
      "Plan colony expansion"
    ],
    vrMode: true
  }
]

const vrScenes: VRScene[] = [
  {
    id: "spacewalk-1",
    name: "Spacewalk Training",
    description: "Experience a virtual spacewalk outside the ISS",
    type: "spacewalk",
    duration: 20,
    difficulty: 3,
    completed: false,
    achievements: ["First Steps", "Zero Gravity Master"]
  },
  {
    id: "station-tour-1",
    name: "ISS Complete Tour",
    description: "Comprehensive tour of all ISS modules",
    type: "station_tour",
    duration: 35,
    difficulty: 2,
    completed: false,
    achievements: ["Station Explorer", "Module Expert"]
  },
  {
    id: "mars-surface",
    name: "Mars Surface Exploration",
    description: "Explore the Martian surface in a virtual rover",
    type: "planet_exploration",
    duration: 40,
    difficulty: 4,
    completed: false,
    achievements: ["Mars Pioneer", "Rover Driver"]
  },
  {
    id: "satellite-repair",
    name: "Satellite Repair Mission",
    description: "Repair a malfunctioning satellite in orbit",
    type: "satellite_repair",
    duration: 25,
    difficulty: 5,
    completed: false,
    achievements: ["Repair Specialist", "Orbit Technician"]
  }
]

export default function VRLearningExperience() {
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null)
  const [selectedScene, setSelectedScene] = useState<VRScene | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 1,
    experience: 0,
    achievements: ["Space Explorer"],
    totalModulesCompleted: 0,
    totalTimeSpent: 0,
    currentStreak: 3
  })
  const [currentStep, setCurrentStep] = useState(0)
  const [vrMode, setVrMode] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Auto-select first unlocked module
    const firstUnlocked = learningModules.find(m => m.unlocked && !m.completed)
    if (firstUnlocked) {
      setSelectedModule(firstUnlocked)
    }
  }, [])

  const startModule = (module: LearningModule) => {
    setSelectedModule(module)
    setCurrentStep(0)
    setIsPlaying(true)
  }

  const startVRScene = (scene: VRScene) => {
    setSelectedScene(scene)
    setVrMode(true)
    setIsPlaying(true)
  }

  const completeModule = () => {
    if (selectedModule) {
      const updatedModules = learningModules.map(m => 
        m.id === selectedModule.id 
          ? { ...m, completed: true, progress: 100 }
          : m
      )
      
      // Unlock next modules
      updatedModules.forEach(m => {
        if (m.prerequisites.includes(selectedModule!.id)) {
          m.unlocked = true
        }
      })

      setUserProgress(prev => ({
        ...prev,
        level: prev.level + 1,
        experience: prev.experience + 100,
        totalModulesCompleted: prev.totalModulesCompleted + 1,
        currentStreak: prev.currentStreak + 1
      }))

      setIsPlaying(false)
      setSelectedModule(null)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-600"
      case "intermediate": return "bg-yellow-600"
      case "advanced": return "bg-red-600"
      default: return "bg-gray-600"
    }
  }

  const getSceneTypeIcon = (type: string) => {
    switch (type) {
      case "spacewalk": return <Rocket className="w-4 h-4" />
      case "station_tour": return <Users className="w-4 h-4" />
      case "planet_exploration": return <Globe className="w-4 h-4" />
      case "satellite_repair": return <Satellite className="w-4 h-4" />
      default: return <Eye className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
          <Headphones className="relative h-10 w-10 text-purple-400" />
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            VR Learning Experience
          </h2>
          <p className="text-slate-300 mt-1">
            Immersive Educational Space Training
          </p>
        </div>
      </div>

      {/* User Progress */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-400">
            <Trophy className="w-5 h-5" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{userProgress.level}</div>
              <div className="text-sm text-slate-400">Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{userProgress.experience}</div>
              <div className="text-sm text-slate-400">XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{userProgress.totalModulesCompleted}</div>
              <div className="text-sm text-slate-400">Modules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{userProgress.totalTimeSpent}m</div>
              <div className="text-sm text-slate-400">Time Spent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{userProgress.currentStreak}</div>
              <div className="text-sm text-slate-400">Day Streak</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Level Progress</span>
              <span className="text-sm text-purple-400">{userProgress.experience}/1000 XP</span>
            </div>
            <Progress value={(userProgress.experience % 1000) / 10} className="h-2 bg-slate-700" />
          </div>

          <div className="mt-4">
            <div className="text-sm text-slate-400 mb-2">Recent Achievements</div>
            <div className="flex flex-wrap gap-2">
              {userProgress.achievements.map((achievement, index) => (
                <Badge key={index} className="bg-purple-600">
                  <Star className="w-3 h-3 mr-1" />
                  {achievement}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="modules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="modules" className="data-[state=active]:bg-purple-600">
            <BookOpen className="w-4 h-4 mr-2" />
            Learning Modules
          </TabsTrigger>
          <TabsTrigger value="vr-scenes" className="data-[state=active]:bg-blue-600">
            <Eye className="w-4 h-4 mr-2" />
            VR Scenes
          </TabsTrigger>
        </TabsList>

        {/* Learning Modules Tab */}
        <TabsContent value="modules" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningModules.map((module) => (
              <Card 
                key={module.id} 
                className={`bg-slate-800/50 border-slate-700 transition-all hover:scale-105 ${
                  !module.unlocked ? 'opacity-50' : ''
                } ${selectedModule?.id === module.id ? 'ring-2 ring-purple-400' : ''}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-white">{module.title}</CardTitle>
                    {module.completed && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                  <CardDescription className="text-slate-300">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-400">{module.duration}m</span>
                    </div>
                    <Badge className={getDifficultyColor(module.difficulty)}>
                      {module.difficulty}
                    </Badge>
                  </div>

                  {module.vrMode && (
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-purple-400">VR Available</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="text-sm text-slate-400">Progress</div>
                    <Progress value={module.progress} className="h-2 bg-slate-700" />
                  </div>

                  {module.prerequisites.length > 0 && (
                    <div className="text-xs text-slate-400">
                      Requires: {module.prerequisites.join(", ")}
                    </div>
                  )}

                  <Button
                    onClick={() => startModule(module)}
                    disabled={!module.unlocked}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700"
                  >
                    {module.completed ? "Review" : module.unlocked ? "Start" : "Locked"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Active Module View */}
          {selectedModule && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                  <BookOpen className="w-5 h-5" />
                  {selectedModule.title} - Active Learning
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Interactive learning session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Video/Content Area */}
                  <div className="lg:col-span-2">
                    <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 flex items-center justify-center">
                        <div className="text-center">
                          <Play className="w-16 h-16 text-white/50 mx-auto mb-4" />
                          <p className="text-white/70">Interactive Content</p>
                          <p className="text-white/50 text-sm mt-2">
                            {selectedModule.vrMode ? "VR Mode Available" : "Standard Learning Mode"}
                          </p>
                        </div>
                      </div>
                      
                      {/* VR Mode Toggle */}
                      {selectedModule.vrMode && (
                        <Button
                          size="sm"
                          onClick={() => setVrMode(!vrMode)}
                          className="absolute top-4 right-4 bg-purple-600 hover:bg-purple-700"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          {vrMode ? "Exit VR" : "Enter VR"}
                        </Button>
                      )}

                      {/* Video Controls */}
                      <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4">
                        <Button
                          size="sm"
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="bg-white/20 hover:bg-white/30"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setIsMuted(!isMuted)}
                          className="bg-white/20 hover:bg-white/30"
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </Button>
                        <div className="flex-1">
                          <Progress value={(currentStep / selectedModule.objectives.length) * 100} className="h-1 bg-white/20" />
                        </div>
                        <span className="text-white/70 text-sm">
                          {currentStep + 1} / {selectedModule.objectives.length}
                        </span>
                      </div>
                    </div>

                    {/* Learning Objectives */}
                    <div className="mt-6">
                      <h4 className="font-semibold text-white mb-3">Learning Objectives</h4>
                      <div className="space-y-2">
                        {selectedModule.objectives.map((objective, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              index <= currentStep ? 'bg-green-600 border-green-600' : 'border-slate-600'
                            }`}>
                              {index <= currentStep && <CheckCircle className="w-3 h-3" />}
                            </div>
                            <span className={`text-sm ${index <= currentStep ? 'text-green-400' : 'text-slate-400'}`}>
                              {objective}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Side Panel */}
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <h4 className="font-semibold text-white mb-2">Session Info</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Duration</span>
                          <span className="text-white">{selectedModule.duration}m</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Difficulty</span>
                          <Badge className={getDifficultyColor(selectedModule.difficulty)}>
                            {selectedModule.difficulty}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Category</span>
                          <span className="text-white">{selectedModule.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <h4 className="font-semibold text-white mb-2">Actions</h4>
                      <div className="space-y-2">
                        <Button 
                          className="w-full bg-purple-600 hover:bg-purple-700"
                          onClick={() => setCurrentStep(Math.min(currentStep + 1, selectedModule.objectives.length - 1))}
                          disabled={currentStep >= selectedModule.objectives.length - 1}
                        >
                          Next Step
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full bg-slate-700/50 border-slate-600"
                          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                          disabled={currentStep === 0}
                        >
                          Previous Step
                        </Button>
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={completeModule}
                          disabled={currentStep < selectedModule.objectives.length - 1}
                        >
                          Complete Module
                        </Button>
                      </div>
                    </div>

                    {selectedModule.vrMode && (
                      <Alert className="bg-purple-600/20 border-purple-500">
                        <AlertDescription className="text-purple-300">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            VR mode available for enhanced learning experience
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* VR Scenes Tab */}
        <TabsContent value="vr-scenes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vrScenes.map((scene) => (
              <Card 
                key={scene.id} 
                className={`bg-slate-800/50 border-slate-700 transition-all hover:scale-105 ${
                  selectedScene?.id === scene.id ? 'ring-2 ring-blue-400' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-white">
                      {getSceneTypeIcon(scene.type)}
                      {scene.name}
                    </CardTitle>
                    {scene.completed && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                  <CardDescription className="text-slate-300">
                    {scene.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-400">{scene.duration}m</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < scene.difficulty ? 'text-yellow-400' : 'text-slate-600'}`}
                          fill={i < scene.difficulty ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                  </div>

                  {scene.achievements.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm text-slate-400">Achievements</div>
                      <div className="flex flex-wrap gap-1">
                        {scene.achievements.map((achievement, index) => (
                          <Badge key={index} className="text-xs bg-blue-600">
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => startVRScene(scene)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {scene.completed ? "Replay" : "Start VR Experience"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* VR Experience View */}
          {selectedScene && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Eye className="w-5 h-5" />
                  VR Experience - {selectedScene.name}
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Immersive virtual reality experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* VR Viewport */}
                  <div className="lg:col-span-2">
                    <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30 flex items-center justify-center">
                        <div className="text-center">
                          <div className="relative">
                            <div className="w-32 h-32 bg-blue-500/20 rounded-full animate-pulse"></div>
                            <Eye className="w-16 h-16 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                          </div>
                          <p className="text-white/70 mt-4">VR Mode Active</p>
                          <p className="text-white/50 text-sm mt-2">
                            Use your VR headset or click and drag to look around
                          </p>
                        </div>
                      </div>

                      {/* VR Controls */}
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="bg-white/20 hover:bg-white/30"
                          >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setVrMode(false)}
                            className="bg-white/20 hover:bg-white/30"
                          >
                            <Minimize className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="text-white/70 text-sm">
                          {selectedScene.duration} minutes remaining
                        </div>
                      </div>
                    </div>

                    {/* VR Instructions */}
                    <div className="mt-6 p-4 bg-blue-600/20 border border-blue-500 rounded-lg">
                      <h4 className="font-semibold text-blue-300 mb-2">VR Instructions</h4>
                      <ul className="text-sm text-blue-200 space-y-1">
                        <li>• Use your VR headset for full immersion</li>
                        <li>• Click and drag to look around in desktop mode</li>
                        <li>• Follow the on-screen prompts to complete objectives</li>
                        <li>• Move around using the controller or WASD keys</li>
                      </ul>
                    </div>
                  </div>

                  {/* VR Info Panel */}
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <h4 className="font-semibold text-white mb-2">Experience Info</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Type</span>
                          <span className="text-white capitalize">{scene.type.replace("_", " ")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Duration</span>
                          <span className="text-white">{scene.duration}m</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Difficulty</span>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < scene.difficulty ? 'text-yellow-400' : 'text-slate-600'}`}
                                fill={i < scene.difficulty ? 'currentColor' : 'none'}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <h4 className="font-semibold text-white mb-2">Controls</h4>
                      <div className="space-y-2 text-sm text-slate-300">
                        <div>• Move: WASD or Left Stick</div>
                        <div>• Look: Mouse or Right Stick</div>
                        <div>• Interact: E or A Button</div>
                        <div>• Menu: ESC or Menu Button</div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <h4 className="font-semibold text-white mb-2">Status</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Connection</span>
                          <Badge className="bg-green-600">Connected</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">VR Mode</span>
                          <Badge className="bg-blue-600">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Progress</span>
                          <span className="text-white">45%</span>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      Exit VR Experience
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}