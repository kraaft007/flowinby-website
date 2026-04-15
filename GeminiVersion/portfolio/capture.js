import { chromium } from 'playwright';
import fs from 'fs';

async function takeScreenshots() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Routes to screenshot
  const routes = [
    { name: 'home', url: 'http://localhost:5173/' },
    { name: 'about', url: 'http://localhost:5173/about' },
    { name: 'experience', url: 'http://localhost:5173/experience' },
    { name: 'projects', url: 'http://localhost:5173/projects' },
    { name: 'final', url: 'http://localhost:5173/final' }
  ];

  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }

  for (const route of routes) {
    try {
      await page.goto(route.url);
      await page.waitForTimeout(1000); // Wait for animations
      await page.screenshot({ path: `screenshots/${route.name}.png`, fullPage: true });
      console.log(`Captured ${route.name}`);
    } catch (e) {
      console.error(`Failed to capture ${route.name}: ${e.message}`);
    }
  }

  await browser.close();
}

takeScreenshots();
