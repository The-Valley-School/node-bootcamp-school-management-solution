# VIDEO 06 - CRUD de asignaturas

En este video hemos creado el CRUD para gestionar las clases, te dejamos un enlace al commit con todos los cambios:

<https://github.com/The-Valley-School/node-bootcamp-school-management-solution/commit/2200d96223acc3a6591e2bfdb6c7b587bcef27a3>

Como cambios interesantes, hemos añadido lógica en las clases para que se recupere la información de sus alumnos y de las asignaturas:

```jsx
export const getClassroomById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const classroomIdToShow = req.params.id;

    // Only for admins and teachers
    if (req.user.rol !== "ADMIN" && req.user.rol !== "TEACHER") {
      res.status(401).json({ error: "No tienes autorización para hacer esto" });
      return;
    }

    const classroom = await classroomOdm.getClassroomById(classroomIdToShow);

    if (classroom) {
      const classroomToSend = classroom.toObject();

      const students = await userOdm.getStudentsByClassroomId(classroom.id);
      const subjects = await subjectOdm.getSubjectsByClassroomId(classroom.id);

      classroomToSend.students = students;
      classroomToSend.subjects = subjects;

      res.json(classroomToSend);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};
```