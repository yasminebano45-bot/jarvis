// Speech Recognition and Text-to-Speech Handler - FIXED VERSION
class SpeechHandler {
  constructor() {
    this.recognition = null
    this.synthesis = window.speechSynthesis
    this.isListening = false
    this.wakeWord = "hey jarvis"
    this.isProcessingWakeWord = false
    this.restartAttempts = 0
    this.maxRestartAttempts = 3
    this.restartTimeout = null

    // Callbacks
    this.onWakeWord = null
    this.onSpeechResult = null
    this.onListeningStart = null
    this.onListeningEnd = null

    this.initializeSpeechRecognition()
    console.log("[v0] Speech Handler Initialized - FIXED VERSION")
  }

  initializeSpeechRecognition() {
    // Check browser support
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      console.warn("[v0] Speech Recognition not supported in this browser")
      return
    }

    // Initialize recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    this.recognition = new SpeechRecognition()

    // Configure recognition
    this.recognition.continuous = true
    this.recognition.interimResults = true
    this.recognition.lang = "en-US"

    // Event handlers
    this.recognition.onstart = () => {
      this.isListening = true
      this.restartAttempts = 0 // Reset restart attempts on successful start
      console.log("[v0] Speech recognition started")
      if (this.onListeningStart) this.onListeningStart()
    }

    this.recognition.onend = () => {
      this.isListening = false
      console.log("[v0] Speech recognition ended")
      if (this.onListeningEnd) this.onListeningEnd()

      if (this.restartTimeout) {
        clearTimeout(this.restartTimeout)
      }

      this.restartTimeout = setTimeout(() => {
        if (
          window.jarvisApp &&
          window.jarvisApp.isOnline &&
          !this.isListening &&
          window.jarvisApp.currentState !== "speaking" &&
          window.jarvisApp.currentState !== "thinking" &&
          this.restartAttempts < this.maxRestartAttempts
        ) {
          console.log("[v0] Attempting to restart speech recognition")
          this.restartAttempts++
          this.startListening()
        }
      }, 1000) // Single restart attempt after 1 second
    }

    this.recognition.onresult = (event) => {
      let finalTranscript = ""
      let interimTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript

        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      const fullTranscript = (finalTranscript + interimTranscript).toLowerCase().trim()
      console.log("[v0] Speech transcript:", fullTranscript)

      if (fullTranscript.includes(this.wakeWord) && !this.isProcessingWakeWord) {
        this.isProcessingWakeWord = true
        console.log("[v0] Wake word detected:", fullTranscript)

        if (this.onWakeWord) this.onWakeWord()

        // Extract command after wake word
        const commandStart = fullTranscript.indexOf(this.wakeWord) + this.wakeWord.length
        const command = fullTranscript.substring(commandStart).trim()

        if (command && command.length > 2 && this.onSpeechResult) {
          console.log("[v0] Processing wake word command:", command)
          this.onSpeechResult(command)
        }

        setTimeout(() => {
          this.isProcessingWakeWord = false
        }, 2000)
      } else if (
        finalTranscript &&
        finalTranscript.trim().length > 2 &&
        window.jarvisApp &&
        window.jarvisApp.currentState === "listening"
      ) {
        console.log("[v0] Direct command received:", finalTranscript.trim())
        if (this.onSpeechResult) {
          this.onSpeechResult(finalTranscript.trim())
        }
      }
    }

    this.recognition.onerror = (event) => {
      console.error("[v0] Speech recognition error:", event.error)

      if (event.error === "not-allowed") {
        console.warn("[v0] Microphone access denied - stopping restart attempts")
        this.restartAttempts = this.maxRestartAttempts // Prevent further restarts
        return
      }

      if (event.error === "network" && this.restartAttempts < this.maxRestartAttempts) {
        console.warn("[v0] Network error, retrying...")
        this.restartAttempts++
        setTimeout(() => {
          if (window.jarvisApp && window.jarvisApp.isOnline && !this.isListening) {
            this.startListening()
          }
        }, 2000)
      }
    }
  }

  startListening() {
    if (this.recognition && !this.isListening) {
      try {
        console.log("[v0] Starting speech recognition...")
        this.recognition.start()
      } catch (error) {
        console.error("[v0] Error starting speech recognition:", error)

        if (error.name === "InvalidStateError") {
          console.log("[v0] Recognition already running, stopping first...")
          this.stopListening()
          setTimeout(() => {
            if (!this.isListening && window.jarvisApp?.isOnline) {
              this.recognition.start()
            }
          }, 500)
        }
      }
    } else if (this.isListening) {
      console.log("[v0] Speech recognition already running")
    } else {
      console.warn("[v0] Speech recognition not initialized")
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      console.log("[v0] Stopping speech recognition...")
      this.isListening = false

      if (this.restartTimeout) {
        clearTimeout(this.restartTimeout)
        this.restartTimeout = null
      }

      this.recognition.stop()
    }
  }

  speak(text, onEndCallback = null) {
    if (!this.synthesis) {
      console.warn("[v0] Speech synthesis not supported")
      if (onEndCallback) onEndCallback()
      return
    }

    // Cancel any ongoing speech
    this.synthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)

    // Configure voice for better JARVIS-like sound
    utterance.rate = 0.9
    utterance.pitch = 0.85
    utterance.volume = 0.9

    const voices = this.synthesis.getVoices()
    let preferredVoice = null

    // Try to find the best voice for JARVIS
    const voicePreferences = [
      (voice) => voice.name.toLowerCase().includes("google") && voice.lang.includes("en-US"),
      (voice) => voice.name.toLowerCase().includes("microsoft") && voice.lang.includes("en-US"),
      (voice) => voice.lang.includes("en-US") && voice.name.toLowerCase().includes("male"),
      (voice) => voice.lang.includes("en-US"),
      (voice) => voice.lang.includes("en"),
    ]

    for (const preference of voicePreferences) {
      preferredVoice = voices.find(preference)
      if (preferredVoice) break
    }

    if (preferredVoice) {
      utterance.voice = preferredVoice
      console.log("[v0] Using voice:", preferredVoice.name)
    }

    utterance.onstart = () => {
      console.log("[v0] JARVIS started speaking:", text.substring(0, 50) + "...")
    }

    let callbackExecuted = false

    const executeCallback = () => {
      if (!callbackExecuted && onEndCallback) {
        callbackExecuted = true
        console.log("[v0] JARVIS finished speaking - executing callback")
        onEndCallback()
      }
    }

    utterance.onend = executeCallback
    utterance.onerror = (event) => {
      console.error("[v0] Speech synthesis error:", event.error)
      executeCallback()
    }

    const maxSpeechTime = Math.max(text.length * 50, 3000)
    setTimeout(() => {
      if (!callbackExecuted) {
        console.warn("[v0] Speech callback timeout - forcing callback execution")
        executeCallback()
      }
    }, maxSpeechTime)

    // Speak
    this.synthesis.speak(utterance)
  }

  resetRestartAttempts() {
    this.restartAttempts = 0
  }

  // Get available voices
  getVoices() {
    return this.synthesis.getVoices()
  }

  // Set preferred voice
  setVoice(voiceName) {
    const voices = this.getVoices()
    this.preferredVoice = voices.find((voice) => voice.name === voiceName)
  }
}

if (typeof window !== "undefined") {
  window.speechHandler = new SpeechHandler()
}
