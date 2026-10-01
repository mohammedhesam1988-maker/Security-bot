const API_BASE = 'http://localhost:3000/api';

let whitelistData = { users: {}, roles: {}, channels: {} };
let antispamData = {};
let antinukeData = {};

// ==================== دۆخی بۆت ====================
async function fetchStatus() {
    try {
        const res = await fetch(`${API_BASE}/status`);
        const data = await res.json();
        document.getElementById('botName').innerText = data.online ? data.tag : 'Offline';
        document.getElementById('statusDot').className = data.online ? 'dot' : 'dot offline';
    } catch (e) {
        document.getElementById('statusDot').className = 'dot offline';
    }
}

// ==================== Whitelist ====================
async function fetchWhitelist() {
    try {
        const res = await fetch(`${API_BASE}/whitelist`);
        whitelistData = await res.json();
        renderWhitelist();
    } catch (e) {
        console.error('Error fetching whitelist:', e);
    }
}

function renderWhitelist() {
    const container = document.getElementById('whitelistContent');
    if (!container) return;
    container.innerHTML = '';

    const categories = [
        { key: 'users', label: 'بەکارهێنەران' },
        { key: 'roles', label: 'ڕۆڵەکان' },
        { key: 'channels', label: 'کەناڵەکان' }
    ];

    categories.forEach(cat => {
        const catDiv = document.createElement('div');
        catDiv.className = 'category';
        catDiv.innerHTML = `<h3>${cat.label}</h3>`;

        const actions = Object.keys(whitelistData[cat.key] || {});
        actions.forEach(action => {
            const box = document.createElement('div');
            box.className = 'item-box';
            box.innerHTML = `
                <h4>${action.toUpperCase()}</h4>
                <div class="input-row">
                    <input type="text" id="input-${cat.key}-${action}" placeholder="ئایدی">
                    <button class="btn btn-add" onclick="addItem('${cat.key}', '${action}')">زیادکردن</button>
                </div>
                <div class="item-list" id="list-${cat.key}-${action}"></div>
            `;
            catDiv.appendChild(box);

            const listDiv = box.querySelector(`#list-${cat.key}-${action}`);
            const items = whitelistData[cat.key][action] || [];
            items.forEach(id => {
                const itemDiv = document.createElement('div');
                itemDiv.innerHTML = `<span>${id}</span><button onclick="removeItem('${cat.key}', '${action}', '${id}')">✖</button>`;
                listDiv.appendChild(itemDiv);
            });
        });

        container.appendChild(catDiv);
    });
}

async function addItem(type, action) {
    const input = document.getElementById(`input-${type}-${action}`);
    const id = input.value.trim();
    if (!id) return;

    try {
        await fetch(`${API_BASE}/whitelist/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, action, id })
        });
        input.value = '';
        await fetchWhitelist();
    } catch (e) {
        alert('هەڵە لە زیادکردن');
    }
}

async function removeItem(type, action, id) {
    try {
        await fetch(`${API_BASE}/whitelist/remove`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, action, id })
        });
        await fetchWhitelist();
    } catch (e) {
        alert('هەڵە لە سڕینەوە');
    }
}

// ==================== Anti-Spam ====================
async function fetchAntiSpam() {
    try {
        const res = await fetch(`${API_BASE}/antispam`);
        antispamData = await res.json();
        renderAntiSpam();
    } catch (e) {
        console.error('Error fetching antispam:', e);
    }
}

function renderAntiSpam() {
    const container = document.getElementById('antispamContent');
    if (!container) return;
    container.innerHTML = '';

    const modules = Object.keys(antispamData);
    modules.forEach(module => {
        const settings = antispamData[module];
        const box = document.createElement('div');
        box.className = 'item-box';

        let fieldsHtml = '';

        if (settings.enabled !== undefined) {
            fieldsHtml += `
                <div class="setting-row">
                    <span>چالاک:</span>
                    <input type="checkbox" ${settings.enabled ? 'checked' : ''} 
                        onchange="updateAntiSpam('${module}', 'enabled', this.checked)">
                </div>`;
        }

        ['max', 'threshold', 'maxJoins', 'maxConnects'].forEach(field => {
            if (settings[field] !== undefined) {
                fieldsHtml += `
                    <div class="setting-row">
                        <span>${field}:</span>
                        <input type="number" value="${settings[field]}" style="width:80px;"
                            onchange="updateAntiSpam('${module}', '${field}', parseInt(this.value))">
                    </div>`;
            }
        });

        if (settings.punishment !== undefined) {
            fieldsHtml += `
                <div class="setting-row">
                    <span>سزا:</span>
                    <select onchange="updateAntiSpam('${module}', 'punishment', this.value)">
                        <option value="delete" ${settings.punishment === 'delete' ? 'selected' : ''}>سڕینەوە</option>
                        <option value="timeout" ${settings.punishment === 'timeout' ? 'selected' : ''}>Timeout</option>
                        <option value="kick" ${settings.punishment === 'kick' ? 'selected' : ''}>Kick</option>
                        <option value="ban" ${settings.punishment === 'ban' ? 'selected' : ''}>Ban</option>
                        <option value="warn" ${settings.punishment === 'warn' ? 'selected' : ''}>Warn</option>
                    </select>
                </div>`;
        }

        box.innerHTML = `
            <h4>${module.toUpperCase()}</h4>
            ${fieldsHtml}
        `;
        container.appendChild(box);
    });
}

async function updateAntiSpam(module, field, value) {
    try {
        await fetch(`${API_BASE}/antispam/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ module, field, value })
        });
        await fetchAntiSpam();
    } catch (e) {
        alert('هەڵە لە پاشەکەوتکردن');
    }
}

// ==================== Anti-Nuke ====================
async function fetchAntiNuke() {
    try {
        const res = await fetch(`${API_BASE}/antinuke/config`);
        antinukeData = await res.json();
        renderAntiNuke();
    } catch (e) {
        console.error('Error fetching antinuke:', e);
    }
}

function renderAntiNuke() {
    const container = document.getElementById('antinukeContent');
    if (!container) return;
    container.innerHTML = '';

    const actions = Object.keys(antinukeData);
    actions.forEach(action => {
        const settings = antinukeData[action];
        const box = document.createElement('div');
        box.className = 'item-box';

        let fieldsHtml = '';

        if (settings.enabled !== undefined) {
            fieldsHtml += `
                <div class="setting-row">
                    <span>چالاک:</span>
                    <input type="checkbox" ${settings.enabled ? 'checked' : ''} 
                        onchange="updateAntiNuke('${action}', 'enabled', this.checked)">
                </div>`;
        }

        if (settings.max !== undefined) {
            fieldsHtml += `
                <div class="setting-row">
                    <span>max:</span>
                    <input type="number" value="${settings.max}" style="width:80px;"
                        onchange="updateAntiNuke('${action}', 'max', parseInt(this.value))">
                </div>`;
        }

        if (settings.punishment !== undefined) {
            fieldsHtml += `
                <div class="setting-row">
                    <span>سزا:</span>
                    <select onchange="updateAntiNuke('${action}', 'punishment', this.value)">
                        <option value="delete" ${settings.punishment === 'delete' ? 'selected' : ''}>سڕینەوە</option>
                        <option value="timeout" ${settings.punishment === 'timeout' ? 'selected' : ''}>Timeout</option>
                        <option value="kick" ${settings.punishment === 'kick' ? 'selected' : ''}>Kick</option>
                        <option value="ban" ${settings.punishment === 'ban' ? 'selected' : ''}>Ban</option>
                        <option value="detect" ${settings.punishment === 'detect' ? 'selected' : ''}>Detect</option>
                    </select>
                </div>`;
        }

        box.innerHTML = `
            <h4>${action.toUpperCase()}</h4>
            ${fieldsHtml}
        `;
        container.appendChild(box);
    });
}

async function updateAntiNuke(action, field, value) {
    try {
        await fetch(`${API_BASE}/antinuke/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, field, value })
        });
        await fetchAntiNuke();
    } catch (e) {
        alert('هەڵە لە پاشەکەوتکردن');
    }
}

// ==================== Logs ====================
async function fetchLogs() {
    try {
        const res = await fetch(`${API_BASE}/logs/config`);
        const data = await res.json();
        if (data.logChannelId) document.getElementById('logChannelId').value = data.logChannelId;
    } catch (e) {
        console.error('Error fetching logs:', e);
    }
}

async function setLog(type) {
    const channelId = document.getElementById('logChannelId').value.trim();
    if (!channelId) return;
    try {
        await fetch(`${API_BASE}/logs/set`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, channelId })
        });
        alert('✅ پاشەکەوتکرا');
    } catch (e) {
        alert('هەڵە');
    }
}

// ==================== ناوبردن ====================
function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    event.target.classList.add('active');
    document.getElementById('pageTitle').innerText = id.charAt(0).toUpperCase() + id.slice(1);
}

// ==================== دەستپێکردن ====================
fetchStatus();
fetchWhitelist();
fetchAntiSpam();
fetchAntiNuke();
fetchLogs();
setInterval(fetchStatus, 10000);
