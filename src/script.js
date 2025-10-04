let events = JSON.parse(localStorage.getItem("events") || "[]");
const save = () => localStorage.setItem("events", JSON.stringify(events));

function addEvent() {
  const name = document.getElementById("eventName").value.trim();
  const date = document.getElementById("eventDate").value;
  const remind = +document.getElementById("remMinutes").value || 0;

  if (!name) {
    alert("Please, enter an event name.");
    return;
  }
  if (!date) {
    alert("Please, select an event date.");
    return;
  }

  events.push({
    id: Date.now(),
    name,
    date,
    remind,
    done: false,
    remShown: false,
  });
  save();
  render();

  document.getElementById("eventName").value = "";
  document.getElementById("eventDate").value = "";
  document.getElementById("remMinutes").value = "";
}

function showReminder(e) {
  const reminder = document.getElementById("reminder");
  reminder.innerHTML = `
  <div style="display:flex; gap:3px;">
    <strong>Reminder:</strong>
    <b>${e.name}</b> at
    ${new Date(e.date).toLocaleString()}
    <button onclick="dismissReminder()">Dismiss</button>
  </div>
`;
  reminder.style.display = "flex";
}




function dismissReminder() {
  document.getElementById("reminder").style.display = "none";
}

function render() {
  const eventsDiv = document.getElementById("events");
  eventsDiv.innerHTML = "";

  if (events.length === 0) {
    eventsDiv.classList.add("hidden");
    return;
  }

  eventsDiv.classList.remove("hidden");

  events.forEach((e) => {
    if (!e.name || !e.date) return;

    const t = new Date(e.date).getTime(),
      left = t - Date.now();

    // Reminder check
    if (!e.remShown && left > 0 && left <= e.remind * 60000) {
      showReminder(e);
      e.remShown = true;
      save();
    }

    if (!e.done && left <= 0) {
      e.done = true;
      save();
    }

    const card = document.createElement("div");
    card.className = e.done ? "done" : "";
    card.innerHTML = `<div style="display:flex; justify-content:space-between; align-items:flex-start">
    <div>
    <h3>${e.name}</h3>
    <p>${new Date(e.date).toLocaleString()}</p>
    <p style="${left > 0 ? "color: #2563eb;" : ""}"${
      left <= 0 ? ' class="completed-text"' : ""
    }>
        ${left > 0 ? fmt(left) : "Completed"}
   
    <p>Reminder: ${e.remind} min before</p>
    </div>
    <div>
    <button onclick="toggle(${e.id})">${e.done ? "Undo" : "Complete"}</button>
    <button class="delete" onclick="del(${e.id})">Delete</button>
    </div>
    </div>`;
    eventsDiv.appendChild(card);
  });
}

const fmt = (ms) => {
  let d = Math.floor(ms / 86400000),
    h = Math.floor(ms / 3600000) % 24,
    m = Math.floor(ms / 60000) % 60,
    s = Math.floor(ms / 1000) % 60;
  return `${d}d ${h}h ${m}m ${s}s`;
};

function toggle(id) {
  events = events.map((e) => (e.id === id ? { ...e, done: !e.done } : e));
  save();
  render();
}

function del(id) {
  events = events.filter((e) => e.id !== id);
  save();
  render();
}

setInterval(render, 1000);
render();
