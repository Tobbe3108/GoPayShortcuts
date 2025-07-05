import { fromHono } from "chanfana";
import { Hono } from "hono";

// import { TaskCreate } from "./demoendpoints/taskCreate";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/",
});

// Register OpenAPI endpoints
// openapi.get("/api/tasks", TaskList);

// Export the Hono app
export default app;
