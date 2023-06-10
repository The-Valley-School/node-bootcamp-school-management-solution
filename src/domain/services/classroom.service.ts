import { Request, Response, NextFunction } from "express";
import { classOdm } from "../odm/classroom.odm";
import { userOdm } from "../odm/user.odm";

const getClassrooms = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Only for admins and teachers
    if (req.user.rol !== "ADMIN" && req.user.rol !== "TEACHER") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    // Ternario que se queda con el parametro si llega
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const classs = await classOdm.getAllClassrooms(page, limit);

    // Num total de elementos
    const totalElements = await classOdm.getClassroomCount();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: classs,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getClassroomById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const classroomIdToShow = req.params.id;

    // Only for admins, teachers and the current class
    if (req.user.rol !== "ADMIN" && req.user.rol !== "TEACHER") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const classroomInfo = await classOdm.getClassroomById(classroomIdToShow);

    if (classroomInfo) {
      const students = await userOdm.getStudentsOfClassroomId(classroomInfo.id);
      const classroomInfoToSend = classroomInfo.toObject();
      classroomInfoToSend.students = students;

      res.json(classroomInfoToSend);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

const createClassroom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Solo admins pueden crear usuarios
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const createdClassroom = await classOdm.createClassroom(req.body);
    res.status(201).json(createdClassroom);
  } catch (error) {
    next(error);
  }
};

const deleteClassroom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const id = req.params.id;
    const classDeleted = await classOdm.deleteClassroom(id);
    if (classDeleted) {
      res.json(classDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

const updateClassroom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const id = req.params.id;
    const classToUpdate = await classOdm.getClassroomById(id);
    if (classToUpdate) {
      Object.assign(classToUpdate, req.body);
      const classUpdated = await classToUpdate.save();
      res.json(classUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const classService = {
  getClassrooms,
  getClassroomById,
  createClassroom,
  deleteClassroom,
  updateClassroom,
};
