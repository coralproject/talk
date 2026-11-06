import { getLanguageDirection, isRTL } from "./direction";

describe("direction helpers", () => {
  describe("isRTL", () => {
    it("returns true for RTL locales", () => {
      expect(isRTL("ar-AE")).toBe(true);
      expect(isRTL("ar")).toBe(true);
      expect(isRTL("he-IL")).toBe(true);
      expect(isRTL("fa")).toBe(true);
      expect(isRTL("ur-PK")).toBe(true);
    });

    it("returns false for LTR locales", () => {
      expect(isRTL("en-US")).toBe(false);
      expect(isRTL("fr-FR")).toBe(false);
      expect(isRTL("es")).toBe(false);
      expect(isRTL("de-DE")).toBe(false);
      expect(isRTL("zh-CN")).toBe(false);
    });

    it("handles null or empty inputs", () => {
      expect(isRTL(null)).toBe(false);
      expect(isRTL(undefined)).toBe(false);
      expect(isRTL("")).toBe(false);
    });
  });

  describe("getLanguageDirection", () => {
    it("returns 'rtl' for RTL locales", () => {
      expect(getLanguageDirection("ar-AE")).toBe("rtl");
      expect(getLanguageDirection("he")).toBe("rtl");
    });

    it("returns 'ltr' for LTR locales", () => {
      expect(getLanguageDirection("en-US")).toBe("ltr");
      expect(getLanguageDirection("es")).toBe("ltr");
      expect(getLanguageDirection()).toBe("ltr");
    });
  });
});
