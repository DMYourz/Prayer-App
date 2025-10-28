import { afterEach, describe, expect, it, vi } from "vitest";

import { __setDbResolver, getPrayers } from "./db";

describe("getPrayers", () => {
  afterEach(() => {
    __setDbResolver(null);
    vi.restoreAllMocks();
  });

  it("applies all provided filters in a single where call", async () => {
    const mockQuery = {
      where: vi.fn(),
      orderBy: vi.fn(),
      limit: vi.fn(),
      offset: vi.fn(),
    };

    mockQuery.where.mockReturnValue(mockQuery);
    mockQuery.orderBy.mockReturnValue(mockQuery);
    mockQuery.limit.mockReturnValue(mockQuery);
    mockQuery.offset.mockResolvedValue([]);

    const mockDb = {
      select: vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          $dynamic: vi.fn().mockReturnValue(mockQuery),
        }),
      }),
    };

    __setDbResolver(async () => mockDb as never);

    await getPrayers({
      churchId: 1,
      status: "active",
      isPublic: true,
      moderationStatus: "approved",
    });

    expect(mockQuery.where).toHaveBeenCalledTimes(1);
    expect(mockQuery.limit).toHaveBeenCalledWith(50);
    expect(mockQuery.offset).toHaveBeenCalledWith(0);
  });
});
