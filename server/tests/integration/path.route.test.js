const request = require("supertest");
const app = require("../../server.js");
const mongoose = require("mongoose");

describe("POST /api/path/find", () => {
    beforeAll(async () => {
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
        const { success, optimisation, src, dst, path, totalNodes } = response.body;
        expect(response.status).toBe(200);
        expect(success).toEqual(true);
        expect(optimisation).toEqual("Shortest");
        expect(src).toEqual(["COM1-1-D-7-7"]);
        expect(dst).toEqual(["COM1-1-D-7-12"]);
        expect(totalNodes).toEqual(3);
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
        const { success, optimisation, src, dst, path, totalNodes } = response.body;
        expect(response.status).toBe(200);
        expect(success).toEqual(true);
        expect(optimisation).toEqual("Shortest");
        expect(src).toEqual(["COM1-1-D-7-7"]);
        expect(dst).toEqual(["COM1-1-D-6-48"]);
        expect(totalNodes).toEqual(14);
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
        const { success, optimisation, src, dst, path, totalNodes } = response.body;
        expect(response.status).toBe(200);
        expect(success).toEqual(true);
        expect(optimisation).toEqual("Shortest");
        expect(src).toEqual(["COM1-1-D-7-7"]);
        expect(dst).toEqual(["COM1-3-D-22-31"]);
        expect(totalNodes).toEqual(23);
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
});
