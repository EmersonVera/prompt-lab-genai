import { EvaluationResult, CriteriaScore } from "@/components/PromptEvaluator";

/**
 * Analiza un prompt y evalúa su calidad según 4 criterios:
 * - Rol: ¿Define un rol o perspectiva para la IA?
 * - Contexto: ¿Proporciona información de fondo relevante?
 * - Tarea: ¿Especifica claramente qué debe hacer la IA?
 * - Restricciones: ¿Incluye limitaciones o requisitos específicos?
 */
export const analyzePrompt = (prompt: string): EvaluationResult => {
  const lowerPrompt = prompt.toLowerCase();
  const criteria: CriteriaScore[] = [];

  // 1. Evaluar ROL (25 puntos)
  const rolKeywords = [
    'eres', 'actúa como', 'rol', 'experto', 'especialista', 
    'profesor', 'tutor', 'consultor', 'asistente', 'eres un'
  ];
  const hasRol = rolKeywords.some(keyword => lowerPrompt.includes(keyword));
  const rolScore = hasRol ? 25 : 0;
  
  criteria.push({
    name: 'Rol',
    score: rolScore,
    maxScore: 25,
    feedback: hasRol 
      ? '✓ Buen trabajo definiendo un rol para la IA.'
      : '✗ Intenta especificar un rol (ej: "Eres un experto en..."). Esto ayuda a la IA a adoptar la perspectiva correcta.',
    found: hasRol
  });

  // 2. Evaluar CONTEXTO (25 puntos)
  const contextIndicators = [
    'contexto:', 'para', 'porque', 'con el fin de', 'objetivo',
    'necesito', 'estoy', 'proyecto', 'trabajo', 'curso'
  ];
  const hasContext = contextIndicators.some(keyword => lowerPrompt.includes(keyword)) 
                    || prompt.split(' ').length > 15; // Prompts largos suelen tener más contexto
  const contextScore = hasContext ? 25 : 0;
  
  criteria.push({
    name: 'Contexto',
    score: contextScore,
    maxScore: 25,
    feedback: hasContext
      ? '✓ Proporcionas contexto útil para la IA.'
      : '✗ Añade información de fondo relevante. Explica por qué necesitas esto o en qué situación lo usarás.',
    found: hasContext
  });

  // 3. Evaluar TAREA (25 puntos)
  const taskKeywords = [
    'crea', 'genera', 'escribe', 'explica', 'describe', 'analiza',
    'resume', 'lista', 'compara', 'diseña', 'desarrolla', 'traduce',
    'corrige', 'mejora', 'sugiere', 'proporciona'
  ];
  const hasTask = taskKeywords.some(keyword => lowerPrompt.includes(keyword));
  const taskScore = hasTask ? 25 : 0;
  
  criteria.push({
    name: 'Tarea',
    score: taskScore,
    maxScore: 25,
    feedback: hasTask
      ? '✓ La tarea está claramente especificada.'
      : '✗ Define claramente qué quieres que haga la IA usando verbos de acción (genera, explica, crea, etc.).',
    found: hasTask
  });

  // 4. Evaluar RESTRICCIONES (25 puntos)
  const restrictionKeywords = [
    'máximo', 'mínimo', 'no más de', 'al menos', 'debe', 'no debe',
    'formato', 'estilo', 'tono', 'longitud', 'palabras', 'párrafos',
    'incluye', 'evita', 'usa', 'no uses', 'requisitos', 'restricciones'
  ];
  const hasRestrictions = restrictionKeywords.some(keyword => lowerPrompt.includes(keyword));
  const restrictionsScore = hasRestrictions ? 25 : 0;
  
  criteria.push({
    name: 'Restricciones',
    score: restrictionsScore,
    maxScore: 25,
    feedback: hasRestrictions
      ? '✓ Incluyes restricciones específicas.'
      : '✗ Añade restricciones o requisitos (ej: longitud, formato, tono, qué incluir/evitar).',
    found: hasRestrictions
  });

  // Calcular puntuación total
  const totalScore = criteria.reduce((sum, c) => sum + c.score, 0);
  const maxScore = 100;

  // Determinar calificación general
  let grade: 'excelente' | 'bueno' | 'regular' | 'necesita-mejorar';
  let overallFeedback: string;

  if (totalScore >= 90) {
    grade = 'excelente';
    overallFeedback = '¡Excelente prompt! Has incluido todos los elementos clave. Este tipo de prompt generará respuestas de alta calidad y muy específicas a tus necesidades.';
  } else if (totalScore >= 70) {
    grade = 'bueno';
    overallFeedback = 'Buen prompt. Has cubierto la mayoría de los elementos importantes. Considera agregar más detalles en los criterios faltantes para obtener respuestas aún más precisas.';
  } else if (totalScore >= 50) {
    grade = 'regular';
    overallFeedback = 'Prompt regular. Hay elementos importantes que faltan. Intenta ser más específico sobre el rol, contexto o restricciones para mejorar la calidad de las respuestas.';
  } else {
    grade = 'necesita-mejorar';
    overallFeedback = 'El prompt necesita mejoras significativas. Un buen prompt debe incluir: un rol claro, contexto relevante, una tarea específica y restricciones útiles. Revisa los criterios faltantes.';
  }

  return {
    totalScore,
    maxScore,
    criteria,
    overallFeedback,
    grade
  };
};

/**
 * Genera una respuesta simulada de IA basada en la calidad del prompt
 * Cuanto mejor el prompt, más detallada y relevante será la respuesta
 */
export const generateSimulatedResponse = (prompt: string, evaluation: EvaluationResult): string => {
  const { totalScore, grade } = evaluation;

  // Respuestas basadas en la calidad del prompt
  if (grade === 'excelente') {
    return `Como experto en el tema que has definido, he analizado cuidadosamente tu solicitud.

Basándome en el contexto específico que proporcionaste y considerando las restricciones que mencionaste, aquí está mi respuesta detallada:

[Esta sería una respuesta altamente personalizada y específica a tu solicitud. La IA tendría toda la información necesaria para proporcionar una respuesta precisa y útil.]

Tu prompt fue claro y completo, lo que me permitió entender exactamente qué necesitas y cómo estructurar mi respuesta. He tomado en cuenta todos los detalles que especificaste.

¿Hay algo específico que te gustaría que profundice o ajuste en esta respuesta?`;
  }

  if (grade === 'bueno') {
    return `He procesado tu solicitud. Aquí está mi respuesta:

[Esta sería una respuesta relevante pero podría ser más específica. La IA tiene información suficiente para dar una respuesta útil, pero algunos detalles adicionales mejorarían la precisión.]

Tu prompt incluye elementos importantes, aunque añadir más detalles sobre ${evaluation.criteria.find(c => c.score < 25)?.name.toLowerCase() || 'algunos aspectos'} podría generar una respuesta más precisa.

¿Necesitas que ajuste algo en mi respuesta?`;
  }

  if (grade === 'regular') {
    return `Entiendo que necesitas ayuda con: "${prompt.substring(0, 50)}..."

[Esta sería una respuesta genérica. La IA haría suposiciones sobre lo que realmente necesitas porque el prompt no proporciona suficiente información.]

Para darte una respuesta más útil y específica, sería beneficioso que incluyeras:
${evaluation.criteria.filter(c => c.score < 25).map(c => `- ${c.feedback}`).join('\n')}

Esto me ayudaría a entender mejor tus necesidades específicas.`;
  }

  // necesita-mejorar
  return `He recibido tu mensaje, pero necesito más información para ayudarte efectivamente.

[La respuesta sería muy vaga y general porque el prompt no proporciona suficiente contexto o especificaciones.]

Para poder asistirte mejor, por favor considera:

${evaluation.criteria.filter(c => c.score < 25).map((c, i) => `${i + 1}. ${c.feedback}`).join('\n\n')}

Un prompt bien estructurado me permite darte exactamente lo que necesitas. ¿Podrías proporcionar más detalles?`;
};
