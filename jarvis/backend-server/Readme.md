# JARVIS Web Automation Backend

## Setup Instructions

1. **Install Dependencies**
   \`\`\`bash
   cd backend-server
   npm install
   \`\`\`

2. **Start the Server**
   \`\`\`bash
   npm start
   \`\`\`
   
   For development with auto-restart:
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Server Details**
   - Port: 3001
   - Health Check: http://localhost:3001/health
   - Automation Endpoint: http://localhost:3001/automate

## Supported Automation Actions

- **goto**: Navigate to a URL
- **type**: Type text into an input field
- **click**: Click on an element
- **scrape**: Extract text from elements
- **screenshot**: Take a screenshot
- **wait**: Wait for a specified duration
- **scroll**: Scroll to bottom of page
- **extract_links**: Get all links from page

## Example Usage

The frontend automatically converts voice commands to automation actions:

- "Search for AI news" → Google search automation
- "Open YouTube" → Navigate to YouTube
- "Go to amazon.com" → Navigate to Amazon
- "Take a screenshot" → Capture current page

## Troubleshooting

1. **Port 3001 already in use**: Change PORT in server.js
2. **Puppeteer installation issues**: Run `npm install puppeteer --unsafe-perm=true`
3. **CORS errors**: Ensure CORS is enabled in server.js
