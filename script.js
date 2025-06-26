const cardConfig = [
    { id: 'hero', startx: 2, starty: 12, sizex: 35, sizey: 45, colorid: 1 },
    { id: 'profile', startx: 39, starty: 12, sizex: 28, sizey: 45, colorid: 2 },
    { id: 'project1', startx: 69, starty: 12, sizex: 29, sizey: 28, colorid: 1 },
    { id: 'about', startx: 2, starty: 59, sizex: 25, sizey: 28, colorid: 2 },
    { id: 'contact', startx: 29, starty: 59, sizex: 25, sizey: 28, colorid: 1 },
    { id: 'project2', startx: 69, starty: 42, sizex: 29, sizey: 15, colorid: 2 },
    { id: 'project3', startx: 56, starty: 59, sizex: 21, sizey: 28, colorid: 1 },
    { id: 'project4', startx: 79, starty: 59, sizex: 19, sizey: 28, colorid: 2 }
];

// Initialize cards
function initializeCards() {
    const container = document.querySelector('.container');
    
    cardConfig.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = `card color-${card.colorid}`;
        cardElement.id = card.id;
        cardElement.style.left = `${card.startx}%`;
        cardElement.style.top = `${card.starty}%`;
        cardElement.style.width = `${card.sizex}%`;
        cardElement.style.height = `${card.sizey}%`;
        
        container.appendChild(cardElement);
    });
}

// Theme toggle functionality
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    const themeIcon = document.getElementById('theme-icon');
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon based on theme
    if (newTheme === 'dark') {
        themeIcon.src = 'media/dark_mode.svg';
    } else {
        themeIcon.src = 'media/light_mode.svg';
    }
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const themeIcon = document.getElementById('theme-icon');
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Set initial icon based on theme
    if (savedTheme === 'dark') {
        themeIcon.src = 'media/dark_mode.svg';
    } else {
        themeIcon.src = 'media/light_mode.svg';
    }
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    initializeCards();
});