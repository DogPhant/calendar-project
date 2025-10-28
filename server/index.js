const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

let notes = {}; // { '2025-10-27': [ { name, text } ] }

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.post("/api/notes", (req, res) => {
  const { date, name, text } = req.body;
  if (!notes[date]) notes[date] = [];
  notes[date].push({ name, text });
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
