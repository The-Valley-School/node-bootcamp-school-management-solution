import { Schema, Document, model } from "mongoose";
import { IUser, User } from "./user.entity";
import { Classroom, IClassroom } from "./classroom.entity";

export interface ISubjectCreate {
  name: string;
  teacher: IUser;
  classroom: IClassroom;
}

export type ISubject = ISubjectCreate & Document;

// Creamos el schema del usuario
const SubjectSchema = new Schema<ISubjectCreate>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minLength: [5, "El nombre debe tener al menos 5 caracters, por ejemplo 2 ESO, 1 BACH"],
    },
    classroom: {
      type: Schema.Types.ObjectId,
      ref: Classroom,
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Subject = model<ISubjectCreate>("Subject", SubjectSchema);
