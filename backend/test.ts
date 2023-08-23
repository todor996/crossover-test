import { performance } from "perf_hooks";
import supertest from "supertest";
import { buildApp } from "./app";

const app = supertest(buildApp());

async function basicLatencyTest() {
    await app.post("/reset").expect(204);
    const start = performance.now();
    await app.post("/charge").expect(200);
    await app.post("/charge").expect(200);
    await app.post("/charge").expect(200);
    await app.post("/charge").expect(200);
    await app.post("/charge").expect(200);
    console.log(`Latency: ${performance.now() - start} ms`);
}

async function concurrentTest() {
    await app.post("/reset").expect(204);
    const start = performance.now();
    const tasks = [];
    tasks.push(app.post("/charge").expect(200));
    tasks.push(app.post("/charge").expect(200));
    tasks.push(app.post("/charge").expect(200));
    await Promise.all(tasks);
    console.log(`Latency: ${performance.now() - start} ms`);
}
async function runTests() {
    await basicLatencyTest();
    await concurrentTest();
}

runTests().catch(console.error);
