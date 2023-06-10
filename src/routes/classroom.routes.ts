import express from "express";
import { isAuth } from "../utils/auth.middleware";
import { classService } from "../domain/services/classroom.service";

// Router propio de usuarios
export const classroomRouter = express.Router();

classroomRouter.get("/", isAuth, classService.getClassrooms);
classroomRouter.get("/:id", isAuth, classService.getClassroomById);
classroomRouter.post("/", isAuth, classService.createClassroom);
classroomRouter.delete("/:id", isAuth, classService.deleteClassroom);
classroomRouter.put("/:id", isAuth, classService.updateClassroom);
