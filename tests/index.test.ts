import { describe, expect, test } from "vitest";
import app from "../backend/src/index";

//? HONO TEST

describe("Health Check API", () => {
  test("should return 200 OK", async()=>{
    const res = await app.request("/api/healthcheck",{
      method: "GET"
    });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toBe("OK");
    expect(body.message).toBe("Health check passed");
  })
});


//? axios test
import axios from "axios";

const BACKEND_URL = "http://localhost:8787";


describe("Health Check API", () => {
  test("should return 200", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/healthcheck`);
    const body = response.data;

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toBe("OK");
    expect(body.message).toBe("Health check passed");
  });
});
