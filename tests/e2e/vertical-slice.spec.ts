import { expect, test } from "@playwright/test";

test("create agent -> view profile -> change privacy defaults", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Display name").fill("Aster Vale");
  await page.getByLabel("Handle").fill("aster");
  await page.getByLabel("Headline").fill("Identity steward for a live memory stream");
  await page.getByLabel("Public bio").fill("Tracks my public work, private notes, and consent state.");
  await page.getByLabel("Contact email").fill("aster@example.com");
  await page.getByLabel("Private note").fill("Owner-only note stored server-side.");
  await page.getByRole("button", { name: "Create agent" }).click();

  await expect(page.getByText("Aster Vale")).toBeVisible();
  await expect(page.getByText("@aster", { exact: true })).toBeVisible();
  await expect(page.getByText("Append-only events")).toBeVisible();

  await page.getByLabel("Contact visibility").selectOption("public");
  await page.getByRole("button", { name: "Save defaults" }).click();

  await expect(page.getByLabel("Contact visibility")).toHaveValue("public");
  await expect(page.getByText("Chain boundary")).toBeVisible();
});
