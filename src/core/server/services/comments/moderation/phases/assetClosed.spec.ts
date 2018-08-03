import { Asset } from "talk-server/models/asset";
import { Comment } from "talk-server/models/comment";
import { Tenant } from "talk-server/models/tenant";
import { User } from "talk-server/models/user";
import { assetClosed } from "talk-server/services/comments/moderation/phases/assetClosed";

describe("assetClosed", () => {
  it("throws an error when the asset is closed", () => {
    const asset = { closedAt: new Date() };

    expect(() =>
      assetClosed({
        asset: asset as Asset,
        tenant: (null as any) as Tenant,
        comment: (null as any) as Comment,
        author: (null as any) as User,
      })
    ).toThrow();
  });

  it("does not throw an error when the asset is not closed", () => {
    const now = new Date();

    expect(
      assetClosed({
        asset: { closedAt: new Date(now.getTime() + 60000) } as Asset,
        tenant: (null as any) as Tenant,
        comment: (null as any) as Comment,
        author: (null as any) as User,
      })
    ).toBeUndefined();

    expect(
      assetClosed({
        asset: {} as Asset,
        tenant: (null as any) as Tenant,
        comment: (null as any) as Comment,
        author: (null as any) as User,
      })
    ).toBeUndefined();
  });
});
