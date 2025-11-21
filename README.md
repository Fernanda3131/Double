# Proceso de Software Personal (PSP)

## Acerca de este repositorio

Repositorio para almacenar mis soluciones a las tareas del Proceso de Software Personal.

## Materiales utilizados para realizar las tareas del PSP

- [PSP: Un proceso de automejora para ingenieros de software](https://www.amazon.com/PSP-Self-Improvement-Process-Software-Engineers/dp/0321305493)
- [Cuerpo de Conocimiento del Proceso Personal de Software, Versión 2.0](http://resources.sei.cmu.edu/asset_files/SpecialReport/2009_003_001_15029.pdf)
- [Material de Autoaprendizaje del PSP](http://www.sei.cmu.edu/tsp/tools/studypsp-form.cfm)

## Acerca del PSP (según Wikipedia)

El Proceso Personal de Software (PSP, por sus siglas en inglés) es un proceso estructurado de desarrollo de software diseñado para ayudar a los ingenieros de software a comprender mejor su desempeño y mejorarlo mediante el seguimiento del desarrollo de código previsto y real. El PSP fue creado por Watts Humphrey para aplicar los principios fundamentales del Modelo de Madurez de Capacidades (CMM, por sus siglas en inglés) del Instituto de Ingeniería de Software (SEI, por sus siglas en inglés) a las prácticas de desarrollo de software de un desarrollador individual. Su objetivo es proporcionar a los ingenieros de software las habilidades necesarias para trabajar en un equipo de desarrollo de software (TSP, por sus siglas en inglés).

### Objetivos

El PSP tiene como objetivo proporcionar a los ingenieros de software métodos disciplinados para mejorar sus procesos personales de desarrollo de software. El PSP ayuda a los ingenieros de software a:

- Mejorar sus habilidades de estimación y planificación.
- Asumir compromisos que puedan cumplir.
- Gestionar la calidad de sus proyectos.
- Reducir el número de defectos en su trabajo.

### Estructura del PSP

La formación en PSP sigue un enfoque de mejora evolutiva: un ingeniero que aprende a integrar el PSP en su proceso comienza en el primer nivel (PSP0) y progresa en madurez del proceso hasta el nivel final (PSP2.1). Cada nivel cuenta con guiones detallados, listas de verificación y plantillas para guiar al ingeniero a través de los pasos necesarios y ayudarle a mejorar su propio proceso personal de desarrollo de software. Humphrey anima a los ingenieros con experiencia a personalizar estos guiones y plantillas a medida que comprenden sus propias fortalezas y debilidades.

#### Proceso

La entrada del PSP son los requisitos; el documento de requisitos se completa y se entrega al ingeniero.

#### PSP0, PSP0.1 (Introduce la disciplina y la medición del proceso)

PSP0 tiene 3 fases: planificación, desarrollo (diseño, codificación, compilación y pruebas) y análisis post mortem. Se establece una línea base del proceso actual midiendo: tiempo dedicado a la programación, errores introducidos/eliminados y tamaño del programa. En el análisis post mortem, el ingeniero se asegura de que todos los datos del proyecto se hayan registrado y analizado correctamente. PSP0.1 mejora el proceso añadiendo un estándar de codificación, una medición del tamaño y el desarrollo de un plan de mejora de procesos personal (PIP). En el PIP, el ingeniero registra ideas para mejorar su propio proceso.

#### PSP1, PSP1.1 (Introducción a la estimación y la planificación)

A partir de los datos de referencia recopilados en PSP0 y PSP0.1, el ingeniero estima la magnitud de un nuevo programa y elabora un informe de pruebas (PSP1). Los datos acumulados de proyectos anteriores se utilizan para estimar el tiempo total. En cada nuevo proyecto se registrará el tiempo real empleado. Esta información se utiliza para la planificación y estimación de tareas y cronogramas (PSP1.1).

#### PSP2, PSP2.1 (Introduce la gestión de la calidad y el diseño)

PSP2 añade dos nuevas fases: revisión del diseño y revisión del código. La prevención y eliminación de defectos son el objetivo principal de PSP2. Los ingenieros aprenden a evaluar y mejorar su proceso midiendo la duración de las tareas y el número de defectos introducidos y corregidos en cada fase del desarrollo. Los ingenieros crean y utilizan listas de verificación para las revisiones de diseño y código. PSP2.1 introduce técnicas de especificación y análisis del diseño.

### La importancia de los datos

Uno de los aspectos fundamentales de PSP es el uso de datos históricos para analizar y mejorar el rendimiento del proceso. La recopilación de datos de PSP se apoya en cuatro elementos principales:

- Guiones.
- Métricas.
- Estándares.
- Formularios.

Los guiones de PSP proporcionan una guía experta para seguir los pasos del proceso y un marco para aplicar las métricas de PSP. PSP cuenta con cuatro métricas principales:

- Tamaño: la medida del tamaño de una pieza del producto, como las líneas de código (LOC).
- Esfuerzo: el tiempo necesario para completar una tarea, generalmente registrado en minutos.
- Calidad: el número de defectos en el producto.
- Cronograma: una medida del progreso del proyecto, comparada con las fechas de finalización planificadas y reales.

La aplicación de estándares al proceso garantiza la precisión y la coherencia de los datos. Estos se registran en formularios, normalmente mediante una herramienta de software PSP. El SEI ha desarrollado una herramienta PSP y también existen opciones de código abierto, como Process Dashboard.

Los datos clave que recopila la herramienta PSP son el tiempo, los defectos y el tamaño: el tiempo invertido en cada fase; cuándo y dónde se introdujeron, detectaron y corrigieron los defectos; y el tamaño de las piezas del producto. Los desarrolladores de software utilizan muchas otras métricas derivadas de estas tres básicas para comprender y mejorar su rendimiento. Las medidas derivadas incluyen:

- Precisión de la estimación (tamaño/tiempo)
- Intervalos de predicción (tamaño/tiempo)
- Distribución del tiempo en cada fase
- Distribución de la inyección de defectos
- Distribución de la eliminación de defectos
- Productividad
- Porcentaje de reutilización
- Índice de rendimiento de costos
- Valor planificado
- Valor ganado
- Valor ganado previsto
- Densidad de defectos
- Densidad de defectos por fase
- Tasa de eliminación de defectos por fase
- Apalancamiento de la eliminación de defectos
- Tasas de revisión
- Rendimiento del proceso
- Rendimiento de la fase
- Costo de calidad por falla (COQ)
- COQ de evaluación
- Relación COQ de evaluación/falla

### Planificación y seguimiento

El registro de datos de tiempo, defectos y tamaño es fundamental para la planificación y el seguimiento de proyectos PSP, ya que los datos históricos se utilizan para mejorar la precisión de las estimaciones.

El PSP utiliza el método de Estimación Basada en Proxy (PROBE) para mejorar las habilidades de estimación de los desarrolladores y lograr una planificación de proyectos más precisa. Para el seguimiento de proyectos, el PSP utiliza el método del valor ganado.

El PSP también utiliza técnicas estadísticas, como correlación, regresión lineal y desviación estándar, para transformar los datos en información útil que permita mejorar la estimación, la planificación y la calidad. Estas fórmulas estadísticas son calculadas por la herramienta PSP.

### Calidad

El objetivo del PSP es obtener software de alta calidad, y esta se mide en función de los defectos. Para el PSP, un proceso de calidad debe producir software con pocos defectos que satisfaga las necesidades del usuario.

La estructura de fases del PSP permite a los desarrolladores detectar defectos de forma temprana. Al detectarlos precozmente, el PSP puede reducir el tiempo dedicado a fases posteriores, como las pruebas.

La teoría PSP sostiene que es más económico y eficaz corregir los defectos lo más cerca posible del lugar y momento en que se introdujeron, por lo que se anima a los ingenieros de software a realizar revisiones personales en cada fase del desarrollo. Por lo tanto, la estructura de fases PSP incluye dos fases de revisión:

- Revisión de diseño.
- Revisión de código.

Para realizar una revisión eficaz, es necesario seguir un proceso estructurado. El PSP recomienda el uso de listas de verificación para ayudar a los desarrolladores a seguir un procedimiento ordenado de forma consistente.

El PSP parte de la premisa de que, cuando las personas cometen errores, estos suelen ser predecibles, por lo que los desarrolladores del PSP pueden personalizar sus listas de verificación para identificar sus errores más comunes. También se espera que los ingenieros de software elaboren propuestas de mejora de procesos para identificar áreas de mejora en su desempeño actual. Los datos históricos del proyecto, que muestran cómo se invierte el tiempo y se introducen los defectos, ayudan a los desarrolladores a identificar áreas de mejora.

Asimismo, se espera que los desarrolladores del PSP realicen autoevaluaciones antes de que su trabajo sea sometido a una revisión por pares o por equipo.
📌 Double P

Proyecto Double.p – Aplicación web con frontend y backend.

🚀 Descripción

Double.p es un proyecto diseñado para la gestión de prendas (crear, ver, editar y eliminar), pensado para un entorno web moderno. Incluye un backend (Flask) y un frontend (React).

📂 Estructura del proyecto
Double.p/
│── backend/        # Servidor (Flask o Express)
│── frontend/       # Aplicación React
│── README.md       # Documentación

⚙️ Requisitos previos

Antes de ejecutar el proyecto asegúrate de tener instalado:

Python 3.x

Node.js y npm

Git

(Opcional) MongoDB
 o MySQL según la base de datos usada

▶️ Instalación y ejecución
1. Clonar el repositorio
git clone https://github.com/tu-usuario/Double.p.git
cd Double.p

2. Backend

Entra a la carpeta backend e instala dependencias:

pip install -r requirements.txt   # Si es Flask
# o
npm install                       # Si es Express


Levantar servidor local:

flask run   # Flask
# o
npm start   # Express


Servidor por defecto:

Flask → http://127.0.0.1:5000/

Express → http://localhost:3000/

3. Frontend

Entra a la carpeta frontend:

npm install
npm start


Aplicación en:

http://localhost:3000/

🛠️ Tecnologías usadas

Frontend: React

Backend: Flask / Express

Base de datos: MongoDB / MySQL

Control de versiones: Git + GitHub

👩‍💻 Autores

Equipo Double.p

---

## Instalación en Windows (PowerShell) — pasos recomendados

Recomiendo crear un entorno virtual y usar `pip` para instalar las dependencias listadas en `requirements.txt`.

1) Crear y activar un virtualenv:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
```

2) Instalar dependencias:

```powershell
python -m pip install -r requirements.txt
```

3) Ejecutar el backend:

```powershell
cd backend
python app.py
```

Notas:
- Si la instalación de `Flask-MySQLdb` falla en Windows, `PyMySQL` puede funcionar como reemplazo. El `app.py` intenta instalar `PyMySQL` como `MySQLdb` automáticamente.
- Para envío de correos necesitas `Flask-Mail` y una App Password si usas Gmail; guarda las credenciales en variables de entorno.

Si quieres, puedo añadir un `.env.example` y cambiar `backend/app.py` para leer variables de entorno automáticamente.