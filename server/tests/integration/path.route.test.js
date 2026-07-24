const request = require("supertest");
const app = require("../../server.js");
const mongoose = require("mongoose");

describe("POST /api/path/find", () => {
    beforeAll(async () => {
        await app.dbConnection;
    });
    afterAll(async () => {
        await mongoose.connection.close();
    });

    test("Single map test 1", async () => {
        const response = await request(app)
            .post("/api/path/find")
            .send({
                startLocation: {
                    roomNumber: "01-01",
                    building: "COM1",
                    floor: 1
                },
                endLocation: {
                    roomNumber: "01-03",
                    building: "COM1",
                    floor: 1
                },
                optimisation: 0,
            });
        const { success, optimisation, src, dst, path, time, totalNodes } = response.body;
        expect(response.status).toBe(200);
        expect(success).toEqual(true);
        expect(optimisation).toEqual("Shortest");
        expect(src).toEqual(["COM1-1-D-7-7"]);
        expect(dst).toEqual(["COM1-1-D-7-12"]);
        expect(totalNodes).toEqual(3);
        expect(time).toEqual(4);
    });

    test("Single map test 2", async () => {
        const response = await request(app)
            .post("/api/path/find")
            .send({
                startLocation: {
                    roomNumber: "01-01",
                    building: "COM1",
                    floor: 1
                },
                endLocation: {
                    roomNumber: "01-08",
                    building: "COM1",
                    floor: 1
                },
                optimisation: 0,
            });
        const { success, optimisation, src, dst, path, time, totalNodes } = response.body;
        expect(response.status).toBe(200);
        expect(success).toEqual(true);
        expect(optimisation).toEqual("Shortest");
        expect(src).toEqual(["COM1-1-D-7-7"]);
        expect(dst).toEqual(["COM1-1-D-6-48"]);
        expect(totalNodes).toEqual(14);
        expect(time).toEqual(31);
    });

    test("Cross map test", async () => {
        const response = await request(app)
            .post("/api/path/find")
            .send({
                startLocation: {
                    roomNumber: "01-01",
                    building: "COM1",
                    floor: 1
                },
                endLocation: {
                    roomNumber: "03-03",
                    building: "COM1",
                    floor: 3
                },
                optimisation: 0,
            });
        const { success, optimisation, src, dst, path, time, totalNodes } = response.body;
        expect(response.status).toBe(200);
        expect(success).toEqual(true);
        expect(optimisation).toEqual("Shortest");
        expect(src).toEqual(["COM1-1-D-7-7"]);
        expect(dst).toEqual(["COM1-3-D-22-31"]);
        expect(totalNodes).toEqual(23);
        expect(time).toEqual(45);
    });

    test("Invalid Input -> Empty locations", async () => {
        const response = await request(app)
            .post("/api/path/find")
            .send({
                startLocation: {
                },
                endLocation: {
                },
                optimisation: 0,
            });
        expect(response.status).toBe(500);
    });

    test("No paths", async () => {
        const response = await request(app)
            .post("/api/path/find")
            .send({
                startLocation: {
                    roomNumber: "B-AHU2",
                    building: "COM1",
                    floor: 0
                },
                endLocation: {
                    roomNumber: "B-09",
                    building: "COM1",
                    floor: 0
                },
                optimisation: 0,
            });
        expect(response.status).toBe(500);
    });

    test("Src == Dst", async () => {
        const response = await request(app)
            .post("/api/path/find")
            .send({
                startLocation: {
                    roomNumber: "B-09",
                    building: "COM1",
                    floor: 0
                },
                endLocation: {
                    roomNumber: "B-09",
                    building: "COM1",
                    floor: 0
                },
                optimisation: 0,
            });
        expect(response.status).toBe(200);
    });
});
