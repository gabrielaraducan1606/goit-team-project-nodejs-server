import cors from "cors";

const corsOptions = {
  origin: "*", // trb setat domeniu frontend pt productie ex "http://localhost:3000" "https://myapp.netlify.app",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

export default cors(corsOptions);
