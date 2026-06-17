
const request = require("supertest");
const app = require("../../server.js");
const mongoose = require("mongoose");

describe("GET api/locations", () => {
    beforeAll(async () => {
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });


    test("Fetch all locations", async () => {
        const response = await request(app).get("/api/locations");
        expect(response.status).toBe(200);
    });

    test("Fetch all location with empty query", async () => {
        const response = await request(app).get("/api/locations?q=");
        expect(response.status).toBe(200);
    });

    test("GET api/locations?q=Programming", async () => {
        const response = await request(app).get("/api/locations?q=Programming");
        expect(response.status).toBe(200);
        expect(response.body.length).toEqual(6);
    });

    test("No matches in database", async () => {
        const response = await request(app).get("/api/locations?q=Themysteriousrulerabovethegreyfog");
        expect(response.status).toBe(200);
        expect(response.body.length).toEqual(0);
    });
});
