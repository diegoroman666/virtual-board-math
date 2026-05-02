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
    },
    mecanica: {
        label: 'Mecánica Clásica',
        contexto: 'mecánica clásica avanzada: leyes de Newton, mecánica lagrangiana (ecuaciones de Euler-Lagrange L=T-V), mecánica hamiltoniana (H=T+V, ecuaciones canónicas), principio de mínima acción, dinámica de cuerpos rígidos, momento de inercia, oscilaciones armónicas, péndulo simple y físico, gravitación universal de Newton, problema de los dos cuerpos, órbitas keplerianas, mecánica de fluidos básica.'
    },
    fisicaCuantica: {
        label: 'Física Cuántica',
        contexto: 'física cuántica conceptual y de fenómenos: efecto fotoeléctrico (Einstein, E=hf-W), radiación de cuerpo negro (Planck, E=hf), modelo atómico de Bohr (energías E_n=-13.6/n^2 eV), dualidad onda-partícula (de Broglie λ=h/p), experimento de la doble rendija, efecto Compton, cuantización de la energía, niveles atómicos, transiciones electrónicas, emisión y absorción de fotones, láseres, superconductividad, entrelazamiento cuántico.'
    },
    mecanicaCuantica: {
        label: 'Mecánica Cuántica',
        contexto: 'mecánica cuántica formal: ecuación de Schrödinger dependiente e independiente del tiempo, función de onda Ψ y su interpretación probabilística, principio de incertidumbre de Heisenberg ΔxΔp≥ℏ/2, postulados de la mecánica cuántica, operadores hermíticos, valor esperado, pozo de potencial infinito, oscilador armónico cuántico, átomo de hidrógeno, números cuánticos (n, l, ml, ms), espín, principio de exclusión de Pauli, momento angular, notación bra-ket de Dirac ⟨ψ|φ⟩, conmutadores [A,B].'
    },
    computacionCuantica: {
        label: 'Computación Cuántica',
        contexto: 'computación cuántica: qubits y estados |0⟩, |1⟩, superposición α|0⟩+β|1⟩ con |α|²+|β|²=1, entrelazamiento, esfera de Bloch, compuertas cuánticas (Hadamard H, Pauli-X/Y/Z, CNOT, Toffoli, fase S/T), circuitos cuánticos, algoritmo de Deutsch-Jozsa, algoritmo de Grover (búsqueda en O(√N)), algoritmo de Shor (factorización), teleportación cuántica, codificación superdensa, corrección de errores cuánticos, productos tensoriales ⊗, matrices unitarias.'
    },
    astrofisica: {
        label: 'Astrofísica',
        contexto: 'astrofísica con cálculo: leyes de Kepler, gravitación de Newton F=GMm/r², mecánica orbital, velocidad de escape v=√(2GM/r), energía orbital, ley de Stefan-Boltzmann L=4πR²σT⁴, ley de Wien λmax·T=b, magnitud aparente y absoluta, módulo de distancia, paralaje, distancia en años luz y parsecs, evolución estelar, secuencia principal, diagrama HR, agujeros negros (radio de Schwarzschild Rs=2GM/c²), corrimiento al rojo z, ley de Hubble v=H₀d, expansión del universo.'
    },
    astronomia: {
        label: 'Astronomía',
        contexto: 'astronomía observacional con matemática: coordenadas celestes (ecuatoriales: ascensión recta α, declinación δ; horizontales: altura h, azimut A), tiempo sideral, leyes de Kepler (T²=a³ en unidades AU/años), periodo orbital, distancias planetarias en UA, magnitudes estelares m-M=5log(d/10), calendarios juliano y gregoriano, eclipses solares y lunares, fases lunares, mareas, constelaciones, sistemas planetarios.'
    },
    geologia: {
        label: 'Geología',
        contexto: 'geología cuantitativa: tectónica de placas, sismología (escala Richter, magnitud de momento Mw=⅔log₁₀(M₀)-10.7), velocidad de ondas P y S, datación radiométrica con vida media (N=N₀·e^(-λt), donde t½=ln2/λ), edad de rocas con isótopos (U-Pb, K-Ar, C-14), mineralogía, escala de Mohs, geocronología, columna estratigráfica, isostasia, gradiente geotérmico.'
    }
};

const SECTION_KEYS = Object.keys(SECTIONS);

const RESPONSE_SCHEMA = {
    type: "OBJECT",
    properties: {
        seccionDetectada: {
            type: "STRING",
            enum: SECTION_KEYS,
            description: "La sección a la que MEJOR pertenece el ejercicio mostrado en la imagen."
        },
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

function buildSectionsCatalog() {
    return SECTION_KEYS.map(k => `- ${k}: ${SECTIONS[k].label}`).join('\n');
}

function buildPrompt(seccionSugerida) {
    const sugerencia = seccionSugerida
        ? `El usuario eligió manualmente la sección "${seccionSugerida.label}", úsala como pista pero CONFIRMA o CORRIGE según el ejercicio real.`
        : `El usuario no seleccionó sección; clasifícalo tú.`;

    return `
Eres un excelente, didáctico y muy simpático "profe de mate" de un colegio en Chile. Resuelves ejercicios de matemática, física, química, computación cuántica, astrofísica, geología y áreas relacionadas.

PASO 0 — CLASIFICACIÓN AUTOMÁTICA:
Antes de resolver, identifica a CUÁL de estas secciones pertenece el ejercicio mostrado en la imagen y devuelve su clave en el campo "seccionDetectada":

${buildSectionsCatalog()}

${sugerencia}

Reglas para clasificar:
- "fisica" para problemas de mecánica básica (cinemática, Newton, energía, ondas mecánicas, electromagnetismo aplicado).
- "mecanica" SOLO si involucra Lagrange, Hamilton, principio de mínima acción, mecánica de cuerpos rígidos avanzada.
- "fisicaCuantica" para fenómenos cuánticos conceptuales (efecto fotoeléctrico, Bohr, de Broglie, doble rendija).
- "mecanicaCuantica" para formalismo (Schrödinger, función de onda, operadores, bra-ket, Heisenberg).
- "computacionCuantica" si hay qubits, |0⟩, |1⟩, compuertas cuánticas, circuitos.
- "matricial" si hay matrices, determinantes, vectores, sistemas con matrices.
- "calculoDif" si hay derivadas, límites, máximos/mínimos.
- "calculoInt" si hay integrales (∫).
- "ecDif" si hay y', y'', dy/dx con ecuación diferencial.
- "astrofisica" para estrellas, agujeros negros, leyes de Hubble, Stefan-Boltzmann.
- "astronomia" para coordenadas celestes, periodos orbitales, magnitudes estelares.
- "geologia" para datación radiométrica, sismología, tectónica.
- "quimica" si hay fórmulas químicas, balanceo, mol, pH.

═══════════════════════════════════════════════════════════════
LECTURA DE MATRICES Y ESTRUCTURAS 2D — REGLA OBLIGATORIA
═══════════════════════════════════════════════════════════════

CUANDO veas números organizados en un layout 2D (paréntesis, corchetes, o cuadro grande con varios números adentro), DEBES leerlos como matriz, NO como vector fila lineal.

PROCEDIMIENTO para identificar dimensiones de una matriz manuscrita:
1. Identifica el bounding box (paréntesis exterior o corchetes).
2. Agrupa los números por su coordenada VERTICAL (Y) — números a la misma altura están en la MISMA fila.
3. Agrupa los números por su coordenada HORIZONTAL (X) — números en la misma columna vertical están en la MISMA columna.
4. El número de filas = cantidad de "líneas horizontales" de números visibles.
5. El número de columnas = cantidad de números por línea horizontal.

REGLAS DE BIAS PARA EL CONTEXTO MATRICIAL:
- Si la sección es "matricial" o detectas matrices y ves 4 números → muy probablemente es matriz 2×2, NO vector fila 1×4.
- Si ves 9 números → casi seguro 3×3, NO 1×9.
- Si ves 6 números → puede ser 2×3 o 3×2; mira el layout.
- Si ves un patrón de "1, 0, 0, 1" o "1, 0, 0, 0, 1, 0, 0, 0, 1" → SOSPECHA matriz identidad (I_2 o I_3).
- Si ves números con guión o flecha encima → es VECTOR.
- Si ves UNA SOLA fila claramente lineal sin paréntesis altos → es vector fila.

EJEMPLOS:
✅ "(1 0 / 0 1)" escrito en dos filas dentro de un paréntesis → matriz I_2 = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}
✅ "(1 2 3 / 4 5 6 / 7 8 9)" en tres filas → matriz 3×3
❌ NO interpretes "(1 0 0 1)" en un layout cuadrado como vector fila si claramente hay 2 filas visibles.

Si la sección detectada es "matricial", asume por defecto que cualquier conjunto de números entre paréntesis grandes y altos es una matriz 2D, no un vector lineal.

═══════════════════════════════════════════════════════════════

PASO 1 — RESOLUCIÓN:
Una vez clasificado, resuelve el ejercicio así:

1. Transcribe el ejercicio inicial en "ecuacionTranscrita" usando CÓDIGO LATEX PURO (sin signos de dólar).
2. Resuelve PASO A PASO. ¡MUY IMPORTANTE!: NO te saltes el procedimiento. Si hay una división larga, multiplicación, factorización, integración por partes, o cualquier algoritmo, DEBES mostrar el desarrollo completo. No des resultados mágicos: muestra cada manipulación.
3. Por cada paso entrega el cálculo matemático explícito en "calculoMatematico" usando CÓDIGO LATEX PURO.
4. Por cada paso identifica el NOMBRE FORMAL Y LITERAL de la propiedad, regla, teorema o método en "propiedadFormal" (ej: "Regla de la cadena", "Teorema fundamental del cálculo", "Eliminación de Gauss-Jordan", "Segunda Ley de Newton", "Identidad pitagórica", "Compuerta de Hadamard").
5. Explica como un profe chileno en "explicacion": tono amigable, cercano y pedagógico. Expresiones como "ya chiquillos, fíjense bien acá", "ojo con los signos", "simplificamos al tiro".
6. Para Física, Química, Astrofísica, Astronomía y Geología: indica UNIDADES en cada paso y verifica el análisis dimensional al final.
7. Entrega el resultado final en "resultadoFinal" en LATEX PURO, con unidades si corresponde.

═══════════════════════════════════════════════════════════════
REGLAS DE NOTACIÓN MATEMÁTICA — RIGUROSAS Y SIN EXCEPCIÓN
═══════════════════════════════════════════════════════════════

PROHIBIDO ABSOLUTAMENTE escribir matemática en notación de texto plano. La notación matemática DEBE renderizarse perfecta como en un libro de texto formal universitario. Cumple TODAS estas reglas:

A) **EXPONENTES**: Usa SIEMPRE \\(x^{n}\\) en LaTeX, NUNCA "x^n" sin llaves, NUNCA "x**n", NUNCA "x al cuadrado" en lugar de \\(x^{2}\\).
   ✅ CORRECTO: 3^{5}, x^{2}, e^{i\\pi}, (a+b)^{n+1}
   ❌ INCORRECTO: 3^5, x^2, e^ipi, "3 elevado a 5"

B) **SUBÍNDICES**: Usa \\(x_{i}\\), \\(a_{n+1}\\). NUNCA "x_i" sin llaves cuando hay más de un carácter.

C) **FRACCIONES**: Usa SIEMPRE \\frac{a}{b}. JAMÁS escribas "a/b" para una fracción matemática (excepto unidades como m/s).
   ✅ CORRECTO: \\frac{x^{2}+1}{x-3}, \\frac{1}{2}
   ❌ INCORRECTO: (x^2+1)/(x-3), 1/2

D) **RAÍCES**: Usa \\sqrt{x}, \\sqrt[n]{x}. NUNCA "√x" en Unicode ni "sqrt(x)".

E) **INTEGRALES**: Usa \\int, \\int_{a}^{b}, \\iint, \\oint con \\,dx al final. NUNCA "integral de" en texto.

F) **DERIVADAS**: Usa \\frac{d}{dx}, \\frac{\\partial f}{\\partial x}, f'(x), f''(x). NUNCA "df/dx" en texto plano.

G) **LÍMITES**: Usa \\lim_{x \\to a}. NUNCA "lim x->a".

H) **SUMATORIAS Y PRODUCTOS**: Usa \\sum_{i=1}^{n}, \\prod_{i=1}^{n}.

I) **MATRICES**: Usa \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}. JAMÁS uses corchetes ASCII.

J) **VECTORES**: Usa \\vec{v}, \\hat{n}, \\mathbf{F}.

K) **FUNCIONES TRIGONOMÉTRICAS Y ESPECIALES**: SIEMPRE con backslash: \\sin, \\cos, \\tan, \\log, \\ln, \\exp. NUNCA "sin(x)" sin barra.

L) **GREGAS Y SÍMBOLOS**: SIEMPRE en LaTeX: \\alpha, \\beta, \\pi, \\theta, \\Delta, \\infty, \\to, \\leq, \\geq, \\neq, \\approx, \\pm, \\cdot, \\times. JAMÁS Unicode (π, θ, ∞, ≤, ≥) en LaTeX.

M) **MULTIPLICACIÓN**: Usa \\cdot o \\times. NUNCA "*" ni "x" como letra.

N) **NOTACIÓN BRA-KET**: \\langle\\psi|, |\\phi\\rangle, \\langle\\psi|\\hat{H}|\\phi\\rangle.

O) **PRODUCTO TENSORIAL Y CRUZ**: \\otimes, \\times.

═══════════════════════════════════════════════════════════════
DENTRO DE "explicacion" (texto en español):
═══════════════════════════════════════════════════════════════

CUALQUIER expresión matemática dentro de la explicación DEBE estar envuelta en delimitadores LaTeX inline: \\( ... \\)

Ejemplos correctos:
- "Aplicamos la fórmula \\(a^{2} + b^{2} = c^{2}\\) y reemplazamos los datos."
- "Como \\(x \\to 1\\), tenemos que \\(\\cos^{-1}(2x) \\to \\cos^{-1}(2)\\)."
- "El resultado es \\(\\frac{15}{4}\\)."
- "La derivada de \\(\\sin(x)\\) es \\(\\cos(x)\\)."

Ejemplos INCORRECTOS (jamás los escribas así):
- "Aplicamos a^2 + b^2 = c^2"  ← FALTA \\( \\)
- "El 3 elevado a 5 da 243"   ← USA \\(3^{5} = 243\\)
- "x^2 + 1"                     ← USA \\(x^{2} + 1\\)
- "Como x tiende a 1"          ← USA "Como \\(x \\to 1\\)"

NO HAY EXCEPCIONES. Si en una explicación aparece cualquier número con exponente, fracción, símbolo griego, función trigonométrica o cualquier construcción matemática, DEBE ir entre \\( y \\).

Responde estrictamente usando el esquema JSON. Toda la matemática debe ser LaTeX válido y riguroso, listo para renderizar en KaTeX.
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

    const seccion = SECTIONS[sectionKey] || null;

    // gemini-2.5-flash-lite: 15 RPM gratis (vs 10 RPM del flash normal)
    // Sigue siendo multimodal y bueno para mate + visión.
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

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
