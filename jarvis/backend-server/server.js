const express = require("express")
const puppeteer = require("puppeteer")
const cors = require("cors")

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Global browser instance for better performance
let browser = null

// Initialize browser
async function initBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: false, // Set to true for production
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })
  }
  return browser
}

// Web Automation API Endpoint
app.post("/automate", async (req, res) => {
  try {
    const { actions } = req.body

    if (!actions || !Array.isArray(actions)) {
      return res.status(400).json({
        success: false,
        error: "Actions array is required",
      })
    }

    await initBrowser()
    const page = await browser.newPage()

    // Set viewport and user agent
    await page.setViewport({ width: 1366, height: 768 })
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")

    const results = []

    // Execute each action
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i]
      console.log(`[JARVIS Backend] Executing action ${i + 1}:`, action)

      try {
        switch (action.action) {
          case "goto":
            await page.goto(action.url, { waitUntil: "networkidle2", timeout: 30000 })
            results.push({ action: "goto", success: true, url: action.url })
            break

          case "type":
            await page.waitForSelector(action.selector, { timeout: 10000 })
            await page.type(action.selector, action.text)
            results.push({ action: "type", success: true, selector: action.selector })
            break

          case "click":
            await page.waitForSelector(action.selector, { timeout: 10000 })
            await page.click(action.selector)
            await page.waitForTimeout(2000) // Wait for page response
            results.push({ action: "click", success: true, selector: action.selector })
            break

          case "scrape":
            await page.waitForSelector(action.selector, { timeout: 10000 })
            const scrapedData = await page.evaluate((selector) => {
              const elements = document.querySelectorAll(selector)
              return Array.from(elements).map((el) => el.textContent.trim())
            }, action.selector)
            results.push({ action: "scrape", success: true, data: scrapedData })
            break

          case "screenshot":
            const screenshot = await page.screenshot({
              path: `screenshots/screenshot-${Date.now()}.png`,
              fullPage: action.fullPage || false,
            })
            results.push({ action: "screenshot", success: true, message: "Screenshot saved" })
            break

          case "wait":
            await page.waitForTimeout(action.duration || 2000)
            results.push({ action: "wait", success: true, duration: action.duration })
            break

          case "scroll":
            await page.evaluate(() => {
              window.scrollTo(0, document.body.scrollHeight)
            })
            results.push({ action: "scroll", success: true })
            break

          case "extract_links":
            const links = await page.evaluate(() => {
              return Array.from(document.querySelectorAll("a")).map((a) => ({
                text: a.textContent.trim(),
                href: a.href,
              }))
            })
            results.push({ action: "extract_links", success: true, data: links })
            break

          default:
            results.push({ action: action.action, success: false, error: "Unknown action" })
        }
      } catch (actionError) {
        console.error(`[JARVIS Backend] Action failed:`, actionError.message)
        results.push({
          action: action.action,
          success: false,
          error: actionError.message,
        })
      }
    }

    await page.close()

    res.json({
      success: true,
      message: "Automation completed successfully",
      results: results,
    })
  } catch (error) {
    console.error("[JARVIS Backend] Automation failed:", error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "JARVIS Backend is running", timestamp: new Date().toISOString() })
})

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("[JARVIS Backend] Shutting down gracefully...")
  if (browser) {
    await browser.close()
  }
  process.exit(0)
})

app.listen(PORT, () => {
  console.log(`[JARVIS Backend] Server running on port ${PORT}`)
  console.log(`[JARVIS Backend] Health check: http://localhost:${PORT}/health`)
})
