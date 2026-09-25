import { quietly } from "@/utils/quietly";

describe("quietly", () => {
  it("appelle la fonction", () => {
    const fn = jest.fn();
    quietly(fn);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("avale le rejet de la promesse rendue", async () => {
    const rejection = Promise.reject(new Error("offline"));
    const spy = jest.spyOn(rejection, "catch");
    quietly(() => rejection);
    expect(spy).toHaveBeenCalled();
    await expect(rejection).rejects.toThrow("offline");
  });

  it("accepte une fonction qui ne rend pas de promesse", () => {
    expect(() => quietly(() => 42)).not.toThrow();
  });
});
