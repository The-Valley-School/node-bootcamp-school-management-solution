import { mongoConnect } from "../src/domain/repositories/mongo-repository";
import { appInstance } from "../src/index";
import { IUserCreate, ROL, User } from "../src/domain/entities/user.entity";
import { app } from "../src/server";
import mongoose from "mongoose";
import request from "supertest";

describe("User controller", () => {
  const adminUserMock: IUserCreate = {
    email: "admin@mail.com",
    password: "12345678",
    firstName: "SUPER",
    lastName: "ADMIN",
    rol: ROL.ADMIN,
  };

  const teacherUserMock: IUserCreate = {
    email: "teacher1@mail.com",
    password: "12345678",
    firstName: "Teacher",
    lastName: "Number 1",
    rol: ROL.TEACHER,
  };

  let adminToken: string;
  let teacherToken: string;
  let createdUserId: string;

  beforeAll(async () => {
    await mongoConnect();
    await User.collection.drop();
    await new User(adminUserMock).save();
    await new User(teacherUserMock).save();
    console.log("Eliminados todos los usuarios y creado ADMIN");
  });

  afterAll(async () => {
    await mongoose.connection.close();
    appInstance.close();
  });

  it("POST /user/login - should return 200 on valid credentials and 401 on bad credentials", async () => {
    // Admin login -> 200
    const adminCredentials = { email: adminUserMock.email, password: adminUserMock.password };
    const adminLoginResponse = await request(app).post("/user/login").send(adminCredentials).expect(200);
    expect(adminLoginResponse.body).toHaveProperty("token");
    adminToken = adminLoginResponse.body.token;

    // Teacher login -> 200
    const teacherCredentials = { email: teacherUserMock.email, password: teacherUserMock.password };
    const teacherLoginResponse = await request(app).post("/user/login").send(teacherCredentials).expect(200);
    expect(teacherLoginResponse.body).toHaveProperty("token");
    teacherToken = teacherLoginResponse.body.token;

    // Wrong login -> 401
    const credentials = { email: adminUserMock.email, password: "BAD PASSWORD" };
    const response = await request(app).post("/user/login").send(credentials).expect(401);
    expect(response.body.token).toBeUndefined();
  });

  it("POST /user - Create user should be allowed only for ADMIN", async () => {
    const userToCreate = { ...teacherUserMock, email: "teacher2@email.com" };

    // Not logged -> 401
    await request(app).post("/user").send(userToCreate).expect(401);

    // Logged with teacher -> 401
    await request(app).post("/user").set("Authorization", `Bearer ${teacherToken}`).send(userToCreate).expect(401);

    // Logged with admin -> 201
    const response = await request(app).post("/user").set("Authorization", `Bearer ${adminToken}`).send(userToCreate).expect(201);
    expect(response.body).toHaveProperty("_id");
    createdUserId = response.body._id;
  });

  it("GET /user - only admins and teachers can get the user list", async () => {
    // Not logged -> 401
    await request(app).get("/user").expect(401);

    // Logged with teacher -> 401
    const teacherResponse = await request(app).get("/user").set("Authorization", `Bearer ${teacherToken}`).expect(200);
    expect(teacherResponse.body.data?.length).toBeDefined();

    // Logged with admin -> 200
    const adminResponse = await request(app).get("/user").set("Authorization", `Bearer ${adminToken}`).expect(200);
    expect(adminResponse.body.data?.length).toBeDefined();
    expect(adminResponse.body.totalItems).toBeDefined();
  });

  it("GET /user/id - only admins or teachers can get a user info", async () => {
    // Not logged -> 401
    await request(app).get(`/user/${createdUserId}`).expect(401);

    // Logged with teacher -> 200
    const teacherResponse = await request(app).get(`/user/${createdUserId}`).set("Authorization", `Bearer ${teacherToken}`).expect(200);
    expect(teacherResponse.body.firstName).toBe(teacherUserMock.firstName);

    // Logged with admin -> 200
    const adminResponse = await request(app).get(`/user/${createdUserId}`).set("Authorization", `Bearer ${adminToken}`).expect(200);
    expect(adminResponse.body.firstName).toBe(teacherUserMock.firstName);
  });

  it("PUT /user/id - only admins can modify users", async () => {
    const updatedData = { firstName: "MODIFIED" };

    // Not logged -> 401
    await request(app).put(`/user/${createdUserId}`).expect(401);

    // Logged with teacher -> 401
    await request(app).put(`/user/${createdUserId}`).set("Authorization", `Bearer ${teacherToken}`).expect(401);

    // Logged with admin -> 200
    const response = await request(app).put(`/user/${createdUserId}`).set("Authorization", `Bearer ${adminToken}`).send(updatedData).expect(200);
    expect(response.body.firstName).toBe(updatedData.firstName);
  });

  it("DELETE /user/id -  Only admins can delete a user", async () => {
    // Not logged -> 401
    await request(app).delete(`/user/${createdUserId}`).expect(401);

    // Logged with teacher -> 401
    await request(app).delete(`/user/${createdUserId}`).set("Authorization", `Bearer ${teacherToken}`).expect(401);

    // Logged with admin -> 200
    const response = await request(app).delete(`/user/${createdUserId}`).set("Authorization", `Bearer ${adminToken}`).expect(200);
    expect(response.body._id).toBe(createdUserId);
  });
});
