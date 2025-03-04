const request = require("supertest");
const app = require("./server");

describe("API de Usuários", () => {
    it("Deve responder 'pong' no endpoint /ping", async () => {
        const res = await request(app).get("/ping");
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual("pong");
    });

    it("Deve criar um novo usuário", async () => {
        const res = await request(app)
            .post("/users")
            .send({ name: "John Doe", email: "john@example.com" });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body.name).toBe("John Doe");
    });

    it("Deve retornar lista de usuários", async () => {
        const res = await request(app).get("/users");
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it("Deve atualizar um usuário existente", async () => {
        const resPost = await request(app)
            .post("/users")
            .send({ name: "Jane Doe", email: "jane@example.com" });

        const userId = resPost.body.id;

        const resPut = await request(app)
            .put(`/users/${userId}`)
            .send({ name: "Jane Updated", email: "jane@updated.com" });

        expect(resPut.statusCode).toEqual(200);
        expect(resPut.body.name).toBe("Jane Updated");
    });

    it("Deve excluir um usuário", async () => {
        const resPost = await request(app)
            .post("/users")
            .send({ name: "Delete Me", email: "delete@example.com" });

        const userId = resPost.body.id;

        const resDelete = await request(app).delete(`/users/${userId}`);

        expect(resDelete.statusCode).toEqual(204);
    });
});
