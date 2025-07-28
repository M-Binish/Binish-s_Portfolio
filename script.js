// Portfolio JavaScript

class Portfolio {
    constructor() {
        this.isDarkMode = false;
        this.activeSection = '';
        this.init();
    }

    init() {
        this.initTheme();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupSmoothScrolling();
        this.setupParallaxEffects();
        this.setupOptimizedScrollHandlers();
    }

    // Theme Management
    initTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            this.isDarkMode = true;
            document.body.classList.add('dark');
            this.updateThemeIcons(true);
        }
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');

        if (this.isDarkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }

        this.updateThemeIcons(this.isDarkMode);
        this.animateThemeTransition();
    }

    animateThemeTransition() {
        document.body.style.transition = 'all 0.5s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 500);
    }

    updateThemeIcons(isDark) {
        const heroToggle = document.getElementById('theme-toggle');
        const navToggle = document.getElementById('nav-theme-toggle');

        const iconClass = isDark ? 'fa-sun' : 'fa-moon';

        if (heroToggle) {
            heroToggle.querySelector('i').className = `fas ${iconClass}`;
        }
        if (navToggle) {
            navToggle.querySelector('i').className = `fas ${iconClass}`;
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Theme toggle buttons
        const heroToggle = document.getElementById('theme-toggle');
        const navToggle = document.getElementById('nav-theme-toggle');

        if (heroToggle) {
            heroToggle.addEventListener('click', () => this.toggleTheme());
        }
        if (navToggle) {
            navToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });

        // Navbar visibility on scroll
        this.setupNavbarScrollBehavior();

        // Button hover effects
        this.setupButtonEffects();

        // Image lazy loading
        this.setupImageLazyLoading();
    }

    setupButtonEffects() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.05)';
            });

            btn.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }

    setupImageLazyLoading() {
        const images = document.querySelectorAll('img');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // The image starts at opacity 0 from the CSS.
                    // We just need to fade it in.
                    img.style.opacity = '1';
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }


    // Smooth Scrolling
    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const navbar = document.getElementById('navbar');
            const headerHeight = navbar ? navbar.offsetHeight : 80;
            const offsetPosition = element.offsetTop - headerHeight - 20;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    setupSmoothScrolling() {
        // Enhanced smooth scrolling with easing
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            document.body.style.pointerEvents = 'none';
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                document.body.style.pointerEvents = 'auto';
            }, 100);
        });
    }

    // Parallax Effects
    setupParallaxEffects() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroSection = document.getElementById('hero');

            if (heroSection) {
                const rate = scrolled * -0.5;
                heroSection.style.transform = `translateY(${rate}px)`;
            }
        });
    }



    // Navbar Scroll Behavior
    setupNavbarScrollBehavior() {
        const navbar = document.getElementById('navbar');
        const heroSection = document.getElementById('hero');

        if (!navbar || !heroSection) return;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            const heroHeight = heroSection.offsetHeight;

            // Add/remove scrolled class based on scroll position
            if (currentScrollY > heroHeight * 0.1) {
                navbar.classList.add('scrolled');
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            } else {
                navbar.classList.remove('scrolled');
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            }
        });
    }

    // Intersection Observer for animations
    setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '-10px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    this.activeSection = entry.target.id;

                    // Animate skill bars when skills section is visible
                    if (entry.target.id === 'skills') {
                        this.animateSkillBars(entry.target);
                    }

                    // Add staggered animation for child elements
                    this.staggerChildAnimations(entry.target);
                } else {
                    // Reset skill bars when section is out of view
                    if (entry.target.id === 'skills') {
                        this.resetSkillBars(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe all fade-in sections except about (which is visible by default)
        document.querySelectorAll('.fade-in:not(#about)').forEach(section => {
            observer.observe(section);
        });
    }

    staggerChildAnimations(section) {
        const children = section.querySelectorAll('.education-item, .project-item, .cert-item, .hobby-item, .contact-item, .soft-skill');

        children.forEach((child, index) => {
            setTimeout(() => {
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Skill Bar Animations
    animateSkillBars(skillsSection) {
        const skillBars = skillsSection.querySelectorAll('.skill-bar[data-width]');

        skillBars.forEach((skillBar, index) => {
            const targetWidth = skillBar.getAttribute('data-width');

            // Reset width first
            skillBar.style.width = '0%';

            // Animate with staggered delay and sound effect simulation
            setTimeout(() => {
                if (targetWidth) {
                    skillBar.style.width = targetWidth;

                    // Add a pulse effect when animation completes
                    setTimeout(() => {
                        skillBar.style.boxShadow = '0 0 20px rgba(52, 152, 219, 0.5)';
                        setTimeout(() => {
                            skillBar.style.boxShadow = '';
                        }, 500);
                    }, 1000);
                }
            }, 100 + (index * 150));
        });
    }

    resetSkillBars(skillsSection) {
        const skillBars = skillsSection.querySelectorAll('.skill-bar[data-width]');
        skillBars.forEach(skillBar => {
            skillBar.style.width = '0%';
            skillBar.style.boxShadow = '';
        });
    }

    // Performance optimizations
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Setup optimized scroll handlers
    setupOptimizedScrollHandlers() {
        const debouncedScroll = this.debounce(() => {
            this.updateActiveNavLink();
        }, 10);

        window.addEventListener('scroll', debouncedScroll);
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-link');

        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
}

// Global scroll function for button onclick
function scrollToSection(sectionId) {
    if (window.portfolioInstance) {
        window.portfolioInstance.scrollToSection(sectionId);
    }
}

// Hobby photo gallery functions
function showHobbyGallery(hobbyType) {
    const gallery = document.getElementById(`${hobbyType}-gallery`);
    if (gallery) {
        gallery.classList.add('active');
    }
}

function hideHobbyGallery(hobbyType) {
    const gallery = document.getElementById(`${hobbyType}-gallery`);
    if (gallery) {
        gallery.classList.remove('active');
    }
}

function uploadHobbyPhoto(hobbyType) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;

    input.onchange = function(e) {
        const files = e.target.files;
        const gallery = document.getElementById(`${hobbyType}-gallery`);

        for (let file of files) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'hobby-photo';
                img.alt = `${hobbyType} photo`;

                // Insert before upload area
                const uploadArea = gallery.querySelector('.upload-area');
                gallery.insertBefore(img, uploadArea);
            };
            reader.readAsDataURL(file);
        }
    };

    input.click();
}

// Gallery functions
function openHobbyGallery(hobbyType) {
    const modal = document.getElementById('hobby-gallery-modal');
    const title = document.getElementById('hobby-gallery-title');
    const grid = document.getElementById('hobby-gallery-grid');

    // Set title
    title.textContent = `${hobbyType.charAt(0).toUpperCase() + hobbyType.slice(1)} Gallery`;

    // Clear existing content
    grid.innerHTML = '';

    // Add sample images based on hobby type
    const sampleImages = getSampleImages(hobbyType);
    sampleImages.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'gallery-image';
        img.alt = `${hobbyType} image`;
        img.onclick = () => openImageModal(src);
        grid.appendChild(img);
    });

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function openCertGallery(category) {
    const modal = document.getElementById('cert-gallery-modal');
    const title = document.getElementById('cert-gallery-title');
    const grid = document.getElementById('cert-gallery-grid');

    // Set title
    title.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} Certifications`;

    // Clear existing content
    grid.innerHTML = '';

    // Add sample certificate images
    const sampleCerts = getSampleCertificates(category);
    sampleCerts.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'gallery-image';
        img.alt = `${category} certificate`;
        img.onclick = () => openImageModal(src);
        grid.appendChild(img);
    });

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeGallery(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function getSampleImages(hobbyType) {
    const imageMap = {
        travelling: [
            'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
            'https://images.unsplash.com/photo-1539650116574-75c0c6d73aff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
        ],
        cricket: [
            'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
            'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
        ],
        music: [
            'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
            'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
        ],
        photography: [
            'images/pp.jpeg',
            'images/flower2.jpeg',
            'images/sea.jpeg'
        ]
    };
    return imageMap[hobbyType] || [];
}

// --- CORRECTED FUNCTION ---
function getSampleCertificates(category) {
    const certImageMap = {
        technical: [
            'images/nptel.jpeg',
            'images/itdp.jpeg'
        ],
        industrial: [
            // Using placeholders for this category as local files were not specified
            'https://images.unsplash.com/photo-1581092916322-3c1a415797f8?w=500&h=600&fit=crop',
            'https://images.unsplash.com/photo-1560959942-7ca23a8527a8?w=500&h=600&fit=crop'
        ],
        academic: [
            'images/scp.jpeg'
        ]
        // Note: The 'professional' category was removed from the script 
        // as it is not present in the provided HTML file.
    };
    // Return the specific array for the category, or a default empty array
    return certImageMap[category] || [];
}


function uploadCertificate(category) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf';
    input.multiple = true;

    input.onchange = function(e) {
        const files = e.target.files;
        const certList = document.getElementById(`${category}-certs`);

        for (let file of files) {
            const certItem = document.createElement('div');
            certItem.className = 'cert-item';

            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    certItem.innerHTML = `
                        <i class="fas fa-certificate"></i>
                        <div>
                            <p>${file.name}</p>
                            <img src="${e.target.result}" alt="Certificate" style="max-width: 100px; margin-top: 0.5rem; border-radius: 5px;">
                        </div>
                    `;
                };
                reader.readAsDataURL(file);
            } else {
                certItem.innerHTML = `
                    <i class="fas fa-file-pdf"></i>
                    <p>${file.name}</p>
                `;
            }

            // Insert before upload area
            const uploadArea = certList.querySelector('.cert-upload-area');
            certList.insertBefore(certItem, uploadArea);
        }
    };

    input.click();
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioInstance = new Portfolio();
    initializeAnimations();

    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Add click handlers for gallery images
    document.querySelectorAll('.photo-item img').forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            openImageModal(img.src);
        });
    });
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is hidden
        document.querySelectorAll('*').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations when page is visible
        document.querySelectorAll('*').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

// Preload critical images for better performance
function preloadImages() {
    const criticalImages = [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400',
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300',
        'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300',
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300',
        'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300'
    ];

    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize image preloading
preloadImages();



// Enhanced Animation Functions
function initializeAnimations() {
    // Add random animation delays to floating elements
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.5}s`;
    });
}

// Image modal for gallery
function openImageModal(src) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    const img = document.createElement('img');
    img.src = src;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 10px;
        transform: scale(0.8);
        transition: transform 0.3s ease;
    `;

    modal.appendChild(img);
    document.body.appendChild(modal);

    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
        img.style.transform = 'scale(1)';
    }, 10);

    // Close modal on click
    modal.addEventListener('click', () => {
        modal.style.opacity = '0';
        img.style.transform = 'scale(0.8)';
        setTimeout(() => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        }, 300);
    });
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Portfolio;
}
