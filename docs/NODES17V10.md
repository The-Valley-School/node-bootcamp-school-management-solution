# VIDEO 10 - Listado y creación de asignaturas

En este video hemos añadido también funcionalidad para crear asignaturas y clases, en concreto mediante un formulario que acaba haciendo POST al API:

```jsx
import { useRef } from "react";
import { SubjectCreate } from "../../../models/Subject";

interface SubjectFormProps {
  userToken?: string;
  fetchSubjects: () => void;
}

const SubjectForm = (props: SubjectFormProps): JSX.Element => {
  const API_URL_SUBJECT = `${process.env.REACT_APP_API_URL as string}/subject`;
  const nameRef = useRef<HTMLInputElement>(null);
  const classIdRef = useRef<HTMLInputElement>(null);
  const teacherIdRef = useRef<HTMLInputElement>(null);

  const submitForm = (event: React.FormEvent): void => {
    event.preventDefault();

    if (!nameRef.current?.value?.length || !teacherIdRef.current?.value?.length || !classIdRef.current?.value?.length) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const newSubject: SubjectCreate = {
      name: nameRef.current.value,
      teacher: teacherIdRef.current.value,
      classroom: classIdRef.current.value,
    };

    fetch(API_URL_SUBJECT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${props.userToken as string}`,
      },
      body: JSON.stringify(newSubject),
    })
      .then(async (response) => {
        if (response.status === 201) {
          (nameRef as any).current.value = "";
          (teacherIdRef as any).current.value = "";
          (classIdRef as any).current.value = "";
        } else {
          alert("Ha ocurrido un error");
        }
        return await response.json();
      })
      .then(() => {
        props.fetchSubjects();
      })
      .catch((error) => {
        alert("Ha ocurrido un error en la petición");
        console.error(error);
      });
  };

  return (
    <form onSubmit={submitForm}>
      <label htmlFor="subject-name">Nombre de la asignatura:</label>
      <input ref={nameRef} type="text" id="subject-name" required />

      <label htmlFor="subject-teacher">ID del profesor:</label>
      <input ref={teacherIdRef} type="text" id="subject-teacher" required />

      <label htmlFor="subject-class">ID de la clase:</label>
      <input ref={classIdRef} type="text" id="subject-class" required />

      <button type="submit">Crear asignatura</button>
    </form>
  );
};

export default SubjectForm;
```

