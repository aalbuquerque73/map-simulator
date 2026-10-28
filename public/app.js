
const socket = io();

const macGuffin = {};
const runner = [];

socket.on("connect", () => {
  console.log("Connected to server:", socket.id);
});

socket.on('simulator:start', (payload) => {
  if (payload == null) {
    return;
  }
  const board = document.getElementById('board');
  if (board == null) {
    return;
  }
  [].slice
    .call(board.childNodes)
    .forEach(child => board.removeChild(child));
  board.style.width = `${payload.map.size.width * 1.2}rem`;
  board.style.height = `${payload.map.size.height * 1.2}rem`;
  for (let v = 0; v < payload.map.size.height; v++) {
    const row = document.createElement('div');
    row.className = 'row';
    row.style.width = `${payload.map.size.width * 1.2}rem`;
    row.style.height = '1.2rem';
    
    for (let u = 0; u < payload.map.size.width; u++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.setAttribute('id', `cell-${u}x${v}`);
      cell.innerText = ' ';
      row.appendChild(cell);
    }

    board.appendChild(row);
    setTimeout(
      () => {
        const el = document.querySelector(`#cell-${payload.macGuffin.position.x}x${payload.macGuffin.position.y}`);
        macGuffin.el = el;
        el.innerText = payload.macGuffin.icon;
      },
      0
    );
    if (macGuffin.interval) {
      clearInterval(macGuffin.interval);
    }
    runner.length = 0;
    macGuffin.interval = setInterval(
      () => {
        if (runner.length === 0) {
          clearInterval(macGuffin.interval);
          macGuffin.interval = null;
          return;
        }
        const { position, icon } = runner.shift();
        if (position == null) {
          return;
        }
        const el = document.querySelector(`#cell-${position.x}x${position.y}`);
        macGuffin.el.innerText = ' ';
        macGuffin.el = el;
        el.innerText = icon;
        if (runner.length === 0) {
          if (macGuffin.valid) {
            macGuffin.el.classList.add('bg-success');
          } else {
            macGuffin.el.classList.add('bg-error');
          }
          if (!macGuffin.stop) {
            return;
          }
          clearInterval(macGuffin.interval);
          macGuffin.interval = null;
        }
      },
      250
    );
  }
});

socket.on('simulator:step', (payload) => {
  runner.push(payload.macGuffin);
});

socket.on('simulator:stop', (payload) => {
  macGuffin.stop = true;
  macGuffin.valid = payload.valid;
});

socket.on('simulator:log', (payload) => {
  console.log(...payload.args);
});

document
    .getElementById("runSimulation")
    .addEventListener("click", async () => {
        const payload = {
            width: Number(document.getElementById("width").value),
            height: Number(document.getElementById("height").value),
            startX: Number(document.getElementById("startX").value),
            startY: Number(document.getElementById("startY").value),
            commands: document
                .getElementById("commands")
                .value
                .split(",")
                .map((value) => value.trim())
                .filter((value) => value !== "")
                .map(Number),
        };

        const resultElement = document.getElementById("result");

        try {
            const response = await fetch("/api/simulate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error((data.error || "Request failed") + "\n" + data.message);
            }

            resultElement.textContent = data.join('\n');
        } catch (error) {
            resultElement.textContent = `Error: ${error.message}`;
        }
    });
    