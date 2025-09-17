class FileManager {
  constructor() {
    this.files = this.loadFiles()
    this.initializeUI()
  }

  // Load files from localStorage
  loadFiles() {
    try {
      const saved = localStorage.getItem("jarvis_files")
      return saved ? JSON.parse(saved) : {}
    } catch (error) {
      console.error("Error loading files:", error)
      return {}
    }
  }

  // Save files to localStorage
  saveFiles() {
    try {
      localStorage.setItem("jarvis_files", JSON.stringify(this.files))
    } catch (error) {
      console.error("Error saving files:", error)
    }
  }

  // Initialize file manager UI
  initializeUI() {
    this.createFileManagerButton()
    this.createFileManagerModal()
  }

  // Create file manager button
  createFileManagerButton() {
    const button = document.createElement("button")
    button.id = "file-manager-btn"
    button.innerHTML = "📁 Files"
    button.className = "file-manager-button"
    button.onclick = () => this.showFileManager()

    // Add to header next to online/offline button
    const header = document.querySelector(".header") || document.querySelector(".top-bar") || document.body
    header.appendChild(button)
  }

  // Create file manager modal
  createFileManagerModal() {
    const modal = document.createElement("div")
    modal.id = "file-manager-modal"
    modal.className = "file-manager-modal hidden"
    modal.innerHTML = `
            <div class="file-manager-content">
                <div class="file-manager-header">
                    <h3>📁 JARVIS File Manager</h3>
                    <button class="close-btn" onclick="fileManager.hideFileManager()">✕</button>
                </div>
                <div class="file-manager-body">
                    <div id="file-list" class="file-list">
                        <p class="no-files">No files created yet. Ask JARVIS to create some files!</p>
                    </div>
                </div>
            </div>
        `
    document.body.appendChild(modal)
  }

  // Show file manager
  showFileManager() {
    const modal = document.getElementById("file-manager-modal")
    modal.classList.remove("hidden")
    this.refreshFileList()
  }

  // Hide file manager
  hideFileManager() {
    const modal = document.getElementById("file-manager-modal")
    modal.classList.add("hidden")
  }

  // Refresh file list
  refreshFileList() {
    const fileList = document.getElementById("file-list")
    const fileCount = Object.keys(this.files).length

    if (fileCount === 0) {
      fileList.innerHTML = '<p class="no-files">No files created yet. Ask JARVIS to create some files!</p>'
      return
    }

    let html = ""
    for (const [fileName, fileData] of Object.entries(this.files)) {
      html += `
                <div class="file-item" data-filename="${fileName}">
                    <div class="file-info">
                        <span class="file-icon">${this.getFileIcon(fileData.type)}</span>
                        <span class="file-name">${fileName}</span>
                        <span class="file-type">${fileData.type}</span>
                        <span class="file-date">${new Date(fileData.created).toLocaleDateString()}</span>
                    </div>
                    <div class="file-actions">
                        <button onclick="fileManager.openFile('${fileName}')" title="Open">👁️</button>
                        <button onclick="fileManager.renameFile('${fileName}')" title="Rename">✏️</button>
                        <button onclick="fileManager.deleteFile('${fileName}')" title="Delete">🗑️</button>
                        <button onclick="fileManager.downloadFile('${fileName}')" title="Download">⬇️</button>
                    </div>
                </div>
            `
    }
    fileList.innerHTML = html
  }

  // Get file icon based on type
  getFileIcon(type) {
    const icons = {
      html: "🌐",
      css: "🎨",
      js: "⚡",
      javascript: "⚡",
      python: "🐍",
      py: "🐍",
      java: "☕",
      kotlin: "🔷",
      kt: "🔷",
      cpp: "⚙️",
      c: "⚙️",
      txt: "📄",
      json: "📋",
      xml: "📋",
      image: "🖼️",
      png: "🖼️",
      jpg: "🖼️",
      jpeg: "🖼️",
      gif: "🖼️",
      default: "📄",
    }
    return icons[type.toLowerCase()] || icons.default
  }

  // Create new file
  createFile(fileName, content, type = "txt") {
    this.files[fileName] = {
      content: content,
      type: type,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    }
    this.saveFiles()
    return fileName
  }

  // Update existing file
  updateFile(fileName, content) {
    if (this.files[fileName]) {
      this.files[fileName].content = content
      this.files[fileName].modified = new Date().toISOString()
      this.saveFiles()
      return true
    }
    return false
  }

  // Open file
  openFile(fileName) {
    const file = this.files[fileName]
    if (!file) return

    const modal = document.createElement("div")
    modal.className = "file-viewer-modal"
    modal.innerHTML = `
            <div class="file-viewer-content">
                <div class="file-viewer-header">
                    <h3>📄 ${fileName}</h3>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()">✕</button>
                </div>
                <div class="file-viewer-body">
                    <pre><code>${this.escapeHtml(file.content)}</code></pre>
                </div>
                <div class="file-viewer-footer">
                    <button onclick="fileManager.editFile('${fileName}')">Edit</button>
                    <button onclick="fileManager.downloadFile('${fileName}')">Download</button>
                </div>
            </div>
        `
    document.body.appendChild(modal)
  }

  // Edit file
  editFile(fileName) {
    const file = this.files[fileName]
    if (!file) return

    const modal = document.createElement("div")
    modal.className = "file-editor-modal"
    modal.innerHTML = `
            <div class="file-editor-content">
                <div class="file-editor-header">
                    <h3>✏️ Edit ${fileName}</h3>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()">✕</button>
                </div>
                <div class="file-editor-body">
                    <textarea id="file-editor-textarea">${this.escapeHtml(file.content)}</textarea>
                </div>
                <div class="file-editor-footer">
                    <button onclick="fileManager.saveEditedFile('${fileName}')">Save</button>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()">Cancel</button>
                </div>
            </div>
        `
    document.body.appendChild(modal)
  }

  // Save edited file
  saveEditedFile(fileName) {
    const textarea = document.getElementById("file-editor-textarea")
    const content = textarea.value
    this.updateFile(fileName, content)
    document.querySelector(".file-editor-modal").remove()
    this.refreshFileList()
    this.speak(`File ${fileName} has been updated successfully.`)
  }

  // Rename file
  renameFile(fileName) {
    const newName = prompt(`Rename file "${fileName}" to:`, fileName)
    if (newName && newName !== fileName && !this.files[newName]) {
      this.files[newName] = this.files[fileName]
      delete this.files[fileName]
      this.saveFiles()
      this.refreshFileList()
      this.speak(`File renamed from ${fileName} to ${newName}.`)
    }
  }

  // Delete file
  deleteFile(fileName) {
    if (confirm(`Are you sure you want to delete "${fileName}"?`)) {
      delete this.files[fileName]
      this.saveFiles()
      this.refreshFileList()
      this.speak(`File ${fileName} has been deleted.`)
    }
  }

  // Download file
  downloadFile(fileName) {
    const file = this.files[fileName]
    if (!file) return

    const blob = new Blob([file.content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    this.speak(`File ${fileName} has been downloaded.`)
  }

  // Helper function to escape HTML
  escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }

  // Helper function for text-to-speech
  speak(text) {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      speechSynthesis.speak(utterance)
    }
  }

  // Get file list for JARVIS commands
  getFileList() {
    return Object.keys(this.files)
  }

  // Check if file exists
  fileExists(fileName) {
    return this.files.hasOwnProperty(fileName)
  }

  // Get file content
  getFileContent(fileName) {
    return this.files[fileName]?.content || null
  }
}

// Initialize file manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.fileManager = new FileManager()
})
