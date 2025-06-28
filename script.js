const cardConfig = [
    { id: 'photo', startx: 24, starty: 12,  sizex: 23, sizey: 28, colorid: 2 },
    { id: 'hobbies', startx: 24, starty: 42, sizex: 30, sizey: 55, colorid: 3 },
    { id: 'education', startx: 48, starty: 12,  sizex: 28, sizey: 28, colorid: 1 },
    { id: 'research_experience', startx: 0,  starty: 12,  sizex: 23, sizey: 38, colorid: 1 },
    { id: 'publications', startx: 0,  starty: 52, sizex: 23, sizey: 45, colorid: 2},
    { id: 'professional_experience', startx: 55, starty: 42, sizex: 21, sizey: 28, colorid: 2 },
    { id: 'teaching_and_mentoring_experience', startx: 77, starty: 12, sizex:  23, sizey: 55, colorid: 3 },
    { id: 'coursework', startx: 77, starty: 69, sizex: 23, sizey: 28, colorid: 2 },
    { id: 'achievements', startx: 55, starty: 72, sizex:  21, sizey: 25, colorid: 1 },
];


let lastScrollY = 0;
let isScrollingDown = false;
let scrollbarTimeout;
const container = document.querySelector('.container');
let expandedCard = null;

async function loadCardContentFromJSON() {
    try {
        const response = await fetch('cardContent.json');
        const cardContentData = await response.json();
        return cardContentData;
    } catch (error) {
        console.error('Failed to load card content JSON:', error);
        return null;
    }
}

// Initialize card content and add click handlers
async function initializeCardContent() {
    const cardContentData = await loadCardContentFromJSON();
    
    if (!cardContentData) {
        console.error('Failed to load card content data');
        return;
    }
    
    for (const card of cardConfig) {
        const cardElement = document.getElementById(card.id);
        const cardData = cardContentData[card.id];
        
        if (cardData && cardElement) {
            // Create content sections using DOMParser (CSP-safe)
            const parser = new DOMParser();
            
            // Create preview desktop
            if (cardData.preview_desktop) {
                const previewDesktop = document.createElement('div');
                previewDesktop.className = 'preview-desktop';
                const doc = parser.parseFromString(`<div>${cardData.preview_desktop}</div>`, 'text/html');
                while (doc.body.firstChild.firstChild) {
                    previewDesktop.appendChild(doc.body.firstChild.firstChild);
                }
                cardElement.appendChild(previewDesktop);
            }
            
            // Create preview mobile
            if (cardData.preview_mobile) {
                const previewMobile = document.createElement('div');
                previewMobile.className = 'preview-mobile';
                const doc = parser.parseFromString(`<div>${cardData.preview_mobile}</div>`, 'text/html');
                while (doc.body.firstChild.firstChild) {
                    previewMobile.appendChild(doc.body.firstChild.firstChild);
                }
                cardElement.appendChild(previewMobile);
            }
            
            // Create full desktop
            if (cardData.full_desktop) {
                const fullDesktop = document.createElement('div');
                fullDesktop.className = 'full-desktop';
                fullDesktop.style.display = 'none';
                const doc = parser.parseFromString(`<div>${cardData.full_desktop}</div>`, 'text/html');
                while (doc.body.firstChild.firstChild) {
                    fullDesktop.appendChild(doc.body.firstChild.firstChild);
                }
                cardElement.appendChild(fullDesktop);
            }
            
            // Create full mobile
            if (cardData.full_mobile) {
                const fullMobile = document.createElement('div');
                fullMobile.className = 'full-mobile';
                fullMobile.style.display = 'none';
                const doc = parser.parseFromString(`<div>${cardData.full_mobile}</div>`, 'text/html');
                while (doc.body.firstChild.firstChild) {
                    fullMobile.appendChild(doc.body.firstChild.firstChild);
                }
                cardElement.appendChild(fullMobile);
            }
            
            // Add click handler for card expansion/collapse
            cardElement.addEventListener('click', (e) => {
                if (window.innerWidth > 768) {
                    handleDesktopCardClick(card.id, e);
                } else {
                    handleMobileCardClick(card.id, e);
                }
            });
        }
    }
}

// Handle desktop card interactions
function handleDesktopCardClick(cardId, event) {
    // Prevent expansion for photo card
    if (cardId === 'photo') {
        return;
    }
    
    const cardElement = document.getElementById(cardId);
    const isExpanded = cardElement.classList.contains('expanded');
    
    // Check if click is on close button
    if (event.target.classList.contains('close-icon')) {
        collapseCard(cardId);
        return;
    }
    
    if (isExpanded) {
        return; // Card is already expanded, do nothing unless close clicked
    }
    
    // Collapse any currently expanded card
    if (expandedCard && expandedCard !== cardId) {
        collapseCard(expandedCard);
    }
    
    expandCard(cardId);
}

// Handle mobile card interactions
function handleMobileCardClick(cardId, event) {
    // Prevent expansion for photo card
    if (cardId === 'photo') {
        return;
    }
    
    const cardElement = document.getElementById(cardId);
    const isExpanded = cardElement.classList.contains('expanded');
    
    // Check if click is on close button
    if (event.target.classList.contains('close-icon')) {
        collapseCard(cardId);
        return;
    }
    
    if (isExpanded) {
        collapseCard(cardId);
    } else {
        // Collapse any currently expanded card
        if (expandedCard && expandedCard !== cardId) {
            collapseCard(expandedCard);
        }
        expandCard(cardId);
    }
}

// Expand card
function expandCard(cardId) {
    const cardElement = document.getElementById(cardId);
    cardElement.classList.add('expanded');
    expandedCard = cardId;
    
    // Show full content, hide preview
    const previewDesktop = cardElement.querySelector('.preview-desktop');
    const previewMobile = cardElement.querySelector('.preview-mobile');
    const fullDesktop = cardElement.querySelector('.full-desktop');
    const fullMobile = cardElement.querySelector('.full-mobile');
    
    if (window.innerWidth > 768) {
        if (previewDesktop) previewDesktop.style.display = 'none';
        if (fullDesktop) fullDesktop.style.display = 'block';
    } else {
        if (previewMobile) previewMobile.style.display = 'none';
        if (fullMobile) fullMobile.style.display = 'block';
    }
}

// Collapse card
function collapseCard(cardId) {
    const cardElement = document.getElementById(cardId);
    cardElement.classList.remove('expanded');
    expandedCard = null;
    
    // Show preview content, hide full
    const previewDesktop = cardElement.querySelector('.preview-desktop');
    const previewMobile = cardElement.querySelector('.preview-mobile');
    const fullDesktop = cardElement.querySelector('.full-desktop');
    const fullMobile = cardElement.querySelector('.full-mobile');
    
    if (window.innerWidth > 768) {
        if (previewDesktop) previewDesktop.style.display = 'block';
        if (fullDesktop) fullDesktop.style.display = 'none';
    } else {
        if (previewMobile) previewMobile.style.display = 'block';
        if (fullMobile) fullMobile.style.display = 'none';
    }
}

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

// Handle window resize for card content
function handleCardResize() {
    cardConfig.forEach(card => {
        const cardElement = document.getElementById(card.id);
        if (cardElement) {
            const previewDesktop = cardElement.querySelector('.preview-desktop');
            const previewMobile = cardElement.querySelector('.preview-mobile');
            const fullDesktop = cardElement.querySelector('.full-desktop');
            const fullMobile = cardElement.querySelector('.full-mobile');
            
            if (window.innerWidth > 768) {
                // Desktop view
                if (previewDesktop) previewDesktop.style.display = cardElement.classList.contains('expanded') ? 'none' : 'block';
                if (previewMobile) previewMobile.style.display = 'none';
                if (fullDesktop) fullDesktop.style.display = cardElement.classList.contains('expanded') ? 'block' : 'none';
                if (fullMobile) fullMobile.style.display = 'none';
            } else {
                // Mobile view
                if (previewDesktop) previewDesktop.style.display = 'none';
                if (previewMobile) previewMobile.style.display = cardElement.classList.contains('expanded') ? 'none' : 'block';
                if (fullDesktop) fullDesktop.style.display = 'none';
                if (fullMobile) fullMobile.style.display = cardElement.classList.contains('expanded') ? 'block' : 'none';
            }
        }
    });
}

// Update the existing handleResize function to include card content handling
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
    
    // Handle card content visibility
    handleCardResize();
}

// Close expanded card when clicking outside on desktop
document.addEventListener('click', (event) => {
    // Only apply on desktop
    if (window.innerWidth <= 768) return;
    
    // Only if there's an expanded card
    if (!expandedCard) return;
    
    const expandedCardElement = document.getElementById(expandedCard);
    
    // Check if click is outside the expanded card
    if (!expandedCardElement.contains(event.target)) {
        collapseCard(expandedCard);
    }
});

// Update the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', async function() {
    loadTheme();
    initializeCards();
    
    // Initialize card content after cards are created
    await initializeCardContent();
    
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
