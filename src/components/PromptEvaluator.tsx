import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

// Tipos para la evaluación
export interface CriteriaScore {
  name: string;
  score: number;
  maxScore: number;
  feedback: string;
  found: boolean;
}

export interface EvaluationResult {
  totalScore: number;
  maxScore: number;
  criteria: CriteriaScore[];
  overallFeedback: string;
  grade: 'excelente' | 'bueno' | 'regular' | 'necesita-mejorar';
}

interface PromptEvaluatorProps {
  evaluation: EvaluationResult | null;
}

/**
 * Componente que muestra la evaluación del prompt
 * Incluye puntuación por criterios y retroalimentación
 */
export const PromptEvaluator = ({ evaluation }: PromptEvaluatorProps) => {
  if (!evaluation) return null;

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'excelente': return 'bg-secondary';
      case 'bueno': return 'bg-primary';
      case 'regular': return 'bg-accent';
      default: return 'bg-destructive';
    }
  };

  const getGradeText = (grade: string) => {
    switch (grade) {
      case 'excelente': return 'Excelente';
      case 'bueno': return 'Bueno';
      case 'regular': return 'Regular';
      default: return 'Necesita Mejorar';
    }
  };

  const getCriteriaIcon = (found: boolean, score: number, maxScore: number) => {
    if (score === maxScore) return <CheckCircle2 className="w-5 h-5 text-secondary" />;
    if (found) return <AlertCircle className="w-5 h-5 text-accent" />;
    return <XCircle className="w-5 h-5 text-destructive" />;
  };

  const percentage = (evaluation.totalScore / evaluation.maxScore) * 100;

  return (
    <Card className="p-6 space-y-6 animate-in fade-in-50 duration-500">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Evaluación del Prompt</h3>
          <Badge className={`${getGradeColor(evaluation.grade)} text-white`}>
            {getGradeText(evaluation.grade)}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Puntuación Total</span>
            <span className="font-semibold">
              {evaluation.totalScore} / {evaluation.maxScore}
            </span>
          </div>
          <Progress value={percentage} className="h-3" />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Criterios Evaluados
        </h4>
        {evaluation.criteria.map((criteria, index) => (
          <div 
            key={index} 
            className="space-y-2 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getCriteriaIcon(criteria.found, criteria.score, criteria.maxScore)}
                <span className="font-medium">{criteria.name}</span>
              </div>
              <span className="text-sm font-semibold">
                {criteria.score}/{criteria.maxScore}
              </span>
            </div>
            <p className="text-sm text-muted-foreground pl-7">
              {criteria.feedback}
            </p>
          </div>
        ))}
      </div>

      <div className="p-4 bg-primary/10 border-l-4 border-primary rounded">
        <h4 className="font-semibold mb-2 text-primary">Retroalimentación General</h4>
        <p className="text-sm text-foreground">{evaluation.overallFeedback}</p>
      </div>
    </Card>
  );
};
