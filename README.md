# virtual-board-math

Pizarra virtual para resolver ejercicios de matemática y física escritos a mano. Usa Gemini 2.5 Flash a través de una Netlify Function que actúa de proxy seguro: la API key vive solo como variable de entorno en Netlify, nunca en el repo.

## Secciones soportadas

Aritmética, Álgebra, Álgebra Matricial, Geometría, Trigonometría, Cálculo Diferencial, Cálculo Integral, Ecuaciones Diferenciales, Estadística, Física, Química.

## Temas de pizarra

- Blanca con cuadrícula
- Tiza verde
- Tiza negra

## Deploy

1. Push a GitHub.
2. Importa el repo en Netlify.
3. En **Site configuration → Environment variables**, agrega `GEMINI_API_KEY` con tu clave de [Google AI Studio](https://aistudio.google.com/apikey).
4. Trigger deploy.
