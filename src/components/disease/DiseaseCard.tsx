import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, AlertTriangle, Info, Loader2, Leaf, Shield, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DiseaseCardProps {
  disease: string;
  confidence: number;
  treatments?: string[];
  isLoading?: boolean;
  error?: string | null;
  severity?: 'low' | 'medium' | 'high';
  description?: string;
  preventionTips?: string[];
  className?: string;
}

const severityConfig = {
  high: {
    color: 'red',
    icon: AlertTriangle,
    title: 'High Severity',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    progressBg: 'bg-red-100',
    progressFill: 'bg-red-500',
    iconColor: 'text-red-500',
  },
  medium: {
    color: 'yellow',
    icon: AlertTriangle,
    title: 'Medium Severity',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    progressBg: 'bg-yellow-100',
    progressFill: 'bg-yellow-500',
    iconColor: 'text-yellow-500',
  },
  low: {
    color: 'green',
    icon: CheckCircle2,
    title: 'Low Severity',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    progressBg: 'bg-green-100',
    progressFill: 'bg-green-500',
    iconColor: 'text-green-500',
  },
} as const;

export function DiseaseCard({ 
  disease, 
  confidence, 
  treatments = [], 
  isLoading = false, 
  error = null,
  severity: propSeverity,
  description,
  preventionTips = [],
  className = ''
}: DiseaseCardProps) {
  const isHealthy = disease.toLowerCase() === 'healthy';
  const severity = propSeverity || (isHealthy ? 'low' : confidence > 70 ? 'high' : 'medium');
  const config = severityConfig[severity];
  const Icon = config.icon;

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("w-full max-w-2xl mx-auto", className)}
      >
        <Card className="border border-blue-100 bg-blue-50/30">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">Analyzing Crop Image</h3>
                <p className="text-sm text-gray-500">This may take a few moments...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn("w-full max-w-2xl mx-auto", className)}
      >
        <Alert variant="destructive" className="border-red-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Detecting Disease</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("w-full max-w-2xl mx-auto", className)}
    >
      <Card className={cn(
        "overflow-hidden transition-all duration-300 border-2",
        config.border,
        config.bg,
        "hover:shadow-md transform hover:-translate-y-0.5"
      )}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className={cn("text-xl font-bold flex items-center", config.text)}>
                <Icon className={cn("h-6 w-6 mr-2.5", config.iconColor)} />
                {disease}
              </CardTitle>
              <CardDescription className={cn("mt-2 text-sm leading-relaxed", config.text)}>
                {isHealthy 
                  ? 'Your plant appears to be healthy and thriving!'
                  : description || `Detected with ${Math.round(confidence)}% confidence.`}
              </CardDescription>
            </div>
            <span className={cn(
              "text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ml-2",
              `bg-${config.color}-100 text-${config.color}-800`
            )}>
              {isHealthy ? 'Healthy Plant' : config.title}
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-6">
          <div className="space-y-4">
            {/* Confidence Meter */}
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-gray-700 flex items-center">
                  <span className={`inline-block w-2 h-2 rounded-full bg-${config.color}-400 mr-1.5`}></span>
                  Confidence Level
                </span>
                <span className="font-semibold">{Math.round(confidence)}%</span>
              </div>
              <div className="relative">
                <div className={`h-2 w-full rounded-full ${config.progressBg} overflow-hidden`}>
                  <motion.div
                    className={`h-full ${config.progressFill} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${confidence}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-1 w-full bg-white/30 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Treatment Recommendations */}
            {!isHealthy && treatments.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-800 flex items-center">
                  <Info className="h-4 w-4 mr-2 text-blue-500" />
                  Recommended Treatments
                </h4>
                <ul className="space-y-2.5">
                  {treatments.map((treatment, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-start group"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <span className={`inline-flex items-center justify-center h-5 w-5 rounded-full bg-${config.color}-50 border-${config.color}-200 border mr-2.5 mt-0.5 flex-shrink-0`}>
                        <span className={`text-xs font-bold text-${config.color}-800`}>
                          {index + 1}
                        </span>
                      </span>
                      <span className="text-gray-700 leading-relaxed">{treatment}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {/* Prevention Tips */}
            {preventionTips && preventionTips.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-800 flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-blue-500" />
                  Prevention Tips
                </h4>
                <ul className="space-y-2.5">
                  {preventionTips.map((tip, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                    >
                      <span className="text-green-500 mr-2 mt-0.5">✓</span>
                      <span className="text-gray-600 text-sm leading-relaxed">{tip}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {/* Healthy Plant Message */}
            {isHealthy && (
              <motion.div 
                className="bg-green-50 border border-green-100 rounded-lg p-4 text-sm text-green-700"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-start">
                  <Leaf className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">Your plant looks healthy!</p>
                    <p className="text-green-600">Continue with your current care routine. Regular monitoring helps maintain plant health.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
