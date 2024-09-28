"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Save, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts'

type Result = {
  timeImpact: number;
  inconvenienceImpact: number;
  opportunityCostImpact: number;
  errorPotentialImpact: number;
  maintainabilityImpact: number;
  totalImpact: number;
  automationROI: number;
  recommendation: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

const ResponsivePieChart = ({ data }: { data: { name: string; value: number }[] }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props

    return (
      <g>
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill={fill} className="text-lg font-bold">
          {payload.name}
        </text>
        <text x={cx} y={cy} dy={20} textAnchor="middle" fill={fill} className="text-base">
          {`${(percent * 100).toFixed(2)}%`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    )
  }

  return (
    <div className="w-full h-[300px] sm:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="70%"
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={onPieEnter}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function AdvancedTaskOptimizer() {
  const [taskName, setTaskName] = useState<string>("")
  const [timeSpent, setTimeSpent] = useState<number>(1)
  const [frequency, setFrequency] = useState<string>("daily")
  const [inconvenienceFactor, setInconvenienceFactor] = useState<number>(5)
  const [opportunityCost, setOpportunityCost] = useState<number>(5)
  const [automationTime, setAutomationTime] = useState<number>(40)
  const [errorPotential, setErrorPotential] = useState<number>(5)
  const [maintainability, setMaintainability] = useState<number>(5)
  const [result, setResult] = useState<Result | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedResult = localStorage.getItem('taskOptimizerResult')
    if (savedResult) {
      setResult(JSON.parse(savedResult))
    }
  }, [])

  const calculateOptimization = () => {
    const frequencyMultiplier: { [key: string]: number } = {
      hourly: 365 * 24,
      daily: 365,
      weekly: 52,
      monthly: 12,
      yearly: 1
    }
    const annualTimeSpent = timeSpent * frequencyMultiplier[frequency]
    const fiveYearTimeSpent = annualTimeSpent * 5

    const inconvenienceImpact = inconvenienceFactor * 0.2 * fiveYearTimeSpent
    const opportunityCostImpact = opportunityCost * 0.2 * fiveYearTimeSpent
    const errorPotentialImpact = errorPotential * 0.1 * fiveYearTimeSpent
    const maintainabilityImpact = (10 - maintainability) * 0.1 * fiveYearTimeSpent

    const totalImpact = fiveYearTimeSpent + inconvenienceImpact + opportunityCostImpact + errorPotentialImpact + maintainabilityImpact

    const automationROI = totalImpact / (automationTime * 60)

    const recommendation = automationROI > 5 ? "Strongly Recommended" :
                           automationROI > 2 ? "Recommended" :
                           automationROI > 1 ? "Consider Automating" : "Not Recommended"

    const newResult: Result = {
      timeImpact: fiveYearTimeSpent,
      inconvenienceImpact,
      opportunityCostImpact,
      errorPotentialImpact,
      maintainabilityImpact,
      totalImpact,
      automationROI,
      recommendation
    }

    setResult(newResult)
    setShowDetails(false)

    // Smooth scroll to results
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const resetForm = () => {
    setTaskName("")
    setTimeSpent(1)
    setFrequency("daily")
    setInconvenienceFactor(5)
    setOpportunityCost(5)
    setAutomationTime(40)
    setErrorPotential(5)
    setMaintainability(5)
    setResult(null)
  }

  const saveResults = () => {
    if (result) {
      localStorage.setItem('taskOptimizerResult', JSON.stringify(result))
      alert("Results saved successfully!")
    }
  }

  const renderPieChart = () => {
    if (!result) return null

    const data = [
      { name: 'Time', value: result.timeImpact },
      { name: 'Inconvenience', value: result.inconvenienceImpact },
      { name: 'Opportunity', value: result.opportunityCostImpact },
      { name: 'Error', value: result.errorPotentialImpact },
      { name: 'Maintainability', value: result.maintainabilityImpact },
    ]

    return <ResponsivePieChart data={data} />
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold">Advanced Task Optimization Calculator</CardTitle>
        <CardDescription className="text-sm sm:text-base">Determine if you should automate a recurring task based on multiple factors.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); calculateOptimization(); }} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="task-name" className="text-sm sm:text-base">Task Name</Label>
            <Input
              id="task-name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter task name"
              className="text-sm sm:text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time-spent" className="text-sm sm:text-base">Time spent on task (minutes)</Label>
            <Input
              id="time-spent"
              value={timeSpent}
              onChange={(e) => {
                const value = e.target.value;
                setTimeSpent(value === "" ? NaN : Number(value)); // Allow empty input
              }}
              type="number" // Ensures the input is numeric
              className="text-sm sm:text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="frequency" className="text-sm sm:text-base">Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger id="frequency" className="text-sm sm:text-base">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Inconvenience Factor</Label>
            <div className="flex items-center space-x-2">
              <Slider
                value={[inconvenienceFactor]}
                onValueChange={(value) => setInconvenienceFactor(value[0])}
                max={10}
                step={1}
                className="flex-grow"
              />
              <span className="text-sm sm:text-base w-8 text-center">{inconvenienceFactor}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Rate how inconvenient or disruptive the task is (1-10)</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Opportunity Cost</Label>
            <div className="flex items-center space-x-2">
              <Slider
                value={[opportunityCost]}
                onValueChange={(value) => setOpportunityCost(value[0])}
                max={10}
                step={1}
                className="flex-grow"
              />
              <span className="text-sm sm:text-base w-8 text-center">{opportunityCost}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Rate the potential value of time spent elsewhere (1-10)</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="automation-time" className="text-sm sm:text-base">Estimated time to automate (hours)</Label>
            <Input
              id="automation-time"
              type="number"
              defaultValue={automationTime} // Use defaultValue instead of value
              className="text-sm sm:text-base"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Error Potential</Label>
            <div className="flex items-center space-x-2">
              <Slider
                value={[errorPotential]}
                onValueChange={(value) => setErrorPotential(value[0])}
                max={10}
                step={1}
                className="flex-grow"
              />
              <span className="text-sm sm:text-base w-8 text-center">{errorPotential}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Rate the potential for errors in manual process (1-10)</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Maintainability</Label>
            <div className="flex items-center space-x-2">
              <Slider
                value={[maintainability]}
                onValueChange={(value) => setMaintainability(value[0])}
                max={10}
                step={1}
                className="flex-grow"
              />
              <span className="text-sm sm:text-base w-8 text-center">{maintainability}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Rate how easy it would be to maintain the automated solution (1-10)</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button type="submit" className="flex-1">Calculate Optimization</Button>
            <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </form>
        <AnimatePresence>
          {result && (
            <motion.div
              ref={resultRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="mt-6 space-y-4"
            >
              <h3 className="text-lg font-semibold">Results</h3>
              {renderPieChart()}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Total Impact:</p>
                  <p className="font-bold">{Math.round(result.totalImpact)} minutes</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Automation ROI:</p>
                  <p className="font-bold">{result.automationROI.toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Recommendation:</p>
                  <p className="font-bold">{result.recommendation}</p>
                </div>
              </div>
              <Button
                onClick={() => setShowDetails(!showDetails)}
                variant="outline"
                className="w-full flex justify-between items-center text-sm"
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
                {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <p>Time Impact:</p>
                      <p className="text-right">{Math.round(result.timeImpact)} min</p>
                      <p>Inconvenience:</p>
                      <p className="text-right">{Math.round(result.inconvenienceImpact)} min</p>
                      <p>Opportunity Cost:</p>
                      <p className="text-right">{Math.round(result.opportunityCostImpact)} min</p>
                      <p>Error Potential:</p>
                      <p className="text-right">{Math.round(result.errorPotentialImpact)} min</p>
                      <p>Maintainability:</p>
                      <p className="text-right">{Math.round(result.maintainabilityImpact)} min</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <Button onClick={saveResults} className="w-full text-sm">
                <Save className="w-4 h-4 mr-2" />
                Save Results
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
