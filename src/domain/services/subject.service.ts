import { Request, Response, NextFunction } from "express";
import { subjectOdm } from "../odm/subject.odm";

const getSubjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Only for admins and teachers
    if (req.user.rol !== "ADMIN" && req.user.rol !== "TEACHER") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    // Ternario que se queda con el parametro si llega
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const subjects = await subjectOdm.getAllSubjects(page, limit);

    // Num total de elementos
    const totalElements = await subjectOdm.getSubjectCount();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: subjects,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getSubjectById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const subjectIdToShow = req.params.id;

    // Only for admins, teachers and the current subject
    if (req.user.rol !== "ADMIN" && req.user.rol !== "TEACHER") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const subjectInfo = await subjectOdm.getSubjectById(subjectIdToShow);

    if (subjectInfo) {
      res.json(subjectInfo);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

const createSubject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Solo admins pueden crear usuarios
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const createdSubject = await subjectOdm.createSubject(req.body);
    res.status(201).json(createdSubject);
  } catch (error) {
    next(error);
  }
};

const deleteSubject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const id = req.params.id;
    const subjectDeleted = await subjectOdm.deleteSubject(id);
    if (subjectDeleted) {
      res.json(subjectDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

const updateSubject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const id = req.params.id;
    const subjectToUpdate = await subjectOdm.getSubjectById(id);
    if (subjectToUpdate) {
      Object.assign(subjectToUpdate, req.body);
      const subjectUpdated = await subjectToUpdate.save();
      res.json(subjectUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const subjectService = {
  getSubjects,
  getSubjectById,
  createSubject,
  deleteSubject,
  updateSubject,
};
