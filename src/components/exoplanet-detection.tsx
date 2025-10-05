"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Upload, 
  Brain, 
  BarChart3, 
  Activity, 
  Star, 
  Globe, 
  Zap,
  TrendingUp,
  Target,
  Satellite
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from "recharts"

interface ExoplanetData {
  id: string
  name: string
  orbitalPeriod: number
  transitDuration: number
  planetaryRadius: number
  stellarMass: number
  temperature: number
  confidence: number
  status: "confirmed" | "candidate" | "false_positive"
}

interface AnalysisResult {
  predictions: ExoplanetData[]
  accuracy: number
  processingTime: number
  modelVersion: string
}

const generateMockExoplanetData = (): ExoplanetData[] => {
  return [
    {
      id: "1",
      name: "Kepler-442b",
      orbitalPeriod: 112.3,
      transitDuration: 2.1,
      planetaryRadius: 1.34,
      stellarMass: 0.61,
      temperature: 233,
      confidence: 94.2,
      status: "confirmed"
    },
    {
      id: "2", 
      name: "K2-18b",
      orbitalPeriod: 33.0,
      transitDuration: 2.7,
      planetaryRadius: 2.61,
      stellarMass: 0.36,
      temperature: 265,
      confidence: 87.5,
      status: "candidate"
    },
    {
      id: "3",
      name: "TOI-715b",
      orbitalPeriod: 19.3,
      transitDuration: 1.8,
      planetaryRadius: 1.55,
      stellarMass: 0.37,
      temperature: 281,
      confidence: 92.1,
      status: "confirmed"
    }
  ]
}

const generateLightCurveData = () => {
  const data = []
  // Reduced from 100 to 50 points for better performance
  for (let i = 0; i < 50; i++) {
    const baseValue = 1.0
    const transitDepth = i > 20 && i < 25 ? 0.01 : 0 // Reduced transit range
    const noise = (Math.random() - 0.5) * 0.005
    data.push({
      time: i,
      brightness: baseValue - transitDepth + noise
    })
  }
  return data
}

const generateScatterData = () => {
  const data = []
  // Reduced from 50 to 25 points for better performance
  for (let i = 0; i < 25; i++) {
    data.push({
      orbitalPeriod: Math.random() * 300,
      planetaryRadius: Math.random() * 4,
      confidence: Math.random() * 100,
      status: Math.random() > 0.7 ? "confirmed" : Math.random() > 0.4 ? "candidate" : "false_positive"
    })
  }
  return data
}

export default function ExoplanetDetection() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [uploadedData, setUploadedData] = useState<string>("")
  const [customParameters, setCustomParameters] = useState({
    minOrbitalPeriod: "1",
    maxOrbitalPeriod: "400",
    minRadius: "0.5",
    maxRadius: "4.0",
    confidenceThreshold: "80"
  })

  const [lightCurveData, setLightCurveData] = useState(generateLightCurveData())
  const [scatterData, setScatterData] = useState(generateScatterData())
  
  const debounceTimeout = useRef<NodeJS.Timeout>()

  const updateChartData = useCallback(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }
    
    debounceTimeout.current = setTimeout(() => {
      setLightCurveData(generateLightCurveData())
      setScatterData(generateScatterData())
    }, 500) // 500ms debounce delay
  }, [])

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [])

  const handleAnalyze = useCallback(async () => {
    setIsAnalyzing(true)
    
    try {
      // Reduced simulation time from 3000ms to 1500ms
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockResult: AnalysisResult = {
        predictions: generateMockExoplanetData(),
        accuracy: 94.2,
        processingTime: 1.5, // Reduced processing time
        modelVersion: "ExoAI-v2.1"
      }
      
      setAnalysisResult(mockResult)
      updateChartData() // Update charts with debouncing
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [updateChartData])

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedData(e.target?.result as string)
      }
      reader.readAsText(file)
    }
  }, [])

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-600"
      case "candidate": return "bg-yellow-600"
      case "false_positive": return "bg-red-600"
      default: return "bg-gray-600"
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
          <Satellite className="relative h-10 w-10 text-blue-400" />
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Exoplanet Detection AI
          </h2>
          <p className="text-slate-300 mt-1">
            NASA Space Apps Challenge - AI-Powered Exoplanet Identification
          </p>
        </div>
      </div>

      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="analysis" className="data-[state=active]:bg-blue-600">
            <Brain className="w-4 h-4 mr-2" />
            AI Analysis
          </TabsTrigger>
          <TabsTrigger value="visualization" className="data-[state=active]:bg-purple-600">
            <BarChart3 className="w-4 h-4 mr-2" />
            Data Visualization
          </TabsTrigger>
          <TabsTrigger value="parameters" className="data-[state=active]:bg-green-600">
            <Target className="w-4 h-4 mr-2" />
            Model Parameters
          </TabsTrigger>
        </TabsList>

        {/* AI Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Data Upload */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Upload className="w-5 h-5" />
                  Data Input
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Upload exoplanet data or paste CSV/JSON format
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="file-upload">Upload Data File</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv,.json,.txt"
                    onChange={handleFileUpload}
                    className="mt-2 bg-slate-700/50 border-slate-600"
                  />
                </div>
                
                <div>
                  <Label htmlFor="data-input">Or Paste Data</Label>
                  <Textarea
                    id="data-input"
                    placeholder="Paste your exoplanet data in CSV or JSON format..."
                    value={uploadedData}
                    onChange={(e) => setUploadedData(e.target.value)}
                    className="mt-2 bg-slate-700/50 border-slate-600 min-h-32"
                  />
                </div>

                <Button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !uploadedData}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isAnalyzing ? (
                    <>
                      <Activity className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Start AI Analysis
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <TrendingUp className="w-5 h-5" />
                  Analysis Results
                </CardTitle>
                <CardDescription className="text-slate-300">
                  AI-powered exoplanet detection results
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analysisResult ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Model Accuracy</span>
                          <span className="text-green-400">{analysisResult.accuracy}%</span>
                        </div>
                        <Progress value={analysisResult.accuracy} className="h-2 bg-slate-700" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Processing Time</span>
                          <span className="text-blue-400">{analysisResult.processingTime}s</span>
                        </div>
                        <Progress value={Math.min(analysisResult.processingTime * 20, 100)} className="h-2 bg-slate-700" />
                      </div>
                    </div>

                    <Alert className="bg-blue-600/20 border-blue-500">
                      <AlertDescription className="text-blue-300">
                        Model Version: {analysisResult.modelVersion} | 
                        {analysisResult.predictions.length} exoplanets detected
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-300">Detected Exoplanets</h4>
                      {analysisResult.predictions.map((exoplanet) => (
                        <div key={exoplanet.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <div>
                              <div className="font-medium text-white">{exoplanet.name}</div>
                              <div className="text-sm text-slate-400">
                                Period: {exoplanet.orbitalPeriod}d | Radius: {exoplanet.planetaryRadius}R⊕
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(exoplanet.status)}>
                              {exoplanet.status.replace("_", " ")}
                            </Badge>
                            <span className="text-sm text-green-400">{exoplanet.confidence}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Globe className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Upload data and run analysis to see results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Data Visualization Tab */}
        <TabsContent value="visualization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Light Curve Chart */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                  <Activity className="w-5 h-5" />
                  Transit Light Curve
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Stellar brightness over time showing exoplanet transit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lightCurveData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="time" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                      labelStyle={{ color: "#f1f5f9" }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="brightness" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Scatter Plot */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-400">
                  <BarChart3 className="w-5 h-5" />
                  Parameter Correlation
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Orbital period vs planetary radius with confidence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={scatterData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="orbitalPeriod" stroke="#94a3b8" />
                    <YAxis dataKey="planetaryRadius" stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                      labelStyle={{ color: "#f1f5f9" }}
                    />
                    <Scatter 
                      dataKey="planetaryRadius" 
                      fill="#06b6d4"
                      fillOpacity={0.6}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Model Parameters Tab */}
        <TabsContent value="parameters" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Target className="w-5 h-5" />
                AI Model Parameters
              </CardTitle>
              <CardDescription className="text-slate-300">
                Configure the exoplanet detection algorithm parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="min-period">Min Orbital Period (days)</Label>
                  <Input
                    id="min-period"
                    value={customParameters.minOrbitalPeriod}
                    onChange={(e) => setCustomParameters({...customParameters, minOrbitalPeriod: e.target.value})}
                    className="bg-slate-700/50 border-slate-600"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max-period">Max Orbital Period (days)</Label>
                  <Input
                    id="max-period"
                    value={customParameters.maxOrbitalPeriod}
                    onChange={(e) => setCustomParameters({...customParameters, maxOrbitalPeriod: e.target.value})}
                    className="bg-slate-700/50 border-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min-radius">Min Planetary Radius (R⊕)</Label>
                  <Input
                    id="min-radius"
                    value={customParameters.minRadius}
                    onChange={(e) => setCustomParameters({...customParameters, minRadius: e.target.value})}
                    className="bg-slate-700/50 border-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-radius">Max Planetary Radius (R⊕)</Label>
                  <Input
                    id="max-radius"
                    value={customParameters.maxRadius}
                    onChange={(e) => setCustomParameters({...customParameters, maxRadius: e.target.value})}
                    className="bg-slate-700/50 border-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confidence">Confidence Threshold (%)</Label>
                  <Input
                    id="confidence"
                    value={customParameters.confidenceThreshold}
                    onChange={(e) => setCustomParameters({...customParameters, confidenceThreshold: e.target.value})}
                    className="bg-slate-700/50 border-slate-600"
                  />
                </div>

                <div className="flex items-end">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Zap className="w-4 h-4 mr-2" />
                    Apply Parameters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}