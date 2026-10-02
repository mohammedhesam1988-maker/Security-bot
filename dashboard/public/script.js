const API_BASE = 'http://127.0.0.1:3000/api';

let whitelistData = { users: {}, roles: {}, channels: {} };
let antispamData = {};
let antinukeData = {};

// ==================== BOT STATUS ====================
async function fetchStatus() {
    try {
        const res = await fetch(`${API_BASE}/status`);
        const data = await res.json();
        const botName = document.getElementById('botName');
        const statusDot = document.getElementById('statusDot');
        if (botName) botName.innerText = data.online ? data.tag : 'Offline';
        if (statusDot) statusDot.className = data.online ? 'dot' : 'dot offline';
    } catch (e) { console.error(e); }
}

// ==================== GENERAL ====================
async function fetchGeneral() {
    try {
        const res = await fetch(`${API_BASE}/general`);
        const data = await res.json();
        renderGeneral(data);
    } catch (e) { console.error(e); }
}

function renderGeneral(data) {
    const container = document.getElementById('generalContent');
    if (!container) return;
    container.innerHTML = `
        <div class="item-box"><h4>🤖 Bot Information</h4>
            <div class="setting-row"><span>Bot Name:</span><input type="text" value="${data.botName || 'Security Bot'}" onchange="updateGeneral('botName', this.value)"></div>
            <div class="setting-row"><span>Bot Description:</span><input type="text" value="${data.botDescription || ''}" onchange="updateGeneral('botDescription', this.value)"></div>
            <div class="setting-row"><span>Bot Status:</span><select onchange="updateGeneral('botStatus', this.value)">
                <option value="online" ${data.botStatus === 'online' ? 'selected' : ''}>Online</option>
                <option value="idle" ${data.botStatus === 'idle' ? 'selected' : ''}>Idle</option>
                <option value="dnd" ${data.botStatus === 'dnd' ? 'selected' : ''}>Do Not Disturb</option>
                <option value="invisible" ${data.botStatus === 'invisible' ? 'selected' : ''}>Invisible</option>
            </select></div>
            <div class="setting-row"><span>Bot Activity:</span><input type="text" value="${data.botActivity || ''}" onchange="updateGeneral('botActivity', this.value)"></div>
            <div class="setting-row"><span>Activity Type:</span><select onchange="updateGeneral('botActivityType', this.value)">
                <option value="PLAYING" ${data.botActivityType === 'PLAYING' ? 'selected' : ''}>Playing</option>
                <option value="WATCHING" ${data.botActivityType === 'WATCHING' ? 'selected' : ''}>Watching</option>
                <option value="LISTENING" ${data.botActivityType === 'LISTENING' ? 'selected' : ''}>Listening</option>
                <option value="COMPETING" ${data.botActivityType === 'COMPETING' ? 'selected' : ''}>Competing</option>
            </select></div>
        </div>
        <div class="item-box"><h4>🎨 Appearance</h4>
            <div class="setting-row"><span>Theme:</span><select onchange="updateGeneral('theme', this.value)">
                <option value="dark" ${data.theme === 'dark' ? 'selected' : ''}>Dark</option>
                <option value="light" ${data.theme === 'light' ? 'selected' : ''}>Light</option>
            </select></div>
            <div class="setting-row"><span>Accent Color:</span><input type="color" value="${data.accentColor || '#fbbf24'}" onchange="updateGeneral('accentColor', this.value)"></div>
            <div class="setting-row"><span>Language:</span><select onchange="updateGeneral('language', this.value)">
                <option value="en" ${data.language === 'en' ? 'selected' : ''}>English</option>
                <option value="ku" ${data.language === 'ku' ? 'selected' : ''}>Kurdish</option>
                <option value="ar" ${data.language === 'ar' ? 'selected' : ''}>Arabic</option>
            </select></div>
        </div>
    `;
}

async function updateGeneral(field, value) {
    try { await fetch(`${API_BASE}/general/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ field, value }) }); await fetchGeneral(); } catch (e) { alert('Error'); }
}

// ==================== PREMIUM ====================
async function fetchPremium() {
    try {
        const res = await fetch(`${API_BASE}/premium`);
        const data = await res.json();
        renderPremium(data);
    } catch (e) { console.error(e); }
}

function renderPremium(data) {
    const container = document.getElementById('premiumContent');
    if (!container) return;
    const tiers = data.tiers || {};
    let tiersHtml = '';
    Object.keys(tiers).forEach(tierKey => {
        const tier = tiers[tierKey];
        const isActive = data.tier === tierKey;
        tiersHtml += `
            <div class="item-box" style="border-color: ${tier.color};">
                <h4 style="color: ${tier.color};">${tier.name} ${isActive ? '✅' : ''}</h4>
                <div class="setting-row"><span>Features:</span><span style="font-size: 12px;">${(tier.features || []).join(', ') || 'None'}</span></div>
                ${!isActive ? `<button class="btn btn-add" onclick="setPremiumTier('${tierKey}')">Set as Active</button>` : ''}
            </div>
        `;
    });
    container.innerHTML = `
        <div class="item-box">
            <div class="setting-row"><span>Premium Enabled:</span><input type="checkbox" ${data.enabled ? 'checked' : ''} onchange="togglePremium(this.checked)"></div>
            <div class="setting-row"><span>Owner Override:</span><input type="checkbox" ${data.ownerOverride ? 'checked' : ''} onchange="updatePremium('ownerOverride', this.checked)"></div>
            <div class="setting-row"><span>Whitelist Override:</span><input type="checkbox" ${data.whitelistOverride ? 'checked' : ''} onchange="updatePremium('whitelistOverride', this.checked)"></div>
        </div>
        <h3>💎 Tiers</h3>${tiersHtml}
    `;
}

async function togglePremium(value) {
    try { await fetch(`${API_BASE}/premium/toggle`, { method: 'POST' }); await fetchPremium(); } catch (e) { alert('Error'); }
}

async function updatePremium(field, value) {
    try { await fetch(`${API_BASE}/premium/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ field, value }) }); await fetchPremium(); } catch (e) { alert('Error'); }
}

async function setPremiumTier(tier) {
    try { await fetch(`${API_BASE}/premium/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ field: 'tier', value: tier }) }); await fetchPremium(); } catch (e) { alert('Error'); }
}

// ==================== ANALYTICS ====================
async function fetchAnalytics() {
    try {
        const res = await fetch(`${API_BASE}/analytics`);
        const data = await res.json();
        renderAnalytics(data);
    } catch (e) { console.error(e); }
}

function renderAnalytics(data) {
    const container = document.getElementById('analyticsContent');
    if (!container) return;
    container.innerHTML = `
        <div class="item-box">
            <div class="setting-row"><span>Enabled:</span><input type="checkbox" ${data.enabled ? 'checked' : ''} onchange="updateAnalytics('enabled', this.checked)"></div>
            <div class="setting-row"><span>Track Messages:</span><input type="checkbox" ${data.trackMessages ? 'checked' : ''} onchange="updateAnalytics('trackMessages', this.checked)"></div>
            <div class="setting-row"><span>Track Voice:</span><input type="checkbox" ${data.trackVoice ? 'checked' : ''} onchange="updateAnalytics('trackVoice', this.checked)"></div>
            <div class="setting-row"><span>Track Members:</span><input type="checkbox" ${data.trackMembers ? 'checked' : ''} onchange="updateAnalytics('trackMembers', this.checked)"></div>
            <div class="setting-row"><span>Track Commands:</span><input type="checkbox" ${data.trackCommands ? 'checked' : ''} onchange="updateAnalytics('trackCommands', this.checked)"></div>
            <div class="setting-row"><span>Daily Report:</span><input type="checkbox" ${data.dailyReport ? 'checked' : ''} onchange="updateAnalytics('dailyReport', this.checked)"></div>
            <div class="setting-row"><span>Report Channel ID:</span><input type="text" value="${data.reportChannel || ''}" placeholder="Channel ID" onchange="updateAnalytics('reportChannel', this.value)"></div>
        </div>
    `;
}

async function updateAnalytics(field, value) {
    try { await fetch(`${API_BASE}/analytics/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ field, value }) }); await fetchAnalytics(); } catch (e) { alert('Error'); }
}

// ==================== WHITELIST ====================
async function fetchWhitelist() {
    try {
        const res = await fetch(`${API_BASE}/whitelist`);
        whitelistData = await res.json();
        renderWhitelist();
    } catch (e) { console.error(e); }
}

function renderWhitelist() {
    const container = document.getElementById('whitelistContent');
    if (!container) return;
    container.innerHTML = '';
    const categories = [
        { key: 'users', label: 'Users' },
        { key: 'roles', label: 'Roles' },
        { key: 'channels', label: 'Channels' }
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
                    <input type="text" id="input-${cat.key}-${action}" placeholder="ID">
                    <button class="btn btn-add" onclick="addItem('${cat.key}', '${action}')">Add</button>
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
    try { await fetch(`${API_BASE}/whitelist/add`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, action, id }) }); input.value = ''; await fetchWhitelist(); } catch (e) { alert('Error'); }
}

async function removeItem(type, action, id) {
    try { await fetch(`${API_BASE}/whitelist/remove`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, action, id }) }); await fetchWhitelist(); } catch (e) { alert('Error'); }
}

// ==================== ANTI-SPAM ====================
async function fetchAntiSpam() {
    try {
        const res = await fetch(`${API_BASE}/antispam`);
        antispamData = await res.json();
        renderAntiSpam();
    } catch (e) { console.error(e); }
}

function renderAntiSpam() {
    const container = document.getElementById('antispamContent');
    if (!container) return;
    container.innerHTML = '';
    Object.keys(antispamData).forEach(module => {
        const settings = antispamData[module];
        if (typeof settings !== 'object' || settings === null) return;
        const box = document.createElement('div');
        box.className = 'item-box';
        let fieldsHtml = '';
        if (settings.enabled !== undefined) {
            fieldsHtml += `<div class="setting-row"><span>Enabled:</span><input type="checkbox" ${settings.enabled ? 'checked' : ''} onchange="updateAntiSpam('${module}', 'enabled', this.checked)"></div>`;
        }
        ['max', 'threshold', 'maxJoins', 'maxConnects'].forEach(field => {
            if (settings[field] !== undefined) {
                fieldsHtml += `<div class="setting-row"><span>${field}:</span><input type="number" value="${settings[field]}" style="width:80px;" onchange="updateAntiSpam('${module}', '${field}', parseInt(this.value))"></div>`;
            }
        });
        if (settings.punishment !== undefined) {
            fieldsHtml += `<div class="setting-row"><span>Punishment:</span><select onchange="updateAntiSpam('${module}', 'punishment', this.value)">
                <option value="delete" ${settings.punishment === 'delete' ? 'selected' : ''}>Delete</option>
                <option value="timeout" ${settings.punishment === 'timeout' ? 'selected' : ''}>Timeout</option>
                <option value="kick" ${settings.punishment === 'kick' ? 'selected' : ''}>Kick</option>
                <option value="ban" ${settings.punishment === 'ban' ? 'selected' : ''}>Ban</option>
                <option value="warn" ${settings.punishment === 'warn' ? 'selected' : ''}>Warn</option>
            </select></div>`;
        }
        box.innerHTML = `<h4>${module.toUpperCase()}</h4>${fieldsHtml}`;
        container.appendChild(box);
    });
}

async function updateAntiSpam(module, field, value) {
    try { await fetch(`${API_BASE}/antispam/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ module, field, value }) }); await fetchAntiSpam(); } catch (e) { alert('Error'); }
}

// ==================== ANTI-NUKE ====================
async function fetchAntiNuke() {
    try {
        const res = await fetch(`${API_BASE}/antinuke/config`);
        antinukeData = await res.json();
        renderAntiNuke();
    } catch (e) { console.error(e); }
}

function renderAntiNuke() {
    const container = document.getElementById('antinukeContent');
    if (!container) return;
    container.innerHTML = '';
    Object.keys(antinukeData).forEach(action => {
        const settings = antinukeData[action];
        if (typeof settings !== 'object' || settings === null) return;
        const box = document.createElement('div');
        box.className = 'item-box';
        let fieldsHtml = '';
        if (settings.enabled !== undefined) {
            fieldsHtml += `<div class="setting-row"><span>Enabled:</span><input type="checkbox" ${settings.enabled ? 'checked' : ''} onchange="updateAntiNuke('${action}', 'enabled', this.checked)"></div>`;
        }
        if (settings.max !== undefined) {
            fieldsHtml += `<div class="setting-row"><span>Max:</span><input type="number" value="${settings.max}" style="width:80px;" onchange="updateAntiNuke('${action}', 'max', parseInt(this.value))"></div>`;
        }
        if (settings.punishment !== undefined) {
            fieldsHtml += `<div class="setting-row"><span>Punishment:</span><select onchange="updateAntiNuke('${action}', 'punishment', this.value)">
                <option value="delete" ${settings.punishment === 'delete' ? 'selected' : ''}>Delete</option>
                <option value="timeout" ${settings.punishment === 'timeout' ? 'selected' : ''}>Timeout</option>
                <option value="kick" ${settings.punishment === 'kick' ? 'selected' : ''}>Kick</option>
                <option value="ban" ${settings.punishment === 'ban' ? 'selected' : ''}>Ban</option>
                <option value="detect" ${settings.punishment === 'detect' ? 'selected' : ''}>Detect</option>
            </select></div>`;
        }
        box.innerHTML = `<h4>${action.toUpperCase()}</h4>${fieldsHtml}`;
        container.appendChild(box);
    });
}

async function updateAntiNuke(action, field, value) {
    try { await fetch(`${API_BASE}/antinuke/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, field, value }) }); await fetchAntiNuke(); } catch (e) { alert('Error'); }
}

// ==================== BEAST MODE ====================
async function fetchBeastMode() {
    try {
        const res = await fetch(`${API_BASE}/beastmode`);
        const data = await res.json();
        const btn = document.getElementById('beastModeBtn');
        const status = document.getElementById('beastModeStatus');
        if (btn) btn.innerText = data.enabled ? 'Disable' : 'Enable';
        if (status) status.innerText = data.enabled ? '✅ Enabled' : '❌ Disabled';
        const container = document.getElementById('beastmodeContent');
        if (container) {
            container.innerHTML = '';
            const actions = data.actions || {};
            Object.keys(actions).forEach(action => {
                const settings = actions[action];
                const box = document.createElement('div');
                box.className = 'item-box';
                let fieldsHtml = '';
                if (settings.max !== undefined) fieldsHtml += `<div class="setting-row"><span>Max:</span><input type="number" value="${settings.max}" style="width:80px;" onchange="updateBeastMode('${action}', 'max', parseInt(this.value))"></div>`;
                if (settings.punishment !== undefined) fieldsHtml += `<div class="setting-row"><span>Punishment:</span><select onchange="updateBeastMode('${action}', 'punishment', this.value)"><option value="delete" ${settings.punishment === 'delete' ? 'selected' : ''}>Delete</option><option value="timeout" ${settings.punishment === 'timeout' ? 'selected' : ''}>Timeout</option><option value="kick" ${settings.punishment === 'kick' ? 'selected' : ''}>Kick</option><option value="ban" ${settings.punishment === 'ban' ? 'selected' : ''}>Ban</option></select></div>`;
                box.innerHTML = `<h4>${action.toUpperCase()}</h4>${fieldsHtml}`;
                container.appendChild(box);
            });
        }
    } catch (e) { console.error(e); }
}

async function toggleBeastMode() {
    try { await fetch(`${API_BASE}/beastmode/toggle`, { method: 'POST' }); await fetchBeastMode(); } catch (e) { alert('Error'); }
}

async function updateBeastMode(action, field, value) {
    try { await fetch(`${API_BASE}/beastmode/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, field, value }) }); await fetchBeastMode(); } catch (e) { alert('Error'); }
}

// ==================== ANTI-RAID ====================
async function fetchAntiRaid() {
    try {
        const res = await fetch(`${API_BASE}/antiraid`);
        const data = await res.json();
        const btn = document.getElementById('antiRaidBtn');
        const status = document.getElementById('antiRaidStatus');
        if (btn) btn.innerText = data.enabled ? 'Disable' : 'Enable';
        if (status) status.innerText = data.enabled ? '✅ Enabled' : '❌ Disabled';
        const container = document.getElementById('antiraidContent');
        if (container) {
            container.innerHTML = `
                <div class="item-box">
                    <div class="setting-row"><span>Join Rate:</span><input type="number" value="${data.joinRate || 5}" style="width:80px;" onchange="updateAntiRaid('joinRate', parseInt(this.value))"></div>
                    <div class="setting-row"><span>Time Window (ms):</span><input type="number" value="${data.timeWindow || 10000}" style="width:100px;" onchange="updateAntiRaid('timeWindow', parseInt(this.value))"></div>
                    <div class="setting-row"><span>Punishment:</span><select onchange="updateAntiRaid('punishment', this.value)"><option value="kick" ${data.punishment === 'kick' ? 'selected' : ''}>Kick</option><option value="ban" ${data.punishment === 'ban' ? 'selected' : ''}>Ban</option></select></div>
                </div>
            `;
        }
    } catch (e) { console.error(e); }
}

async function toggleAntiRaid() {
    try { await fetch(`${API_BASE}/antiraid/toggle`, { method: 'POST' }); await fetchAntiRaid(); } catch (e) { alert('Error'); }
}

async function updateAntiRaid(field, value) {
    try { await fetch(`${API_BASE}/antiraid/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ field, value }) }); await fetchAntiRaid(); } catch (e) { alert('Error'); }
}

// ==================== VERIFICATION ====================
async function fetchVerification() {
    try {
        const res = await fetch(`${API_BASE}/verification`);
        const data = await res.json();
        const container = document.getElementById('verificationContent');
        if (!container) return;
        container.innerHTML = `
            <div class="item-box">
                <div class="setting-row"><span>Enabled:</span><input type="checkbox" ${data.enabled ? 'checked' : ''} onchange="toggleVerification(this.checked)"></div>
                <div class="setting-row"><span>Verification Channel ID:</span><input type="text" value="${data.channelId || ''}" placeholder="Channel ID" onchange="updateVerification('channelId', this.value)"></div>
                <div class="setting-row"><span>Verification Role ID:</span><input type="text" value="${data.roleId || ''}" placeholder="Role ID" onchange="updateVerification('roleId', this.value)"></div>
            </div>
        `;
    } catch (e) { console.error(e); }
}

async function toggleVerification(value) {
    try { await fetch(`${API_BASE}/verification/toggle`, { method: 'POST' }); await fetchVerification(); } catch (e) { alert('Error'); }
}

async function updateVerification(field, value) {
    try { await fetch(`${API_BASE}/verification/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ field, value }) }); } catch (e) { alert('Error'); }
}

// ==================== MODERATION ====================
async function fetchModeration() {
    try {
        const res = await fetch(`${API_BASE}/moderation`);
        const data = await res.json();
        const container = document.getElementById('moderationContent');
        if (!container) return;
        container.innerHTML = `
            <div class="item-box">
                <div class="setting-row"><span>Enabled:</span><input type="checkbox" ${data.enabled ? 'checked' : ''} onchange="updateModeration('enabled', this.checked)"></div>
                <div class="setting-row"><span>Log Channel ID:</span><input type="text" value="${data.logChannelId || ''}" placeholder="Channel ID" onchange="updateModeration('logChannelId', this.value)"></div>
                <div class="setting-row"><span>Mute Role ID:</span><input type="text" value="${data.muteRoleId || ''}" placeholder="Role ID" onchange="updateModeration('muteRoleId', this.value)"></div>
            </div>
        `;
    } catch (e) { console.error(e); }
}

async function updateModeration(field, value) {
    try { await fetch(`${API_BASE}/moderation/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ field, value }) }); } catch (e) { alert('Error'); }
}

// ==================== AUTO ROLE ====================
async function fetchAutoRole() {
    try {
        const res = await fetch(`${API_BASE}/autorole`);
        const data = await res.json();
        renderAutoRole(data);
    } catch (e) { console.error(e); }
}

function renderAutoRole(data) {
    const container = document.getElementById('autoroleContent');
    if (!container) return;
    let humanRolesHtml = '';
    (data.roles || []).forEach(roleId => {
        humanRolesHtml += `<div style="display:flex; justify-content:space-between; align-items:center; background:#334155; padding:8px; border-radius:5px; margin-bottom:5px;"><span>${roleId}</span><button class="btn btn-remove" onclick="removeAutoRole('${roleId}', 'roles')">✖</button></div>`;
    });
    let botRolesHtml = '';
    (data.botRoles || []).forEach(roleId => {
        botRolesHtml += `<div style="display:flex; justify-content:space-between; align-items:center; background:#334155; padding:8px; border-radius:5px; margin-bottom:5px;"><span>${roleId}</span><button class="btn btn-remove" onclick="removeAutoRole('${roleId}', 'botRoles')">✖</button></div>`;
    });
    container.innerHTML = `
        <div class="item-box">
            <div class="setting-row"><span>Enabled:</span><input type="checkbox" ${data.enabled ? 'checked' : ''} onchange="toggleAutoRole(this.checked)"></div>
            <div class="setting-row"><span>Delay (ms):</span><input type="number" value="${data.delay || 0}" style="width:100px;" onchange="updateAutoRole('delay', parseInt(this.value))"></div>
            <div class="setting-row"><span>Ignore Bots:</span><input type="checkbox" ${data.ignoreBots ? 'checked' : ''} onchange="updateAutoRole('ignoreBots', this.checked)"></div>
        </div>
        <div class="item-box">
            <h4>Human Roles</h4>
            <div class="input-row"><input type="text" id="human-role-input" placeholder="Role ID"><button class="btn btn-add" onclick="addAutoRole('roles')">Add</button></div>
            <div style="margin-top:10px;">${humanRolesHtml || '<p style="color:#94a3b8;">No roles added.</p>'}</div>
        </div>
        <div class="item-box">
            <h4>Bot Roles</h4>
            <div class="input-row"><input type="text" id="bot-role-input" placeholder="Role ID"><button class="btn btn-add" onclick="addAutoRole('botRoles')">Add</button></div>
            <div style="margin-top:10px;">${botRolesHtml || '<p style="color:#94a3b8;">No bot roles added.</p>'}</div>
        </div>
    `;
}

async function toggleAutoRole(value) {
    try { await fetch(`${API_BASE}/autorole/toggle`, { method: 'POST' }); await fetchAutoRole(); } catch (e) { alert('Error'); }
}

async function updateAutoRole(field, value) {
    try { await fetch(`${API_BASE}/autorole/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ field, value }) }); await fetchAutoRole(); } catch (e) { alert('Error'); }
}

async function addAutoRole(type) {
    const inputId = type === 'roles' ? 'human-role-input' : 'bot-role-input';
    const input = document.getElementById(inputId);
    const roleId = input.value.trim();
    if (!roleId) return;
    try { await fetch(`${API_BASE}/autorole/add-role`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ roleId, type }) }); input.value = ''; await fetchAutoRole(); } catch (e) { alert('Error'); }
}

async function removeAutoRole(roleId, type) {
    try { await fetch(`${API_BASE}/autorole/remove-role`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ roleId, type }) }); await fetchAutoRole(); } catch (e) { alert('Error'); }
}

// ==================== LOG CHANNELS ====================
async function fetchLogs() {
    try {
        const res = await fetch(`${API_BASE}/logs/channels`);
        const data = await res.json();
        renderLogs(data);
    } catch (e) { console.error(e); }
}

function renderLogs(data) {
    const container = document.getElementById('logsContent');
    if (!container) return;
    container.innerHTML = '';
    const categories = [
        { title: '👤 Member Logs', keys: ['memberBanned', 'memberUnbanned', 'memberKicked', 'memberJoined', 'memberLeft', 'nicknameChanged', 'memberRolesUpdated', 'memberTimeout'] },
        { title: '📁 Channel Logs', keys: ['channelCreated', 'channelDeleted', 'channelUpdated', 'channelPermissionsUpdated'] },
        { title: '🏷️ Role Logs', keys: ['roleCreated', 'roleDeleted', 'roleUpdated', 'roleGiven', 'roleRemoved'] },
        { title: '🎤 Voice Logs', keys: ['voiceJoined', 'voiceLeft', 'voiceMoved', 'voiceStateUpdated'] },
        { title: '💬 Message Logs', keys: ['messageDeleted', 'messageEdited'] },
        { title: '🌐 Server Logs', keys: ['serverUpdated', 'threadCreated', 'threadDeleted', 'threadUpdated'] },
        { title: '📋 General', keys: ['general'] }
    ];
    categories.forEach(cat => {
        const catDiv = document.createElement('div');
        catDiv.className = 'category';
        catDiv.innerHTML = `<h3>${cat.title}</h3>`;
        cat.keys.forEach(key => {
            const box = document.createElement('div');
            box.className = 'item-box';
            box.innerHTML = `
                <div class="setting-row">
                    <span>${formatLogName(key)}:</span>
                    <input type="text" id="log-${key}" value="${data[key] || ''}" placeholder="Channel ID" style="width:150px;">
                    <button class="btn btn-add" onclick="setLogChannel('${key}')">Set</button>
                </div>
            `;
            catDiv.appendChild(box);
        });
        container.appendChild(catDiv);
    });
}

function formatLogName(key) {
    const names = {
        memberBanned: 'Member Banned', memberUnbanned: 'Member Unbanned', memberKicked: 'Member Kicked',
        memberJoined: 'Member Joined', memberLeft: 'Member Left', nicknameChanged: 'Nickname Changed',
        memberRolesUpdated: 'Member Roles Updated', memberTimeout: 'Timeout (Given/Removed)',
        channelCreated: 'Channel Created', channelDeleted: 'Channel Deleted', channelUpdated: 'Channel Updated',
        channelPermissionsUpdated: 'Channel Permissions Updated', roleCreated: 'Role Created',
        roleDeleted: 'Role Deleted', roleUpdated: 'Role Updated', roleGiven: 'Role Given', roleRemoved: 'Role Removed',
        voiceJoined: 'Member Joined Voice', voiceLeft: 'Member Left Voice', voiceMoved: 'Member Moved Voice',
        voiceStateUpdated: 'Voice State (Mute/Deafen)', messageDeleted: 'Message Deleted', messageEdited: 'Message Edited',
        serverUpdated: 'Server Updated', threadCreated: 'Thread Created', threadDeleted: 'Thread Deleted',
        threadUpdated: 'Thread Updated', general: 'General'
    };
    return names[key] || key;
}

async function setLogChannel(type) {
    const input = document.getElementById(`log-${type}`);
    if (!input) return;
    const channelId = input.value.trim();
    if (!channelId) return;
    try { await fetch(`${API_BASE}/logs/set-channel`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, channelId }) }); alert('✅ Log channel saved'); } catch (e) { alert('Error'); }
}

// ==================== WELCOME ====================
async function fetchWelcome() {
    try {
        const res = await fetch(`${API_BASE}/welcome`);
        const data = await res.json();
        const container = document.getElementById('welcomeContent');
        if (!container) return;
        container.innerHTML = `
            <div class="item-box">
                <div class="setting-row"><span>Enabled:</span><input type="checkbox" ${data.enabled ? 'checked' : ''} onchange="toggleWelcome(this.checked)"></div>
                <div class="setting-row"><span>Channel ID:</span><input type="text" value="${data.channelId || ''}" placeholder="Channel ID" onchange="updateWelcome('channelId', this.value)"></div>
                <div class="setting-row"><span>Message:</span><textarea style="width:100%; height:80px; padding:5px; border-radius:5px; border:1px solid #334155; background:#0f172a; color:#fff;" onchange="updateWelcome('message', this.value)">${data.message || ''}</textarea></div>
                <div class="setting-row"><span>Embed:</span><input type="checkbox" ${data.embed ? 'checked' : ''} onchange="updateWelcome('embed', this.checked)"></div>
                <div class="setting-row"><span>Color:</span><input type="color" value="${data.color || '#5865F2'}" onchange="updateWelcome('color', this.value)"></div>
                <div class="setting-row"><span>Image URL:</span><input type="text" value="${data.imageUrl || ''}" placeholder="Image URL" onchange="updateWelcome('imageUrl', this.value)"></div>
                <div class="setting-row"><span>Thumbnail URL:</span><input type="text" value="${data.thumbnailUrl || ''}" placeholder="Thumbnail URL" onchange="updateWelcome('thumbnailUrl', this.value)"></div>
                <div class="setting-row"><span>Footer:</span><input type="text" value="${data.footer || ''}" placeholder="Footer" onchange="updateWelcome('footer', this.value)"></div>
                <div class="setting-row"><span>Emoji:</span><input type="text" value="${data.emoji || ''}" placeholder="Emoji" onchange="updateWelcome('emoji', this.value)"></div>
            </div>
        `;
    } catch (e) { console.error(e); }
}

async function toggleWelcome(value) {
    try { await fetch(`${API_BASE}/welcome/toggle`, { method: 'POST' }); await fetchWelcome(); } catch (e) { alert('Error'); }
}

async function updateWelcome(field, value) {
    try { await fetch(`${API_BASE}/welcome/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ field, value }) }); } catch (e) { alert('Error'); }
}

// ==================== GOODBYE ====================
async function fetchGoodbye() {
    try {
        const res = await fetch(`${API_BASE}/goodbye`);
        const data = await res.json();
        const container = document.getElementById('goodbyeContent');
        if (!container) return;
        container.innerHTML = `
            <div class="item-box">
                <div class="setting-row"><span>Enabled:</span><input type="checkbox" ${data.enabled ? 'checked' : ''} onchange="updateGoodbye('enabled', this.checked)"></div>
                <div class="setting-row"><span>Channel ID:</span><input type="text" value="${data.channelId || ''}" placeholder="Channel ID" onchange="updateGoodbye('channelId', this.value)"></div>
                <div class="setting-row"><span>Message:</span><textarea style="width:100%; height:80px; padding:5px; border-radius:5px; border:1px solid #334155; background:#0f172a; color:#fff;" onchange="updateGoodbye('message', this.value)">${data.message || ''}</textarea></div>
            </div>
        `;
    } catch (e) { console.error(e); }
}

async function updateGoodbye(field, value) {
    try { await fetch(`${API_BASE}/goodbye/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ field, value }) }); } catch (e) { alert('Error'); }
}

// ==================== REACTION ROLES ====================
async function fetchReactionRoles() {
    try {
        const res = await fetch(`${API_BASE}/reactionroles`);
        const data = await res.json();
        const container = document.getElementById('reactionrolesContent');
        if (!container) return;
        let rolesHtml = '';
        (data.roles || []).forEach((role, index) => {
            rolesHtml += `
                <div class="item-box">
                    <div class="setting-row"><span>Message ID:</span><input type="text" value="${role.messageId || ''}" readonly></div>
                    <div class="setting-row"><span>Emoji:</span><input type="text" value="${role.emoji || ''}" readonly></div>
                    <div class="setting-row"><span>Role ID:</span><input type="text" value="${role.roleId || ''}" readonly></div>
                    <div class="setting-row"><span>Channel ID:</span><input type="text" value="${role.channelId || ''}" readonly></div>
                    <button class="btn btn-remove" onclick="removeReactionRole(${index})">✖ Remove</button>
                </div>
            `;
        });
        container.innerHTML = `
            <div class="item-box">
                <h4>Add Reaction Role</h4>
                <div class="setting-row"><span>Message ID:</span><input type="text" id="rr-messageId" placeholder="Message ID"></div>
                <div class="setting-row"><span>Emoji:</span><input type="text" id="rr-emoji" placeholder="Emoji"></div>
                <div class="setting-row"><span>Role ID:</span><input type="text" id="rr-roleId" placeholder="Role ID"></div>
                <div class="setting-row"><span>Channel ID:</span><input type="text" id="rr-channelId" placeholder="Channel ID"></div>
                <button class="btn btn-add" onclick="addReactionRole()">Add</button>
            </div>
            <h4>Reaction Roles:</h4>
            ${rolesHtml || '<p style="color:#94a3b8;">No reaction roles.</p>'}
        `;
    } catch (e) { console.error(e); }
}

async function addReactionRole() {
    const messageId = document.getElementById('rr-messageId').value.trim();
    const emoji = document.getElementById('rr-emoji').value.trim();
    const roleId = document.getElementById('rr-roleId').value.trim();
    const channelId = document.getElementById('rr-channelId').value.trim();
    if (!messageId || !emoji || !roleId || !channelId) { alert('Please fill all fields'); return; }
    try { await fetch(`${API_BASE}/reactionroles/add`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messageId, emoji, roleId, channelId }) }); await fetchReactionRoles(); } catch (e) { alert('Error'); }
}

async function removeReactionRole(index) {
    try { await fetch(`${API_BASE}/reactionroles/remove`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ index }) }); await fetchReactionRoles(); } catch (e) { alert('Error'); }
}

// ==================== INVITE TRACKER ====================
async function fetchInviteTracker() {
    try {
        const res = await fetch(`${API_BASE}/invitetracker`);
        const data = await res.json();
        const container = document.getElementById('invitetrackerContent');
        if (!container) return;
        container.innerHTML = `
            <div class="item-box">
                <div class="setting-row"><span>Enabled:</span><input type="checkbox" ${data.enabled ? 'checked' : ''} onchange="updateInviteTracker('enabled', this.checked)"></div>
                <div class="setting-row"><span>Channel ID:</span><input type="text" value="${data.channelId || ''}" placeholder="Channel ID" onchange="updateInviteTracker('channelId', this.value)"></div>
                <div class="setting-row"><span>Message:</span><textarea style="width:100%; height:80px; padding:5px; border-radius:5px; border:1px solid #334155; background:#0f172a; color:#fff;" onchange="updateInviteTracker('message', this.value)">${data.message || ''}</textarea></div>
                <div class="setting-row"><span>Embed:</span><input type="checkbox" ${data.embed ? 'checked' : ''} onchange="updateInviteTracker('embed', this.checked)"></div>
            </div>
        `;
    } catch (e) { console.error(e); }
}

async function updateInviteTracker(field, value) {
    try { await fetch(`${API_BASE}/invitetracker/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ field, value }) }); await fetchInviteTracker(); } catch (e) { alert('Error'); }
}

// ==================== LEVELS ====================
async function fetchLevels() {
    try {
        const res = await fetch(`${API_BASE}/levels`);
        const data = await res.json();
        const btn = document.getElementById('levelsBtn');
        const status = document.getElementById('levelsStatus');
        if (btn) btn.innerText = data.enabled ? 'Disable' : 'Enable';
        if (status) status.innerText = data.enabled ? '✅ Enabled' : '❌ Disabled';
        renderLevels(data);
    } catch (e) { console.error(e); }
}

function renderLevels(data) {
    const container = document.getElementById('levelsContent');
    if (!container) return;
    let rolesHtml = '';
    const roles = data.roles || {};
    Object.keys(roles).forEach(level => {
        rolesHtml += `<div style="display:flex; justify-content:space-between; align-items:center; background:#334155; padding:8px; border-radius:5px; margin-bottom:5px;"><span>Level ${level} → ${roles[level]}</span><button class="btn btn-remove" onclick="removeLevelRole('${level}')">✖</button></div>`;
    });
    container.innerHTML = `
        <div class="item-box">
            <div class="setting-row"><span>XP Per Message (min):</span><input type="number" value="${data.xpPerMessage?.min || 15}" style="width:80px;" onchange="updateLevels('xpPerMessage', { min: parseInt(this.value), max: ${data.xpPerMessage?.max || 25} })"></div>
            <div class="setting-row"><span>XP Per Message (max):</span><input type="number" value="${data.xpPerMessage?.max || 25}" style="width:80px;" onchange="updateLevels('xpPerMessage', { min: ${data.xpPerMessage?.min || 15}, max: parseInt(this.value) })"></div>
            <div class="setting-row"><span>Cooldown (ms):</span><input type="number" value="${data.cooldown || 60000}" style="width:100px;" onchange="updateLevels('cooldown', parseInt(this.value))"></div>
            <div class="setting-row"><span>Level Up Channel ID:</span><input type="text" value="${data.levelUpChannel || ''}" placeholder="Channel ID" onchange="updateLevels('levelUpChannel', this.value)"></div>
            <div class="setting-row"><span>Level Up Message:</span><textarea style="width:100%; height:60px; padding:5px; border-radius:5px; border:1px solid #334155; background:#0f172a; color:#fff;" onchange="updateLevels('levelUpMessage', this.value)">${data.levelUpMessage || ''}</textarea></div>
            <div class="setting-row"><span>Level Up Embed:</span><input type="checkbox" ${data.levelUpEmbed ? 'checked' : ''} onchange="updateLevels('levelUpEmbed', this.checked)"></div>
            <div class="setting-row"><span>Level Up Color:</span><input type="color" value="${data.levelUpColor || '#57F287'}" onchange="updateLevels('levelUpColor', this.value)"></div>
            <div class="setting-row"><span>Announce in DM:</span><input type="checkbox" ${data.announceInDM ? 'checked' : ''} onchange="updateLevels('announceInDM', this.checked)"></div>
        </div>
        <div class="item-box">
            <h4>Level Roles</h4>
            <div class="input-row"><input type="number" id="level-input" placeholder="Level" style="width:80px;"><input type="text" id="role-input" placeholder="Role ID"><button class="btn btn-add" onclick="addLevelRole()">Add</button></div>
            <div style="margin-top:10px;">${rolesHtml || '<p style="color:#94a3b8;">No level roles added.</p>'}</div>
        </div>
    `;
}

async function toggleLevels() {
    try { await fetch(`${API_BASE}/levels/toggle`, { method: 'POST' }); await fetchLevels(); } catch (e) { alert('Error'); }
}

async function updateLevels(field, value) {
    try { await fetch(`${API_BASE}/levels/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ field, value }) }); await fetchLevels(); } catch (e) { alert('Error'); }
}

async function addLevelRole() {
    const level = document.getElementById('level-input').value.trim();
    const roleId = document.getElementById('role-input').value.trim();
    if (!level || !roleId) return;
    try { await fetch(`${API_BASE}/levels/add-role`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ level, roleId }) }); await fetchLevels(); } catch (e) { alert('Error'); }
}

async function removeLevelRole(level) {
    try { await fetch(`${API_BASE}/levels/remove-role`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ level }) }); await fetchLevels(); } catch (e) { alert('Error'); }
}

// ==================== ROLE LIMITS ====================
async function fetchRoleLimits() {
    try {
        const res = await fetch(`${API_BASE}/rolelimits/config`);
        const data = await res.json();
        renderRoleLimits(data);
    } catch (e) { console.error(e); }
}

function renderRoleLimits(data) {
    const container = document.getElementById('rolelimitsContent');
    if (!container) return;
    container.innerHTML = '';
    Object.keys(data).forEach(action => {
        const settings = data[action];
        if (typeof settings !== 'object' || settings === null) return;
        const box = document.createElement('div');
        box.className = 'item-box';
        let fieldsHtml = '';
        if (settings.enabled !== undefined) {
            fieldsHtml += `<div class="setting-row"><span>Enabled:</span><input type="checkbox" ${settings.enabled ? 'checked' : ''} onchange="updateRoleLimits('${action}', 'enabled', this.checked)"></div>`;
        }
        if (settings.max !== undefined) {
            fieldsHtml += `<div class="setting-row"><span>Max:</span><input type="number" value="${settings.max}" style="width:80px;" onchange="updateRoleLimits('${action}', 'max', parseInt(this.value))"></div>`;
        }
        if (settings.punishment !== undefined) {
            fieldsHtml += `<div class="setting-row"><span>Punishment:</span><select onchange="updateRoleLimits('${action}', 'punishment', this.value)">
                <option value="delete" ${settings.punishment === 'delete' ? 'selected' : ''}>Delete</option>
                <option value="timeout" ${settings.punishment === 'timeout' ? 'selected' : ''}>Timeout</option>
                <option value="kick" ${settings.punishment === 'kick' ? 'selected' : ''}>Kick</option>
                <option value="ban" ${settings.punishment === 'ban' ? 'selected' : ''}>Ban</option>
                <option value="detect" ${settings.punishment === 'detect' ? 'selected' : ''}>Detect</option>
            </select></div>`;
        }
        box.innerHTML = `<h4>${action.toUpperCase()}</h4>${fieldsHtml}`;
        container.appendChild(box);
    });
}

async function updateRoleLimits(action, field, value) {
    try { await fetch(`${API_BASE}/rolelimits/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, field, value }) }); await fetchRoleLimits(); } catch (e) { alert('Error'); }
}

// ==================== TICKETS ====================
async function fetchTickets() {
    try {
        const res = await fetch(`${API_BASE}/tickets`);
        const data = await res.json();
        renderTickets(data);
    } catch (e) { console.error(e); }
}

function renderTickets(data) {
    const container = document.getElementById('ticketsContent');
    if (!container) return;
    container.innerHTML = `
        <div class="item-box">
            <div class="setting-row"><span>Enabled:</span><input type="checkbox" ${data.enabled ? 'checked' : ''} onchange="updateTickets('enabled', this.checked)"></div>
            <div class="setting-row"><span>Category ID:</span><input type="text" value="${data.categoryId || ''}" placeholder="Category ID" onchange="updateTickets('categoryId', this.value)"></div>
            <div class="setting-row"><span>Support Role ID:</span><input type="text" value="${data.supportRoleId || ''}" placeholder="Role ID" onchange="updateTickets('supportRoleId', this.value)"></div>
            <div class="setting-row"><span>Log Channel ID:</span><input type="text" value="${data.logChannelId || ''}" placeholder="Channel ID" onchange="updateTickets('logChannelId', this.value)"></div>
            <div class="setting-row"><span>Max Tickets:</span><input type="number" value="${data.maxTickets || 3}" onchange="updateTickets('maxTickets', parseInt(this.value))"></div>
            <div class="setting-row"><span>Transcripts:</span><input type="checkbox" ${data.transcripts ? 'checked' : ''} onchange="updateTickets('transcripts', this.checked)"></div>
        </div>
    `;
}

async function updateTickets(field, value) {
    try { await fetch(`${API_BASE}/tickets/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ field, value }) }); await fetchTickets(); } catch (e) { alert('Error'); }
}

// ==================== GIVEAWAYS ====================
async function fetchGiveaways() {
    try {
        const res = await fetch(`${API_BASE}/giveaways`);
        const data = await res.json();
        renderGiveaways(data);
    } catch (e) { console.error(e); }
}

function renderGiveaways(data) {
    const container = document.getElementById('giveawaysContent');
    if (!container) return;
    container.innerHTML = `
        <div class="item-box">
            <div class="setting-row"><span>Enabled:</span><input type="checkbox" ${data.enabled ? 'checked' : ''} onchange="updateGiveaways('enabled', this.checked)"></div>
            <div class="setting-row"><span>Default Duration (ms):</span><input type="number" value="${data.defaultDuration || 86400000}" onchange="updateGiveaways('defaultDuration', parseInt(this.value))"></div>
            <div class="setting-row"><span>Default Winners:</span><input type="number" value="${data.defaultWinners || 1}" onchange="updateGiveaways('defaultWinners', parseInt(this.value))"></div>
            <div class="setting-row"><span>Required Role ID:</span><input type="text" value="${data.requireRole || ''}" placeholder="Role ID" onchange="updateGiveaways('requireRole', this.value)"></div>
            <div class="setting-row"><span>Required Level:</span><input type="number" value="${data.requireLevel || 0}" onchange="updateGiveaways('requireLevel', parseInt(this.value))"></div>
        </div>
    `;
}

async function updateGiveaways(field, value) {
    try { await fetch(`${API_BASE}/giveaways/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ field, value }) }); await fetchGiveaways(); } catch (e) { alert('Error'); }
}

// ==================== WARNS ====================
async function fetchWarns() {
    try {
        const res = await fetch(`${API_BASE}/warns`);
        const data = await res.json();
        renderWarns(data);
    } catch (e) { console.error(e); }
}

function renderWarns(data) {
    const container = document.getElementById('warnsContent');
    if (!container) return;
    container.innerHTML = `
        <div class="item-box">
            <div class="setting-row"><span>Enabled:</span><input type="checkbox" ${data.enabled ? 'checked' : ''} onchange="updateWarns('enabled', this.checked)"></div>
            <div class="setting-row"><span>Auto Punish:</span><input type="checkbox" ${data.autoPunish ? 'checked' : ''} onchange="updateWarns('autoPunish', this.checked)"></div>
            <div class="setting-row"><span>Max Warns:</span><input type="number" value="${data.maxWarns || 3}" onchange="updateWarns('maxWarns', parseInt(this.value))"></div>
            <div class="setting-row"><span>Punishment:</span><select onchange="updateWarns('punishment', this.value)">
                <option value="timeout" ${data.punishment === 'timeout' ? 'selected' : ''}>Timeout</option>
                <option value="kick" ${data.punishment === 'kick' ? 'selected' : ''}>Kick</option>
                <option value="ban" ${data.punishment === 'ban' ? 'selected' : ''}>Ban</option>
            </select></div>
            <div class="setting-row"><span>Log Channel ID:</span><input type="text" value="${data.logChannelId || ''}" placeholder="Channel ID" onchange="updateWarns('logChannelId', this.value)"></div>
        </div>
    `;
}

async function updateWarns(field, value) {
    try { await fetch(`${API_BASE}/warns/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ field, value }) }); await fetchWarns(); } catch (e) { alert('Error'); }
}

// ==================== GAMES ====================
async function fetchGames() {
    try {
        const res = await fetch(`${API_BASE}/games`);
        const data = await res.json();
        renderGames(data);
    } catch (e) { console.error(e); }
}

function renderGames(data) {
    const container = document.getElementById('gamesContent');
    if (!container) return;
    container.innerHTML = `
        <div class="item-box">
            <div class="setting-row"><span>Enabled:</span><input type="checkbox" ${data.enabled ? 'checked' : ''} onchange="updateGames('enabled', this.checked)"></div>
<<<<<<< HEAD
            <div class="setting-row"><span>Channel ID:</span><input type="text" value="${data.channelId || ''}" placeholder="Channel ID" onchange="updateGames('channelId', this.value)"></div>
            <div class="setting-row"><span>Trivia:</span><input type="checkbox" ${data.trivia ? 'checked' : ''} onchange="updateGames('trivia', this.checked)"></div>
            <div class="setting-row"><span>Wordle:</span><input type="checkbox" ${data.wordle ? 'checked' : ''} onchange="updateGames('wordle', this.checked)"></div>
            <div class="setting-row"><span>Truth or Dare:</span><input type="checkbox" ${data.truthordare ? 'checked' : ''} onchange="updateGames('truthordare', this.checked)"></div>
            <div class="setting-row"><span>Would You Rather:</span><input type="checkbox" ${data.wouldyourather ? 'checked' : ''} onchange="updateGames('wouldyourather', this.checked)"></div>
            <div class="setting-row"><span>Points Per Win:</span><input type="number" value="${data.pointsPerWin || 10}" onchange="updateGames('pointsPerWin', this.value)"></div>
            <div class="setting-row"><span>Show Correct Answer:</span><input type="checkbox" ${data.showCorrectAnswer ? 'checked' : ''} onchange="updateGames('showCorrectAnswer', this.checked)"></div>
            <div class="setting-row"><span>Show Wrong Answer:</span><input type="checkbox" ${data.showWrongAnswer ? 'checked' : ''} onchange="updateGames('showWrongAnswer', this.checked)"></div>
=======
            <div class="setting-row"><span>Truth or Dare:</span><input type="checkbox" ${data.truthOrDare ? 'checked' : ''} onchange="updateGames('truthOrDare', this.checked)"></div>
            <div class="setting-row"><span>Would You Rather:</span><input type="checkbox" ${data.wouldYouRather ? 'checked' : ''} onchange="updateGames('wouldYouRather', this.checked)"></div>
            <div class="setting-row"><span>Trivia:</span><input type="checkbox" ${data.trivia ? 'checked' : ''} onchange="updateGames('trivia', this.checked)"></div>
            <div class="setting-row"><span>Wordle:</span><input type="checkbox" ${data.wordle ? 'checked' : ''} onchange="updateGames('wordle', this.checked)"></div>
            <div class="setting-row"><span>Points Per Win:</span><input type="number" value="${data.pointsPerWin || 10}" onchange="updateGames('pointsPerWin', parseInt(this.value))"></div>
>>>>>>> origin/main
        </div>
    `;
}

async function updateGames(field, value) {
    try { await fetch(`${API_BASE}/games/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ field, value }) }); await fetchGames(); } catch (e) { alert('Error'); }
}

// ==================== ANNOUNCEMENTS ====================
async function fetchAnnouncements() {
    try {
        const res = await fetch(`${API_BASE}/announcements`);
        const data = await res.json();
        renderAnnouncements(data);
    } catch (e) { console.error(e); }
}

function renderAnnouncements(data) {
    const container = document.getElementById('announcementsContent');
    if (!container) return;
    container.innerHTML = `
        <div class="item-box">
            <div class="setting-row"><span>Enabled:</span><input type="checkbox" ${data.enabled ? 'checked' : ''} onchange="updateAnnouncements('enabled', this.checked)"></div>
            <div class="setting-row"><span>Default Channel ID:</span><input type="text" value="${data.defaultChannel || ''}" placeholder="Channel ID" onchange="updateAnnouncements('defaultChannel', this.value)"></div>
            <div class="setting-row"><span>Mention Everyone:</span><input type="checkbox" ${data.mentionEveryone ? 'checked' : ''} onchange="updateAnnouncements('mentionEveryone', this.checked)"></div>
            <div class="setting-row"><span>Use Embed:</span><input type="checkbox" ${data.embed ? 'checked' : ''} onchange="updateAnnouncements('embed', this.checked)"></div>
            <div class="setting-row"><span>Color:</span><input type="color" value="${data.color || '#5865F2'}" onchange="updateAnnouncements('color', this.value)"></div>
        </div>
    `;
}

async function updateAnnouncements(field, value) {
    try { await fetch(`${API_BASE}/announcements/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ field, value }) }); await fetchAnnouncements(); } catch (e) { alert('Error'); }
}

// ==================== COLOR ROLES ====================
async function fetchColorRoles() {
    try {
        const res = await fetch(`${API_BASE}/colorroles`);
        const data = await res.json();
        renderColorRoles(data);
    } catch (e) { console.error(e); }
}

function renderColorRoles(data) {
    const container = document.getElementById('colorrolesContent');
    if (!container) return;
    let rolesHtml = '';
    const roles = data.roles || {};
    Object.keys(roles).forEach(colorName => {
        rolesHtml += `
            <div class="item-list" style="display:flex; justify-content:space-between; align-items:center; background:#334155; padding:8px; border-radius:5px; margin-bottom:5px;">
                <span>${colorName} → ${roles[colorName]}</span>
                <button class="btn btn-remove" onclick="removeColorRole('${colorName}')">✖</button>
            </div>
        `;
    });
    container.innerHTML = `
        <div class="item-box">
            <div class="setting-row"><span>Enabled:</span><input type="checkbox" ${data.enabled ? 'checked' : ''} onchange="updateColorRoles('enabled', this.checked)"></div>
            <div class="setting-row"><span>Channel ID:</span><input type="text" value="${data.channelId || ''}" placeholder="Channel ID" onchange="updateColorRoles('channelId', this.value)"></div>
            <div class="setting-row"><span>Max Roles:</span><input type="number" value="${data.maxRoles || 1}" onchange="updateColorRoles('maxRoles', parseInt(this.value))"></div>
            <div class="setting-row"><span>Allow Multiple:</span><input type="checkbox" ${data.allowMultiple ? 'checked' : ''} onchange="updateColorRoles('allowMultiple', this.checked)"></div>
        </div>
        <div class="item-box">
            <h4>Color Roles</h4>
            <div class="input-row">
                <input type="text" id="color-name" placeholder="Color Name">
                <input type="text" id="color-role-id" placeholder="Role ID">
                <button class="btn btn-add" onclick="addColorRole()">Add</button>
            </div>
            <div style="margin-top:10px;">${rolesHtml || '<p style="color:#94a3b8;">No color roles added.</p>'}</div>
        </div>
    `;
}

async function updateColorRoles(field, value) {
    try { await fetch(`${API_BASE}/colorroles/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ field, value }) }); await fetchColorRoles(); } catch (e) { alert('Error'); }
}

async function addColorRole() {
    const colorName = document.getElementById('color-name').value.trim();
    const roleId = document.getElementById('color-role-id').value.trim();
    if (!colorName || !roleId) return;
    try { await fetch(`${API_BASE}/colorroles/add`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ colorName, roleId }) }); await fetchColorRoles(); } catch (e) { alert('Error'); }
}

async function removeColorRole(colorName) {
    try { await fetch(`${API_BASE}/colorroles/remove`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ colorName }) }); await fetchColorRoles(); } catch (e) { alert('Error'); }
}

// ==================== UTILITY ====================
async function fetchUtility() {
    try {
        const res = await fetch(`${API_BASE}/utility`);
        const data = await res.json();
        renderUtility(data);
    } catch (e) { console.error(e); }
}

function renderUtility(data) {
    const container = document.getElementById('utilityContent');
    if (!container) return;
    container.innerHTML = '';
    const commands = Object.keys(data);
    if (commands.length === 0) {
        container.innerHTML = '<p style="color:#94a3b8;">No utility commands found.</p>';
        return;
    }
    commands.forEach(command => {
        const settings = data[command];
        const box = document.createElement('div');
        box.className = 'item-box';
        box.style.marginBottom = '15px';
        let fieldsHtml = `
            <div class="setting-row"><span>Command:</span><strong style="color:#fbbf24;">/${command}</strong></div>
            <div class="setting-row"><span>Enabled:</span><input type="checkbox" ${settings.enabled ? 'checked' : ''} onchange="updateUtility('${command}', 'enabled', this.checked)"></div>
            <div class="setting-row"><span>Custom Name:</span><input type="text" value="${settings.customName || ''}" placeholder="e.g. p, c, s" onchange="updateUtility('${command}', 'customName', this.value)"></div>
            <div class="setting-row"><span>Aliases:</span><input type="text" value="${(settings.aliases || []).join(',')}" placeholder="Aliases (comma separated)" onchange="updateUtility('${command}', 'aliases', this.value.split(',').map(x => x.trim()).filter(x => x))"></div>
            <div class="setting-row"><span>Enabled Roles:</span><input type="text" value="${(settings.enabledRoles || []).join(',')}" placeholder="Role IDs (comma separated)" onchange="updateUtility('${command}', 'enabledRoles', this.value.split(',').map(x => x.trim()).filter(x => x))"></div>
            <div class="setting-row"><span>Disabled Roles:</span><input type="text" value="${(settings.disabledRoles || []).join(',')}" placeholder="Role IDs (comma separated)" onchange="updateUtility('${command}', 'disabledRoles', this.value.split(',').map(x => x.trim()).filter(x => x))"></div>
            <div class="setting-row"><span>Enabled Channels:</span><input type="text" value="${(settings.enabledChannels || []).join(',')}" placeholder="Channel IDs (comma separated)" onchange="updateUtility('${command}', 'enabledChannels', this.value.split(',').map(x => x.trim()).filter(x => x))"></div>
            <div class="setting-row"><span>Disabled Channels:</span><input type="text" value="${(settings.disabledChannels || []).join(',')}" placeholder="Channel IDs (comma separated)" onchange="updateUtility('${command}', 'disabledChannels', this.value.split(',').map(x => x.trim()).filter(x => x))"></div>
            <div class="setting-row"><span>Max Limit:</span><input type="number" value="${settings.maxLimit || 4}" style="width:80px;" onchange="updateUtility('${command}', 'maxLimit', parseInt(this.value))"></div>
            <div class="setting-row"><span>Auto-Delete Message:</span><input type="checkbox" ${settings.autoDeleteMessage ? 'checked' : ''} onchange="updateUtility('${command}', 'autoDeleteMessage', this.checked)"></div>
            <div class="setting-row"><span>Auto-Delete Invocation:</span><input type="checkbox" ${settings.autoDeleteInvocation ? 'checked' : ''} onchange="updateUtility('${command}', 'autoDeleteInvocation', this.checked)"></div>
            <div class="setting-row"><span>Auto-Delete Reply:</span><input type="checkbox" ${settings.autoDeleteReply ? 'checked' : ''} onchange="updateUtility('${command}', 'autoDeleteReply', this.checked)"></div>
        `;
        box.innerHTML = `<h4>/${command.toUpperCase()}</h4>${fieldsHtml}`;
        container.appendChild(box);
    });
}

async function updateUtility(command, field, value) {
    try { await fetch(`${API_BASE}/utility/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command, field, value }) }); await fetchUtility(); } catch (e) { alert('Error'); }
}

// ==================== NAVIGATION ====================
function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
    const section = document.getElementById(id);
    if (section) section.classList.add('active');
    if (event && event.target) event.target.classList.add('active');
    const title = document.getElementById('pageTitle');
    if (title) title.innerText = id.charAt(0).toUpperCase() + id.slice(1);
}

// ==================== INIT ====================
fetchStatus();
fetchGeneral();
fetchPremium();
fetchAnalytics();
fetchWhitelist();
fetchAntiSpam();
fetchAntiNuke();
fetchBeastMode();
fetchAntiRaid();
fetchVerification();
fetchModeration();
fetchAutoRole();
fetchLogs();
fetchWelcome();
fetchGoodbye();
fetchReactionRoles();
fetchInviteTracker();
fetchLevels();
fetchRoleLimits();
fetchTickets();
fetchGiveaways();
fetchWarns();
fetchGames();
fetchAnnouncements();
fetchColorRoles();
fetchUtility();
setInterval(fetchStatus, 10000);
