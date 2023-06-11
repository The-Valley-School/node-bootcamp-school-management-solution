# VIDEO 03 - CRUD de usuarios

En este video hemos empezado con el CRUD de usuarios siguiendo arquitectura hexagonal.

Como hemos realizado muchos cambios, te dejamos un enlace al commit:

<https://github.com/The-Valley-School/node-bootcamp-school-management-solution/commit/a400e7618872630d1ea0d8c955b0b4c76d0a2840>

Alguna de las cosas más interesantes:

Hemos creado un fichero custom-definitions.d.ts donde poder indicar que las Request tienen info del user:

```jsx
enum CUSTOM_ROL {
  "STUDENT" = "STUDENT",
  "TEACHER" = "TEACHER",
  "PARENT" = "PARENT",
  "ADMIN" = "ADMIN",
}

declare namespace Express {
  export interface Request {
    user: {
      rol: CUSTOM_ROL;
      id: string;
    };
  }
}
```

Y hemos incluido el fichero en nuestro tsconfig.json:

```jsx
"include": ["src/**/*.ts", "__tests__/**/*.ts", "custom-definitions.d.ts"],
"exclude": ["dist/*"],
"files": ["custom-definitions.d.ts"]
```

