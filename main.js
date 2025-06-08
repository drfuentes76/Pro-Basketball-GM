const output = document.getElementById("game-output");
const input = document.getElementById("game-input");

let gameState = {
  teamName: "Houston Rockets",
  year: 2026,
  balance: 95000000,
  capSpace: 120000000,
  roster: [],
  draftPicks: [7, 37],
  record: { wins: 0, losses: 0 },
  news: [],
  hallOfFame: [],
};

async function loadInitialData() {
  const res = await fetch("players.json");
  const data = await res.json();
  gameState.roster = data.filter(p => p.team === gameState.teamName);
  showIntro();
}

function showIntro() {
  output.textContent = `
🏀 ${gameState.teamName} - Year ${gameState.year}
💰 Cap: $${(gameState.capSpace - totalPayroll()).toLocaleString()}
📋 Commands: roster | simulate | save | load | draft | news | trade | playoffs | hall
`;
}

function handleInput() {
  const cmd = input.value.trim().toLowerCase();
  input.value = "";
  switch (cmd) {
    case "roster": showRoster(); break;
    case "simulate": simulateSeason(); break;
    case "draft": showDraft(); break;
    case "save": saveGame(); break;
    case "load": loadGame(); break;
    case "news": showNews(); break;
    case "trade": makeTrade(); break;
    case "playoffs": simulatePlayoffs(); break;
    case "hall": showHallOfFame(); break;
    default: output.textContent = "❓ Unknown command.";
  }
}

function showRoster() {
  let txt = "📋 Roster:
";
  gameState.roster.forEach(p => {
    txt += `${p.position} - ${p.name} (OVR: ${p.rating}) - $${p.salary}M - ${p.morale}
`;
  });
  output.textContent = txt;
}

function totalPayroll() {
  return gameState.roster.reduce((sum, p) => sum + (p.salary || 0), 0);
}

function simulateSeason() {
  const wins = Math.floor(Math.random() * 30) + 25;
  const losses = 82 - wins;
  gameState.record = { wins, losses };
  gameState.year++;
  gameState.news.push(`📰 ${gameState.teamName} finished ${wins}-${losses} in ${gameState.year - 1}.`);
  if (wins >= 45) {
    gameState.hallOfFame.push(`${gameState.teamName} - ${gameState.year - 1}`);
  }
  output.textContent = `🏁 You finished ${wins}-${losses}. Type 'playoffs' or 'save'.`;
}

function simulatePlayoffs() {
  output.textContent = `🏆 ${gameState.teamName} reached the 2nd round but lost to the Lakers.
Better luck next season!`;
}

function showDraft() {
  output.textContent = "🧑‍🎓 Top Draft Prospects:
1. Marcus King (PG - Duke)
2. Leo Zhang (C - Gonzaga)
3. Devonte Wells (SF - UCLA)";
}

function showNews() {
  output.textContent = "📰 News Feed:
" + gameState.news.join("\n");
}

function saveGame() {
  localStorage.setItem("basketballGM", JSON.stringify(gameState));
  output.textContent = "💾 Game saved!";
}

function loadGame() {
  const save = localStorage.getItem("basketballGM");
  if (save) {
    gameState = JSON.parse(save);
    showIntro();
  } else {
    output.textContent = "⚠️ No saved game found.";
  }
}

function makeTrade() {
  if (gameState.roster.length > 0) {
    let traded = gameState.roster.pop();
    gameState.news.push(`🔁 Traded ${traded.name} for a 2nd-round pick.`);
    output.textContent = `🔁 ${traded.name} traded away!`;
  } else {
    output.textContent = "⚠️ No players to trade.";
  }
}

function showHallOfFame() {
  output.textContent = "🏅 Hall of Fame Seasons:
" + (gameState.hallOfFame.join("\n") || "None yet.");
}

loadInitialData();

// -------------------- DEEPER GAME LOGIC BELOW --------------------

// Enforce salary cap and luxury tax penalties
function enforceSalaryCap() {
  const payroll = totalPayroll();
  if (payroll > gameState.capSpace) {
    gameState.news.push("⚠️ Over the salary cap! Penalties may apply.");
    gameState.balance -= (payroll - gameState.capSpace) * 1.1;
  }
}

// Evaluate trade value (simplified logic)
function evaluateTradeValue(player) {
  const ratingValue = player.rating * 1.5;
  const agePenalty = (player.age > 30 ? 10 : 0);
  const moraleBonus = (player.morale === "Happy" ? 5 : 0);
  return ratingValue - agePenalty + moraleBonus;
}

// Generate and simulate playoff bracket
function generatePlayoffBracket() {
  output.textContent = "🏆 Simulating 8-team bracket...
Houston Rockets reach Finals!
Lose to Boston Celtics 4-2.";
  gameState.news.push("🏆 Playoff run ends in Finals vs Celtics.");
}

// Morale and fatigue adjustments
function adjustPlayerMoraleAndFatigue() {
  gameState.roster.forEach(player => {
    if (Math.random() < 0.3) {
      player.morale = "Unhappy";
      gameState.news.push(`${player.name} is unhappy with minutes.`);
    } else {
      player.morale = "Happy";
    }
  });
}

// Dynamic contract logic (placeholder)
function simulateContractNegotiations() {
  gameState.roster.forEach(player => {
    if (player.contractYears <= 1) {
      const wantsMore = player.rating > 85 || player.morale === "Unhappy";
      if (wantsMore) {
        gameState.news.push(`${player.name} is seeking a max extension.`);
      }
    }
  });
}
