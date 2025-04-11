Frontend del Proyecto - Tienda de Bicicletas
============================================

Este es el frontend del proyecto "Tienda de Bicicletas", desarrollado con Astro.

Requisitos previos
------------------
Antes de comenzar, asegúrate de tener instalado lo siguiente en tu sistema:
- Node.js (versión 14 o superior)
- pnpm (administrador de paquetes)

Pasos para iniciar el proyecto
------------------------------
1. Clona el repositorio:
   Clona el repositorio y navega al directorio del frontend:
   git clone <URL_DEL_REPOSITORIO>
   cd tienda-bicicletas/frontend

2. Instala las dependencias:
   Ejecuta el siguiente comando para instalar las dependencias necesarias:
   pnpm install

3. Configura las variables de entorno (si aplica):
   Si el proyecto requiere un archivo `.env` para configuraciones (como la URL del backend), créalo en el directorio raíz del frontend. Por ejemplo:
   VITE_API_URL=http://localhost:3000

4. Inicia el servidor de desarrollo:
   Una vez instaladas las dependencias, inicia el servidor de desarrollo con:
   pnpm dev

5. Verifica el funcionamiento:
   Abre tu navegador y visita la URL que aparece en la terminal (por ejemplo, http://localhost:5173). Deberías ver la página principal con el mensaje:
   ¡Bienvenido a la Tienda de Bicicletas!

Estructura del proyecto
-----------------------
frontend/
├── src/
│   ├── pages/
│   │   └── index.astro       # Página principal
│   ├── layouts/
│   │   └── Layout.astro      # Componente de diseño principal
├── public/                   # Archivos estáticos
├── package.json              # Configuración del proyecto y dependencias
└── node_modules/             # Dependencias instaladas (generado automáticamente)

Scripts disponibles
-------------------
- pnpm dev: Inicia el servidor de desarrollo.
- pnpm build: Genera una versión optimizada para producción.
- pnpm preview: Previsualiza la versión de producción.

Notas adicionales
-----------------
- Si necesitas cambiar la configuración del proyecto, revisa el archivo `astro.config.mjs`.
- Asegúrate de instalar las dependencias cada vez que clones el repositorio o actualices el archivo `package.json`.

¡Listo! Ahora puedes trabajar en el frontend del proyecto.

***************************************************************************************************************************************

Backend del Proyecto - Tienda de Bicicletas
===========================================

Este es el backend del proyecto "Tienda de Bicicletas", desarrollado con Node.js y Express.

Requisitos previos
------------------
Antes de comenzar, asegúrate de tener instalado lo siguiente en tu sistema:
- Node.js (versión 14 o superior)
- npm (administrador de paquetes, incluido con Node.js)

Pasos para iniciar el proyecto
------------------------------
1. Clona el repositorio:
   Clona el repositorio y navega al directorio del backend:
   git clone <URL_DEL_REPOSITORIO>
   cd tienda-bicicletas/backend

2. Instala las dependencias:
   Ejecuta el siguiente comando para instalar las dependencias necesarias:
   npm install

3. Inicia el servidor:
   Una vez instaladas las dependencias, inicia el servidor con:
   npm run dev

4. Verifica el funcionamiento:
   Abre tu navegador y visita la siguiente URL para verificar que el servidor esté funcionando:
   http://localhost:3000
   Deberías ver el mensaje: "Servidor backend funcionando correctamente".

Estructura del proyecto
-----------------------
backend/
├── index.js          # Archivo principal del servidor
├── package.json      # Configuración del proyecto y dependencias
└── node_modules/     # Dependencias instaladas (generado automáticamente)

Código del servidor
-------------------
El archivo `index.js` contiene el siguiente código para iniciar el servidor:

const express = require('express');
const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Servidor backend funcionando correctamente');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

Scripts disponibles
-------------------
- npm run dev: Inicia el servidor de desarrollo.

Notas adicionales
-----------------
- Si necesitas cambiar el puerto del servidor, edita la constante `PORT` en el archivo `index.js`.
- Asegúrate de instalar las dependencias cada vez que clones el repositorio o actualices el archivo `package.json`.

¡Listo! Ahora puedes trabajar en el backend del proyecto.
