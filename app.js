/* ==========================================
   HORARIO INTELIGENTE v2 - APLICACIÓN PRINCIPAL
   Basada en hora real del sistema
   ========================================== */

// ===== REGISTRO DEL SERVICE WORKER =====
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
        .then(() => console.log('Service Worker registrado'))
        .catch(err => console.log('Error registrando Service Worker:', err));
}

// ===== MANEJO DE INSTALACIÓN PWA =====
let deferredPrompt;
const installPrompt = document.getElementById('installPrompt');
const installBtn = document.getElementById('installBtn');
const dismissBtn = document.getElementById('dismissBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installPrompt.style.display = 'flex';
});

installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        installPrompt.style.display = 'none';
    }
});

dismissBtn.addEventListener('click', () => {
    installPrompt.style.display = 'none';
});

// ===== ELEMENTOS DEL DOM =====
const profileSelect = document.getElementById('profileSelect');
const newProfileBtn = document.getElementById('newProfileBtn');
const deleteProfileBtn = document.getElementById('deleteProfileBtn');
const profileModal = document.getElementById('profileModal');
const modalOverlay = document.getElementById('modalOverlay');
const profileNameInput = document.getElementById('profileNameInput');
const confirmProfileBtn = document.getElementById('confirmProfileBtn');
const cancelProfileBtn = document.getElementById('cancelProfileBtn');
const quickNewBtn = document.getElementById('quickNewBtn');

const mainContent = document.getElementById('mainContent');
const welcomeMessage = document.getElementById('welcomeMessage');
const clock = document.getElementById('clock');
const dateDisplay = document.getElementById('date');

const dayTabs = document.querySelectorAll('.day-tab');
const scheduleTable = document.getElementById('scheduleTable');
const alertContainer = document.getElementById('alertContainer');
const progressCard = document.getElementById('progressCard');
const progressFill = document.getElementById('progressFill');
const progressTime = document.getElementById('progressTime');
const progressActivityName = document.getElementById('progressActivityName');

const currentActivityName = document.getElementById('currentActivityName');
const activityTime = document.getElementById('activityTime');
const startActivityBtn = document.getElementById('startActivityBtn');

const activityName = document.getElementById('activityName');
const activityStart = document.getElementById('activityStart');
const activityEnd = document.getElementById('activityEnd');
const activityDay = document.getElementById('activityDay');
const addActivityBtn = document.getElementById('addActivityBtn');

// === NUEVOS ELEMENTOS v2.5 ===
const noEndTimeCheckbox = document.getElementById('noEndTimeCheckbox');
const repeatActivityCheckbox = document.getElementById('repeatActivityCheckbox');
const repeatOptionsContainer = document.getElementById('repeatOptionsContainer');
const dayRepeatCheckboxes = document.querySelectorAll('.day-repeat-checkbox');
const repeatDurationOptions = document.querySelectorAll('input[name="repeatDuration"]');
const repeatEndDateInput = document.getElementById('repeatEndDate');
const endDateContainer = document.getElementById('endDateContainer');

const breakToggle = document.getElementById('breakToggle');
const breakDurationContainer = document.getElementById('breakDurationContainer');
const durationBtns = document.querySelectorAll('.duration-btn');

const statOnTime = document.getElementById('statOnTime');
const statLate = document.getElementById('statLate');
const statAvgDelay = document.getElementById('statAvgDelay');

const resetDayBtn = document.getElementById('resetDayBtn');
const resetAllBtn = document.getElementById('resetAllBtn');

// ===== ESTADO GLOBAL =====
let currentProfile = null;
let currentDay = getCurrentDayOfWeek();
let updateInterval = null;

// ===== ESTRUCTURA DE DATOS EN LOCALSTORAGE =====
const StorageManager = {
    getAllProfiles() {
        const profiles = localStorage.getItem('horario_profiles_v2');
        return profiles ? JSON.parse(profiles) : [];
    },

    getProfile(profileName) {
        const profiles = this.getAllProfiles();
        return profiles.find(p => p.name === profileName);
    },

    createProfile(name) {
        if (name.trim() === '' || this.getProfile(name)) return false;
        
        const profiles = this.getAllProfiles();
        profiles.push({
            name: name,
            schedule: {
                0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
            },
            breakEnabled: true,
            breakMinutes: 15,
            stats: {
                onTime: 0,
                late: 0,
                totalDelays: 0,
                count: 0
            },
            dayAdjustments: {}
        });
        
        localStorage.setItem('horario_profiles_v2', JSON.stringify(profiles));
        return true;
    },

    deleteProfile(name) {
        const profiles = this.getAllProfiles().filter(p => p.name !== name);
        localStorage.setItem('horario_profiles_v2', JSON.stringify(profiles));
    },

    saveProfile(profile) {
        const profiles = this.getAllProfiles();
        const index = profiles.findIndex(p => p.name === profile.name);
        if (index !== -1) {
            profiles[index] = profile;
            localStorage.setItem('horario_profiles_v2', JSON.stringify(profiles));
        }
    },

    addActivity(profileName, day, activity) {
        const profile = this.getProfile(profileName);
        if (profile) {
            profile.schedule[day].push({
                id: Date.now(),
                name: activity.name,
                start: activity.start,
                end: activity.end || null,
                noEndTime: activity.noEndTime || false,
                repetitive: activity.repetitive || false,
                repeatDays: activity.repeatDays || [],
                repeatType: activity.repeatType || 'forever',
                repeatEndDate: activity.repeatEndDate || null,
                startedAt: null,
                completed: false
            });
            this.saveProfile(profile);
        }
    },

    updateActivity(profileName, day, activityId, updates) {
        const profile = this.getProfile(profileName);
        if (profile) {
            const activity = profile.schedule[day].find(a => a.id === activityId);
            if (activity) {
                Object.assign(activity, updates);
                this.saveProfile(profile);
            }
        }
    },

    deleteActivity(profileName, day, activityId) {
        const profile = this.getProfile(profileName);
        if (profile) {
            profile.schedule[day] = profile.schedule[day].filter(a => a.id !== activityId);
            this.saveProfile(profile);
        }
    },

    applyRepetition(profileName, activityData, days) {
        const profile = this.getProfile(profileName);
        if (profile && days.length > 0) {
            days.forEach(day => {
                const dayNum = parseInt(day);
                if (profile.schedule[dayNum] !== undefined) {
                    profile.schedule[dayNum].push({
                        id: Date.now() + Math.random(),
                        name: activityData.name,
                        start: activityData.start,
                        end: activityData.end || null,
                        noEndTime: activityData.noEndTime || false,
                        repetitive: activityData.repetitive || false,
                        repeatDays: activityData.repeatDays || [],
                        repeatType: activityData.repeatType || 'forever',
                        repeatEndDate: activityData.repeatEndDate || null,
                        startedAt: null,
                        completed: false
                    });
                }
            });
            this.saveProfile(profile);
        }
    },

    updateStats(profileName, onTime, delay) {
        const profile = this.getProfile(profileName);
        if (profile) {
            if (onTime) {
                profile.stats.onTime++;
            } else {
                profile.stats.late++;
                profile.stats.totalDelays += delay;
            }
            profile.stats.count++;
            this.saveProfile(profile);
        }
    },

    getAdjustment(profileName, day) {
        const profile = this.getProfile(profileName);
        if (profile && profile.dayAdjustments) {
            return profile.dayAdjustments[day] || 0;
        }
        return 0;
    },

    setAdjustment(profileName, day, minutes) {
        const profile = this.getProfile(profileName);
        if (profile) {
            if (!profile.dayAdjustments) profile.dayAdjustments = {};
            profile.dayAdjustments[day] = minutes;
            this.saveProfile(profile);
        }
    }
};

// ===== FUNCIONES AUXILIARES =====
function getCurrentDayOfWeek() {
    return new Date().getDay();
}

function timeToMinutes(time) {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
}

function minutesToTime(mins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function getCurrentMinutes() {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
}

function adjustTime(time, minutes) {
    let mins = timeToMinutes(time) + minutes;
    if (mins >= 1440) mins -= 1440;
    if (mins < 0) mins += 1440;
    return minutesToTime(mins);
}

// ===== RELOJ EN VIVO =====
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    clock.textContent = `${hours}:${minutes}:${seconds}`;
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.textContent = now.toLocaleDateString('es-ES', options);
}

setInterval(updateClock, 1000);
updateClock();

// ===== FUNCIONES DE PERFIL =====
function loadProfiles() {
    const profiles = StorageManager.getAllProfiles();
    
    profileSelect.innerHTML = '<option value="">-- Seleccionar perfil --</option>';
    
    profiles.forEach(profile => {
        const option = document.createElement('option');
        option.value = profile.name;
        option.textContent = profile.name;
        profileSelect.appendChild(option);
    });
    
    deleteProfileBtn.style.display = profiles.length > 0 ? 'block' : 'none';
}

function selectProfile(profileName) {
    if (!profileName) {
        currentProfile = null;
        mainContent.style.display = 'none';
        welcomeMessage.style.display = 'flex';
        return;
    }

    currentProfile = StorageManager.getProfile(profileName);
    if (currentProfile) {
        mainContent.style.display = 'flex';
        welcomeMessage.style.display = 'none';
        
        currentDay = getCurrentDayOfWeek();
        updateDayTabs();
        loadConfiguration();
        loadSchedule();
        updateUI();
    }
}

// ===== FUNCIONES DE DÍA =====
function updateDayTabs() {
    dayTabs.forEach(tab => {
        const day = parseInt(tab.dataset.day);
        tab.classList.toggle('active', day === currentDay);
    });
}

function switchDay(day) {
    currentDay = day;
    updateDayTabs();
    alertContainer.innerHTML = '';
    loadSchedule();
    updateUI();
}

// ===== FUNCIONES DE HORARIO =====
function loadSchedule() {
    if (!currentProfile) return;

    scheduleTable.innerHTML = '';
    
    let schedule = currentProfile.schedule[currentDay] || [];
    
    schedule = [...schedule].sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));

    if (currentProfile.breakEnabled) {
        schedule = insertBreakTime(schedule);
    }

    if (schedule.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="4" class="empty-message">No hay actividades para este día</td>';
        scheduleTable.appendChild(tr);
        return;
    }

    const adjustment = StorageManager.getAdjustment(currentProfile.name, `${currentDay}-${new Date().toISOString().split('T')[0]}`);
    const currentMin = getCurrentMinutes();

    schedule.forEach((activity, index) => {
        const startMin = timeToMinutes(activity.start) + adjustment;
        
        // Calcular endMin considerando actividades sin hora de fin
        let endMin;
        if (activity.noEndTime) {
            // Si no tiene hora de fin, buscar la siguiente actividad
            if (index + 1 < schedule.length) {
                endMin = timeToMinutes(schedule[index + 1].start) + adjustment;
            } else {
                endMin = 1440; // Fin del día
            }
        } else {
            endMin = timeToMinutes(activity.end || activity.start) + adjustment;
        }
        
        const isCurrentActivity = currentMin >= startMin && currentMin < endMin;

        const tr = document.createElement('tr');
        if (activity.isBreak) {
            tr.classList.add('break');
        }
        if (isCurrentActivity) {
            tr.classList.add('current');
        }
        if (activity.repetitive) {
            tr.classList.add('repetitive');
        }
        if (activity.noEndTime) {
            tr.classList.add('no-end-time');
        }

        const startTime = minutesToTime(startMin);
        let endDisplay;
        if (activity.noEndTime) {
            endDisplay = '∞';
        } else {
            endDisplay = minutesToTime(endMin);
        }

        // Crear indicadores
        let activityNameDisplay = activity.name;
        let badges = '';
        if (activity.repetitive) {
            badges += '<span class="repetitive-badge">🔄 Repetitiva</span>';
        }
        if (activity.noEndTime) {
            badges += '<span class="no-end-badge">∞ Sin fin</span>';
        }

        const nameHTML = badges ? `<div class="activity-name-with-badges">${activity.name}${badges}</div>` : activity.name;

        tr.innerHTML = `
            <td>${startTime}</td>
            <td>${endDisplay}</td>
            <td>${nameHTML}</td>
            <td class="action-cell">
                <button class="btn btn-small" onclick="editActivity(${activity.id}, '${activity.name}', '${activity.start}', '${activity.end || ''}')">✏️</button>
                <button class="btn btn-small btn-danger" onclick="deleteActivityRow(${activity.id})">🗑️</button>
            </td>
        `;

        scheduleTable.appendChild(tr);
    });
}

function insertBreakTime(schedule) {
    const result = [];
    for (let i = 0; i < schedule.length - 1; i++) {
        result.push(schedule[i]);
        
        // Si la actividad actual no tiene hora de fin, no agregar tiempo libre
        if (schedule[i].noEndTime) {
            continue;
        }
        
        const endMin = timeToMinutes(schedule[i].end);
        const nextMin = timeToMinutes(schedule[i + 1].start);
        
        if (nextMin - endMin > currentProfile.breakMinutes) {
            const breakStart = minutesToTime(endMin);
            const breakEnd = minutesToTime(endMin + currentProfile.breakMinutes);
            
            result.push({
                id: `break-${i}`,
                name: '☕ Tiempo libre',
                start: breakStart,
                end: breakEnd,
                isBreak: true,
                completed: true
            });
        }
    }
    if (schedule.length > 0) {
        result.push(schedule[schedule.length - 1]);
    }
    return result;
}

function deleteActivityRow(activityId) {
    if (confirm('¿Eliminar esta actividad?')) {
        StorageManager.deleteActivity(currentProfile.name, currentDay, activityId);
        currentProfile = StorageManager.getProfile(currentProfile.name);
        loadSchedule();
    }
}

function editActivity(id, name, start, end) {
    // Buscar la actividad completa
    const activity = currentProfile.schedule[currentDay].find(a => a.id === id);
    if (!activity) return;

    // Cargar datos básicos
    activityName.value = activity.name;
    activityStart.value = activity.start;
    activityEnd.value = activity.end || '';
    activityDay.value = currentDay;

    // Cargar datos de sin hora de fin
    noEndTimeCheckbox.checked = activity.noEndTime || false;
    activityEnd.disabled = activity.noEndTime || false;

    // Cargar datos de repetición
    repeatActivityCheckbox.checked = activity.repetitive || false;
    repeatOptionsContainer.style.display = (activity.repetitive || false) ? 'block' : 'none';

    if (activity.repetitive) {
        // Cargar días seleccionados
        dayRepeatCheckboxes.forEach(cb => {
            cb.checked = (activity.repeatDays || []).includes(cb.value);
        });

        // Cargar tipo de repetición
        document.querySelectorAll('input[name="repeatDuration"]').forEach(radio => {
            radio.checked = radio.value === (activity.repeatType || 'forever');
        });

        // Cargar fecha límite
        if (activity.repeatEndDate) {
            repeatEndDateInput.value = activity.repeatEndDate;
            endDateContainer.style.display = activity.repeatType === 'until' ? 'block' : 'none';
        } else {
            endDateContainer.style.display = 'none';
        }
    }

    addActivityBtn.dataset.editId = id;
    activityName.focus();
}

// ===== AGREGAR/ACTUALIZAR ACTIVIDAD =====
function addActivity() {
    if (!currentProfile) return;

    const name = activityName.value.trim();
    const start = activityStart.value;
    const end = activityEnd.value;
    const day = parseInt(activityDay.value);
    const noEndTime = noEndTimeCheckbox.checked;
    const isRepetitive = repeatActivityCheckbox.checked;

    if (!name || !start) {
        alert('Por favor completa el nombre y la hora de inicio');
        return;
    }

    // Validar hora de fin si no es "sin hora de fin"
    if (!noEndTime && !end) {
        alert('Por favor selecciona la hora de fin o marca "sin hora de fin"');
        return;
    }

    // Validar que hora inicio < hora fin
    if (!noEndTime && timeToMinutes(start) >= timeToMinutes(end)) {
        alert('La hora de fin debe ser posterior a la de inicio');
        return;
    }

    // Validar repetición
    let selectedRepeatDays = [];
    if (isRepetitive) {
        selectedRepeatDays = Array.from(dayRepeatCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        if (selectedRepeatDays.length === 0) {
            alert('Selecciona al menos un día para la repetición');
            return;
        }
    }

    const activityData = {
        name,
        start,
        end: end || null,
        noEndTime,
        repetitive: isRepetitive,
        repeatDays: selectedRepeatDays,
        repeatType: document.querySelector('input[name="repeatDuration"]:checked')?.value || 'forever',
        repeatEndDate: repeatEndDateInput.value || null
    };

    const editId = addActivityBtn.dataset.editId;
    
    if (editId) {
        // Modo edición - actualizar la actividad existente
        StorageManager.updateActivity(currentProfile.name, currentDay, parseInt(editId), activityData);
        delete addActivityBtn.dataset.editId;
    } else {
        // Modo crear - si es repetitiva, agregar a todos los días seleccionados
        if (isRepetitive) {
            StorageManager.applyRepetition(currentProfile.name, activityData, selectedRepeatDays);
        } else {
            StorageManager.addActivity(currentProfile.name, day, activityData);
        }
    }

    // Limpiar formulario
    activityName.value = '';
    activityStart.value = '';
    activityEnd.value = '';
    noEndTimeCheckbox.checked = false;
    repeatActivityCheckbox.checked = false;
    activityEnd.disabled = false;
    repeatOptionsContainer.style.display = 'none';
    dayRepeatCheckboxes.forEach(cb => cb.checked = false);
    repeatEndDateInput.value = '';
    endDateContainer.style.display = 'none';
    repeatDurationOptions[0].checked = true;
    addActivityBtn.textContent = 'Agregar';
    
    currentProfile = StorageManager.getProfile(currentProfile.name);
    loadSchedule();
}

// ===== DETECCIÓN AUTOMÁTICA DE ACTIVIDAD ACTUAL =====
function updateUI() {
    if (!currentProfile) return;

    const schedule = currentProfile.schedule[currentDay] || [];
    const currentMin = getCurrentMinutes();
    const adjustment = StorageManager.getAdjustment(currentProfile.name, `${currentDay}-${new Date().toISOString().split('T')[0]}`);

    let currentActivity = null;
    
    for (let i = 0; i < schedule.length; i++) {
        const activity = schedule[i];
        const startMin = timeToMinutes(activity.start) + adjustment;
        
        // Para actividades sin hora de fin, buscar la siguiente actividad
        let endMin;
        if (activity.noEndTime) {
            if (i + 1 < schedule.length) {
                endMin = timeToMinutes(schedule[i + 1].start) + adjustment;
            } else {
                endMin = 1440; // Fin del día
            }
        } else {
            endMin = timeToMinutes(activity.end) + adjustment;
        }
        
        if (currentMin >= startMin && currentMin < endMin) {
            currentActivity = { ...activity, startMin, endMin };
            break;
        }
    }

    if (currentActivity) {
        currentActivityName.textContent = currentActivity.name;
        const startTime = minutesToTime(currentActivity.startMin);
        
        let timeDisplay;
        if (currentActivity.noEndTime) {
            timeDisplay = `${startTime} — Sin fin definido`;
        } else {
            const endTime = minutesToTime(currentActivity.endMin);
            timeDisplay = `${startTime} a ${endTime}`;
        }
        activityTime.textContent = timeDisplay;

        progressCard.style.display = 'block';
        progressActivityName.textContent = currentActivity.name;
        
        const elapsed = currentMin - currentActivity.startMin;
        const duration = currentActivity.endMin - currentActivity.startMin;
        const percentage = Math.max(0, Math.min(100, (elapsed / duration) * 100));
        
        progressFill.style.width = percentage + '%';
        
        if (currentActivity.noEndTime) {
            progressTime.textContent = `${minutesToTime(elapsed * 60)} / Sin fin`;
        } else {
            progressTime.textContent = `${minutesToTime(elapsed * 60)} / ${minutesToTime(duration * 60)}`;
        }

        showAlerts(currentActivity, elapsed);
    } else {
        currentActivityName.textContent = 'Ninguna actividad';
        activityTime.textContent = '--:-- a --:--';
        progressCard.style.display = 'none';
        alertContainer.innerHTML = '';
    }

    startActivityBtn.disabled = !currentActivity;
}

function showAlerts(activity, elapsedMins) {
    alertContainer.innerHTML = '';
    
    if (elapsedMins < 5) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-info';
        alert.innerHTML = `<span class="alert-text">🟢 ${activity.name} está en curso</span>`;
        alertContainer.appendChild(alert);
    }
}

// ===== INICIAR ACTIVIDAD CON DETECCIÓN DE RETRASO =====
function startActivity() {
    if (!currentProfile || !currentActivityName.textContent) return;

    const now = new Date();
    const schedule = currentProfile.schedule[currentDay] || [];
    
    let activity = null;
    for (let a of schedule) {
        if (a.name === currentActivityName.textContent) {
            activity = a;
            break;
        }
    }

    if (!activity) return;

    const plannedStartMin = timeToMinutes(activity.start);
    const actualStartMin = getCurrentMinutes();
    const delay = actualStartMin - plannedStartMin;

    StorageManager.updateActivity(currentProfile.name, currentDay, activity.id, {
        startedAt: now.toISOString(),
        completed: true
    });

    if (delay <= 0) {
        StorageManager.updateStats(currentProfile.name, true, 0);
        showAlert('success', '✅ ¡Puntual! Actividad iniciada a tiempo');
    } else {
        StorageManager.updateStats(currentProfile.name, false, delay);
        showAlert('warning', `⚠️ Retraso detectado: ${delay} minutos`);
        
        adjustScheduleForDelay(delay);
    }

    currentProfile = StorageManager.getProfile(currentProfile.name);
    updateStats();
    loadSchedule();
    setTimeout(updateUI, 500);
}

function adjustScheduleForDelay(delayMinutes) {
    const today = new Date().toISOString().split('T')[0];
    const key = `${currentDay}-${today}`;
    
    const currentAdjustment = StorageManager.getAdjustment(currentProfile.name, key);
    StorageManager.setAdjustment(currentProfile.name, key, currentAdjustment + delayMinutes);
    
    const alert = document.createElement('div');
    alert.className = 'alert alert-warning';
    alert.innerHTML = `<span class="alert-text">⏰ Horario ajustado: +${delayMinutes} minutos de retraso</span>`;
    alertContainer.appendChild(alert);
}

function showAlert(type, message) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `<span class="alert-text">${message}</span>`;
    alertContainer.appendChild(alert);
    
    setTimeout(() => alert.remove(), 5000);
}

// ===== ESTADÍSTICAS =====
function updateStats() {
    if (!currentProfile) return;

    const total = currentProfile.stats.count || 0;
    const avgDelay = total > 0 && currentProfile.stats.late > 0 ? Math.round(currentProfile.stats.totalDelays / currentProfile.stats.late) : 0;

    statOnTime.textContent = currentProfile.stats.onTime;
    statLate.textContent = currentProfile.stats.late;
    statAvgDelay.textContent = `${avgDelay} min`;
}

// ===== CONFIGURACIÓN =====
function loadConfiguration() {
    if (!currentProfile) return;

    breakToggle.checked = currentProfile.breakEnabled;
    breakDurationContainer.style.display = currentProfile.breakEnabled ? 'block' : 'none';

    durationBtns.forEach(btn => {
        const mins = parseInt(btn.dataset.minutes);
        btn.classList.toggle('active', mins === currentProfile.breakMinutes);
    });

    updateStats();
}

breakToggle.addEventListener('change', (e) => {
    if (!currentProfile) return;
    currentProfile.breakEnabled = e.target.checked;
    breakDurationContainer.style.display = currentProfile.breakEnabled ? 'block' : 'none';
    StorageManager.saveProfile(currentProfile);
    loadSchedule();
});

durationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (!currentProfile) return;
        
        const minutes = parseInt(btn.dataset.minutes);
        currentProfile.breakMinutes = minutes;
        
        durationBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        StorageManager.saveProfile(currentProfile);
        loadSchedule();
    });
});

// ===== MODALES =====
function openProfileModal() {
    profileNameInput.value = '';
    profileModal.style.display = 'block';
    modalOverlay.style.display = 'block';
    profileNameInput.focus();
}

function closeProfileModal() {
    profileModal.style.display = 'none';
    modalOverlay.style.display = 'none';
}

modalOverlay.addEventListener('click', closeProfileModal);
cancelProfileBtn.addEventListener('click', closeProfileModal);

profileNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') confirmProfileBtn.click();
});

confirmProfileBtn.addEventListener('click', () => {
    const name = profileNameInput.value.trim();
    if (name === '') {
        alert('Escribe un nombre para el perfil');
        return;
    }

    if (StorageManager.createProfile(name)) {
        loadProfiles();
        closeProfileModal();
        profileSelect.value = name;
        selectProfile(name);
    } else {
        alert('El perfil ya existe o el nombre es inválido');
    }
});

// ===== EVENTOS =====
profileSelect.addEventListener('change', (e) => {
    selectProfile(e.target.value);
});

newProfileBtn.addEventListener('click', openProfileModal);
quickNewBtn.addEventListener('click', openProfileModal);

deleteProfileBtn.addEventListener('click', () => {
    if (!currentProfile || !confirm(`¿Eliminar "${currentProfile.name}"?`)) return;
    
    StorageManager.deleteProfile(currentProfile.name);
    currentProfile = null;
    loadProfiles();
    profileSelect.value = '';
    selectProfile('');
});

dayTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        switchDay(parseInt(tab.dataset.day));
    });
});

addActivityBtn.addEventListener('click', addActivity);
activityName.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addActivityBtn.click();
});

startActivityBtn.addEventListener('click', startActivity);

// ===== EVENT LISTENERS v2.5 - REPETICIÓN Y SIN HORA DE FIN =====
noEndTimeCheckbox.addEventListener('change', (e) => {
    activityEnd.disabled = e.target.checked;
    if (e.target.checked) activityEnd.value = '';
});

repeatActivityCheckbox.addEventListener('change', (e) => {
    repeatOptionsContainer.style.display = e.target.checked ? 'block' : 'none';
    if (!e.target.checked) {
        dayRepeatCheckboxes.forEach(cb => cb.checked = false);
        repeatEndDateInput.value = '';
        endDateContainer.style.display = 'none';
        repeatDurationOptions[0].checked = true;
    }
});

repeatDurationOptions.forEach(option => {
    option.addEventListener('change', (e) => {
        endDateContainer.style.display = e.target.value === 'until' ? 'block' : 'none';
        if (e.target.value === 'forever') repeatEndDateInput.value = '';
    });
});

// ===== LÓGICA DEL TUTORIAL =====
const tutorialBtn = document.getElementById('tutorialBtn');
const tutorialModal = document.getElementById('tutorialModal');
const closeTutorialBtn = document.getElementById('closeTutorialBtn');
const closeTutorialBottomBtn = document.getElementById('closeTutorialBottomBtn');
const tutorialTabs = document.querySelectorAll('.tutorial-tab');
const tutorialSteps = document.querySelectorAll('.tutorial-step');
const prevTutorialBtn = document.getElementById('prevTutorialBtn');
const nextTutorialBtn = document.getElementById('nextTutorialBtn');

let currentTutorialStep = 0;

function openTutorial() {
    tutorialModal.style.display = 'flex';
    modalOverlay.style.display = 'block';
    currentTutorialStep = 0;
    updateTutorialDisplay();
}

function closeTutorial() {
    tutorialModal.style.display = 'none';
    modalOverlay.style.display = 'none';
}

function updateTutorialDisplay() {
    // Actualizar pasos visibles
    tutorialSteps.forEach((step, index) => {
        step.classList.toggle('active', index === currentTutorialStep);
    });

    // Actualizar tabs
    tutorialTabs.forEach((tab, index) => {
        tab.classList.toggle('active', index === currentTutorialStep);
    });

    // Deshabilitar botones si es necesario
    prevTutorialBtn.disabled = currentTutorialStep === 0;
    nextTutorialBtn.disabled = currentTutorialStep === tutorialSteps.length - 1;
}

function goToTutorialStep(step) {
    if (step >= 0 && step < tutorialSteps.length) {
        currentTutorialStep = step;
        updateTutorialDisplay();
    }
}

// Event listeners del tutorial
tutorialBtn.addEventListener('click', openTutorial);
closeTutorialBtn.addEventListener('click', closeTutorial);
closeTutorialBottomBtn.addEventListener('click', closeTutorial);

tutorialTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => goToTutorialStep(index));
});

prevTutorialBtn.addEventListener('click', () => {
    if (currentTutorialStep > 0) {
        goToTutorialStep(currentTutorialStep - 1);
    }
});

nextTutorialBtn.addEventListener('click', () => {
    if (currentTutorialStep < tutorialSteps.length - 1) {
        goToTutorialStep(currentTutorialStep + 1);
    }
});

// Cerrar tutorial al hacer click en overlay
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay && tutorialModal.style.display === 'flex') {
        closeTutorial();
    }
});

resetDayBtn.addEventListener('click', () => {
    if (!confirm('¿Reiniciar todas las actividades del día?')) return;
    
    if (currentProfile) {
        currentProfile.schedule[currentDay].forEach(a => {
            a.completed = false;
            a.startedAt = null;
        });
        StorageManager.saveProfile(currentProfile);
        loadSchedule();
        updateUI();
    }
});

resetAllBtn.addEventListener('click', () => {
    if (!confirm('¿Limpiar todo el horario?')) return;
    
    if (currentProfile) {
        currentProfile.schedule = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
        currentProfile.stats = { onTime: 0, late: 0, totalDelays: 0, count: 0 };
        StorageManager.saveProfile(currentProfile);
        loadSchedule();
        updateStats();
    }
});

// ===== INICIALIZACIÓN =====
loadProfiles();

// ===== FUNCIONES DE HORARIO =====
function loadSchedule() {
    if (!currentProfile) return;

    scheduleList.innerHTML = '';

    if (currentProfile.schedule.length === 0) {
        scheduleList.innerHTML = '<p class="empty-message">No hay actividades. ¡Agrega una!</p>';
        return;
    }

    currentProfile.schedule.forEach((activity, index) => {
        const isCurrentActivity = currentActivityIndex === index;
        const item = createScheduleItem(activity, index, isCurrentActivity);
        scheduleList.appendChild(item);
    });
}

function createScheduleItem(activity, index, isCurrent) {
    const item = document.createElement('div');
    item.className = 'schedule-item';
    
    if (isCurrent) {
        item.classList.add('current');
    } else if (activity.completed) {
        item.classList.add('completed');
    }

    const isBreak = activity.name === '☕ Descanso';
    if (isBreak) {
        item.classList.add('break');
    }

    const info = document.createElement('div');
    info.className = 'schedule-info';

    const name = document.createElement('div');
    name.className = 'schedule-name';
    name.textContent = activity.name;

    const timeInfo = document.createElement('div');
    timeInfo.className = 'schedule-time';
    
    if (activity.startTime) {
        const start = new Date(activity.startTime);
        const end = activity.endTime ? new Date(activity.endTime) : 'En progreso';
        timeInfo.textContent = `${start.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - ${end === 'En progreso' ? end : end.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
        timeInfo.textContent = `${activity.duration} min planeados`;
    }

    info.appendChild(name);
    info.appendChild(timeInfo);

    const duration = document.createElement('div');
    duration.className = 'schedule-duration';
    duration.textContent = activity.usedTime > 0 ? `${activity.usedTime} min` : `${activity.duration} min`;

    item.appendChild(info);
    item.appendChild(duration);

    // Acciones para actividades no iniciadas
    if (!activity.completed && !isCurrent) {
        const actions = document.createElement('div');
        actions.className = 'schedule-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-small';
        editBtn.textContent = '✏️';
        editBtn.title = 'Editar';
        editBtn.addEventListener('click', () => {
            activityName.value = activity.name;
            activityDuration.value = activity.duration;
            addActivityBtn.textContent = 'Actualizar';
            addActivityBtn.dataset.editId = activity.id;
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-small btn-danger';
        deleteBtn.textContent = '🗑️';
        deleteBtn.title = 'Eliminar';
        deleteBtn.addEventListener('click', () => {
            currentProfile.schedule = currentProfile.schedule.filter(a => a.id !== activity.id);
            StorageManager.saveProfile(currentProfile);
            loadSchedule();
        });

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        item.appendChild(actions);
    }

    return item;
}

function addActivity() {
    if (!currentProfile) return;

    const name = activityName.value.trim();
    const duration = parseInt(activityDuration.value);

    if (!name || duration <= 0) {
        alert('Por favor completa los campos correctamente');
        return;
    }

    const editId = addActivityBtn.dataset.editId;
    if (editId) {
        // Editar actividad existente
        StorageManager.updateActivity(currentProfile.name, parseInt(editId), {
            name: name,
            duration: duration
        });
        addActivityBtn.textContent = 'Agregar';
        delete addActivityBtn.dataset.editId;
    } else {
        // Agregar nueva actividad
        StorageManager.addActivity(currentProfile.name, { name, duration });
    }

    activityName.value = '';
    activityDuration.value = '30';
    currentProfile = StorageManager.getProfile(currentProfile.name);
    loadSchedule();
}

// ===== FUNCIONES DE TIMER =====
function resetCurrentActivity() {
    currentActivityIndex = 0;
    pausedTime = 0;
    activityStartTime = null;
    isActivityRunning = false;
    stopTimer();
    updateActivityDisplay();
}

function updateActivityDisplay() {
    if (!currentProfile || currentProfile.schedule.length === 0) {
        currentActivityName.textContent = 'Ninguna actividad';
        activityTimer.textContent = '00:00';
        startBtn.disabled = false;
        nextBtn.disabled = true;
        pauseBtn.style.display = 'none';
        return;
    }

    const activity = currentProfile.schedule[currentActivityIndex];
    currentActivityName.textContent = activity.name;
    
    startBtn.disabled = activity.completed;
    nextBtn.disabled = !isActivityRunning && !activity.usedTime;
    pauseBtn.style.display = isActivityRunning ? 'block' : 'none';

    if (isActivityRunning) {
        updateTimer();
    } else if (activity.usedTime) {
        activityTimer.textContent = formatTime(activity.usedTime * 60);
    } else {
        activityTimer.textContent = formatTime(activity.duration * 60);
    }
}

function startActivity() {
    if (!currentProfile || currentProfile.schedule.length === 0) return;

    const activity = currentProfile.schedule[currentActivityIndex];
    if (activity.completed || isActivityRunning) return;

    isActivityRunning = true;
    activityStartTime = new Date();
    pausedTime = activity.usedTime * 60 || 0;

    StorageManager.updateActivity(currentProfile.name, activity.id, {
        startTime: activityStartTime.toISOString(),
        status: 'in-progress'
    });

    startTimer();
    updateActivityDisplay();
}

function pauseActivity() {
    isActivityRunning = false;
    stopTimer();
    updateActivityDisplay();
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        updateTimer();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function updateTimer() {
    if (!activityStartTime) return;

    const elapsed = Math.floor((new Date() - activityStartTime) / 1000) + pausedTime;
    activityTimer.textContent = formatTime(elapsed);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function nextActivity() {
    if (!currentProfile || !isActivityRunning) return;

    const activity = currentProfile.schedule[currentActivityIndex];
    const endTime = new Date();
    const usedMinutes = Math.round((endTime - activityStartTime + pausedTime * 1000) / 60000);

    // Guardar historial
    StorageManager.addToHistory(currentProfile.name, {
        name: activity.name,
        usedTime: usedMinutes,
        plannedTime: activity.duration
    });

    // Marcar como completada
    StorageManager.updateActivity(currentProfile.name, activity.id, {
        completed: true,
        usedTime: usedMinutes,
        endTime: endTime.toISOString()
    });

    stopTimer();
    isActivityRunning = false;
    pausedTime = 0;
    activityStartTime = null;

    // Avanzar a siguiente actividad
    currentProfile = StorageManager.getProfile(currentProfile.name);
    
    // Agregar descanso si está habilitado
    if (currentProfile.breakEnabled && currentActivityIndex < currentProfile.schedule.length - 1) {
        const breakActivity = {
            id: Date.now(),
            name: '☕ Descanso',
            duration: currentProfile.breakDuration,
            completed: false,
            usedTime: 0,
            startTime: null,
            endTime: null
        };
        currentProfile.schedule.splice(currentActivityIndex + 1, 0, breakActivity);
    }

    currentActivityIndex++;
    StorageManager.saveProfile(currentProfile);
    currentProfile = StorageManager.getProfile(currentProfile.name);

    updateActivityDisplay();
    loadSchedule();
    updateHistoryUI();
    updateStats();
}

// ===== FUNCIONES DE CONFIGURACIÓN =====
function loadConfiguration() {
    if (!currentProfile) return;

    breakToggle.checked = currentProfile.breakEnabled;
    breakDuration.value = currentProfile.breakDuration;

    // Actualizar botón activo
    durationBtns.forEach(btn => {
        if (parseInt(btn.dataset.minutes) === currentProfile.breakDuration) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    breakDurationContainer.style.display = currentProfile.breakEnabled ? 'block' : 'none';
}

breakToggle.addEventListener('change', (e) => {
    if (!currentProfile) return;
    currentProfile.breakEnabled = e.target.checked;
    breakDurationContainer.style.display = currentProfile.breakEnabled ? 'block' : 'none';
    StorageManager.saveProfile(currentProfile);
});

durationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (!currentProfile) return;
        
        const minutes = parseInt(btn.dataset.minutes);
        currentProfile.breakDuration = minutes;
        
        durationBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        StorageManager.saveProfile(currentProfile);
    });
});

// ===== FUNCIONES DE HISTORIAL =====
function updateHistoryUI() {
    if (!currentProfile) return;

    historyList.innerHTML = '';

    const today = new Date().toLocaleDateString('es-ES');
    const todayHistory = currentProfile.history.filter(h => h.date === today);

    if (todayHistory.length === 0) {
        historyList.innerHTML = '<p class="empty-message">Sin historial hoy</p>';
        return;
    }

    todayHistory.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'history-item';

        item.innerHTML = `
            <div>
                <div class="history-name">${entry.name}</div>
                <div class="history-time">${entry.date}</div>
            </div>
            <div class="history-duration">${entry.usedTime} / ${entry.plannedTime} min</div>
        `;

        historyList.appendChild(item);
    });

    updateStats();
}

function updateStats() {
    const stats = StorageManager.getStats(currentProfile.name);
    statCount.textContent = stats.count;
    statTime.textContent = `${stats.totalTime} min`;
}

// ===== EVENT LISTENERS =====
profileSelect.addEventListener('change', (e) => {
    selectProfile(e.target.value);
});

newProfileBtn.addEventListener('click', openProfileModal);
quickNewBtn.addEventListener('click', openProfileModal);

confirmProfileBtn.addEventListener('click', () => {
    const name = profileNameInput.value.trim();
    if (name === '') {
        alert('Escribe un nombre para el perfil');
        profileNameInput.focus();
        return;
    }

    if (StorageManager.createProfile(name)) {
        loadProfiles();
        closeProfileModal();
        profileSelect.value = name;
        selectProfile(name);
    } else {
        alert('El perfil ya existe o el nombre es inválido');
        profileNameInput.focus();
    }
});

deleteProfileBtn.addEventListener('click', () => {
    if (!currentProfile || !confirm(`¿Eliminar perfil "${currentProfile.name}"?`)) return;

    StorageManager.deleteProfile(currentProfile.name);
    currentProfile = null;
    loadProfiles();
    profileSelect.value = '';
    selectProfile('');
});

addActivityBtn.addEventListener('click', addActivity);

activityName.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addActivityBtn.click();
    }
});

startBtn.addEventListener('click', startActivity);
pauseBtn.addEventListener('click', pauseActivity);
nextBtn.addEventListener('click', nextActivity);

resetScheduleBtn.addEventListener('click', () => {
    if (!confirm('¿Reiniciar el horario?')) return;

    if (currentProfile) {
        currentProfile.schedule = [];
        currentProfile.history = [];
        StorageManager.saveProfile(currentProfile);
        resetCurrentActivity();
        loadSchedule();
        updateHistoryUI();
        updateStats();
    }
});

clearHistoryBtn.addEventListener('click', () => {
    if (!confirm('¿Limpiar el historial?')) return;

    if (currentProfile) {
        StorageManager.clearHistory(currentProfile.name);
        updateHistoryUI();
        updateStats();
    }
});

// ===== INICIALIZACIÓN =====
loadProfiles();

