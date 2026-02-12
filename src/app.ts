import express from "express";
import routes from './routes/index.js';


const app = express();

const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
routes(app);


// Test route
app.get("/", (req, res) => {
  res.send("Node + TypeScript server running 🚀");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
export default app;