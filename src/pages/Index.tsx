import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PromptEvaluator } from "@/components/PromptEvaluator";
import { AIResponse } from "@/components/AIResponse";
import { analyzePrompt, generateSimulatedResponse } from "@/utils/promptAnalyzer";
import { EvaluationResult } from "@/components/PromptEvaluator";
import { Sparkles, Lightbulb, BookOpen, RefreshCw } from "lucide-react";
import { toast } from "sonner";

/**
 * Página principal del Simulador de Prompts
 * Herramienta educativa para aprender a crear prompts efectivos
 */
const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ prompt: string; score: number }>>([]);

  /**
   * Maneja el envío del prompt para evaluación
   */
  const handleSubmit = () => {
    if (!prompt.trim()) {
      toast.error("Por favor, escribe un prompt antes de generar");
      return;
    }

    setIsLoading(true);
    setAiResponse(null);
    setEvaluation(null);

    // Simular un pequeño delay para dar sensación de procesamiento
    setTimeout(() => {
      const result = analyzePrompt(prompt);
      setEvaluation(result);
      
      // Generar respuesta simulada basada en la evaluación
      const response = generateSimulatedResponse(prompt, result);
      setAiResponse(response);
      
      // Guardar en el historial
      setHistory(prev => [...prev, { prompt: prompt.substring(0, 50) + '...', score: result.totalScore }].slice(-5));
      
      setIsLoading(false);
      
      toast.success("Prompt evaluado correctamente");
    }, 1500);
  };

  /**
   * Limpia el formulario y resultados
   */
  const handleReset = () => {
    setPrompt("");
    setEvaluation(null);
    setAiResponse(null);
    toast.info("Formulario reiniciado");
  };

  /**
   * Carga un prompt de ejemplo
   */
  const loadExamplePrompt = () => {
    const example = `Eres un profesor universitario experto en algoritmos de ordenamiento.

Contexto: Estoy preparando una clase para estudiantes de segundo año de Ingeniería de Sistemas sobre algoritmos de ordenamiento. Necesito material didáctico claro y accesible.

Tarea: Explica el algoritmo QuickSort de manera sencilla, usando una analogía con objetos de la vida cotidiana.

Restricciones:
- Máximo 200 palabras
- Incluye un ejemplo paso a paso
- Usa un lenguaje simple, sin jerga técnica excesiva
- Menciona la complejidad temporal de forma breve`;

    setPrompt(example);
    toast.success("Prompt de ejemplo cargado");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Prompt Simulator
                </h1>
                <p className="text-sm text-muted-foreground">
                  Laboratorio de Inteligencia Artificial Generativa
                </p>
              </div>
            </div>
            <Badge variant="outline" className="hidden sm:flex">
              <BookOpen className="w-3 h-3 mr-1" />
              Herramienta Educativa
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Instrucciones */}
          <Card className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-l-4 border-primary">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="font-semibold mb-2">¿Cómo funciona?</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Escribe un prompt en el área de texto. El simulador evaluará tu prompt según 4 criterios clave:
                  <span className="font-medium text-foreground"> Rol, Contexto, Tarea y Restricciones</span>.
                  Recibirás una puntuación y retroalimentación específica para mejorar.
                </p>
              </div>
            </div>
          </Card>

          {/* Editor de Prompt */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Escribe tu Prompt</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadExamplePrompt}
                  className="text-xs"
                >
                  <BookOpen className="w-3 h-3 mr-1" />
                  Ver Ejemplo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  disabled={!prompt && !evaluation}
                  className="text-xs"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Limpiar
                </Button>
              </div>
            </div>

            <Textarea
              placeholder="Ejemplo: Eres un experto en marketing digital. Necesito crear una campaña para redes sociales dirigida a jóvenes de 18-25 años. Genera 5 ideas creativas de publicaciones para Instagram. Cada idea debe ser breve (máximo 2 líneas) y usar un tono cercano y divertido."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[200px] resize-none text-base"
              disabled={isLoading}
            />

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {prompt.length} caracteres
              </span>
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading || !prompt.trim()}
                className="bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Evaluando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generar y Evaluar
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Resultados */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Respuesta de la IA */}
            <div className="space-y-4">
              <AIResponse response={aiResponse} isLoading={isLoading} />
            </div>

            {/* Evaluación */}
            <div className="space-y-4">
              <PromptEvaluator evaluation={evaluation} />
            </div>
          </div>

          {/* Historial */}
          {history.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Historial de Intentos</h3>
              <div className="space-y-2">
                {history.map((item, index) => (
                  <div 
                    key={index}
                    className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <span className="text-sm text-muted-foreground truncate flex-1">
                      {item.prompt}
                    </span>
                    <Badge variant="secondary" className="ml-2">
                      {item.score}/100
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-6 bg-card/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Herramienta educativa para aprender Inteligencia Artificial Generativa
          </p>
          <p className="mt-1">
            Desarrollado para estudiantes de Ingeniería de Sistemas
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
