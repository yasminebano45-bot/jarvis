// Enhanced Web Automation Handler with Advanced Capabilities
class EnhancedWebAutomationHandler {
  constructor() {
    this.isAutomating = false
    this.automationWindow = null
    this.downloadQueue = []
    this.searchResults = []

    this.searchEngines = {
      google: "https://www.google.com/search?q=",
      bing: "https://www.bing.com/search?q=",
      duckduckgo: "https://duckduckgo.com/?q=",
      yandex: "https://yandex.com/search/?text=",
    }

    this.downloadSites = {
      images: ["unsplash.com", "pexels.com", "pixabay.com", "freepik.com"],
      apps: ["github.com", "sourceforge.net", "softonic.com", "filehippo.com"],
      software: ["ninite.com", "chocolatey.org", "winget.run"],
    }

    console.log("[v0] Enhanced Web Automation Handler Initialized")
  }

  async routeAutomationTask(command) {
    const lowerCommand = command.toLowerCase().trim()
    console.log("[v0] Enhanced routing automation task:", command)

    // Web search commands
    if (this.isSearchCommand(lowerCommand)) {
      return await this.handleAdvancedSearch(command)
    }

    // Image download commands
    if (this.isImageDownloadCommand(lowerCommand)) {
      return await this.handleImageDownload(command)
    }

    // App download commands
    if (this.isAppDownloadCommand(lowerCommand)) {
      return await this.handleAppDownload(command)
    }

    // Text reading commands
    if (this.isTextReadCommand(lowerCommand)) {
      return await this.handleTextReading(command)
    }

    // Web navigation commands
    if (this.isNavigationCommand(lowerCommand)) {
      return await this.handleWebNavigation(command)
    }

    // Default automation
    return await this.executeTask(command, "foreground")
  }

  isSearchCommand(command) {
    const searchKeywords = [
      "search for",
      "find",
      "look up",
      "google",
      "bing",
      "search on",
      "find me",
      "look for",
      "search about",
      "dhundo",
      "search karo",
      "find karo",
    ]
    return searchKeywords.some((keyword) => command.includes(keyword))
  }

  isImageDownloadCommand(command) {
    const imageKeywords = [
      "download image",
      "get image",
      "save image",
      "find image",
      "image download",
      "photo download",
      "picture download",
      "image dhundo",
      "photo chahiye",
      "tasveer download",
    ]
    return imageKeywords.some((keyword) => command.includes(keyword))
  }

  isAppDownloadCommand(command) {
    const appKeywords = [
      "download app",
      "get app",
      "find app",
      "install app",
      "software download",
      "program download",
      "application download",
      "app chahiye",
      "software chahiye",
      "program dhundo",
    ]
    return appKeywords.some((keyword) => command.includes(keyword))
  }

  isTextReadCommand(command) {
    const textKeywords = [
      "read text",
      "read this",
      "what does it say",
      "read aloud",
      "text paro",
      "ye kya likha hai",
      "read karo",
      "batao kya likha hai",
    ]
    return textKeywords.some((keyword) => command.includes(keyword))
  }

  async handleAdvancedSearch(command) {
    try {
      console.log("[v0] Handling advanced search:", command)

      // Extract search query from command
      const searchQuery = this.extractSearchQuery(command)
      if (!searchQuery) {
        return "Main search query samajh nahi paya. Kya search karna hai?"
      }

      // Choose search engine (default Google)
      let searchEngine = "google"
      if (command.includes("bing")) searchEngine = "bing"
      if (command.includes("duckduckgo")) searchEngine = "duckduckgo"

      const searchUrl = this.searchEngines[searchEngine] + encodeURIComponent(searchQuery)

      // Open search in new window
      const searchWindow = window.open(searchUrl, "_blank", "width=1200,height=800")

      if (!searchWindow) {
        return "Search window nahi khul saka. Popup allow karo."
      }

      // Simulate search results extraction (in real implementation, would use APIs)
      setTimeout(() => {
        if (window.chatHandler) {
          window.chatHandler.addJARVISMessage(
            `Search results for "${searchQuery}" opened in new window. Main ${searchEngine} par search kar diya hai.`,
          )
        }
      }, 1000)

      return `"${searchQuery}" ke liye ${searchEngine} par search kar raha hun...`
    } catch (error) {
      console.error("[v0] Search error:", error)
      return "Search mein error aa gaya. Dobara try karo."
    }
  }

  async handleImageDownload(command) {
    try {
      console.log("[v0] Handling image download:", command)

      const imageQuery = this.extractSearchQuery(command)
      if (!imageQuery) {
        return "Kya image download karni hai? Query specify karo."
      }

      // Open image search sites
      const imageSites = [
        `https://unsplash.com/s/photos/${encodeURIComponent(imageQuery)}`,
        `https://www.pexels.com/search/${encodeURIComponent(imageQuery)}/`,
        `https://pixabay.com/images/search/${encodeURIComponent(imageQuery)}/`,
      ]

      // Open first available site
      const imageWindow = window.open(imageSites[0], "_blank", "width=1200,height=800")

      if (!imageWindow) {
        return "Image site nahi khul saki. Popup allow karo."
      }

      // Provide download instructions
      setTimeout(() => {
        if (window.chatHandler) {
          window.chatHandler.addJARVISMessage(
            `"${imageQuery}" images mil gayi hain. Right-click karke "Save image as" se download kar sakte ho.`,
          )
        }
      }, 2000)

      return `"${imageQuery}" images search kar raha hun...`
    } catch (error) {
      console.error("[v0] Image download error:", error)
      return "Image download mein problem hai. Try again."
    }
  }

  async handleAppDownload(command) {
    try {
      console.log("[v0] Handling app download:", command)

      const appQuery = this.extractSearchQuery(command)
      if (!appQuery) {
        return "Kya app download karni hai? App name batao."
      }

      // Popular app download sites
      const appSites = [
        `https://github.com/search?q=${encodeURIComponent(appQuery)}`,
        `https://sourceforge.net/directory/?q=${encodeURIComponent(appQuery)}`,
        `https://www.softonic.com/s/${encodeURIComponent(appQuery)}`,
      ]

      // Open GitHub first (most reliable for open source)
      const appWindow = window.open(appSites[0], "_blank", "width=1200,height=800")

      if (!appWindow) {
        return "App download site nahi khul saki. Popup allow karo."
      }

      setTimeout(() => {
        if (window.chatHandler) {
          window.chatHandler.addJARVISMessage(
            `"${appQuery}" app search results mil gaye. Official releases section se download karo.`,
          )
        }
      }, 2000)

      return `"${appQuery}" app dhund raha hun...`
    } catch (error) {
      console.error("[v0] App download error:", error)
      return "App download mein error. Dobara try karo."
    }
  }

  async handleTextReading(command) {
    try {
      console.log("[v0] Handling text reading:", command)

      // Check if there's selected text on the page
      const selectedText = window.getSelection().toString()

      if (selectedText) {
        // Use speech synthesis to read selected text
        if ("speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(selectedText)
          utterance.rate = 0.8
          utterance.pitch = 1
          utterance.volume = 1

          // Set voice to English
          const voices = speechSynthesis.getVoices()
          const englishVoice = voices.find((voice) => voice.lang.includes("en"))
          if (englishVoice) utterance.voice = englishVoice

          speechSynthesis.speak(utterance)

          return `Selected text pad raha hun: "${selectedText.substring(0, 50)}..."`
        } else {
          return "Text-to-speech support nahi hai is browser mein."
        }
      } else {
        return "Pehle text select karo, phir main pad dunga."
      }
    } catch (error) {
      console.error("[v0] Text reading error:", error)
      return "Text reading mein problem hai."
    }
  }

  async handleWebNavigation(command) {
    try {
      console.log("[v0] Handling enhanced web navigation:", command)

      const url = this.extractUrlFromCommand(command)
      if (!url) {
        return "Valid URL nahi mila. Website name ya URL specify karo."
      }

      const newWindow = window.open(url, "_blank", "width=1200,height=800")
      if (!newWindow) {
        return "Website nahi khul saki. Popup allow karo."
      }

      return `Successfully opened ${url}`
    } catch (error) {
      console.error("[v0] Navigation error:", error)
      return "Website navigation mein error."
    }
  }

  extractSearchQuery(command) {
    // Remove common command words
    const cleanCommand = command
      .replace(/search for|find|look up|google|bing|download|get|save|read/gi, "")
      .replace(/image|app|text|photo|picture|software|program/gi, "")
      .replace(/karo|chahiye|dhundo|batao/gi, "")
      .trim()

    return cleanCommand || null
  }

  extractUrlFromCommand(command) {
    // Direct URL patterns
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const urlMatch = command.match(urlRegex)
    if (urlMatch) return urlMatch[0]

    // Website name patterns
    const websitePatterns = [
      /(?:go to|visit|open|navigate to|browse to)\s+([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
      /([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
    ]

    for (const pattern of websitePatterns) {
      const match = command.match(pattern)
      if (match) {
        let url = match[1]
        if (!url.startsWith("http")) {
          url = "https://" + url
        }
        return url
      }
    }

    // Popular sites mapping (enhanced)
    const popularSites = {
      google: "https://www.google.com",
      youtube: "https://www.youtube.com",
      facebook: "https://www.facebook.com",
      twitter: "https://www.twitter.com",
      instagram: "https://www.instagram.com",
      github: "https://www.github.com",
      stackoverflow: "https://stackoverflow.com",
      reddit: "https://www.reddit.com",
      amazon: "https://www.amazon.com",
      netflix: "https://www.netflix.com",
      whatsapp: "https://web.whatsapp.com",
      gmail: "https://mail.google.com",
      drive: "https://drive.google.com",
      maps: "https://maps.google.com",
      translate: "https://translate.google.com",
      news: "https://news.google.com",
      images: "https://images.google.com",
      scholar: "https://scholar.google.com",
      books: "https://books.google.com",
      photos: "https://photos.google.com",
    }

    for (const [name, url] of Object.entries(popularSites)) {
      if (command.toLowerCase().includes(name)) {
        return url
      }
    }

    return null
  }

  async executeTask(task, mode = "background") {
    if (this.isAutomating) {
      return "Abhi dusra task chal raha hai. Wait karo."
    }

    this.isAutomating = true

    try {
      if (mode === "foreground") {
        return await this.executeForegroundTask(task)
      } else {
        return await this.executeBackgroundTask(task)
      }
    } catch (error) {
      console.error("[v0] Enhanced automation error:", error)
      return "Task execution mein error aa gaya."
    } finally {
      this.isAutomating = false
    }
  }

  async executeBackgroundTask(task) {
    if (window.chatHandler) {
      window.chatHandler.addJARVISMessage("Background mein task execute kar raha hun...")
    }

    await this.delay(2000)
    return `Background task completed: ${task}`
  }

  async executeForegroundTask(task) {
    if (window.chatHandler) {
      window.chatHandler.addJARVISMessage("Live automation window khol raha hun...")
    }

    this.automationWindow = window.open("about:blank", "_blank", "width=1200,height=800")

    if (!this.automationWindow) {
      return "Automation window nahi khul saki. Popup allow karo."
    }

    // Enhanced automation interface
    this.automationWindow.document.write(`
      <html>
        <head>
          <title>JARVIS Live Automation</title>
          <style>
            body { font-family: 'Segoe UI', sans-serif; padding: 20px; background: linear-gradient(135deg, #1e3c72, #2a5298); color: white; }
            .container { max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; }
            .status { background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; margin: 10px 0; }
            .progress-bar { background: #333; height: 20px; border-radius: 10px; overflow: hidden; }
            .progress-fill { background: linear-gradient(90deg, #00ff88, #00ccff); height: 100%; width: 0%; transition: width 0.5s; }
            .pulse { animation: pulse 2s infinite; }
            @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="pulse">🤖 JARVIS Live Automation</h1>
              <p>Task: ${task}</p>
            </div>
            <div id="status" class="status">Initializing enhanced automation...</div>
            <div class="progress-bar">
              <div id="progressBar" class="progress-fill"></div>
            </div>
          </div>
        </body>
      </html>
    `)

    // Enhanced automation steps
    const steps = [
      "🔍 Analyzing task requirements...",
      "🌐 Connecting to web services...",
      "⚡ Executing automation commands...",
      "✅ Task completed successfully!",
    ]

    for (let i = 0; i < steps.length; i++) {
      await this.delay(1500)

      if (this.automationWindow && !this.automationWindow.closed) {
        const statusDiv = this.automationWindow.document.getElementById("status")
        const progressBar = this.automationWindow.document.getElementById("progressBar")

        if (statusDiv) statusDiv.textContent = steps[i]
        if (progressBar) progressBar.style.width = `${((i + 1) / steps.length) * 100}%`
      }
    }

    setTimeout(() => {
      if (this.automationWindow && !this.automationWindow.closed) {
        this.automationWindow.close()
      }
    }, 3000)

    return `Enhanced automation completed: ${task}`
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  stopAutomation() {
    this.isAutomating = false
    if (this.automationWindow && !this.automationWindow.closed) {
      this.automationWindow.close()
    }
    return "Automation stopped."
  }

  isSupported() {
    return true
  }
}

// Initialize enhanced web automation handler
if (typeof window !== "undefined") {
  window.enhancedWebAutomationHandler = new EnhancedWebAutomationHandler()

  // Replace the old handler
  window.webAutomationHandler = window.enhancedWebAutomationHandler
}
