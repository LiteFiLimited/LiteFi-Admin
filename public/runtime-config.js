// LiteFi Admin Runtime Configuration
console.log("Loading LiteFi Admin runtime configuration...");

// Create window.process.env if it doesn't exist
window.process = window.process || {};
window.process.env = window.process.env || {};

// Set production API URL for the application
window.process.env.NEXT_PUBLIC_API_URL = "https://litefi-backend.onrender.com";
window.process.env.NEXT_PUBLIC_BACKEND_URL = "https://litefi-backend.onrender.com";
window.process.env.BACKEND_URL = "https://litefi-backend.onrender.com";

// Global API URL variables (some components might use these directly)
window.NEXT_PUBLIC_API_URL = "https://litefi-backend.onrender.com";
window.NEXT_PUBLIC_BACKEND_URL = "https://litefi-backend.onrender.com";
window.BACKEND_URL = "https://litefi-backend.onrender.com";

console.log("Runtime config loaded with API URL: https://litefi-backend.onrender.com");
