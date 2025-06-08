
function simulateGame(teamA, teamB, teams) {
  const log = [];
  let scoreA = 0, scoreB = 0;
  const playersA = teams[teamA].roster;
  const playersB = teams[teamB].roster;
  const boxA = playersA.map(p => ({ name: p.name, pts: 0, ast: 0, reb: 0, stl: 0, blk: 0 }));
  const boxB = playersB.map(p => ({ name: p.name, pts: 0, ast: 0, reb: 0, stl: 0, blk: 0 }));

  for (let q = 1; q <= 4; q++) {
    let qa = 0, qb = 0;
    for (let i = 0; i < 12; i++) {
      let pa = Math.floor(Math.random() * 6);
      let pb = Math.floor(Math.random() * 6);
      let asa = Math.floor(Math.random() * 3);
      let asb = Math.floor(Math.random() * 3);
      let rebA = Math.floor(Math.random() * 4);
      let rebB = Math.floor(Math.random() * 4);
      let stlA = Math.floor(Math.random() * 2);
      let stlB = Math.floor(Math.random() * 2);
      let blkA = Math.floor(Math.random() * 2);
      let blkB = Math.floor(Math.random() * 2);

      boxA[i].pts += pa;
      boxB[i].pts += pb;
      boxA[i].ast += asa;
      boxB[i].ast += asb;
      boxA[i].reb += rebA;
      boxB[i].reb += rebB;
      boxA[i].stl += stlA;
      boxB[i].stl += stlB;
      boxA[i].blk += blkA;
      boxB[i].blk += blkB;

      qa += pa;
      qb += pb;
    }
    scoreA += qa;
    scoreB += qb;
    log.push(`Q${q} - ${teamA}: ${qa}, ${teamB}: ${qb}`);
  }

  const winner = scoreA > scoreB ? teamA : teamB;
  log.push(`🏁 Final Score: ${teamA} ${scoreA} - ${teamB} ${scoreB}`);
  log.push(`🎉 Winner: ${winner}`);

  return { log, boxA, boxB, teamA, teamB, scoreA, scoreB, winner };
}

function runPlayByPlay() {
  const gameState = JSON.parse(localStorage.getItem("basketballGM") || "{}");
  const teamA = gameState.selectedTeam;
  const teamList = Object.keys(gameState.teams).filter(t => t !== teamA);
  const teamB = teamList[Math.floor(Math.random() * teamList.length)];

  const gameResult = simulateGame(teamA, teamB, gameState.teams);
  const { log, boxA, boxB, teamA: A, teamB: B } = gameResult;

  const output = document.getElementById("playLog");
  const box = document.getElementById("boxScore");

  output.innerHTML = log.map(line => `<p>${line}</p>`).join("");

  const makeBox = (team, players) => {
    return `
    <h3>${team}</h3>
    <table>
      <tr><th>Player</th><th>PTS</th><th>AST</th><th>REB</th><th>STL</th><th>BLK</th></tr>
      ${players.map(p =>
        `<tr><td>${p.name}</td><td>${p.pts}</td><td>${p.ast}</td><td>${p.reb}</td><td>${p.stl}</td><td>${p.blk}</td></tr>`
      ).join("")}
    </table>`;
  };

  box.innerHTML = makeBox(A, boxA) + makeBox(B, boxB);

  // Save to history log
  const history = JSON.parse(localStorage.getItem("gmGameHistory") || "[]");
  history.push(gameResult);
  localStorage.setItem("gmGameHistory", JSON.stringify(history));
}
