import React from 'react';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-heading">Generative AI Innovations</h1>

      <section className="article-section">
        <h2 className="article-title">State of the Art: Spring 2025</h2>
        <p className="article-text">
          The HatchWorks report highlights the rapid adoption and significant economic potential of generative AI. Organizations have increasingly integrated generative AI into their operations, with pilot programs and production deployments rising sharply from 2023 to 2024. This trend is expected to continue into 2025 and beyond. Economically, generative AI is poised to contribute trillions of dollars annually to the global economy, with projections ranging from $6.1 to $7.9 trillion. The technology's influence spans various sectors, including software development, where tools like GitHub Copilot have demonstrated substantial productivity gains. As generative AI continues to evolve, its impact on industries and the global economy is anticipated to grow correspondingly.<br /><br />
          Source: <a href="https://hatchworks.com/blog/gen-ai/generative-ai-statistics/" target="_blank" rel="noopener noreferrer">https://hatchworks.com/blog/gen-ai/generative-ai-statistics/</a>
        </p>
      </section>

      <section className="article-section">
        <h2 className="article-title">Web App Infrastructure and Tech Stack Spex</h2>
        <p className="article-text">
        This project uses a React frontend and a Node.js backend with Express. The data is stored in a MySQL database hosted on DigitalOcean as well. When the app runs, the frontend and backend communicate using HTTP requests, data from the chart is pulled using a JSON response. The app uses JWT for login security, so only logged-in users can access the main pages, but for the purposes of this application my first name is hardcoded in the backend as the username and password. Everything is hosted on a single DigitalOcean server, where NGINX is used to serve the frontend (on port 80) and route requests to the backend (on port 3000). The app is built as a single-page application, so the page doesn't reload when users move between sections. The chart data is all pulled from my mySQL database and uses chart.js to format the charts. I have ensured that if the user is not logged in, they cannot access any of the links in the toolbar, it all reroutes to the login page.
        </p>
      </section>
    </div>
  );
}

export default Dashboard;
