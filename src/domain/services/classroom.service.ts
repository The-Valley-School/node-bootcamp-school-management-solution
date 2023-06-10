import { Request, Response, NextFunction } from "express";
import { classroomOdm } from "../odm/classroom.odm";

export const getClassrooms = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Only for admins and teachers
    if (req.user.rol !== "ADMIN" && req.user.rol !== "TEACHER") {
      res.status(401).json({ error: "No tienes autorización para hacer esto" });
      return;
    }

    // Ternario que se queda con el parametro si llega
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const classrooms = await classroomOdm.getAllClassrooms(page, limit);

    // Num total de elementos
    const totalElements = await classroomOdm.getClassroomCount();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: classrooms,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

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
      const temporalClassroom = classroom.toObject();
      // TODO: RELLENAR LOS DATOS DE LOS ALUMNOS Y DE LAS ASIGNATURAS
      res.json(temporalClassroom);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const createClassroom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Only for admins
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para hacer esto" });
      return;
    }

    const createdClassroom = await classroomOdm.createClassroom(req.body);
    res.status(201).json(createdClassroom);
  } catch (error) {
    next(error);
  }
};

export const deleteClassroom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Only for admins
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para hacer esto" });
      return;
    }

    const id = req.params.id;
    const classroomDeleted = await classroomOdm.deleteClassroom(id);
    if (classroomDeleted) {
      res.json(classroomDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const updateClassroom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Only for admins
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para hacer esto" });
      return;
    }

    const id = req.params.id;
    const classroomToUpdate = await classroomOdm.getClassroomById(id);
    if (classroomToUpdate) {
      Object.assign(classroomToUpdate, req.body);
      const classroomSaved = await classroomToUpdate.save();
      res.json(classroomSaved);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const classroomService = {
  getClassrooms,
  getClassroomById,
  createClassroom,
  deleteClassroom,
  updateClassroom,
};
