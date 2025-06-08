
fetch('teams.json')
  .then(res => res.json())
  .then(teams => {
    const select = document.getElementById('teamSelect');
    const table = document.getElementById('rankingTable');
    const legendsIncluded = document.getElementById('importLegends');

    const realTeams = Object.entries(teams).filter(([name, _]) => name !== "Legends");
    const teamList = realTeams.map(([name, data]) => {
      const avg = data.roster.reduce((sum, p) => sum + (p.rating || 50), 0) / data.roster.length;
      return { name, rating: Math.round(avg), ...data };
    }).sort((a, b) => b.rating - a.rating);

    teamList.forEach((t, i) => {
      const opt = document.createElement('option');
      opt.value = t.name;
      opt.textContent = t.name;
      select.appendChild(opt);

      const row = document.createElement('tr');
      row.innerHTML = `<td>${i + 1}</td>
                       <td style="color:${t.color}"><img src="${t.logo}" style="height:24px;vertical-align:middle;margin-right:6px;">${t.name}</td>
                       <td>${t.rating}</td>`;
      table.appendChild(row);
    });

    document.getElementById('startBtn').onclick = () => {
      const selected = select.value;
      let selectedTeams = Object.fromEntries(realTeams);

      if (legendsIncluded.checked) {
        selectedTeams["Legends"] = teams["Legends"];
      }

      const gameState = { selectedTeam: selected, teams: selectedTeams };
      localStorage.setItem("basketballGM", JSON.stringify(gameState));
      window.location.href = "index.html";
    };
  });
