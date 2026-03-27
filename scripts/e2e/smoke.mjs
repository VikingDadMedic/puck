import { smoke } from "./smoke-framework.mjs";
import { dragAndDrop } from "./utils/drag-and-drop.mjs";

const runs = {
  oneLevel: async (page) => {
    await dragAndDrop(
      page,
      '[data-testid="drawer-item:Heading"]',
      '[data-testid="dropzone:root:default-zone"]'
    );
  },
  twoLevels: async (page) => {
    await dragAndDrop(
      page,
      '[data-testid="drawer-item:Grid"]',
      '[data-testid="dropzone:root:default-zone"]',
      "top"
    );

    await dragAndDrop(
      page,
      '[data-testid="drawer-item:Heading"]',
      '[data-testid="dropzone:root:default-zone"] [data-puck-dropzone]'
    );
  },
  threeLevels: async (page) => {
    await dragAndDrop(
      page,
      '[data-testid="drawer-item:Grid"]',
      '[data-testid="dropzone:root:default-zone"]',
      "top"
    );

    await dragAndDrop(
      page,
      '[data-testid="drawer-item:Grid"]',
      '[data-testid="dropzone:root:default-zone"] [data-puck-dropzone]'
    );

    await dragAndDrop(
      page,
      '[data-testid="drawer-item:Heading"]',
      '[data-testid="dropzone:root:default-zone"] [data-puck-dropzone] [data-puck-dropzone]'
    );
  },
  sixLevels: async (page) => {
    await dragAndDrop(
      page,
      '[data-testid="drawer-item:Grid"]',
      '[data-testid="dropzone:root:default-zone"]',
      "top"
    );

    await dragAndDrop(
      page,
      '[data-testid="drawer-item:Grid"]',
      '[data-testid="dropzone:root:default-zone"] [data-puck-dropzone]'
    );

    await dragAndDrop(
      page,
      '[data-testid="drawer-item:Grid"]',
      '[data-testid="dropzone:root:default-zone"] [data-puck-dropzone] [data-puck-dropzone]'
    );

    await dragAndDrop(
      page,
      '[data-testid="drawer-item:Grid"]',
      '[data-testid="dropzone:root:default-zone"] [data-puck-dropzone] [data-puck-dropzone] [data-puck-dropzone]'
    );

    await dragAndDrop(
      page,
      '[data-testid="drawer-item:Grid"]',
      '[data-testid="dropzone:root:default-zone"] [data-puck-dropzone] [data-puck-dropzone] [data-puck-dropzone] [data-puck-dropzone]'
    );

    await dragAndDrop(
      page,
      '[data-testid="drawer-item:Heading"]',
      '[data-testid="dropzone:root:default-zone"] [data-puck-dropzone] [data-puck-dropzone] [data-puck-dropzone] [data-puck-dropzone] [data-puck-dropzone]'
    );
  },
};

const tests = [
  {
    label: "iframe, 2 levels",
    url: "http://localhost:3000/test/edit?disableIframe=false",
    run: runs.twoLevels,
  },
  {
    label: "iframe, 6 levels",
    url: "http://localhost:3000/test/edit?disableIframe=false",
    run: runs.sixLevels,
  },
  {
    label: "no iframe, 2 levels",
    url: "http://localhost:3000/test/edit?disableIframe=true",
    run: runs.twoLevels,
  },
  {
    label: "no iframe, 6 levels",
    url: "http://localhost:3000/test/edit?disableIframe=true",
    run: runs.sixLevels,
  },
  {
    label: "travel-studio edit/save/preview/search",
    url: "http://localhost:3001/trip/edit",
    duration: 20,
    run: (() => {
      let completed = false;
      return async (page) => {
        if (completed) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return;
        }
        completed = true;

        const authHeaders = {};
        if (process.env.TRAVEL_STUDIO_API_KEY) {
          authHeaders["x-api-key"] = process.env.TRAVEL_STUDIO_API_KEY;
        }

        await page.waitForFunction(
          () =>
            Array.from(document.querySelectorAll("button")).some((btn) =>
              btn.textContent?.includes("Save Draft")
            ),
          { timeout: 60_000 }
        );

        const saveResponsePromise = page.waitForResponse(
          (response) =>
            response.url().includes("/api/documents") &&
            response.request().method() === "POST",
          { timeout: 60_000 }
        );
        await page.evaluate(() => {
          const saveButton = Array.from(document.querySelectorAll("button")).find(
            (btn) => btn.textContent?.includes("Save Draft")
          );
          if (!saveButton) {
            throw new Error("Save Draft button not found");
          }
          saveButton.click();
        });
        const saveResponse = await saveResponsePromise;
        if (![200, 409].includes(saveResponse.status())) {
          throw new Error(
            `Unexpected /api/documents status: ${saveResponse.status()}`
          );
        }

        const previewHref = await page.evaluate(() => {
          const previewLink = Array.from(document.querySelectorAll("a")).find(
            (a) => a.textContent?.includes("Preview")
          );
          return previewLink?.getAttribute("href") || null;
        });
        if (!previewHref) {
          throw new Error("Preview link not found");
        }
        await page.goto(`http://localhost:3001${previewHref}`, {
          waitUntil: "domcontentloaded",
        });
        await page.waitForSelector("body", { timeout: 60_000 });

        const imageSearchStatus = await page.evaluate(async (headers) => {
          const res = await fetch("/api/search/images?query=mediterranean", {
            headers,
          });
          await res.text();
          return res.status;
        }, authHeaders);
        if (![200, 502].includes(imageSearchStatus)) {
          throw new Error(
            `Unexpected /api/search/images status: ${imageSearchStatus}`
          );
        }

        await page.goto("http://localhost:3001/trip/edit", {
          waitUntil: "domcontentloaded",
        });
      };
    })(),
  },
];

(async () => {
  await smoke(tests, {
    chart: true,
    duration: 180,
    threshold: 300,
    puppeteerOptions: { headless: true },
  });
})();
