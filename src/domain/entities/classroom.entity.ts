import { Schema, Document, model } from "mongoose";

export interface IClassroomCreate {
  name: string;
}

export type IClassroom = IClassroomCreate & Document;

// Creamos el schema del usuario
const ClassroomSchema = new Schema<IClassroomCreate>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minLength: [5, "El nombre debe tener al menos 5 caracters, por ejemplo 2 ESO, 1 BACH"],
    },
  },
  {
    timestamps: true,
  }
);

export const Classroom = model<IClassroomCreate>("Classroom", ClassroomSchema);
