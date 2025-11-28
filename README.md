NIZZ Analytics Dashboard - Installation Guide

This dashboard is a React application powered by Vite and styled with Tailwind CSS. It uses Recharts for data visualization and Lucide React for icons.

Prerequisites

Node.js: You need Node.js installed to run React apps. Download it from nodejs.org.

Code Editor: VS Code is recommended.

Step 1: Create the Project

Open your terminal (Command Prompt or Terminal) and run the following commands to create a new React project:

npm create vite@latest nizz-analytics -- --template react
cd nizz-analytics
npm install


Step 2: Install Dependencies

Install the libraries used in the dashboard (Charts and Icons):

npm install recharts lucide-react


Step 3: Setup Tailwind CSS

Since the dashboard uses Tailwind for styling, you need to configure it.

Install Tailwind:

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p



Configure tailwind.config.js: Open the tailwind.config.js file created in your project folder and replace its content with:

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}



Add Tailwind to CSS: Open src/index.css and replace its entire content with:

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Optional: Dark mode background for the whole body */
body {
  background-color: #030712; /* gray-950 */
  color: white;
}


Step 4: Add the Application Code

Go to the src folder.

Open App.jsx.

Delete everything inside and paste the entire code from the dashboard.jsx file provided in the chat.

Important: Ensure the component name in the file matches. If you paste the code, make sure the export is export default function Dashboard() { ... } and change main.jsx to import it if necessary, or simply rename the component in App.jsx to App.

Step 5: Run the App

Back in your terminal, run:

npm run dev



You will see a link (usually http://localhost:5173). Ctrl+Click that link to open your dashboard in the browser!

Deployment

To share this app with others (like sending a link), you can deploy it for free using services like Vercel or Netlify.

Push your code to a GitHub repository.

Log in to Vercel/Netlify.

Import your repository.

They will automatically detect it's a Vite React app and publish it.
