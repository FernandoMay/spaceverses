"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  BookOpen, 
  Search, 
  HelpCircle, 
  Video, 
  Code, 
  Users, 
  Settings,
  ExternalLink,
  Download,
  Star,
  CheckCircle,
  AlertTriangle,
  Info,
  FileText,
  MessageCircle,
  Github,
  Globe,
  Zap,
  Clock,
  Play
} from "lucide-react"

interface DocumentationSection {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  content: string
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  readTime: number
  lastUpdated: string
  tags: string[]
}

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  helpful: number
}

interface Tutorial {
  id: string
  title: string
  description: string
  duration: number
  type: "video" | "interactive" | "text"
  difficulty: string
  completed: boolean
  url?: string
}

interface GlossaryTerm {
  term: string
  definition: string
  category: string
  relatedTerms: string[]
}

const documentationSections: DocumentationSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Introduction to the Procedural Space Framework",
    icon: <BookOpen className="w-5 h-5" />,
    content: `
# Getting Started with Procedural Space Framework

Welcome to the Procedural Space Framework (PSF), a comprehensive platform that combines AI, blockchain, and procedural generation for next-generation space exploration and simulation.

## What is PSF?

PSF is an integrated system designed for:
- **Exoplanet Detection**: AI-powered identification of exoplanets using NASA datasets
- **Space Habitat Design**: Interactive tools for creating space habitat layouts
- **Universe Generation**: Procedural generation of galaxies, stars, and planets
- **Orbital Mechanics**: Satellite route optimization and management
- **Blockchain Governance**: Decentralized control and resource management

## System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Stable internet connection
- VR headset (optional, for enhanced experiences)
- WebGL enabled browser

## Quick Start

1. **Navigate the Dashboard**: Use the main dashboard to access different modules
2. **Choose Your Challenge**: Select from NASA Space Apps challenges or explore other features
3. **Follow Tutorials**: Use the VR Learning Experience for guided tutorials
4. **Experiment**: Try different parameters and settings in each module

## Key Concepts

### Procedural Generation
PSF uses mathematical algorithms and seed-based generation to create infinite, unique universes. Each universe is generated from a seed value, ensuring reproducibility while allowing for endless variety.

### AI Integration
Machine learning models are used for:
- Exoplanet detection and classification
- Route optimization for satellites
- Resource management and allocation
- Predictive maintenance

### Blockchain Governance
The system implements:
- Proof-of-Orbital-Work (PoOW) consensus mechanism
- Smart contracts for resource management
- Decentralized decision making
- Transparent transaction logging
    `,
    category: "Introduction",
    difficulty: "beginner",
    readTime: 10,
    lastUpdated: "2024-01-15",
    tags: ["introduction", "basics", "overview"]
  },
  {
    id: "exoplanet-detection",
    title: "Exoplanet Detection Guide",
    description: "Complete guide to using AI for exoplanet identification",
    icon: <Zap className="w-5 h-5" />,
    content: `
# Exoplanet Detection with AI

This comprehensive guide covers how to use the AI-powered exoplanet detection system to identify exoplanets from NASA datasets.

## Understanding Exoplanet Detection

### What are Exoplanets?
Exoplanets are planets that orbit stars outside our solar system. They are detected using various methods, with the transit method being the most common.

### The Transit Method
The transit method involves:
1. **Monitoring stellar brightness** over time
2. **Detecting periodic dips** in brightness
3. **Analyzing light curves** for planetary signatures
4. **Confirming discoveries** through follow-up observations

## Using the AI Detection System

### Data Input
The system accepts multiple data formats:
- **CSV files** with time-series brightness data
- **JSON format** for structured data
- **Manual entry** for individual observations
- **NASA dataset integration** for direct access

### AI Model Configuration

#### Model Parameters
- **Confidence Threshold**: Minimum confidence level for detection
- **Orbital Period Range**: Filter for specific period ranges
- **Planetary Radius Range**: Focus on specific size ranges
- **Stellar Properties**: Consider star characteristics

#### Performance Metrics
- **Accuracy**: Overall detection accuracy
- **Precision**: True positive rate
- **Recall**: Detection completeness
- **F1 Score**: Balanced precision and recall

## Data Analysis Workflow

### 1. Data Preparation
- Upload or input your dataset
- Ensure proper formatting
- Check data quality and completeness
- Apply necessary preprocessing

### 2. Model Training/Selection
- Choose appropriate model architecture
- Set hyperparameters
- Train on historical data
- Validate performance

### 3. Detection Process
- Run AI analysis on your data
- Review detection results
- Analyze confidence scores
- Identify potential exoplanets

### 4. Result Interpretation
- Understand detection confidence
- Review light curve analysis
- Consider false positive rates
- Plan follow-up observations

## Best Practices

### Data Quality
- Ensure high signal-to-noise ratio
- Remove systematic errors
- Account for stellar variability
- Use multiple observation cycles

### Model Optimization
- Start with default parameters
- Gradually adjust based on results
- Use cross-validation
- Monitor overfitting

### Result Validation
- Cross-reference with known catalogs
- Consider multiple detection methods
- Account for stellar activity
- Plan follow-up observations

## Troubleshooting

### Common Issues

**Low Detection Rate**
- Check data quality and preprocessing
- Adjust confidence thresholds
- Consider different model architectures
- Increase observation duration

**High False Positive Rate**
- Improve data preprocessing
- Add more validation steps
- Use ensemble methods
- Consider stellar activity patterns

**Performance Issues**
- Reduce dataset size
- Use batch processing
- Optimize model parameters
- Consider cloud processing

## Advanced Features

### Ensemble Methods
Combine multiple AI models for improved accuracy:
- Random Forest
- Neural Networks
- Support Vector Machines
- Gradient Boosting

### Real-time Processing
Process data streams in real-time:
- Live telescope integration
- Automated alerting
- Continuous monitoring
- Adaptive learning

### Integration with NASA Datasets
Direct access to:
- Kepler mission data
- TESS observations
- K2 survey results
- Custom dataset uploads
    `,
    category: "Technical Guide",
    difficulty: "intermediate",
    readTime: 15,
    lastUpdated: "2024-01-14",
    tags: ["AI", "exoplanets", "machine learning", "NASA"]
  },
  {
    id: "habitat-design",
    title: "Space Habitat Design",
    description: "Complete guide to designing space habitats",
    icon: <Settings className="w-5 h-5" />,
    content: `
# Space Habitat Design Guide

This guide covers the complete process of designing space habitats using the interactive habitat layout creator.

## Habitat Design Principles

### Human Factors
- **Crew comfort and well-being**
- **Efficient use of space**
- **Safety considerations**
- **Psychological factors**

### Technical Requirements
- **Life support systems**
- **Power generation and distribution**
- **Thermal control**
- **Waste management**
- **Communication systems**

## Design Process

### 1. Requirements Analysis
#### Mission Parameters
- **Crew size**: Number of inhabitants
- **Mission duration**: Length of stay
- **Destination**: Orbital, lunar, or Martian
- **Activities**: Research, exploration, or colonization

#### Environmental Constraints
- **Radiation protection**
- **Microgravity effects**
- **Thermal extremes**
- **Atmospheric pressure**

### 2. Habitat Configuration

#### Shape Selection
- **Cylindrical**: Most common, efficient use of space
- **Spherical**: Optimal pressure distribution
- **Modular**: Flexible and expandable
- **Inflatable**: Lightweight and compact

#### Size Considerations
- **Volume per crew member**: Minimum 20m³
- **Total habitat volume**: Based on crew size and mission duration
- **Ceiling height**: Minimum 2.1m for comfort
- **Circulation paths**: Minimum 1m width

### 3. Functional Areas

#### Required Spaces
- **Crew Quarters**: Sleeping areas for each crew member
- **Galley/Mess**: Food preparation and dining
- **Medical Bay**: Health monitoring and treatment
- **Exercise Area**: Physical fitness equipment
- **Workshop**: Equipment maintenance and repair
- **Waste Management**: Sanitation and recycling
- **Power Systems**: Energy generation and storage
- **Life Support**: Air and water recycling

#### Optional Spaces
- **Hydroponics**: Food production
- **Laboratory**: Research facilities
- **Recreation**: Leisure activities
- **Storage**: Supplies and equipment
- **Communication**: Mission control interface

### 4. Layout Optimization

#### Space Efficiency
- **Minimize circulation space**
- **Multi-functional areas**
- **Vertical space utilization**
- **Modular design principles**

#### Human Factors
- **Privacy considerations**
- **Noise control**
- **Lighting design**
- **Emergency access**

#### Safety Considerations
- **Emergency exits**
- **Fire suppression**
- **Medical access**
- **Equipment clearance**

## Using the Design Tool

### Interface Overview
- **Canvas area**: Main design space
- **Module palette**: Available habitat modules
- **Properties panel**: Configuration options
- **Validation system**: Real-time feedback

### Design Steps

#### 1. Set Basic Parameters
- Choose habitat shape
- Set dimensions
- Specify crew size
- Define mission duration

#### 2. Add Functional Modules
- Drag modules from palette
- Position on canvas
- Resize as needed
- Connect related areas

#### 3. Configure Modules
- Set specific requirements
- Adjust sizes
- Add equipment
- Define connections

#### 4. Validate Design
- Check space requirements
- Verify safety compliance
- Assess efficiency
- Review constraints

### Best Practices

#### Design Principles
- **Group related functions**
- **Minimize travel distances**
- **Provide clear circulation**
- **Allow for future expansion**

#### Common Mistakes to Avoid
- **Insufficient space allocation**
- **Poor traffic flow**
- **Inadequate storage**
- **Ignoring maintenance access**

## Advanced Features

### Multi-level Design
- Create multiple floors
- Add stairs or ladders
- Optimize vertical space
- Consider weight distribution

### Custom Modules
- Create specialized areas
- Define custom requirements
- Add unique equipment
- Set specific constraints

### Export and Sharing
- Save designs locally
- Export to various formats
- Share with team members
- Collaborate in real-time

## Validation and Compliance

### NASA Standards
- **NASA-STD-3001**: Space habitation standards
- **NASA/TP-2015-218540**: Habitat design guidelines
- **NASA-SP-2010-3407**: Human integration standards

### Safety Requirements
- **Emergency egress**: Multiple exit paths
- **Fire safety**: Suppression systems and materials
- **Medical access**: Reachable from all areas
- **Equipment clearance**: Maintenance access

## Troubleshooting

### Common Issues

**Space Constraints**
- Optimize module sizes
- Consider multi-level design
- Use multi-functional areas
- Reorganize layout

**Validation Failures**
- Review minimum requirements
- Check safety compliance
- Verify circulation paths
- Assess crew needs

**Performance Issues**
- Reduce complexity
- Optimize rendering
- Use simpler modules
- Clear cache data

## Future Developments

### Planned Features
- **VR integration**: Immersive design experience
- **AI optimization**: Automated layout suggestions
- **Collaboration tools**: Real-time teamwork
- **Advanced simulation**: Behavior modeling

### Integration Capabilities
- **CAD software**: Professional design tools
- **BIM integration**: Building information modeling
- **Simulation software**: Performance analysis
- **Mission planning**: Complete mission design
    `,
    category: "Technical Guide",
    difficulty: "intermediate",
    readTime: 20,
    lastUpdated: "2024-01-13",
    tags: ["habitat", "design", "space", "NASA"]
  }
]

const faqItems: FAQItem[] = [
  {
    id: "faq-1",
    question: "What is the Procedural Space Framework?",
    answer: "The Procedural Space Framework (PSF) is a comprehensive platform that combines AI, blockchain, and procedural generation for space exploration and simulation. It includes tools for exoplanet detection, habitat design, universe generation, and satellite management.",
    category: "General",
    helpful: 45
  },
  {
    id: "faq-2",
    question: "How do I start using the exoplanet detection system?",
    answer: "To start using the exoplanet detection system, navigate to the 'Exoplanets' tab in the main dashboard. Upload your data in CSV or JSON format, or use the provided NASA datasets. Configure the AI parameters and click 'Start AI Analysis' to begin detection.",
    category: "Exoplanets",
    helpful: 38
  },
  {
    id: "faq-3",
    question: "What types of habitats can I design?",
    answer: "You can design various types of space habitats including cylindrical, spherical, modular, and inflatable habitats. Each type has different characteristics and is suitable for different mission requirements and environments.",
    category: "Habitat Design",
    helpful: 32
  },
  {
    id: "faq-4",
    question: "How does the universe generator work?",
    answer: "The universe generator uses procedural generation algorithms with seed-based generation. This means that each universe is created from a unique seed value, allowing for infinite variety while ensuring reproducibility. The system uses fractal mathematics and Perlin noise for realistic galaxy and star system generation.",
    category: "Universe Generation",
    helpful: 29
  },
  {
    id: "faq-5",
    question: "What is Proof-of-Orbital-Work (PoOW)?",
    answer: "Proof-of-Orbital-Work (PoOW) is a consensus mechanism specifically designed for satellite networks. It rewards nodes for contributing to orbital stability, network optimization, and resource management. Unlike traditional Proof-of-Work, it focuses on useful computational work related to space operations.",
    category: "Blockchain",
    helpful: 25
  }
]

const tutorials: Tutorial[] = [
  {
    id: "tutorial-1",
    title: "First Steps with PSF",
    description: "Introduction to the Procedural Space Framework interface",
    duration: 10,
    type: "interactive",
    difficulty: "Beginner",
    completed: false
  },
  {
    id: "tutorial-2",
    title: "Exoplanet Detection Basics",
    description: "Learn how to use AI to detect exoplanets from light curve data",
    duration: 15,
    type: "video",
    difficulty: "Beginner",
    completed: false,
    url: "https://example.com/tutorial-exoplanets"
  },
  {
    id: "tutorial-3",
    title: "Designing Your First Habitat",
    description: "Step-by-step guide to creating a space habitat layout",
    duration: 20,
    type: "interactive",
    difficulty: "Intermediate",
    completed: false
  },
  {
    id: "tutorial-4",
    title: "Universe Generation Mastery",
    description: "Advanced techniques for procedural universe generation",
    duration: 25,
    type: "video",
    difficulty: "Advanced",
    completed: false,
    url: "https://example.com/tutorial-universe"
  }
]

const glossaryTerms: GlossaryTerm[] = [
  {
    term: "Exoplanet",
    definition: "A planet that orbits a star outside our solar system.",
    category: "Astronomy",
    relatedTerms: ["Planet", "Star", "Orbit", "Transit Method"]
  },
  {
    term: "Procedural Generation",
    definition: "The programmatic generation of content using algorithms, rather than manually creating everything.",
    category: "Computer Science",
    relatedTerms: ["Algorithm", "Seed", "Fractal", "Perlin Noise"]
  },
  {
    term: "Blockchain",
    definition: "A distributed ledger technology that maintains a continuously growing list of records linked and secured using cryptography.",
    category: "Technology",
    relatedTerms: ["Cryptocurrency", "Smart Contract", "Consensus", "Distributed Ledger"]
  },
  {
    term: "Machine Learning",
    definition: "A subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.",
    category: "AI",
    relatedTerms: ["Neural Network", "Training Data", "Algorithm", "Model"]
  },
  {
    term: "LEO (Low Earth Orbit)",
    definition: "An Earth-centered orbit with an altitude of 2,000 km or less.",
    category: "Space Technology",
    relatedTerms: ["Satellite", "Orbit", "GEO", "MEO"]
  }
]

export default function HelpDocumentation() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDoc, setSelectedDoc] = useState<DocumentationSection | null>(null)

  const filteredDocs = documentationSections.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["all", ...new Set(documentationSections.map(doc => doc.category))]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-600"
      case "intermediate": return "bg-yellow-600"
      case "advanced": return "bg-red-600"
      default: return "bg-gray-600"
    }
  }

  const getTutorialIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="w-4 h-4" />
      case "interactive": return <Settings className="w-4 h-4" />
      case "text": return <FileText className="w-4 h-4" />
      default: return <BookOpen className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
          <BookOpen className="relative h-10 w-10 text-blue-400" />
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Help & Documentation
          </h2>
          <p className="text-slate-300 mt-1">
            Comprehensive guides, tutorials, and support resources
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search documentation, tutorials, and FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="documentation" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="documentation" className="data-[state=active]:bg-blue-600">
            <BookOpen className="w-4 h-4 mr-2" />
            Documentation
          </TabsTrigger>
          <TabsTrigger value="tutorials" className="data-[state=active]:bg-green-600">
            <Video className="w-4 h-4 mr-2" />
            Tutorials
          </TabsTrigger>
          <TabsTrigger value="faq" className="data-[state=active]:bg-purple-600">
            <HelpCircle className="w-4 h-4 mr-2" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="glossary" className="data-[state=active]:bg-orange-600">
            <FileText className="w-4 h-4 mr-2" />
            Glossary
          </TabsTrigger>
        </TabsList>

        {/* Documentation Tab */}
        <TabsContent value="documentation" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-semibold text-white">Documentation</h3>
              <div className="flex gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-blue-600" : "bg-slate-700/50 border-slate-600"}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            <div className="text-sm text-slate-400">
              {filteredDocs.length} document{filteredDocs.length !== 1 ? 's' : ''} found
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Documentation List */}
            <div className="lg:col-span-1 space-y-4">
              {filteredDocs.map((doc) => (
                <Card 
                  key={doc.id} 
                  className={`bg-slate-800/50 border-slate-700 cursor-pointer transition-all hover:scale-105 ${
                    selectedDoc?.id === doc.id ? 'ring-2 ring-blue-400' : ''
                  }`}
                  onClick={() => setSelectedDoc(doc)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="text-blue-400">{doc.icon}</div>
                      <div className="flex-1">
                        <CardTitle className="text-lg text-white">{doc.title}</CardTitle>
                        <CardDescription className="text-slate-300">
                          {doc.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={getDifficultyColor(doc.difficulty)}>
                        {doc.difficulty}
                      </Badge>
                      <span className="text-sm text-slate-400">{doc.readTime} min read</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {doc.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-slate-700">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Documentation Content */}
            <div className="lg:col-span-2">
              {selectedDoc ? (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-blue-400">{selectedDoc.icon}</div>
                        <div>
                          <CardTitle className="text-xl text-white">{selectedDoc.title}</CardTitle>
                          <CardDescription className="text-slate-300">
                            {selectedDoc.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(selectedDoc.difficulty)}>
                          {selectedDoc.difficulty}
                        </Badge>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert max-w-none">
                      <div className="whitespace-pre-wrap text-slate-300 font-mono text-sm leading-relaxed">
                        {selectedDoc.content}
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-slate-700">
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>Category: {selectedDoc.category}</span>
                        <span>Last updated: {selectedDoc.lastUpdated}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400">Select a document to view its contents</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Tutorials Tab */}
        <TabsContent value="tutorials" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tutorials.map((tutorial) => (
              <Card key={tutorial.id} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-white">
                      {getTutorialIcon(tutorial.type)}
                      {tutorial.title}
                    </CardTitle>
                    {tutorial.completed && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                  <CardDescription className="text-slate-300">
                    {tutorial.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-400">{tutorial.duration}m</span>
                      </div>
                      <Badge className="bg-green-600">
                        {tutorial.difficulty}
                      </Badge>
                    </div>
                    <Badge variant="secondary" className="bg-slate-700">
                      {tutorial.type}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      <Play className="w-4 h-4 mr-2" />
                      {tutorial.completed ? "Review" : "Start"}
                    </Button>
                    {tutorial.url && (
                      <Button variant="outline" className="bg-slate-700/50 border-slate-600">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <HelpCircle className="w-5 h-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription className="text-slate-300">
                Find answers to common questions about the Procedural Space Framework
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="border-slate-700">
                    <AccordionTrigger className="text-white hover:text-purple-400">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-300">
                      {faq.answer}
                      <div className="mt-3 flex items-center justify-between">
                        <Badge variant="secondary" className="bg-slate-700">
                          {faq.category}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Star className="w-4 h-4" />
                          {faq.helpful} people found this helpful
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Glossary Tab */}
        <TabsContent value="glossary" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {glossaryTerms.map((term) => (
              <Card key={term.term} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white">{term.term}</CardTitle>
                  <CardDescription className="text-slate-300">
                    {term.category}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-300 mb-3">{term.definition}</p>
                  {term.relatedTerms.length > 0 && (
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Related terms:</div>
                      <div className="flex flex-wrap gap-1">
                        {term.relatedTerms.map((relatedTerm, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-slate-700">
                            {relatedTerm}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Help */}
      <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Need More Help?</h3>
              <p className="text-slate-300">
                Can't find what you're looking for? Our support team is here to help you.
              </p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline" className="bg-slate-700/50 border-slate-600">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
              <Button variant="outline" className="bg-slate-700/50 border-slate-600">
                <Globe className="w-4 h-4 mr-2" />
                Community
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}