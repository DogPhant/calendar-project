const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;
const DATA_FILE = path.join(__dirname, "notes.json");

app.use(cors());
app.use(express.json());

// ✅ React 정적 파일 제공
app.use(express.static(path.join(__dirname, "public")));

// 📖 저장된 메모 가져오기
app.get("/api/notes", (req, res) => {
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.json({});
    }
    try {
      res.json(JSON.parse(data || "{}"));
    } catch {
      res.json({});
    }
  });
});

// 📝 새 메모 저장
app.post("/api/notes", (req, res) => {
  const { date, name, text } = req.body;
  if (!date || !name || !text)
    return res.status(400).json({ error: "Invalid data" });

  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    let notes = {};
    if (!err && data) notes = JSON.parse(data);
    if (!notes[date]) notes[date] = [];
    notes[date].push({ name, text });

    fs.writeFile(DATA_FILE, JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to save" });
      }
      res.json({ success: true });
    });
  });
});

// ✅ React SPA 대응 (모든 경로를 index.html로 리턴)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
