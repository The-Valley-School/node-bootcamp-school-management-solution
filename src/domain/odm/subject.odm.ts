import { Subject, ISubject } from "../entities/subject.entity";
import { Document } from "mongoose";

const getAllSubjects = async (page: number, limit: number): Promise<ISubject[]> => {
  return await Subject.find()
    .limit(limit)
    .skip((page - 1) * limit);
};

const getSubjectCount = async (): Promise<number> => {
  return await Subject.countDocuments();
};

const getSubjectById = async (id: string): Promise<ISubject | null> => {
  return await Subject.findById(id).populate(["teacher", "classroom"]);
};

const getSubjectsOfClassroomId = async (classroomId: string): Promise<ISubject[]> => {
  return await Subject.find({ classroom: classroomId });
};

const createSubject = async (subjectData: any): Promise<Document<ISubject>> => {
  const newSubject = new Subject(subjectData);
  const document: Document<ISubject> = (await newSubject.save()) as any;

  return document;
};

const deleteSubject = async (id: string): Promise<ISubject | null> => {
  return await Subject.findByIdAndDelete(id);
};

const updateSubject = async (id: string, subjectData: any): Promise<ISubject | null> => {
  return await Subject.findByIdAndUpdate(id, subjectData, { new: true, runValidators: true });
};

export const subjectOdm = {
  getAllSubjects,
  getSubjectCount,
  getSubjectById,
  getSubjectsOfClassroomId,
  createSubject,
  deleteSubject,
  updateSubject,
};
