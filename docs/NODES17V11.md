# VIDEO 11 - Desplegando back y front

En este vídeo hemos visto la solución de la parte de gestión de usuarios y además hemos realizado el depliegue en render de nuestros dos proyectos:

**BACK:**

<https://node-bootcamp-school-management.onrender.com>

**FRONT:**

<https://node-bootcamp-school-management-front.onrender.com>

Para poder conectarlos adecuadamente hemos creado una variable de entorno para que la configuración del CORS dependa del fichero .env:

```jsx
import express from "express";
import cors from "cors";
import { configureRoutes } from "../routes/index";

// Cargamos variables de entorno
import dotenv from "dotenv";
dotenv.config();

const FRONT_END_URL: string = process.env.FRONT_END_URL as string;

// Configuración del server
export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: FRONT_END_URL,
  })
);

configureRoutes(app);
```

De esta manera podemos hacer que en local el CORS sea válido para:

<http://localhost:3000>

Y en la web desplegada para:

<https://node-bootcamp-school-management-front.onrender.com>

Con esto damos por terminado el Bootcamp de Node, la aplicación está aún verde de funcionalidad, pero hay que tener en cuenta que un solo desarrollador haciendo front y back, en 8h es imposible que termine un proyecto tan ambicioso, por suerte para este Bootcamp final trabajaréis en grupo y tendréis una semana para terminarlo.

Os dejamos por aquí el enlace al repo de back:

<https://github.com/The-Valley-School/node-bootcamp-school-management-solution>

Y el enlace al repo de front:

<https://github.com/The-Valley-School/node-bootcamp-school-management-solution-front>
