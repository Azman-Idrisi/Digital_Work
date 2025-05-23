# Pinterest Infographic Screenshot App

This is a web application that displays an infographic about Pinterest marketing and allows users to take screenshots of it.

## Features

- Responsive infographic with a timeline layout
- "Take Screenshot" button to capture the infographic
- Backend API endpoint for capturing screenshots
- Automatic download of the captured screenshot

## Tech Stack

- Frontend: HTML, CSS, and vanilla JavaScript
- Backend: Node.js with Express
- Screenshot functionality: Puppeteer

## Setup Instructions

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Development Mode

To run the server in development mode with automatic restarts:

```bash
npm run dev
```

## How It Works

1. The frontend displays an infographic about Pinterest marketing
2. When the user clicks the "Take Screenshot" button, a request is sent to the backend
3. The backend uses Puppeteer to navigate to the page and take a screenshot
4. The screenshot is sent back to the frontend and automatically downloaded

## Requirements

- Node.js (v14 or higher recommended)
- NPM (v6 or higher recommended) 