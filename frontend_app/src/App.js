import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Rock Paper Scissors Game UI - React Functional Component
 * Modern, minimal, and responsive.
 * Primary: #1976D2 | Secondary: #FFC107 | Accent: #E53935
 *
 * Layout:
 *  - Top: Score display
 *  - Center: Move selection buttons
 *  - Bottom: Result/status
 */

// Color constants from spec
const COLORS = {
  primary: "#1976D2",   // Blue
  secondary: "#FFC107", // Yellow
  accent: "#E53935",    // Red
};

const moves = [
  { id: "rock", label: "✊ Rock", color: COLORS.primary },
  { id: "paper", label: "✋ Paper", color: COLORS.secondary },
  { id: "scissors", label: "✌️ Scissors", color: COLORS.accent }
];

// Returns "win", "lose", or "draw"
function getResult(player, computer) {
  if (player === computer) return "draw";
  if (
    (player === "rock"     && computer === "scissors") ||
    (player === "scissors" && computer === "paper") ||
    (player === "paper"    && computer === "rock")
  ) return "win";
  return "lose";
}

// PUBLIC_INTERFACE
function App() {
  // Score state
  const [score, setScore] = useState({win: 0, lose: 0, draw: 0});
  // Last play details
  const [playerMove, setPlayerMove] = useState(null);
  const [computerMove, setComputerMove] = useState(null);
  const [result, setResult] = useState(null);
  // Theme state
  const [theme, setTheme] = useState("light");

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  // PUBLIC_INTERFACE
  // Handle user selecting a move
  function handleMove(moveId) {
    // Computer randomly selects a move
    const compMoveId = moves[Math.floor(Math.random() * moves.length)].id;
    setPlayerMove(moveId);
    setComputerMove(compMoveId);

    // Get result and update score
    const verdict = getResult(moveId, compMoveId);
    setResult(verdict);
    setScore(prev => ({
      win:  prev.win  + (verdict === "win"  ? 1 : 0),
      lose: prev.lose + (verdict === "lose" ? 1 : 0),
      draw: prev.draw + (verdict === "draw" ? 1 : 0),
    }));
  }

  // UI utilities
  const moveButton = (move) => (
    <button
      key={move.id}
      className="move-btn"
      aria-label={move.label}
      style={{
        backgroundColor: move.color,
        color: "#fff",
        border: playerMove === move.id ? `3px solid ${COLORS.accent}` : "none",
        boxShadow: playerMove === move.id ? "0 4px 16px rgba(229,57,53,0.09)" : undefined,
      }}
      onClick={() => handleMove(move.id)}
      tabIndex={0}
    >
      {move.label}
    </button>
  );

  return (
    <div className="App game-app">
      <header className="game-header">
        <button 
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          style={{ backgroundColor: COLORS.primary, color: "#fff"}}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <h1 className="game-title">Rock Paper Scissors</h1>
        <div className="scoreboard" role="status" aria-label="Scoreboard">
          <span className="score win" style={{color: COLORS.primary}}>Win: {score.win}</span>
          <span className="score lose" style={{color: COLORS.accent}}>Lose: {score.lose}</span>
          <span className="score draw" style={{color: COLORS.secondary}}>Draw: {score.draw}</span>
        </div>
      </header>
      <main className="game-main">
        <div className="moves-row" role="group" aria-label="Move selection">
          {moves.map(move => moveButton(move))}
        </div>
        <div className="game-status" aria-live="polite">
          {playerMove == null ? (
            <p className="prompt" style={{color: COLORS.primary}}>Select your move to play!</p>
          ) : (
            <>
              <p>
                You picked <strong>{moves.find(m=>m.id===playerMove).label}</strong> 
                &nbsp;– Computer picked <strong>{moves.find(m=>m.id===computerMove).label}</strong>
              </p>
              <ResultDisplay result={result} />
            </>
          )}
        </div>
      </main>
      <footer className="game-footer">
        <button
          className="reset-btn"
          style={{backgroundColor: COLORS.secondary, color:"#222"}}
          onClick={() => {
            setPlayerMove(null); setComputerMove(null); setResult(null);
            setScore({win: 0, lose: 0, draw: 0});
          }}
          aria-label="Reset Game"
        >
          Reset
        </button>
        <div className="credit" style={{fontSize:"0.9rem", color:"var(--text-secondary)", marginTop:"16px"}}>
          <span>Modern React game UI demo</span>
        </div>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
function ResultDisplay({ result }) {
  if (!result) return null;
  let text = "", color = "";
  switch(result) {
    case "win":  text = "You Win! 🎉";    color = COLORS.primary;   break;
    case "lose": text = "You Lose! 😥";   color = COLORS.accent;    break;
    case "draw": text = "It's a Draw.";   color = COLORS.secondary; break;
    default: break;
  }
  return <div className={`result result-${result}`} style={{color, fontWeight:700, fontSize:"1.3rem", marginTop:"18px"}}>{text}</div>;
}

export default App;
