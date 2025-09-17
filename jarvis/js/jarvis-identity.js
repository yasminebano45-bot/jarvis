// JARVIS Personal Identity Data
const jarvisIdentity = {
  name: "JARVIS",
  fullName: "Just A Rather Very Intelligent System",
  creator: "Bilal",
  purpose: "Main aapka personal AI assistant hoon, jise Bilal ne web ke liye design kiya hai.",
  version: "1.0",
  capabilities: [
    "Voice recognition aur speech synthesis",
    "File processing aur analysis",
    "Web search aur information retrieval",
    "Chat conversation aur intelligent responses",
    "Task automation aur assistance",
  ],
  personality: {
    greeting: "Greetings, I am JARVIS. How can I assist you today?",
    aboutSelf:
      "I am JARVIS, your personal AI assistant created by Bilal. I'm designed to help you with various tasks using voice commands and text input.",
    aboutCreator:
      "I was created by Bilal, who designed me to be your intelligent personal assistant for web-based tasks.",
  },
}

// Identity check functions
function checkIdentityQuestion(question) {
  const lowerQuestion = question.toLowerCase()

  // Name related questions
  if (
    lowerQuestion.includes("what is your name") ||
    lowerQuestion.includes("what's your name") ||
    lowerQuestion.includes("who are you")
  ) {
    return {
      isIdentityQuestion: true,
      response: `${jarvisIdentity.personality.aboutSelf}`,
    }
  }

  // Creator related questions
  if (
    lowerQuestion.includes("who created you") ||
    lowerQuestion.includes("who made you") ||
    lowerQuestion.includes("who built you") ||
    lowerQuestion.includes("your creator") ||
    lowerQuestion.includes("your developer")
  ) {
    return {
      isIdentityQuestion: true,
      response: `${jarvisIdentity.personality.aboutCreator}`,
    }
  }

  // Capabilities questions
  if (
    lowerQuestion.includes("what can you do") ||
    lowerQuestion.includes("your capabilities") ||
    lowerQuestion.includes("your features")
  ) {
    return {
      isIdentityQuestion: true,
      response: `I can help you with: ${jarvisIdentity.capabilities.join(", ")}. Just tell me what you need assistance with!`,
    }
  }

  return { isIdentityQuestion: false }
}

// Export for use in other modules
if (typeof window !== "undefined") {
  window.jarvisIdentity = jarvisIdentity
  window.checkIdentityQuestion = checkIdentityQuestion
}
