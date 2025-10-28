import React, { useEffect, useState } from "react";
import "./App.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000/api/notes";

function App() {
  const [notes, setNotes] = useState({});
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());

  // 서버에서 메모 가져오기
  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error("Fetch failed:", err));
  }, []);

  // 메모 저장
  const handleSubmit = async () => {
    if (!name || !selectedDate || !text) return alert("모든 칸을 채워주세요!");

    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: selectedDate, name, text }),
    });

    setNotes((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), { name, text }],
    }));

    setText("");
  };

  // 달력 렌더링
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    return (
      <div className="calendar-grid">
        {["일", "월", "화", "수", "목", "금", "토"].map((day, i) => (
          <div key={`header-${i}`} className="day header">
            {day}
          </div>
        ))}

        {days.map((day, i) => {
          const dateStr = `${year}-${month + 1}-${day}`;
          const isToday = dateStr === todayStr;
          const isSelected = selectedDate === dateStr;

          return (
            <div
              key={i}
              className={`day-cell ${day ? "active" : "empty"} ${
                isToday ? "today" : ""
              } ${isSelected ? "selected" : ""}`}
              onClick={() => day && setSelectedDate(dateStr)}
            >
              <div className="day-number">{day}</div>
              {notes[dateStr]?.map((n, idx) => (
                <div key={idx} className="note">
                  {n.name}: {n.text}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  // 월 이동
  const changeMonth = (delta) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1)
    );
  };

  return (
    <div className="App">
      <h1>📅 캘린더 프로젝트</h1>

      {/* 상단 월 이동 버튼 */}
      <div className="month-nav">
        <button onClick={() => changeMonth(-1)}>◀ 이전 달</button>
        <span>
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </span>
        <button onClick={() => changeMonth(1)}>다음 달 ▶</button>
      </div>

      {/* 메모 입력 */}
      <div className="memo-input">
        <div>
          이름: <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          {selectedDate && <p>선택된 날짜: {selectedDate}</p>}
          <textarea
            placeholder="메모 입력..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <button onClick={handleSubmit}>저장</button>
      </div>

      {/* 달력 표시 */}
      {renderCalendar()}
    </div>
  );
}

export default App;
