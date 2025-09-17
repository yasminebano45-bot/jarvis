// File Upload and Processing Handler
class FileHandler {
  constructor() {
    this.supportedTypes = [".txt", ".html", ".py", ".js", ".css", ".json", ".md"]
    this.currentFile = null

    // Callbacks
    this.onFileProcessed = null

    console.log("[v0] File Handler Initialized")
  }

  processFile(file) {
    console.log("[v0] Processing file:", file.name)
    if (!this.isFileSupported(file)) {
      this.showError("File type not supported. Supported types: " + this.supportedTypes.join(", "))
      return
    }

    this.currentFile = file
    this.readFile(file)
  }

  isFileSupported(file) {
    const extension = "." + file.name.split(".").pop().toLowerCase()
    return this.supportedTypes.includes(extension)
  }

  readFile(file) {
    const reader = new FileReader()

    reader.onload = (e) => {
      const content = e.target.result
      this.handleFileContent(file, content)
    }

    reader.onerror = () => {
      this.showError("Error reading file")
    }

    reader.readAsText(file)
  }

  handleFileContent(file, content) {
    const fileInfo = {
      name: file.name,
      size: file.size,
      type: file.type,
      content: content,
      lines: content.split("\n").length,
    }

    const message = `📁 File uploaded successfully!\n\n**${file.name}**\n- Size: ${this.formatFileSize(file.size)}\n- Lines: ${fileInfo.lines}\n- Type: ${file.type || "Unknown"}`

    if (window.chatHandler) {
      window.chatHandler.addJARVISMessage(message)
    }

    // Analyze file content
    setTimeout(() => {
      this.analyzeFile(fileInfo)
    }, 500)

    if (this.onFileProcessed) {
      this.onFileProcessed(fileInfo)
    }
  }

  analyzeFile(fileInfo) {
    console.log("[v0] Analyzing file:", fileInfo.name)
    let analysis = `🔍 **File Analysis Complete**\n\n`
    analysis += `**Basic Information:**\n`
    analysis += `- Name: ${fileInfo.name}\n`
    analysis += `- Size: ${this.formatFileSize(fileInfo.size)}\n`
    analysis += `- Lines: ${fileInfo.lines}\n`
    analysis += `- Characters: ${fileInfo.content.length}\n\n`

    // Basic content analysis
    const extension = fileInfo.name.split(".").pop().toLowerCase()
    analysis += `**Content Analysis:**\n`

    switch (extension) {
      case "html":
        analysis += this.analyzeHTML(fileInfo.content)
        break
      case "js":
        analysis += this.analyzeJavaScript(fileInfo.content)
        break
      case "py":
        analysis += this.analyzePython(fileInfo.content)
        break
      case "css":
        analysis += this.analyzeCSS(fileInfo.content)
        break
      case "json":
        analysis += this.analyzeJSON(fileInfo.content)
        break
      default:
        analysis += `- File type: Text document\n`
        analysis += `- Word count: ${fileInfo.content.split(/\s+/).length}\n`
    }

    if (window.chatHandler) {
      window.chatHandler.addJARVISMessage(analysis)
    }
  }

  analyzeHTML(content) {
    const tags = content.match(/<[^>]+>/g) || []
    const uniqueTags = [...new Set(tags.map((tag) => tag.match(/<(\w+)/)?.[1]).filter(Boolean))]

    return `- HTML elements: ${uniqueTags.join(", ")}\n- Total tags: ${tags.length}\n- Document type: HTML\n`
  }

  analyzeJavaScript(content) {
    const functions = content.match(/function\s+\w+/g) || []
    const classes = content.match(/class\s+\w+/g) || []
    const variables = content.match(/(?:var|let|const)\s+\w+/g) || []

    return `- Functions: ${functions.length}\n- Classes: ${classes.length}\n- Variables: ${variables.length}\n- Language: JavaScript\n`
  }

  analyzePython(content) {
    const functions = content.match(/def\s+\w+/g) || []
    const classes = content.match(/class\s+\w+/g) || []
    const imports = content.match(/(?:import|from)\s+\w+/g) || []

    return `- Functions: ${functions.length}\n- Classes: ${classes.length}\n- Imports: ${imports.length}\n- Language: Python\n`
  }

  analyzeCSS(content) {
    const selectors = content.match(/[^{}]+(?=\s*{)/g) || []
    const properties = content.match(/[^{}:]+(?=\s*:)/g) || []

    return `- CSS selectors: ${selectors.length}\n- CSS properties: ${properties.length}\n- Stylesheet type: CSS\n`
  }

  analyzeJSON(content) {
    try {
      const parsed = JSON.parse(content)
      const keys = Object.keys(parsed).length
      return `- JSON structure: Valid\n- Top-level keys: ${keys}\n- Data type: JSON\n`
    } catch (error) {
      return `- JSON structure: Invalid (${error.message})\n- Data type: JSON (malformed)\n`
    }
  }

  editFile(instructions) {
    if (!this.currentFile) {
      this.showError("No file currently loaded")
      return
    }

    // This would implement file editing based on instructions
    // For now, just acknowledge the request
    if (window.chatHandler) {
      window.chatHandler.addJARVISMessage("File editing functionality will be implemented with AI integration.")
    }
  }

  createFile(filename, content) {
    console.log("[v0] Creating file:", filename)
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    if (window.chatHandler) {
      window.chatHandler.addJARVISMessage(`✅ File "${filename}" has been created and is ready for download.`)
    }
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  showError(message) {
    console.error("[v0] File handler error:", message)
    if (window.chatHandler) {
      window.chatHandler.addJARVISMessage(`❌ Error: ${message}`)
    }
  }
}

if (typeof window !== "undefined") {
  window.fileHandler = new FileHandler()
}
