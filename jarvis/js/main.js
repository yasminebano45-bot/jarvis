// Main JARVIS Application Controller
class JARVISApp {
  constructor() {
    this.isOnline = false
    this.isListening = false
    this.currentState = "offline" // offline, idle, listening, thinking, speaking
    this.hasShownWelcome = false // Prevent multiple welcome messages

    this.initializeElements()
    this.bindEvents()
    this.initializeModules()

    console.log("[v0] JARVIS System Initialized")
  }

  initializeElements() {
    this.powerBtn = document.getElementById("powerBtn")
    this.jarvisCircle = document.getElementById("jarvisCircle")
    this.statusText = document.getElementById("statusText")
    this.chatContainer = document.getElementById("chatContainer")
    this.inputArea = document.getElementById("inputArea")
    this.textInput = document.getElementById("textInput")
    this.sendBtn = document.getElementById("sendBtn")
    this.fileBtn = document.getElementById("fileBtn")
    this.voiceIndicator = document.getElementById("voiceIndicator")
  }

  bindEvents() {
    this.powerBtn.addEventListener("click", () => this.togglePower())
    this.sendBtn.addEventListener("click", () => this.sendMessage())
    this.textInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.sendMessage()
    })
    this.fileBtn.addEventListener("click", () => this.handleFileUpload())
  }

  initializeModules() {
    setTimeout(() => {
      // Initialize speech recognition
      if (window.speechHandler) {
        window.speechHandler.onWakeWord = () => this.handleWakeWord()
        window.speechHandler.onSpeechResult = (text) => this.handleSpeechInput(text)
        window.speechHandler.onListeningStart = () => this.setState("listening")
        window.speechHandler.onListeningEnd = () => this.setState("idle")
        console.log("[v0] Speech handler connected")
      }

      // Initialize chat handler
      if (window.chatHandler) {
        console.log("[v0] Chat handler connected")
      }

      // Initialize file handler
      if (window.fileHandler) {
        window.fileHandler.onFileProcessed = (result) => this.handleFileResult(result)
        console.log("[v0] File handler connected")
      }
    }, 500)
  }

  togglePower() {
    this.isOnline = !this.isOnline
    console.log("[v0] Power toggled:", this.isOnline ? "ONLINE" : "OFFLINE")

    if (this.isOnline) {
      this.goOnline()
    } else {
      this.goOffline()
    }
  }

  goOnline() {
    console.log("[v0] Going online...")
    this.powerBtn.classList.remove("offline")
    this.powerBtn.classList.add("online")
    this.powerBtn.querySelector(".power-text").textContent = "ONLINE"

    this.chatContainer.style.display = "block"
    this.inputArea.style.display = "block"
    this.textInput.disabled = false
    this.sendBtn.disabled = false
    this.fileBtn.disabled = false

    this.setState("idle")
    this.updateStatus("System Online - Ready to assist")

    if (!this.hasShownWelcome) {
      setTimeout(() => {
        const welcomeMessage = "Greetings, I am JARVIS. How can I assist you today?"
        if (window.chatHandler) {
          window.chatHandler.addJARVISMessage(welcomeMessage)
        }
        this.speak(welcomeMessage)
        this.hasShownWelcome = true
        console.log("[v0] Welcome message sent")

        // Set state to idle after welcome message
        setTimeout(() => {
          this.setState("idle")
          // Start speech recognition after welcome
          if (window.speechHandler) {
            window.speechHandler.startListening()
            console.log("[v0] Speech recognition started after welcome")
          }
        }, 3000)
      }, 1500)
    } else {
      // If welcome already shown, just start listening
      setTimeout(() => {
        if (window.speechHandler) {
          window.speechHandler.startListening()
          console.log("[v0] Speech recognition started")
        }
      }, 1000)
    }
  }

  goOffline() {
    console.log("[v0] Going offline...")
    this.powerBtn.classList.remove("online")
    this.powerBtn.classList.add("offline")
    this.powerBtn.querySelector(".power-text").textContent = "OFFLINE"

    this.chatContainer.style.display = "none"
    this.inputArea.style.display = "none"
    this.textInput.disabled = true
    this.sendBtn.disabled = true
    this.fileBtn.disabled = true

    this.setState("offline")
    this.updateStatus("System Offline")
    this.hasShownWelcome = false // Reset welcome flag

    // Stop speech recognition
    if (window.speechHandler) {
      window.speechHandler.stopListening()
    }
  }

  setState(state) {
    this.currentState = state
    console.log("[v0] State changed to:", state)

    // Remove all state classes
    this.jarvisCircle.classList.remove("listening", "thinking", "speaking")

    // Add current state class
    if (state !== "offline" && state !== "idle") {
      this.jarvisCircle.classList.add(state)
    }

    // Update status text based on state
    switch (state) {
      case "offline":
        this.updateStatus("System Offline")
        break
      case "idle":
        this.updateStatus('Listening for "Hey JARVIS"...')
        break
      case "listening":
        this.updateStatus("Listening to your command...")
        this.voiceIndicator.style.display = "flex"
        break
      case "thinking":
        this.updateStatus("Processing your request...")
        this.voiceIndicator.style.display = "none"
        break
      case "speaking":
        this.updateStatus("Responding...")
        this.voiceIndicator.style.display = "none"
        break
    }
  }

  updateStatus(text) {
    this.statusText.textContent = text
  }

  handleWakeWord() {
    if (!this.isOnline) return
    console.log("[v0] Wake word detected")

    this.setState("listening")
  }

  handleSpeechInput(text) {
    if (!this.isOnline) return
    console.log("[v0] Speech input received:", text)

    this.setState("thinking")
    if (window.chatHandler) {
      window.chatHandler.addUserMessage(text)
    }
    this.processCommand(text)
  }

  sendMessage() {
    const message = this.textInput.value.trim()
    if (!message || !this.isOnline) return

    console.log("[v0] Text message sent:", message)
    this.textInput.value = ""
    this.setState("thinking")
    if (window.chatHandler) {
      window.chatHandler.addUserMessage(message)
    }
    this.processCommand(message)
  }

  async processCommand(command) {
    try {
      console.log("[v0] Processing command with Master Brain system:", command)

      // Identity check first
      if (window.checkIdentityQuestion) {
        const identityCheck = window.checkIdentityQuestion(command)
        if (identityCheck.isIdentityQuestion) {
          this.handleJARVISResponse(identityCheck.response)
          return
        }
      }

      // Special commands
      if (command.toLowerCase().includes("save chat") || command.toLowerCase().includes("chat history save")) {
        this.saveChatHistory()
        return
      }

      if (command.toLowerCase().includes("clear chat") || command.toLowerCase().includes("delete history")) {
        this.clearChatHistory()
        return
      }

      let response
      if (window.commandRouter) {
        console.log("[v0] Using Gemini Master Brain system for intelligent routing")
        response = await window.commandRouter.routeCommand(command)
      } else {
        console.log("[v0] Master Brain system not available, using fallback")
        response = "Master Brain system is not available. Please refresh the page and try again."
      }

      this.handleJARVISResponse(response)
    } catch (error) {
      console.error("[v0] Error processing command:", error)
      this.handleJARVISResponse(`I encountered an error: ${error.message}. Please try again.`)
    }
  }

  async generateIntelligentResponse(command) {
    try {
      console.log("[v0] Calling Gemini API for:", command)

      // Call Gemini API
      const response = await this.callGeminiAPI(command)
      return response
    } catch (error) {
      console.error("[v0] Gemini API error:", error)

      // Fallback to local responses if API fails
      const lowerCommand = command.toLowerCase()

      if (lowerCommand.includes("hello") || lowerCommand.includes("hi") || lowerCommand.includes("hey")) {
        return "Hello! I'm here and ready to assist you. What would you like me to help you with?"
      }

      if (lowerCommand.includes("how are you") || lowerCommand.includes("how do you feel")) {
        return "I'm functioning optimally and ready to assist you with any task you have in mind."
      }

      if (lowerCommand.includes("what can you do") || lowerCommand.includes("your capabilities")) {
        return "I can help you with web searches, file analysis, automation tasks, answer questions, and much more. Just tell me what you need!"
      }

      if (lowerCommand.includes("time") || lowerCommand.includes("what time")) {
        const currentTime = new Date().toLocaleTimeString()
        return `The current time is ${currentTime}.`
      }

      if (lowerCommand.includes("date") || lowerCommand.includes("what date")) {
        const currentDate = new Date().toLocaleDateString()
        return `Today's date is ${currentDate}.`
      }

      return "I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again in a moment."
    }
  }

  async callGeminiAPI(prompt) {
    const API_KEY = "YOUR_GEMINI_API_KEY" // Replace with actual API key
    const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are JARVIS, an advanced AI assistant. Respond helpfully and intelligently to: ${prompt}`,
                },
              ],
            },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text
      } else {
        throw new Error("Invalid API response format")
      }
    } catch (error) {
      console.error("[v0] Gemini API call failed:", error)
      throw error
    }
  }

  handleJARVISResponse(response) {
    console.log("[v0] JARVIS responding:", response)
    this.setState("speaking")

    if (window.chatHandler) {
      window.chatHandler.addJARVISMessage(response)
    }

    this.speak(response)
  }

  speak(text) {
    if (window.speechHandler && window.speechHandler.speak) {
      console.log("[v0] Speaking:", text.substring(0, 50) + "...")

      window.speechHandler.speak(text, () => {
        console.log("[v0] Speech completed - GOLDEN RULE: IMMEDIATELY restarting conversation loop")

        this.setState("idle")

        const restartListening = () => {
          if (this.isOnline && window.speechHandler && !window.speechHandler.isListening) {
            console.log("[v0] GOLDEN RULE: FORCING immediate speech recognition restart")
            try {
              window.speechHandler.startListening()
            } catch (error) {
              console.error("[v0] Error restarting speech recognition:", error)
              // Try again after a short delay
              setTimeout(() => {
                if (this.isOnline && !window.speechHandler.isListening) {
                  window.speechHandler.startListening()
                }
              }, 500)
            }
          } else {
            console.log("[v0] GOLDEN RULE: Retry conditions:", {
              isOnline: this.isOnline,
              speechHandlerExists: !!window.speechHandler,
              isListening: window.speechHandler?.isListening,
            })
          }
        }

        // Immediate restart with multiple aggressive attempts
        setTimeout(restartListening, 50)
        setTimeout(restartListening, 150)
        setTimeout(restartListening, 300)
        setTimeout(restartListening, 600)
        setTimeout(restartListening, 1000)
        setTimeout(restartListening, 1500)
        setTimeout(restartListening, 2000)
        setTimeout(restartListening, 3000)
      })
    }
  }

  handleFileUpload() {
    const fileInput = document.getElementById("fileInput")
    fileInput.click()

    fileInput.onchange = (e) => {
      const file = e.target.files[0]
      if (file && window.fileHandler) {
        window.fileHandler.processFile(file)
      }
    }
  }

  saveChatHistory() {
    if (window.chatHandler) {
      window.chatHandler.saveHistory()
      this.handleJARVISResponse("Chat history has been saved and is ready for download.")
    }
  }

  clearChatHistory() {
    if (window.chatHandler) {
      window.chatHandler.clearHistory()
      this.handleJARVISResponse("Chat history has been cleared.")
    }
  }

  handleUserMessage(message) {
    // This function is no longer called from chat handler to prevent duplicates
    console.log("[v0] Direct user message handling:", message)
    this.processCommand(message)
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("[v0] DOM loaded, initializing JARVIS...")
  window.jarvisApp = new JARVISApp()
})
