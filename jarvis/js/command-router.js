// JARVIS Master Brain System - Gemini-Powered Intelligent Routing
class CommandRouter {
  constructor() {
    this.geminiApiKey = this.getGeminiApiKey()
    this.wikipediaApiUrl = "https://en.wikipedia.org/api/rest_v1/page/summary/"
    this.googleSearchApiKey = "AIzaSyC_m-H_5qA5x45prSXgAh7oeBjL4HEbMLg" // Replace with actual API key
    this.googleSearchEngineId = "33d0b0a677e594545" // Replace with actual search engine ID

    console.log("[v0] JARVIS Master Brain System initialized with Gemini-2.0-Flash")
  }

  getGeminiApiKey() {
    // Try to get from environment variable first
    if (typeof process !== "undefined" && process.env && process.env.GEMINI_API_KEY) {
      return process.env.GEMINI_API_KEY
    }

    // Try to get from localStorage
    let apiKey = localStorage.getItem("gemini_api_key")

    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") {
      // Prompt user for API key
      apiKey = prompt("Please enter your Gemini API Key:")
      if (apiKey) {
        localStorage.setItem("gemini_api_key", apiKey)
      }
    }

    return apiKey || "YOUR_GEMINI_API_KEY"
  }

  // Main routing function - ALL queries go to Gemini first (Master Brain)
  async routeCommand(command) {
    console.log("[v0] Master Brain processing command:", command)

    try {
      // STEP 1: Send EVERY query to Gemini first (Master Brain)
      const geminiPlan = await this.getGeminiPlan(command)
      console.log("[v0] Gemini Master Brain plan:", geminiPlan)

      // STEP 2: Execute the plan that Gemini created
      return await this.executePlan(geminiPlan, command)
    } catch (error) {
      console.error("[v0] Master Brain system error:", error)
      return `I'm experiencing a system error: ${error.message}. Please try again.`
    }
  }

  // Get intelligent plan from Gemini (Master Brain)
  async getGeminiPlan(command) {
    try {
      console.log("[v0] Consulting Gemini Master Brain for:", command)

      // Check if API key is configured
      if (!this.geminiApiKey || this.geminiApiKey === "YOUR_GEMINI_API_KEY") {
        console.error("[v0] Gemini API key not configured!")
        throw new Error("Gemini API key not configured. Please set up the API key.")
      }

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.geminiApiKey}`

      const systemPrompt = `You are JARVIS Master Brain. Analyze the user's query and decide the best approach.

CRITICAL: RESPOND ONLY WITH VALID JSON. NO OTHER TEXT BEFORE OR AFTER THE JSON.

For Wikipedia searches (factual information about people, places, history):
{"tool": "wikipedia", "query": "search term", "explanation": "why wikipedia"}

For Google searches (current events, real-time info, latest news):
{"tool": "google_search", "query": "search term", "explanation": "why google search"}

For web automation (navigate, download, fill forms):
{"tool": "web_automation", "action": "navigate|download|search|form", "target": "url or search term", "explanation": "why automation"}

For direct conversation (creative, explanatory, coding, personal chat):
{"tool": "direct_response", "response": "your direct answer here", "explanation": "why direct response"}

User Query: "${command}"

JSON Response:`

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: systemPrompt,
              },
            ],
          },
        ],
      }

      console.log("[v0] Sending request to Gemini-2.0-Flash Master Brain")

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": this.geminiApiKey,
        },
        body: JSON.stringify(requestBody),
      })

      console.log("[v0] Gemini Master Brain response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Gemini Master Brain API error:", errorText)
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("[v0] Gemini Master Brain raw response:", JSON.stringify(data, null, 2))

      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        let responseText = data.candidates[0].content.parts[0].text.trim()
        console.log("[v0] Gemini Master Brain response text:", responseText)

        // Remove any markdown formatting or extra text
        responseText = responseText
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim()

        // Find JSON object in the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          responseText = jsonMatch[0]
        }

        // Parse JSON response
        try {
          const plan = JSON.parse(responseText)
          console.log("[v0] Gemini Master Brain parsed plan:", plan)

          if (!plan.tool) {
            console.warn("[v0] Invalid plan structure, missing tool field")
            return {
              tool: "direct_response",
              response: "I'm having trouble understanding your request. Could you please rephrase it?",
              explanation: "Invalid plan structure from Gemini",
            }
          }

          return plan
        } catch (parseError) {
          console.error("[v0] Failed to parse Gemini plan as JSON:", parseError)
          console.error("[v0] Raw response text:", responseText)

          return {
            tool: "direct_response",
            response:
              "I understand your request, but I'm having trouble processing it right now. Could you try asking in a different way?",
            explanation: "JSON parsing failed, using fallback response",
          }
        }
      } else {
        console.error("[v0] Invalid Gemini Master Brain response structure:", data)
        throw new Error("Invalid Gemini API response structure")
      }
    } catch (error) {
      console.error("[v0] Gemini Master Brain error:", error)
      throw error
    }
  }

  // Execute the plan created by Gemini Master Brain
  async executePlan(plan, originalCommand) {
    console.log("[v0] Executing Gemini Master Brain plan:", plan)

    try {
      switch (plan.tool) {
        case "wikipedia":
          console.log("[v0] Executing Wikipedia search as planned by Master Brain")
          return await this.handleWikipediaQuery(plan.query)

        case "google_search":
          console.log("[v0] Executing Google search as planned by Master Brain")
          return await this.handleGoogleSearchQuery(plan.query)

        case "web_automation":
          console.log("[v0] Executing web automation as planned by Master Brain")
          return await this.executeWebAutomation(plan, originalCommand)

        case "direct_response":
          console.log("[v0] Using direct response as planned by Master Brain")
          return plan.response

        default:
          console.warn("[v0] Unknown tool in Gemini plan:", plan.tool)
          return plan.response || "I'm not sure how to handle that request. Please try rephrasing it."
      }
    } catch (error) {
      console.error("[v0] Plan execution error:", error)
      return `I encountered an error while executing the plan: ${error.message}`
    }
  }

  // Handle Wikipedia queries
  async handleWikipediaQuery(query) {
    try {
      console.log("[v0] Wikipedia search for:", query)

      const response = await fetch(`${this.wikipediaApiUrl}${encodeURIComponent(query)}`)

      if (!response.ok) {
        throw new Error(`Wikipedia API error: ${response.status}`)
      }

      const data = await response.json()

      if (data.extract) {
        return `${data.extract}\n\nSource: Wikipedia`
      } else {
        throw new Error("No Wikipedia information found")
      }
    } catch (error) {
      console.error("[v0] Wikipedia API error:", error)
      throw error
    }
  }

  // Handle Google Search queries
  async handleGoogleSearchQuery(query) {
    try {
      console.log("[v0] Google Search for:", query)

      if (this.googleSearchApiKey === "YOUR_GOOGLE_API_KEY") {
        throw new Error("Google Search API key not configured")
      }

      const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${this.googleSearchApiKey}&cx=${this.googleSearchEngineId}&q=${encodeURIComponent(query)}&num=3`

      const response = await fetch(searchUrl)

      if (!response.ok) {
        throw new Error(`Google Search API error: ${response.status}`)
      }

      const data = await response.json()

      if (data.items && data.items.length > 0) {
        const topResults = data.items.slice(0, 3)
        let searchSummary = "Here's what I found:\n\n"

        topResults.forEach((item, index) => {
          searchSummary += `${index + 1}. ${item.title}\n${item.snippet}\n\n`
        })

        return searchSummary + "Source: Google Search"
      } else {
        throw new Error("No search results found")
      }
    } catch (error) {
      console.error("[v0] Google Search API error:", error)
      throw error
    }
  }

  // Execute backend-powered web automation
  async executeWebAutomation(plan, originalCommand) {
    try {
      console.log("[v0] Starting backend web automation for:", originalCommand)

      // Convert user command to Puppeteer actions
      const actions = this.convertToAutomationActions(plan, originalCommand)

      if (actions.length === 0) {
        return "I couldn't determine the specific automation steps for your request. Please be more specific."
      }

      const backendUrl = "https://jarvis-ai-assistant-production.up.railway.app/automate"

      console.log("[v0] Sending automation request to backend:", actions)

      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ actions }),
      })

      if (!response.ok) {
        throw new Error(`Backend server error: ${response.status}`)
      }

      const result = await response.json()
      console.log("[v0] Backend automation result:", result)

      if (result.success) {
        return this.formatAutomationResult(result, originalCommand)
      } else {
        throw new Error(result.error || "Automation failed")
      }
    } catch (error) {
      console.error("[v0] Web automation error:", error)

      if (error.message.includes("Failed to fetch")) {
        return "The automation backend server is not responding. Please check if the Railway server is running at: https://jarvis-ai-assistant-production.up.railway.app"
      }

      return `Web automation failed: ${error.message}`
    }
  }

  // Convert commands to Puppeteer actions
  convertToAutomationActions(plan, command) {
    const actions = []
    const lowerCommand = command.toLowerCase()

    // Google Search automation
    if (lowerCommand.includes("search") || lowerCommand.includes("google")) {
      const searchQuery = plan.target || plan.query || command.replace(/search|google|for/gi, "").trim()
      actions.push(
        { action: "goto", url: "https://www.google.com" },
        { action: "type", selector: 'textarea[name="q"]', text: searchQuery },
        { action: "click", selector: 'input[name="btnK"]' },
        { action: "wait", duration: 3000 },
        { action: "scrape", selector: ".g h3" },
      )
    }
    // YouTube automation
    else if (lowerCommand.includes("youtube") || lowerCommand.includes("video")) {
      const searchQuery = command.replace(/youtube|video|search|for/gi, "").trim()
      actions.push(
        { action: "goto", url: "https://www.youtube.com" },
        { action: "type", selector: 'input[name="search_query"]', text: searchQuery },
        { action: "click", selector: 'button[id="search-icon-legacy"]' },
        { action: "wait", duration: 3000 },
      )
    }
    // Amazon automation
    else if (lowerCommand.includes("amazon") || lowerCommand.includes("buy") || lowerCommand.includes("shop")) {
      const searchQuery = command.replace(/amazon|buy|shop|for/gi, "").trim()
      actions.push(
        { action: "goto", url: "https://www.amazon.com" },
        { action: "type", selector: 'input[id="twotabsearchtextbox"]', text: searchQuery },
        { action: "click", selector: 'input[id="nav-search-submit-button"]' },
        { action: "wait", duration: 3000 },
        { action: "scrape", selector: '[data-component-type="s-search-result"] h2' },
      )
    }
    // Facebook automation
    else if (lowerCommand.includes("facebook") || lowerCommand.includes("fb")) {
      actions.push({ action: "goto", url: "https://www.facebook.com" }, { action: "wait", duration: 3000 })
    }
    // Twitter/X automation
    else if (lowerCommand.includes("twitter") || lowerCommand.includes("x.com")) {
      actions.push({ action: "goto", url: "https://x.com" }, { action: "wait", duration: 3000 })
    }
    // LinkedIn automation
    else if (lowerCommand.includes("linkedin")) {
      actions.push({ action: "goto", url: "https://www.linkedin.com" }, { action: "wait", duration: 3000 })
    }
    // GitHub automation
    else if (lowerCommand.includes("github")) {
      const searchQuery = command.replace(/github|search|for/gi, "").trim()
      if (searchQuery) {
        actions.push(
          { action: "goto", url: "https://github.com" },
          { action: "type", selector: 'input[name="q"]', text: searchQuery },
          { action: "click", selector: 'button[type="submit"]' },
          { action: "wait", duration: 3000 },
        )
      } else {
        actions.push({ action: "goto", url: "https://github.com" })
      }
    }
    // Generic website navigation
    else if (lowerCommand.includes("open") || lowerCommand.includes("go to") || lowerCommand.includes("visit")) {
      const urlMatch = command.match(/(https?:\/\/[^\s]+)/i)
      if (urlMatch) {
        actions.push({ action: "goto", url: urlMatch[1] })
      } else {
        // Try to extract website name
        const siteMatch = command.match(/(?:open|go to|visit)\s+([a-zA-Z0-9.-]+(?:\.[a-zA-Z]{2,})?)/i)
        if (siteMatch) {
          let url = siteMatch[1]
          if (!url.startsWith("http")) {
            url = "https://" + url
          }
          actions.push({ action: "goto", url })
        }
      }
    }
    // Screenshot
    else if (lowerCommand.includes("screenshot") || lowerCommand.includes("capture")) {
      actions.push({ action: "screenshot", fullPage: true })
    }

    return actions
  }

  // Format automation results
  formatAutomationResult(result, originalCommand) {
    let response = "✅ Web automation completed successfully!\n\n"

    const successfulActions = result.results.filter((r) => r.success)
    const failedActions = result.results.filter((r) => !r.success)

    if (successfulActions.length > 0) {
      response += `Completed ${successfulActions.length} actions:\n`
      successfulActions.forEach((action, index) => {
        switch (action.action) {
          case "goto":
            response += `• Navigated to ${action.url}\n`
            break
          case "type":
            response += `• Entered text in search field\n`
            break
          case "click":
            response += `• Clicked search button\n`
            break
          case "scrape":
            if (action.data && action.data.length > 0) {
              response += `• Found ${action.data.length} results:\n`
              action.data.slice(0, 5).forEach((item, i) => {
                response += `  ${i + 1}. ${item}\n`
              })
            }
            break
          case "screenshot":
            response += `• Screenshot captured\n`
            break
          default:
            response += `• ${action.action} completed\n`
        }
      })
    }

    if (failedActions.length > 0) {
      response += `\n⚠️ ${failedActions.length} actions failed:\n`
      failedActions.forEach((action) => {
        response += `• ${action.action}: ${action.error}\n`
      })
    }

    return response
  }
}

// Initialize command router
if (typeof window !== "undefined") {
  window.commandRouter = new CommandRouter()
}
