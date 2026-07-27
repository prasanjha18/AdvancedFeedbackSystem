# Advanced Feedback System

## Live Demo
* **Customer Feedback Form:** [https://advanced-feedback-system.vercel.app](https://advanced-feedback-system.vercel.app)
* **Backend API (Render):** [https://advancedfeedbacksystem.onrender.com](https://advancedfeedbacksystem.onrender.com)

---

## Tech Stack Choices
* **Frontend:** React with Tailwind CSS (Vite) - Chosen for fast development, optimal bundle sizes, and rapid UI styling.
* **Backend:** FastAPI (Python) - Chosen for native asynchronous support (great for WebSockets) and built-in Pydantic data validation.
* **Database:** PostgreSQL (Neon Cloud) - Chosen for persistent, reliable relational data storage in a serverless environment (falling back to SQLite for local development). 
* **LLM:** Google Gemini (2.5-flash) - Chosen for fast inference speeds and excellent JSON-mode structuring.
* **Security & Real-time:** JWT for stateless Admin authentication and native FastAPI WebSockets for live broadcasting.

---

## Setup Instructions
1. **Clone the repository:** 
   ```bash
   git clone [https://github.com/prasanjha18/AdvancedFeedbackSystem.git](https://github.com/prasanjha18/AdvancedFeedbackSystem.git)