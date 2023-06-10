import { Classroom, IClassroom } from "../entities/classroom.entity";
import { Document } from "mongoose";

const getAllClassrooms = async (page: number, limit: number): Promise<IClassroom[]> => {
  return await Classroom.find()
    .limit(limit)
    .skip((page - 1) * limit);
};

const getClassroomCount = async (): Promise<number> => {
  return await Classroom.countDocuments();
};

const getClassroomById = async (id: string): Promise<IClassroom | null> => {
  return await Classroom.findById(id);
};

const createClassroom = async (classData: any): Promise<Document<IClassroom>> => {
  const newClassroom = new Classroom(classData);
  const document: Document<IClassroom> = (await newClassroom.save()) as any;

  return document;
};

const deleteClassroom = async (id: string): Promise<IClassroom | null> => {
  return await Classroom.findByIdAndDelete(id);
};

const updateClassroom = async (id: string, classData: any): Promise<IClassroom | null> => {
  return await Classroom.findByIdAndUpdate(id, classData, { new: true, runValidators: true });
};

export const classOdm = {
  getAllClassrooms,
  getClassroomCount,
  getClassroomById,
  createClassroom,
  deleteClassroom,
  updateClassroom,
};
