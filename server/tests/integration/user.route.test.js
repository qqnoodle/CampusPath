
const request = require("supertest");
const app = require("../../server.js");

const mongoose = require("mongoose");
const Histories = require("../../models/histories.model.js");

const jwt = require("jsonwebtoken");

const dummyHistoryEntry = {
    "id": "1784260743817",
    "path": [
        [
            {
                "_id": "6a572dc4d8225e4b43437814",
                "node_id": "COM1-1-D-7-7",
                "building": "COM1",
                "floor": 1,
                "neighbour": [
                    {
                        "node": "COM1-1-D-7-10",
                        "weight": 3,
                        "_id": "6a572dc4d8225e4b43437815"
                    }
                ],
                "attribute": [
                    "Sheltered",
                    "Walk"
                ],
                "nodeType": "door",
                "__v": 0,
                "createdAt": "2026-07-15T06:50:44.152Z",
                "updatedAt": "2026-07-15T06:50:44.152Z"
            }
        ]
    ],
    "estimatedTime": 0,
    "startLocation": "Technical Staff Office 1",
    "endLocation": "Technical Staff Office 1",
    "optimisation": "Shortest",
    "totalNodes": 1,
    "favourite": false,
    "timestamp": 1784260743817,
    "__v": 0
};

beforeAll(async () => {
    await app.dbConnection;
});

describe("GET api/user/history", () => {
    const API = "/api/user/history";
    const jwtToken = jwt.sign({ username: "FOOL" }, process.env.JWT_SECRET, { expiresIn: "5m" });

    test("Successful retrieval User history", async () => {
        const response = await request(app)
            .get(API)
            .set("Authorization", `Bearer ${jwtToken}`)
        expect(response.status).toBe(200);
    });

    test("No Jwt Token", async () => {
        const response = await request(app)
            .get(API)
        expect(response.status).toBe(500);
    });

});

describe("POST api/user/history", () => {
    const API = "/api/user/history";

    const jwtToken = jwt.sign({ username: "FOOL2" }, process.env.JWT_SECRET, { expiresIn: "5m" });

    test("No Jwt Token", async () => {
        const response = await request(app)
            .post(API)
            .send(dummyHistoryEntry);
        expect(response.status).toBe(500);
    });


    test("Successful adding of User history", async () => {
        const response = await request(app)
            .post(API)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send(dummyHistoryEntry);
        expect(response.status).toBe(200);
    });

});

describe("PATCH api/user/history", () => {
    const API = "/api/user/history";
    const jwtToken = jwt.sign({ username: "FOOL2" }, process.env.JWT_SECRET, { expiresIn: "5m" });
    const { timestamp, id } = dummyHistoryEntry;

    test("No id provided", async () => {
        const response = await request(app)
            .patch(API)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send({
                time: timestamp + 10
            });
        expect(response.status).toBe(400);
    });

    test("No time provided", async () => {
        const response = await request(app)
            .patch(API)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send({
                id: id
            });
        expect(response.status).toBe(400);
    });

    test("No Jwt Token", async () => {
        const response = await request(app)
            .patch(API)
            .send({
                id: id,
                time: timestamp + 10
            });
        expect(response.status).toBe(500);
    });

    test("Successful update of timestamp", async () => {
        const response = await request(app)
            .patch(API)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send({
                id: id,
                time: timestamp + 10
            });
        expect(response.status).toBe(201);
    });

});

describe("POST api/user/history/favourite", () => {
    const API = "/api/user/history/favourite";
    const jwtToken = jwt.sign({ username: "FOOL2" }, process.env.JWT_SECRET, { expiresIn: "5m" });
    const { id } = dummyHistoryEntry;

    test("Successful favourited", async () => {
        const response = await request(app)
            .post(API)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send({
                id: id,
            });
        expect(response.status).toBe(200);
        const historyEntry = await Histories.findOne({
            username: "FOOL2",
            id: id
        });
        expect(historyEntry.favourite).toEqual(true);
    });

    test("Successful unfavourited", async () => {
        const response = await request(app)
            .post(API)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send({
                id: id,
            });
        expect(response.status).toBe(200);
        const historyEntry = await Histories.findOne({
            username: "FOOL2",
            id: id
        });
        expect(historyEntry.favourite).toEqual(false);
    });
});

describe("DELETE api/user/history", () => {
    const API = "/api/user/history";
    const jwtToken = jwt.sign({ username: "FOOL2" }, process.env.JWT_SECRET, { expiresIn: "5m" });

    test("No Token", async () => {
        const response = await request(app)
            .delete(API)
        expect(response.status).toBe(500);
    });

    test("Successful Delete", async () => {
        const response = await request(app)
            .delete(API)
            .set("Authorization", `Bearer ${jwtToken}`)
        expect(response.status).toBe(200);
        const historyEntry = await Histories.findOne({
            username: "FOOL2",
        });
        expect(historyEntry).toBe(null);
    });
});


afterAll(async () => {
    await mongoose.connection.close();
});

