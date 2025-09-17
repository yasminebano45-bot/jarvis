class MemorySystem {
  constructor() {
    this.conversations = this.loadConversations()
    this.userPreferences = this.loadUserPreferences()
    this.context = this.loadContext()
  }

  // Load conversations from localStorage
  loadConversations() {
    try {
      const saved = localStorage.getItem("jarvis_conversations")
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error("Error loading conversations:", error)
      return []
    }
  }

  // Save conversations to localStorage
  saveConversations() {
    try {
      // Keep only last 100 conversations to prevent storage overflow
      const recentConversations = this.conversations.slice(-100)
      localStorage.setItem("jarvis_conversations", JSON.stringify(recentConversations))
    } catch (error) {
      console.error("Error saving conversations:", error)
    }
  }

  // Load user preferences
  loadUserPreferences() {
    try {
      const saved = localStorage.getItem("jarvis_preferences")
      return saved
        ? JSON.parse(saved)
        : {
            name: "User",
            language: "en",
            voiceEnabled: true,
            theme: "dark",
          }
    } catch (error) {
      console.error("Error loading preferences:", error)
      return { name: "User", language: "en", voiceEnabled: true, theme: "dark" }
    }
  }

  // Save user preferences
  saveUserPreferences() {
    try {
      localStorage.setItem("jarvis_preferences", JSON.stringify(this.userPreferences))
    } catch (error) {
      console.error("Error saving preferences:", error)
    }
  }

  // Load context
  loadContext() {
    try {
      const saved = localStorage.getItem("jarvis_context")
      return saved
        ? JSON.parse(saved)
        : {
            currentProject: null,
            recentFiles: [],
            lastActivity: null,
          }
    } catch (error) {
      console.error("Error loading context:", error)
      return { currentProject: null, recentFiles: [], lastActivity: null }
    }
  }

  // Save context
  saveContext() {
    try {
      localStorage.setItem("jarvis_context", JSON.stringify(this.context))
    } catch (error) {
      console.error("Error saving context:", error)
    }
  }

  // Add conversation to memory
  addConversation(userInput, jarvisResponse) {
    const conversation = {
      timestamp: new Date().toISOString(),
      user: userInput,
      jarvis: jarvisResponse,
    }

    this.conversations.push(conversation)
    this.saveConversations()
  }

  // Get recent conversations
  getRecentConversations(count = 10) {
    return this.conversations.slice(-count)
  }

  // Search conversations
  searchConversations(query) {
    return this.conversations.filter(
      (conv) =>
        conv.user.toLowerCase().includes(query.toLowerCase()) ||
        conv.jarvis.toLowerCase().includes(query.toLowerCase()),
    )
  }

  // Update user preference
  updatePreference(key, value) {
    this.userPreferences[key] = value
    this.saveUserPreferences()
  }

  // Get user preference
  getPreference(key) {
    return this.userPreferences[key]
  }

  // Update context
  updateContext(key, value) {
    this.context[key] = value
    this.context.lastActivity = new Date().toISOString()
    this.saveContext()
  }

  // Get context
  getContext(key) {
    return this.context[key]
  }

  // Clear all memory (reset JARVIS)
  clearMemory() {
    if (
      confirm(
        "Are you sure you want to clear all JARVIS memory? This will delete all conversations, files, and preferences.",
      )
    ) {
      localStorage.removeItem("jarvis_conversations")
      localStorage.removeItem("jarvis_preferences")
      localStorage.removeItem("jarvis_context")
      localStorage.removeItem("jarvis_files")

      this.conversations = []
      this.userPreferences = { name: "User", language: "en", voiceEnabled: true, theme: "dark" }
      this.context = { currentProject: null, recentFiles: [], lastActivity: null }

      alert("JARVIS memory has been cleared.")
      location.reload()
    }
  }
}

// Initialize memory system when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.memorySystem = new MemorySystem()
})
