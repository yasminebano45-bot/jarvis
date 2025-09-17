// Chat Interface Handler
class ChatHandler {
  constructor() {
    this.chatMessages = null
    this.messageHistory = []

    // Callbacks
    this.onMessageSent = null
    this.onJARVISResponse = null

    this.initializeElements()
    console.log("[v0] Chat Handler Initialized")
  }

  initializeElements() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.chatMessages = document.getElementById("chatMessages")
        console.log("[v0] Chat messages element found:", !!this.chatMessages)
      })
    } else {
      this.chatMessages = document.getElementById("chatMessages")
      console.log("[v0] Chat messages element found:", !!this.chatMessages)
    }
  }

  addUserMessage(message) {
    console.log("[v0] Adding user message:", message)
    const messageObj = {
      type: "user",
      content: message,
      timestamp: new Date(),
    }

    this.messageHistory.push(messageObj)
    this.renderMessage(messageObj)

    // The main.js will handle user messages directly through sendMessage() and handleSpeechInput()
  }

  addJARVISMessage(message) {
    console.log("[v0] Adding JARVIS message:", message)
    const messageObj = {
      type: "jarvis",
      content: message,
      timestamp: new Date(),
    }

    this.messageHistory.push(messageObj)
    this.renderMessage(messageObj)

    // This callback was causing JARVIS to respond to its own messages
  }

  renderMessage(messageObj) {
    if (!this.chatMessages) {
      console.error("[v0] Chat messages container not found")
      return
    }

    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${messageObj.type}`

    messageDiv.style.opacity = "0"
    messageDiv.style.transform = "translateY(20px)"

    messageDiv.innerHTML = this.formatMessage(messageObj.content)

    // Add timestamp (optional, can be shown on hover)
    messageDiv.title = messageObj.timestamp.toLocaleTimeString()

    this.chatMessages.appendChild(messageDiv)

    this.scrollToBottom()

    requestAnimationFrame(() => {
      messageDiv.style.opacity = "1"
      messageDiv.style.transform = "translateY(0)"
      messageDiv.style.transition = "all 0.5s ease-out"
    })
  }

  scrollToBottom() {
    if (this.chatMessages) {
      this.chatMessages.scrollTo({
        top: this.chatMessages.scrollHeight,
        behavior: "smooth",
      })
    }
  }

  clearHistory() {
    console.log("[v0] Clearing chat history")
    this.messageHistory = []
    if (this.chatMessages) {
      this.chatMessages.innerHTML = ""
    }
  }

  saveHistory() {
    if (this.messageHistory.length === 0) {
      console.log("[v0] No chat history to save")
      return
    }

    console.log("[v0] Saving chat history")
    let chatText = "JARVIS Chat History\n"
    chatText += "===================\n\n"

    this.messageHistory.forEach((msg) => {
      const timestamp = msg.timestamp.toLocaleString()
      const sender = msg.type === "user" ? "You" : "JARVIS"
      chatText += `[${timestamp}] ${sender}: ${msg.content}\n\n`
    })

    // Create and download file
    const blob = new Blob([chatText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `jarvis-chat-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  getHistory() {
    return this.messageHistory
  }

  formatMessage(content) {
    // Handle code blocks
    content = content.replace(
      /```([\s\S]*?)```/g,
      '<pre style="background: rgba(0,0,0,0.3); padding: 0.5rem; border-radius: 5px; margin: 0.5rem 0; overflow-x: auto;"><code>$1</code></pre>',
    )

    // Handle inline code
    content = content.replace(
      /`([^`]+)`/g,
      '<code style="background: rgba(0,0,0,0.2); padding: 0.2rem 0.4rem; border-radius: 3px; font-family: monospace;">$1</code>',
    )

    // Handle bold text
    content = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

    // Handle italic text
    content = content.replace(/\*(.*?)\*/g, "<em>$1</em>")

    // Handle line breaks
    content = content.replace(/\n/g, "<br>")

    return content
  }
}

if (typeof window !== "undefined") {
  window.chatHandler = new ChatHandler()
}
