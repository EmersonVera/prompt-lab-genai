import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface AIResponseProps {
  response: string | null;
  isLoading: boolean;
}

/**
 * Componente que muestra la respuesta simulada de la IA
 * Incluye animación de carga y formateo del texto
 */
export const AIResponse = ({ response, isLoading }: AIResponseProps) => {
  if (!response && !isLoading) return null;

  return (
    <Card className="p-6 space-y-4 animate-in fade-in-50 duration-500">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-semibold">Respuesta de la IA</h3>
        <Badge variant="outline" className="ml-auto">Simulado</Badge>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
          <div className="h-4 bg-muted rounded animate-pulse w-4/6" />
        </div>
      ) : (
        <div className="prose prose-sm max-w-none">
          <p className="text-foreground whitespace-pre-wrap leading-relaxed">
            {response}
          </p>
        </div>
      )}
    </Card>
  );
};
