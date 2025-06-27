const cardConfig = [
  { id: 'research_experience', startx: 0,  starty: 12,  sizex: 23, sizey: 46, colorid: 1 },
  { id: 'photo', startx: 24, starty: 12,  sizex: 23, sizey: 28, colorid: 2 },
  { id: 'education', startx: 48, starty: 12,  sizex: 28, sizey: 28, colorid: 1 },
  { id: 'professional_experience', startx: 77, starty: 12, sizex: 23, sizey: 40, colorid: 3 },
  { id: 'publications', startx: 0,  starty: 59, sizex: 23, sizey: 39, colorid: 2},
  { id: 'hobbies', startx: 24, starty: 41, sizex: 30, sizey: 57, colorid: 3 },
  { id: 'teaching_and_mentoring_experience', startx: 55, starty: 41, sizex: 21, sizey: 30, colorid: 2 },
  { id: 'coursework', startx: 77, starty: 53, sizex:  23, sizey: 45, colorid: 2 },
  { id: 'achievements', startx: 55, starty: 72, sizex:  21, sizey: 26, colorid: 1 },
];


let lastScrollY = 0;
let isScrollingDown = false;
let scrollbarTimeout;
const container = document.querySelector('.container');

// Initialize cards
function initializeCards() {    
    cardConfig.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = `card color-${card.colorid}`;
        cardElement.id = card.id;
        
        // Only apply desktop positioning on larger screens
        if (window.innerWidth > 768) {
            cardElement.style.left = `${card.startx}%`;
            cardElement.style.top = `${card.starty}%`;
            cardElement.style.width = `${card.sizex}%`;
            cardElement.style.height = `${card.sizey}%`;
        }
        
        container.appendChild(cardElement);
    });
}

// Sidebar functionality
function openSidebar() {
    document.getElementById('sidebar').classList.add('open');
    document.querySelector('.overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.querySelector('.overlay').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Theme toggle functionality
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    const themeIcon = document.getElementById('theme-icon');
    const sidebarThemeIcon = document.getElementById('sidebar-theme-icon');
    const themeText = document.getElementById('theme-text');
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update both icons and text based on theme
    if (newTheme === 'dark') {
        if (themeIcon) themeIcon.src = 'media/dark_mode.svg';
        if (sidebarThemeIcon) sidebarThemeIcon.src = 'media/dark_mode.svg';
        if (themeText) themeText.textContent = 'Dark Mode';
    } else {
        if (themeIcon) themeIcon.src = 'media/light_mode.svg';
        if (sidebarThemeIcon) sidebarThemeIcon.src = 'media/light_mode.svg';
        if (themeText) themeText.textContent = 'Light Mode';
    }
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const themeIcon = document.getElementById('theme-icon');
    const sidebarThemeIcon = document.getElementById('sidebar-theme-icon');
    const themeText = document.getElementById('theme-text');
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Set initial icon and text based on theme
    if (savedTheme === 'dark') {
        if (themeIcon) themeIcon.src = 'media/dark_mode.svg';
        if (sidebarThemeIcon) sidebarThemeIcon.src = 'media/dark_mode.svg';
        if (themeText) themeText.textContent = 'Dark Mode';
    } else {
        if (themeIcon) themeIcon.src = 'media/light_mode.svg';
        if (sidebarThemeIcon) sidebarThemeIcon.src = 'media/light_mode.svg';
        if (themeText) themeText.textContent = 'Light Mode';
    }
}

// Scroll handler for top bar transparency
function handleScroll() {
    const topBar = document.getElementById('topBar');
    const currentScrollY = window.scrollY;
    
    // Determine scroll direction
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        isScrollingDown = true;
        topBar.style.opacity = '0.5';
    } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        isScrollingDown = false;
        topBar.style.opacity = '0.9';
    }
    
    // At the top of the page
    if (currentScrollY < 50) {
        topBar.style.opacity = '1';
    }
    
    lastScrollY = currentScrollY;
}

function showScrollbar() {
    container.classList.add('scrollbar-visible');
    clearTimeout(scrollbarTimeout);
    
    scrollbarTimeout = setTimeout(() => {
        container.classList.remove('scrollbar-visible');
    }, 1000);
}

// Show scrollbar on mouse movement or scroll
document.addEventListener('mousemove', showScrollbar);
container.addEventListener('scroll', showScrollbar);

// Handle window resize
function handleResize() {
    if (window.innerWidth <= 768) {
        // Mobile view - reset card positioning
        cardConfig.forEach(card => {
            const cardElement = document.getElementById(card.id);
            if (cardElement) {
                cardElement.style.left = '';
                cardElement.style.top = '';
                cardElement.style.width = '';
                cardElement.style.height = '';
            }
        });
    } else {
        // Desktop view - apply original positioning
        cardConfig.forEach(card => {
            const cardElement = document.getElementById(card.id);
            if (cardElement) {
                cardElement.style.left = `${card.startx}%`;
                cardElement.style.top = `${card.starty}%`;
                cardElement.style.width = `${card.sizex}%`;
                cardElement.style.height = `${card.sizey}%`;
            }
        });
        // Close sidebar if open
        closeSidebar();
    }
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    initializeCards();
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Close sidebar when clicking on nav links
    document.querySelectorAll('.sidebar-nav .nav-link:not(.theme-toggle)').forEach(link => {
        link.addEventListener('click', closeSidebar);
    });

    showScrollbar();
});