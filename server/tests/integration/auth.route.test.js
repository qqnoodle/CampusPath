const request = require("supertest");
const app = require("../../server.js");

const mongoose = require("mongoose");
const Users = require("../../models/users.model.js");

const jwt = require("jsonwebtoken");

beforeAll(async () => {
    await app.dbConnection;
});

describe("POST api/auth/login", () => {
    const API = "/api/auth/login";

    test("Login Success Test", async () => {
        const response = await request(app)
            .post(API)
            .send({
                username: "FOOL",
                password: "123Ab!"
            });
        expect(response.status).toBe(200);
    });

    test("Login missing username", async () => {
        const response = await request(app)
            .post(API)
            .send({
                username: "",
                password: "123Ab!"
            });
        expect(response.status).toBe(401);
    });

    test("Login missing password", async () => {
        const response = await request(app)
            .post(API)
            .send({
                username: "FOOL",
                password: ""
            });
        expect(response.status).toBe(401);
    });

    test("Login missing wrong password", async () => {
        const response = await request(app)
            .post(API)
            .send({
                username: "FOOL",
                password: "123AC!"
            });
        expect(response.status).toBe(401);
    });

    test("Login no Username exist", async () => {
        const response = await request(app)
            .post(API)
            .send({
                username: "loremipsumplaceholder",
                password: "123AC!"
            });
        expect(response.status).toBe(401);
    });


});

describe("POST api/auth/signUp", () => {
    const API = "/api/auth/signUp";
    //Cool javascript trick for me to choose 2 out of the 3 field using the ... operand
    const userInfo = {
        username: "FOOL",
        email: "testdummyemail",
        password: "123Ab!"
    };

    test("duplicated Username", async () => {
        const response = await request(app)
            .post(API)
            .send(
                userInfo
            );
        expect(response.status).toBe(409);
    });

    test("missing Username", async () => {
        const { username, ...otherVariable } = userInfo
        const response = await request(app)
            .post(API)
            .send(
                otherVariable
            );
        expect(response.status).toBe(401);
    });

    test("invalid email", async () => {
        const { username, ...otherVariable } = userInfo
        const response = await request(app)
            .post(API)
            .send(
                {
                    username: "testerthatdoesntexist",
                    ...otherVariable
                }
            );
        expect(response.status).toBe(400);
    });

    test("missing email", async () => {
        const { email, ...otherVariable } = userInfo
        const response = await request(app)
            .post(API)
            .send(
                otherVariable
            );
        expect(response.status).toBe(401);
    });

    test("missing password", async () => {
        const { password, ...otherVariable } = userInfo
        const response = await request(app)
            .post(API)
            .send(
                otherVariable
            );
        expect(response.status).toBe(401);
    });

    test("weak password", async () => {
        const response = await request(app)
            .post(API)
            .send(
                {
                    username: "testerthatdoesntexist",
                    email: "campuspathadmin@gmail.com",
                    password: "1"
                }
            );
        expect(response.status).toBe(400);
    });

    test("Successful creation", async () => {
        const response = await request(app)
            .post(API)
            .send(
                {
                    username: "testerthatdoesntexist",
                    email: "campuspathadmin@gmail.com",
                    password: "123Ab!"
                }
            );
        expect(response.status).toBe(201);
        const createdUser = await Users.findOne({ email: "campuspathadmin@gmail.com" });
        expect(createdUser).not.toBe(null);
        //destroy user to i can repeat test again
        await Users.deleteOne({ email: "campuspathadmin@gmail.com" })
    });

});

describe("POST api/auth/verifyToken", () => {
    const API = "/api/auth/verifyToken";
    const makeToken = (payload, opts) =>
        jwt.sign(payload, process.env.JWT_SECRET, opts);


    test("request with no token", async () => {
        const response = await request(app).post(API).send({});
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
    });

    test("invalid token", async () => {
        const response = await request(app)
            .post(API)
            .set("Authorization", "Bearer FakeTOKEN")
            .send({});
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/invalid token/i);
    });

    test("rejects an expired token", async () => {
        const expiredToken = makeToken({ id: "1", username: "someone" }, { expiresIn: -10 });
        const response = await request(app)
            .post(API)
            .set("Authorization", `Bearer ${expiredToken}`)
            .send({});
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/expired/i);
    });

    test("accepts a valid token", async () => {
        const validToken = makeToken({ id: "1", username: "someone" }, { expiresIn: "30d" });
        const response = await request(app)
            .post(API)
            .set("Authorization", `Bearer ${validToken}`)
            .send({});
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });
});

describe("POST api/auth/resetPassword", () => {
    const API = "/api/auth/resetPassword";

    const makeToken = (username) =>
        jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "5m" });


    test("fields are empty", async () => {
        const response = await request(app)
            .post(API)
            .send({});
        expect(response.status).toBe(400);
    });

    test("wrong reset Token", async () => {
        const response = await request(app)
            .post(API)
            .set("Authorization", `Bearer ${makeToken("NotFOOL")}`)
            .send({
                username: "FOOl",
                newPassword: "123Ab!"
            });
        expect(response.status).toBe(401);
    });

    test("Weak Password", async () => {
        const response = await request(app)
            .post(API)
            .set("Authorization", `Bearer ${makeToken("FOOL")}`)
            .send({
                username: "FOOL",
                newPassword: "1"
            });
        expect(response.status).toBe(400);
    });

    test("Successful Password Reset", async () => {
        const response = await request(app)
            .post(API)
            .set("Authorization", `Bearer ${makeToken("FOOL")}`)
            .send({
                username: "FOOL",
                newPassword: "123Ab!"
            });
        expect(response.status).toBe(200);


        const login = await request(app)
            .post("/api/auth/login")
            .send({
                username: "FOOL",
                password: "123Ab!"
            });
        expect(login.status).toBe(200);
    });
});

describe("POST api/auth/forgotPassword", () => {
    const API = "/api/auth/forgotPassword";

    test("missing fields", async () => {
        const response = await request(app)
            .post(API)
            .send({});
        expect(response.status).toBe(400);
    });

    test("unknown email", async () => {
        const response = await request(app)
            .post(API)
            .send({ userIdentifier: "emailwhodoesnotexist@example.com" });
        expect(response.status).toBe(400);
    });


    test("finds user", async () => {
        const response = await request(app)
            .post(API)
            .send({ userIdentifier: "FOOL" });
        expect(response.status).toBe(200);
        expect(response.body.username).toBe("FOOL");
    });
});


afterAll(async () => {
    await mongoose.connection.close();
});
