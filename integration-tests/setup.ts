import { beforeAll } from "vitest";
import { config } from "dotenv";
import path from "path";
import { exec as _exec } from "child_process";
import { promisify } from "util";

const exec = promisify(_exec);

config({ path: path.resolve(process.cwd(), ".env.test") });

// beforeAll(async () => {
export default async function setup() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL environment variable is required for integration tests. Make sure to run 'pnpm test:db:up' first.",
    );
  }

  if (!process.env.NODE_ENV) {
    Object.defineProperty(process.env, "NODE_ENV", {
      value: "test",
      writable: true,
    });
  }

  const composeFilePath = path.resolve(
    __dirname + "/../",
    "docker-compose.test.yml",
  );

  console.log("\n[Global Setup] Starting test database via Docker Compose...");
  try {
    // Bring up the services in detached mode (-d)
    const { stdout: upStdout, stderr: upStderr } = await exec(
      `docker compose -f ${composeFilePath} up -d`,
    );
    console.log("Docker Compose Up Output:", upStdout);
    if (upStderr) console.error("Docker Compose Up Error:", upStderr);

    // Wait for the database to be healthy
    console.log("[Global Setup] Waiting for database to be healthy...");
    const { stdout: healthStdout, stderr: healthStderr } = await exec(
      `docker compose -f ${composeFilePath} ps -q test-db | xargs docker inspect --format='{{json .State.Health}}' | grep "healthy" || true`,
    );
    // Poll until healthy
    let attempts = 0;
    while (!healthStdout?.includes('"Status":"healthy"') && attempts < 30) {
      process.stdout.write("."); // Indicate waiting
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
      const { stdout: newHealthStdout } = await exec(
        `docker compose -f ${composeFilePath} ps -q test-db | xargs docker inspect --format='{{json .State.Health}}' | grep "healthy" || true`,
      );
      if (newHealthStdout?.includes('"Status":"healthy"')) {
        console.log("\n[Global Setup] Database is healthy!");
        break;
      }
      attempts++;
    }
    if (attempts === 30) {
      throw new Error("Database did not become healthy within timeout.");
    }

    // After starting, run drizzle-kit push to sync the database schema
    console.log("[Global Setup] Pushing database schema...");
    // Set the environment variables for the test database
    const dbUrl = `postgres://test_user:test_password@localhost:5433/pokezoo_test`;
    const { stdout: migrateStdout, stderr: migrateStderr } = await exec(
      `DATABASE_URL="${dbUrl}" pnpm run db:push`,
    );
    console.log("Drizzle Push Output:", migrateStdout);
    if (migrateStderr) console.error("Drizzle Push Error:", migrateStderr);
  } catch (error) {
    console.error("[Global Setup] Error during setup:", error);
    // Ensure containers are torn down on failure
    await exec(
      `docker-compose -f ${composeFilePath} down --volumes --remove-orphans`,
    );
    throw error; // Re-throw to fail the test run
  }

  // Return a teardown function
  return async () => {
    console.log("\n[Global Teardown] Stopping test database...");
    try {
      // Bring down services and remove volumes to ensure a clean slate next time
      const { stdout: downStdout, stderr: downStderr } = await exec(
        `docker compose -f ${composeFilePath} down --volumes --remove-orphans`,
      );
      console.log("Docker Compose Down Output:", downStdout);
      if (downStderr) console.error("Docker Compose Down Error:", downStderr);
    } catch (error) {
      console.error("[Global Teardown] Error during teardown:", error);
    }
    console.log("[Global Teardown] Test database stopped.");
  };
}
