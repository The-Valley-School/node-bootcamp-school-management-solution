# VIDEO 09 - Control de acceso a páginas y lista de clases

En este vídeo hemos añadido control para que solo se acceda a las rutas si estás logado y además hemos añadido un listado de clases (Classroom) que vienen de la API:

```jsx
import { useContext, useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import "./ClassroomPage.scss";
import { AuthContext } from "../../App";
import { Navigate } from "react-router-dom";
import { ClassroomResponse } from "../../models/Classroom";
import ClassroomTable from "./ClassroomTable/ClassroomTable";

const ClassroomPage = (): JSX.Element => {
  const authInfo = useContext(AuthContext);
  const [classrooms, setClassrooms] = useState<ClassroomResponse[]>([]);

  useEffect(() => {
    fetchClassrooms();
  }, [authInfo]);

  const fetchClassrooms = (): void => {
    if (authInfo?.userToken) {
      fetch("http://localhost:3000/classroom", {
        headers: {
          Authorization: `Bearer ${authInfo.userToken}`,
        },
      })
        .then(async (response) => {
          if (response.status !== 200) {
            alert("Ha ocurrido un error en la petición");
          }
          return await response.json();
        })
        .then((responseParsed) => {
          setClassrooms(responseParsed.data);
        })
        .catch((error) => {
          console.error(error);
          alert("Ha ocurrido un error en la petición");
        });
    }
  };

  return (
    <div className="classroom-page page">
      {authInfo?.userInfo ? (
        <>
          <Header></Header>
          <h1>Classroom Page!</h1>

          <ClassroomTable classrooms={classrooms}></ClassroomTable>
        </>
      ) : (
        <Navigate to="/login" replace={true}></Navigate>
      )}
    </div>
  );
};

export default ClassroomPage;
```

