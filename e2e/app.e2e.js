describe("Application", () => {
  it("se lance correctement", async () => {
    await expect(element(by.id("home-title"))).toBeVisible();
  });
});
