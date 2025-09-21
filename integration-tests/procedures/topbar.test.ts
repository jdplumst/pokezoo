import { describe, test, expect, vi, beforeEach } from "vitest";
import { getProfileForTopbar } from "~/server/repositories/profile";
import { createCaller } from "~/server/api/root";
import type { createTRPCContext } from "~/server/api/trpc";
import { ERROR_MESSAGES } from "~/lib/errors";
import type { Session } from "next-auth";

type Context = Awaited<ReturnType<typeof createTRPCContext>> & {
  session: Session | null;
};

vi.mock("~/server/auth", () => ({
  auth: vi.fn().mockImplementation(() =>
    Promise.resolve({
      user: {
        id: "test-user-id",
        name: null,
        email: null,
        image: null,
      },
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    }),
  ),
  handlers: { GET: vi.fn(), POST: vi.fn() },
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("~/server/repositories/profile", () => ({
  getProfileForTopbar: vi.fn(),
}));

type TopbarProfile = Awaited<ReturnType<typeof getProfileForTopbar>>;

describe("Topbar Router", () => {
  let caller: ReturnType<typeof createCaller>;

  const mockHeaders = new Headers();

  const mockSession: Session = {
    user: {
      id: "test-user-id",
      name: null,
      email: null,
      image: null,
    },
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  };

  function createMockContext() {
    const ctx = {
      session: mockSession,
      headers: new Headers(),
      req: {
        headers: Object.fromEntries(mockHeaders.entries()),
      },
      res: {},
    } as unknown as Context;

    return ctx;
  }

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn() as typeof global.fetch;

    const ctx = createMockContext();
    caller = createCaller(ctx);
  });

  describe("getTopbarData", () => {
    test("should return profile data when profile exists", async () => {
      const mockProfile: TopbarProfile = {
        id: "test-profile-id",
        username: "testuser",
        admin: false,
        totalYield: 100,
        balance: 50,
        instanceCount: 10,
        commonCards: 5,
        rareCards: 3,
        epicCards: 1,
        legendaryCards: 1,
        catchingCharm: 1,
      };

      vi.mocked(getProfileForTopbar).mockResolvedValueOnce(mockProfile);

      const result = await caller.topbar.getTopbarData();

      expect(result).toEqual({
        profile: mockProfile,
      });

      expect(getProfileForTopbar).toHaveBeenCalled();
    });

    test("should throw NOT_FOUND error when profile does not exist", async () => {
      vi.mocked(getProfileForTopbar).mockResolvedValueOnce(null);

      await expect(caller.topbar.getTopbarData()).rejects.toMatchObject({
        code: "NOT_FOUND",
        message: ERROR_MESSAGES.PROFILE.NOT_FOUND,
      });

      expect(getProfileForTopbar).toHaveBeenCalled();
    });

    test("should handle repository errors", async () => {
      const mockError = new Error("Database error");
      vi.mocked(getProfileForTopbar).mockRejectedValueOnce(mockError);

      await expect(caller.topbar.getTopbarData()).rejects.toMatchObject({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    });
  });
});
