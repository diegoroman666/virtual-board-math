// Netlify Function: proxy seguro a la API de Gemini.
// La API key NUNCA está en el código ni llega al navegador:
// vive como variable de entorno GEMINI_API_KEY en el panel de Netlify.

const SECTIONS = {
    aritmetica: {
        label: 'Aritmética',
        contexto: 'operaciones básicas (suma, resta, multiplicación, división con algoritmo paso a paso), fracciones (suma, resta, multiplicación, división, simplificación), decimales, potencias y raíces, jerarquía de operaciones (PAPOMUDAS), regla de tres simple y compuesta, porcentajes, proporciones, mínimo común múltiplo y máximo común divisor.'
    },
    algebra: {
        label: 'Álgebra',
        contexto: 'reducción de términos semejantes, ecuaciones lineales y cuadráticas (fórmula general, completación de cuadrados, factorización), sistemas de ecuaciones lineales (igualación, sustitución, reducción), factorización (factor común, trinomio cuadrado perfecto, suma/diferencia de cubos, agrupación), productos notables, polinomios (suma, resta, multiplicación, división sintética/Ruffini), inecuaciones, valor absoluto, logaritmos y exponenciales, progresiones aritméticas y geométricas.'
    },
    matricial: {
        label: 'Álgebra Matricial',
        contexto: 'álgebra lineal y matrices: suma, resta y multiplicación de matrices, matriz transpuesta, determinantes (regla de Sarrus, expansión por cofactores), matriz inversa (método de cofactores y por Gauss-Jordan), regla de Cramer, eliminación de Gauss y Gauss-Jordan, rango de una matriz, sistemas de ecuaciones (compatibles determinados/indeterminados/incompatibles), espacios vectoriales, dependencia e independencia lineal, vectores en R2 y R3, producto punto, producto cruz, ángulo entre vectores, valores y vectores propios.'
    },
    geometria: {
        label: 'Geometría',
        contexto: 'áreas y perímetros de figuras planas, volúmenes y áreas de sólidos (prismas, pirámides, cilindros, conos, esferas), teorema de Pitágoras y sus aplicaciones, semejanza y congruencia de triángulos, geometría analítica: distancia entre puntos, punto medio, ecuación de la recta (pendiente-intersecto, punto-pendiente, general), rectas paralelas y perpendiculares, ecuación de la circunferencia, parábola, elipse, hipérbola.'
    },
    trigonometria: {
        label: 'Trigonometría',
        contexto: 'razones trigonométricas (seno, coseno, tangente, cotangente, secante, cosecante), círculo unitario, ángulos en grados y radianes, identidades fundamentales (pitagóricas, de suma y resta, de ángulo doble y mitad), ecuaciones trigonométricas, ley de senos, ley de cosenos, gráficas de funciones trigonométricas (amplitud, periodo, desfase), funciones trigonométricas inversas.'
    },
    calculoDif: {
        label: 'Cálculo Diferencial',
        contexto: 'cálculo infinitesimal diferencial: límites (laterales, al infinito, indeterminaciones 0/0, ∞/∞, ∞-∞, 0·∞, regla de L\'Hôpital), continuidad de funciones, derivadas por definición y por reglas (suma, producto, cociente, regla de la cadena), derivadas de funciones trascendentes (trigonométricas, exponenciales, logarítmicas, inversas), derivación implícita, derivadas de orden superior, máximos y mínimos absolutos y relativos, criterio de la primera y segunda derivada, puntos de inflexión, optimización, teorema del valor medio, razón de cambio relacionada.'
    },
    calculoInt: {
        label: 'Cálculo Integral',
        contexto: 'cálculo infinitesimal integral: integrales indefinidas (antiderivadas), técnicas de integración (sustitución/cambio de variable, integración por partes con regla LIATE, fracciones parciales, sustitución trigonométrica, integrales trigonométricas), integrales definidas, teorema fundamental del cálculo, área bajo la curva y entre curvas, volúmenes de revolución (discos, anillos, capas/cascarones), longitud de arco, área de superficie de revolución, integrales impropias, series numéricas y de potencias.'
    },
    ecDif: {
        label: 'Ecuaciones Diferenciales',
        contexto: 'ecuaciones diferenciales ordinarias (EDO): EDO de primer orden (variables separables, lineales con factor integrante, exactas, homogéneas, Bernoulli), EDO lineales de segundo orden con coeficientes constantes (homogéneas y no homogéneas, método de coeficientes indeterminados y variación de parámetros), problemas de valor inicial, sistemas de EDO lineales, transformada de Laplace y su inversa, aplicaciones (resortes, circuitos RLC, crecimiento poblacional, ley de enfriamiento de Newton).'
    },
    estadistica: {
        label: 'Estadística',
        contexto: 'estadística y probabilidad: medidas de tendencia central (media, mediana, moda), medidas de dispersión (rango, varianza, desviación estándar, coeficiente de variación), distribuciones de probabilidad discretas (binomial, Poisson, geométrica) y continuas (normal, t-Student, chi-cuadrado), permutaciones y combinaciones, probabilidad condicional, teorema de Bayes, intervalos de confianza, pruebas de hipótesis, regresión lineal y correlación.'
    },
    fisica: {
        label: 'Física',
        contexto: 'física general con énfasis en matemática aplicada: cinemática (MRU, MRUA, caída libre, lanzamiento de proyectiles), dinámica (leyes de Newton, fricción, plano inclinado), trabajo, energía cinética y potencial, conservación de la energía, momentum lineal e impulso, choques elásticos e inelásticos, dinámica rotacional, ondas mecánicas, sonido, óptica geométrica, electricidad (Ley de Coulomb, campo eléctrico, potencial, capacitancia, Ley de Ohm, leyes de Kirchhoff, circuitos RC), magnetismo y electromagnetismo, termodinámica. SIEMPRE: identifica datos con sus unidades del SI, escribe la fórmula formal, reemplaza valores y entrega el resultado con la unidad correspondiente.'
    },
    quimica: {
        label: 'Química',
        contexto: 'química con foco en cálculo: estequiometría, balanceo de ecuaciones químicas (método algebraico, ion electrón), mol y masa molar, número de Avogadro, concentraciones (molaridad, molalidad, normalidad, % m/m, % m/v, ppm), gases ideales (PV=nRT), pH y pOH, equilibrio químico (Kc, Kp), termoquímica (entalpía, ley de Hess).'
    }
};

const RESPONSE_SCHEMA = {
    type: "OBJECT",
    properties: {
        ecuacionTranscrita: { type: "STRING" },
        pasos: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    calculoMatematico: { type: "STRING" },
                    propiedadFormal: { type: "STRING" },
                    explicacion: { type: "STRING" }
                }
            }
        },
        resultadoFinal: { type: "STRING" }
    }
};

function buildPrompt(seccion) {
    return `
Eres un excelente, didáctico y muy simpático "profe de mate" de un colegio en Chile, especializado en la siguiente sección: **${seccion.label.toUpperCase()}**.

CONTEXTO DE LA SECCIÓN (usa estos conocimientos como referencia principal):
${seccion.contexto}

Analiza la imagen adjunta que contiene un ejercicio escrito a mano en una pizarra.

Tareas:
1. Transcribe el ejercicio inicial usando CÓDIGO LATEX PURO (sin signos de dólar). Si es física o química, transcribe el enunciado y ordena los datos.
2. Resuelve el ejercicio PASO A PASO. ¡MUY IMPORTANTE!: NO te saltes el procedimiento de los cálculos. Si hay una división larga, multiplicación, factorización, integración por partes, o cualquier algoritmo, DEBES mostrar el desarrollo completo. No des resultados mágicos: muestra cada manipulación.
3. Por cada paso entrega el cálculo matemático explícito en CÓDIGO LATEX PURO. Para matrices usa \\begin{pmatrix}...\\end{pmatrix}. Para integrales \\int. Para sumas \\sum. Para derivadas \\frac{d}{dx} o notación de Leibniz. Para vectores \\vec{v}.
4. Por cada paso identifica el NOMBRE FORMAL Y LITERAL de la propiedad, regla, teorema o método utilizado (ej: "Regla de la cadena", "Teorema fundamental del cálculo", "Eliminación de Gauss-Jordan", "Segunda Ley de Newton", "Identidad pitagórica", "Fórmula general de la cuadrática"). Esto es CRUCIAL para refrescar la memoria formal del alumno.
5. Por cada paso entrega una explicación EXACTAMENTE como lo explicaría un profe chileno en la sala. Tono amigable, cercano y pedagógico. Puedes usar expresiones moderadas como "ya chiquillos, fíjense bien acá", "pasamos al otro lado con la operación contraria", "ojo con la regla de los signos", "simplificamos al tiro", etc.
6. Si la sección es Física o Química, indica las UNIDADES en cada paso y verifica el análisis dimensional al final.
7. Entrega el resultado final en CÓDIGO LATEX PURO, con unidades si corresponde.

Importante: Responde estrictamente usando el esquema JSON proporcionado. Asegúrate de que TODA la matemática sea sintaxis LaTeX válida.
`;
}

exports.handler = async (event) => {
    // Solo POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Servidor mal configurado: falta GEMINI_API_KEY' })
        };
    }

    let body;
    try {
        body = JSON.parse(event.body || '{}');
    } catch (e) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'JSON inválido' })
        };
    }

    const { base64Image, sectionKey } = body;

    if (!base64Image || typeof base64Image !== 'string') {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Falta base64Image' })
        };
    }

    // Limite tamaño imagen para evitar abuso (≈ 6 MB en base64)
    if (base64Image.length > 8_000_000) {
        return {
            statusCode: 413,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Imagen demasiado grande' })
        };
    }

    const seccion = SECTIONS[sectionKey] || SECTIONS.aritmetica;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{
            role: "user",
            parts: [
                { text: buildPrompt(seccion) },
                { inlineData: { mimeType: "image/png", data: base64Image } }
            ]
        }],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: RESPONSE_SCHEMA
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('Gemini error:', response.status, errText);
            return {
                statusCode: response.status,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: `Gemini API error ${response.status}` })
            };
        }

        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!jsonText) {
            return {
                statusCode: 502,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Respuesta vacía del modelo' })
            };
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
            },
            body: jsonText
        };
    } catch (err) {
        console.error('Function error:', err);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Error interno' })
        };
    }
};
