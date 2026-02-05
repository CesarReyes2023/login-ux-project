// ==================== INICIALIZACIÓN ==================== //
let activityChart, distributionChart, yearlyChart, timeChart, productivityChart;
let tasks = [];

document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    initializeCharts();
    loadActivityTimeline();
    loadTasks();
    loadActivityTable();
    animateNumbers();
    initializeTheme();
    
    // Event Listeners
    document.getElementById('profileForm')?.addEventListener('submit', saveProfile);
    document.getElementById('changePasswordForm')?.addEventListener('submit', changePassword);
    document.getElementById('addTaskForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        addTask();
    });
});

// ==================== USER DATA ==================== //
function loadUserData() {
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (user) {
        // Sidebar
        document.getElementById('sidebarUserName').textContent = user.name || 'Usuario';
        document.getElementById('sidebarUserEmail').textContent = user.email || '';
        
        // Navbar
        document.getElementById('dropdownUserName').textContent = user.name || 'Usuario';
        document.getElementById('dropdownUserEmail').textContent = user.email || '';
        
        // Welcome
        document.getElementById('welcomeUserName').textContent = user.name || 'Usuario';
        
        // Profile Section
        document.getElementById('profileName').textContent = user.name || 'Usuario';
        document.getElementById('profileEmail').textContent = user.email || '';
        document.getElementById('editProfileName').value = user.name || '';
        document.getElementById('editProfileEmail').value = user.email || '';
        document.getElementById('profileRole').textContent = user.role === 'user' ? 'Usuario' : user.role;
        
        // Avatar iniciales
        const initials = getInitials(user.name || 'U');
        setAvatarInitials(initials);
        
        // Fecha de registro
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const fullUser = users.find(u => u.email === user.email);
        
        if (fullUser && fullUser.createdAt) {
            const createdDate = new Date(fullUser.createdAt);
            document.getElementById('profileMemberSince').textContent = createdDate.toLocaleDateString('es-ES', {
                month: 'long',
                year: 'numeric'
            });
        }
    }
}

function getInitials(name) {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
}

function setAvatarInitials(initials) {
    const avatars = [
        document.getElementById('sidebarAvatar'),
        document.getElementById('navbarAvatar'),
        document.getElementById('profileAvatarLarge')
    ];
    
    avatars.forEach(avatar => {
        if (avatar) {
            avatar.innerHTML = `<span style="font-weight: 600;">${initials}</span>`;
        }
    });
}

// ==================== NAVIGATION ==================== //
function showSection(sectionName) {
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(`seccion-${sectionName}`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Actualizar menú activo
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeMenuItem = document.querySelector(`.menu-item[onclick*="${sectionName}"]`);
    if (activeMenuItem) {
        activeMenuItem.classList.add('active');
    }
    
    // Cerrar sidebar en móvil
    if (window.innerWidth < 992) {
        document.getElementById('sidebar').classList.remove('active');
    }
    
    // Registrar actividad
    logActivity(`Navegó a ${sectionName}`, 'navigation');
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// ==================== THEME TOGGLE ==================== //
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.checked = savedTheme === 'dark';
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.checked = newTheme === 'dark';
    }
    
    // Actualizar gráficos con nuevos colores
    updateChartsTheme(newTheme);
    
    // Notificación
    showToast(newTheme === 'dark' ? 'Modo oscuro activado' : 'Modo claro activado', 'info');
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.className = theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars';
    }
}

// ==================== CHARTS ==================== //
function initializeCharts() {
    const theme = document.documentElement.getAttribute('data-theme');
    const textColor = theme === 'dark' ? '#e4e6eb' : '#212529';
    const gridColor = theme === 'dark' ? '#3a3d4e' : '#dee2e6';
    
    // Activity Chart
    const activityCtx = document.getElementById('activityChart');
    if (activityCtx) {
        activityChart = new Chart(activityCtx, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                datasets: [{
                    label: 'Actividad',
                    data: [65, 78, 90, 81, 96, 105, 112, 98, 114, 125, 130, 142],
                    borderColor: '#0d6efd',
                    backgroundColor: 'rgba(13, 110, 253, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: textColor }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: textColor },
                        grid: { color: gridColor }
                    },
                    x: {
                        ticks: { color: textColor },
                        grid: { color: gridColor }
                    }
                }
            }
        });
    }
    
    // Distribution Chart
    const distributionCtx = document.getElementById('distributionChart');
    if (distributionCtx) {
        distributionChart = new Chart(distributionCtx, {
            type: 'doughnut',
            data: {
                labels: ['Tareas', 'Proyectos', 'Reuniones', 'Otros'],
                datasets: [{
                    data: [35, 25, 20, 20],
                    backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#6f42c1'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: textColor }
                    }
                }
            }
        });
    }
    
    // Yearly Chart
    const yearlyCtx = document.getElementById('yearlyChart');
    if (yearlyCtx) {
        yearlyChart = new Chart(yearlyCtx, {
            type: 'bar',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                datasets: [{
                    label: 'Rendimiento',
                    data: [450, 520, 480, 590, 610, 680, 720, 650, 780, 820, 850, 920],
                    backgroundColor: 'rgba(13, 110, 253, 0.8)',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: textColor }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: textColor },
                        grid: { color: gridColor }
                    },
                    x: {
                        ticks: { color: textColor },
                        grid: { display: false }
                    }
                }
            }
        });
    }
    
    // Time Chart
    const timeCtx = document.getElementById('timeChart');
    if (timeCtx) {
        timeChart = new Chart(timeCtx, {
            type: 'pie',
            data: {
                labels: ['Desarrollo', 'Diseño', 'Reuniones', 'Testing', 'Documentación'],
                datasets: [{
                    data: [30, 20, 15, 20, 15],
                    backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6f42c1'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: textColor }
                    }
                }
            }
        });
    }
    
    // Productivity Chart
    const productivityCtx = document.getElementById('productivityChart');
    if (productivityCtx) {
        productivityChart = new Chart(productivityCtx, {
            type: 'radar',
            data: {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Esta Semana',
                    data: [85, 90, 88, 92, 87, 75, 70],
                    backgroundColor: 'rgba(13, 110, 253, 0.2)',
                    borderColor: '#0d6efd',
                    pointBackgroundColor: '#0d6efd'
                }, {
                    label: 'Semana Anterior',
                    data: [78, 82, 80, 85, 83, 72, 68],
                    backgroundColor: 'rgba(108, 117, 125, 0.1)',
                    borderColor: '#6c757d',
                    pointBackgroundColor: '#6c757d'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: textColor }
                    }
                },
                scales: {
                    r: {
                        ticks: { color: textColor },
                        grid: { color: gridColor },
                        pointLabels: { color: textColor }
                    }
                }
            }
        });
    }
}

function updateChartsTheme(theme) {
    const textColor = theme === 'dark' ? '#e4e6eb' : '#212529';
    const gridColor = theme === 'dark' ? '#3a3d4e' : '#dee2e6';
    
    const charts = [activityChart, distributionChart, yearlyChart, timeChart, productivityChart];
    
    charts.forEach(chart => {
        if (chart) {
            // Actualizar colores de etiquetas
            if (chart.options.plugins.legend) {
                chart.options.plugins.legend.labels.color = textColor;
            }
            
            // Actualizar colores de ejes
            if (chart.options.scales) {
                Object.keys(chart.options.scales).forEach(axis => {
                    if (chart.options.scales[axis].ticks) {
                        chart.options.scales[axis].ticks.color = textColor;
                    }
                    if (chart.options.scales[axis].grid) {
                        chart.options.scales[axis].grid.color = gridColor;
                    }
                    if (chart.options.scales[axis].pointLabels) {
                        chart.options.scales[axis].pointLabels.color = textColor;
                    }
                });
            }
            
            chart.update();
        }
    });
}

// ==================== ANIMATED NUMBERS ==================== //
function animateNumbers() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// ==================== ACTIVITY TIMELINE ==================== //
function loadActivityTimeline() {
    const timeline = document.getElementById('activityTimeline');
    if (!timeline) return;
    
    const activities = [
        { title: 'Inicio de sesión exitoso', description: 'Accediste desde tu dispositivo principal', time: 'Hace 5 minutos' },
        { title: 'Tarea completada', description: 'Completaste "Configurar perfil de usuario"', time: 'Hace 1 hora' },
        { title: 'Nuevo comentario', description: 'Recibiste un comentario en tu proyecto', time: 'Hace 3 horas' },
        { title: 'Archivo subido', description: 'Subiste "documento.pdf" exitosamente', time: 'Ayer' },
        { title: 'Perfil actualizado', description: 'Actualizaste tu información personal', time: 'Hace 2 días' }
    ];
    
    timeline.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <h6>${activity.title}</h6>
            <p>${activity.description}</p>
            <small>${activity.time}</small>
        </div>
    `).join('');
}

// ==================== ACTIVITY TABLE ==================== //
function loadActivityTable() {
    const tbody = document.getElementById('activityTableBody');
    if (!tbody) return;
    
    const sessions = [
        { date: new Date(), action: 'Inicio de sesión', device: 'Windows PC', ip: '192.168.1.100', status: 'success' },
        { date: new Date(Date.now() - 86400000), action: 'Inicio de sesión', device: 'Android Phone', ip: '192.168.1.101', status: 'success' },
        { date: new Date(Date.now() - 172800000), action: 'Cambio de contraseña', device: 'Windows PC', ip: '192.168.1.100', status: 'success' },
        { date: new Date(Date.now() - 259200000), action: 'Inicio de sesión fallido', device: 'Unknown', ip: '203.0.113.42', status: 'failed' },
        { date: new Date(Date.now() - 345600000), action: 'Inicio de sesión', device: 'Windows PC', ip: '192.168.1.100', status: 'success' }
    ];
    
    tbody.innerHTML = sessions.map(session => `
        <tr>
            <td>${session.date.toLocaleString('es-ES')}</td>
            <td>${session.action}</td>
            <td><i class="bi bi-${session.device.includes('Windows') ? 'windows' : session.device.includes('Android') ? 'phone' : 'question'}"></i> ${session.device}</td>
            <td>${session.ip}</td>
            <td><span class="badge bg-${session.status === 'success' ? 'success' : 'danger'}">${session.status === 'success' ? 'Exitoso' : 'Fallido'}</span></td>
        </tr>
    `).join('');
}

function clearActivityHistory() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Se eliminará todo el historial de actividad',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById('activityTableBody').innerHTML = '<tr><td colspan="5" class="text-center py-4">No hay actividad registrada</td></tr>';
            showToast('Historial limpiado exitosamente', 'success');
        }
    });
}

// ==================== ACTIVITY LOG ==================== //
function logActivity(action, type = 'general') {
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    activities.unshift({
        action,
        type,
        timestamp: new Date().toISOString(),
        user: JSON.parse(localStorage.getItem('user')).email
    });
    
    // Mantener solo los últimos 50 registros
    if (activities.length > 50) {
        activities.pop();
    }
    
    localStorage.setItem('activities', JSON.stringify(activities));
}

// ==================== TASKS ==================== //
function loadTasks() {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [
        { id: 1, title: 'Completar perfil', description: 'Añadir foto y biografía', priority: 'high', deadline: '2026-02-10', completed: false },
        { id: 2, title: 'Revisar notificaciones', description: 'Configurar preferencias', priority: 'medium', deadline: '2026-02-12', completed: false },
        { id: 3, title: 'Explorar dashboard', description: 'Familiarizarse con las funciones', priority: 'low', deadline: '2026-02-15', completed: true }
    ];
    
    renderTasks();
}

function renderTasks(filter = 'all') {
    const taskList = document.getElementById('taskList');
    if (!taskList) return;
    
    let filteredTasks = tasks;
    
    if (filter === 'completed') {
        filteredTasks = tasks.filter(t => t.completed);
    } else if (filter === 'pending') {
        filteredTasks = tasks.filter(t => !t.completed);
    } else if (filter === 'overdue') {
        const today = new Date();
        filteredTasks = tasks.filter(t => !t.completed && new Date(t.deadline) < today);
    }
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<p class="text-center text-muted py-4">No hay tareas para mostrar</p>';
        return;
    }
    
    taskList.innerHTML = filteredTasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <input type="checkbox" class="form-check-input" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
            <div class="task-content">
                <h6 class="task-title">${task.title}</h6>
                <p class="text-muted mb-1">${task.description}</p>
                <div class="task-meta">
                    <span class="task-priority priority-${task.priority}">${getPriorityText(task.priority)}</span>
                    <span><i class="bi bi-calendar"></i> ${formatDate(task.deadline)}</span>
                </div>
            </div>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteTask(${task.id})">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `).join('');
}

function filterTasks(filter) {
    // Actualizar botones activos
    document.querySelectorAll('.task-filters .btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderTasks(filter);
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        
        if (task.completed) {
            showToast('¡Tarea completada!', 'success');
            logActivity(`Completó la tarea: ${task.title}`, 'task');
        }
    }
}

function deleteTask(id) {
    Swal.fire({
        title: '¿Eliminar tarea?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc3545'
    }).then((result) => {
        if (result.isConfirmed) {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            renderTasks();
            showToast('Tarea eliminada', 'info');
        }
    });
}

function showAddTaskModal() {
    const modal = new bootstrap.Modal(document.getElementById('addTaskModal'));
    modal.show();
}

function addTask() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const priority = document.getElementById('taskPriority').value;
    const deadline = document.getElementById('taskDeadline').value;
    
    if (!title) {
        showToast('El título es obligatorio', 'warning');
        return;
    }
    
    const newTask = {
        id: Date.now(),
        title,
        description,
        priority,
        deadline: deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completed: false
    };
    
    tasks.unshift(newTask);
    saveTasks();
    renderTasks();
    
    // Cerrar modal y limpiar formulario
    bootstrap.Modal.getInstance(document.getElementById('addTaskModal')).hide();
    document.getElementById('addTaskForm').reset();
    
    showToast('Tarea creada exitosamente', 'success');
    logActivity(`Creó la tarea: ${title}`, 'task');
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getPriorityText(priority) {
    const priorities = {
        low: 'Baja',
        medium: 'Media',
        high: 'Alta'
    };
    return priorities[priority] || priority;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ==================== PROFILE MANAGEMENT ==================== //
function toggleEditProfile() {
    const form = document.getElementById('profileForm');
    const inputs = form.querySelectorAll('input, textarea');
    const actions = document.getElementById('profileFormActions');
    const btnText = document.getElementById('editProfileBtnText');
    
    const isDisabled = inputs[0].disabled;
    
    inputs.forEach(input => {
        input.disabled = !isDisabled;
    });
    
    if (isDisabled) {
        actions.classList.remove('d-none');
        btnText.textContent = 'Cancelar';
    } else {
        actions.classList.add('d-none');
        btnText.textContent = 'Editar';
        loadUserData(); // Recargar datos originales
    }
}

function saveProfile(e) {
    e.preventDefault();
    
    const name = document.getElementById('editProfileName').value;
    const email = document.getElementById('editProfileEmail').value;
    const phone = document.getElementById('editProfilePhone').value;
    const birthday = document.getElementById('editProfileBirthday').value;
    const bio = document.getElementById('editProfileBio').value;
    
    const user = JSON.parse(localStorage.getItem('user'));
    user.name = name;
    user.phone = phone;
    user.birthday = birthday;
    user.bio = bio;
    
    localStorage.setItem('user', JSON.stringify(user));
    
    // Actualizar en la lista de usuarios
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...user };
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    toggleEditProfile();
    loadUserData();
    showToast('Perfil actualizado exitosamente', 'success');
    logActivity('Actualizó su perfil', 'profile');
}

function changePassword(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;
    
    if (newPassword !== confirmPassword) {
        showToast('Las contraseñas no coinciden', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showToast('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    
    const user = JSON.parse(localStorage.getItem('user'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === user.email);
    
    if (userIndex === -1) {
        showToast('Usuario no encontrado', 'error');
        return;
    }
    
    if (users[userIndex].password !== currentPassword) {
        showToast('La contraseña actual es incorrecta', 'error');
        return;
    }
    
    users[userIndex].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    
    document.getElementById('changePasswordForm').reset();
    showToast('Contraseña actualizada exitosamente', 'success');
    logActivity('Cambió su contraseña', 'security');
}

function changeAvatar() {
    showToast('Función de cambio de avatar próximamente', 'info');
}

// ==================== SETTINGS ==================== //
function downloadData() {
    const user = JSON.parse(localStorage.getItem('user'));
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    
    const data = {
        user,
        tasks,
        activities,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mis-datos-${Date.now()}.json`;
    link.click();
    
    showToast('Datos descargados exitosamente', 'success');
    logActivity('Descargó sus datos', 'data');
}

function deleteAccount() {
    Swal.fire({
        title: '¿Eliminar cuenta?',
        text: 'Esta acción es permanente y no se puede deshacer. Se eliminarán todos tus datos.',
        icon: 'warning',
        input: 'text',
        inputPlaceholder: 'Escribe "ELIMINAR" para confirmar',
        showCancelButton: true,
        confirmButtonText: 'Eliminar mi cuenta',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc3545',
        inputValidator: (value) => {
            if (value !== 'ELIMINAR') {
                return 'Debes escribir "ELIMINAR" para confirmar';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const user = JSON.parse(localStorage.getItem('user'));
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const filteredUsers = users.filter(u => u.email !== user.email);
            
            localStorage.setItem('users', JSON.stringify(filteredUsers));
            localStorage.removeItem('user');
            localStorage.removeItem('isAuth');
            localStorage.removeItem('tasks');
            localStorage.removeItem('activities');
            
            Swal.fire({
                icon: 'success',
                title: 'Cuenta eliminada',
                text: 'Tu cuenta ha sido eliminada exitosamente',
                timer: 2000,
                showConfirmButton: false
            });
            
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 2000);
        }
    });
}

// ==================== HELP ==================== //
function contactSupport() {
    Swal.fire({
        title: 'Contactar Soporte',
        html: `
            <textarea class="form-control" id="supportMessage" rows="5" placeholder="Describe tu problema o pregunta..."></textarea>
        `,
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const message = document.getElementById('supportMessage').value;
            if (!message) {
                Swal.showValidationMessage('Por favor describe tu problema');
                return false;
            }
            return message;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            showToast('Mensaje enviado. Te contactaremos pronto', 'success');
            logActivity('Contactó al soporte técnico', 'support');
        }
    });
}

// ==================== UTILITIES ==================== //
function exportData() {
    downloadData();
}

function showToast(message, type = 'info') {
    const icon = type === 'error' ? 'error' : type === 'warning' ? 'warning' : type === 'success' ? 'success' : 'info';
    
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: icon,
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    });
}

// ==================== RESPONSIVE ==================== //
window.addEventListener('resize', function() {
    if (window.innerWidth >= 992) {
        document.getElementById('sidebar').classList.remove('active');
    }
});

// Cerrar sidebar al hacer clic fuera en móvil
document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.querySelector('.btn-toggle-sidebar');
    
    if (window.innerWidth < 992 && 
        sidebar.classList.contains('active') && 
        !sidebar.contains(e.target) && 
        !toggleBtn.contains(e.target)) {
        sidebar.classList.remove('active');
    }
});

// ==================== AUTO-SAVE SETTINGS ==================== //
document.querySelectorAll('#animationsToggle, #pushNotifications, #emailNotifications, #soundNotifications, #publicProfile').forEach(toggle => {
    toggle?.addEventListener('change', function() {
        const settings = JSON.parse(localStorage.getItem('settings')) || {};
        settings[this.id] = this.checked;
        localStorage.setItem('settings', JSON.stringify(settings));
        showToast('Configuración guardada', 'success');
    });
});

document.getElementById('languageSelect')?.addEventListener('change', function() {
    showToast('Idioma actualizado (función próximamente)', 'info');
});

document.getElementById('timezoneSelect')?.addEventListener('change', function() {
    showToast('Zona horaria actualizada', 'success');
});

// ==================== KEYBOARD SHORTCUTS ==================== //
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K: Buscar
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('globalSearch')?.focus();
    }
    
    // Ctrl/Cmd + B: Toggle Sidebar
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
    }
    
    // Ctrl/Cmd + D: Toggle Dark Mode
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        toggleTheme();
    }
});

// ==================== SEARCH FUNCTIONALITY ==================== //
document.getElementById('globalSearch')?.addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase();
    if (query.length < 2) return;
    
    // Aquí se implementaría la búsqueda global
    console.log('Buscando:', query);
});

// Log de inicio de sesión
logActivity('Inició sesión en el dashboard', 'auth');
