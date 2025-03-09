// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Custom cursor
    const cursor = document.querySelector('.cursor-follower');
    const links = document.querySelectorAll('a, button, .gallery-item, .nav-dots li, .tab-button, .video-trigger');
    
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    links.forEach(link => {
        link.addEventListener('mouseenter', function() {
            cursor.classList.add('cursor-hover');
        });
        
        link.addEventListener('mouseleave', function() {
            cursor.classList.remove('cursor-hover');
        });
        
        link.addEventListener('mousedown', function() {
            cursor.classList.add('cursor-click');
        });
        
        link.addEventListener('mouseup', function() {
            cursor.classList.remove('cursor-click');
        });
    });
    
    // Hide cursor when it leaves the window
    document.addEventListener('mouseleave', function() {
        cursor.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', function() {
        cursor.style.opacity = '1';
    });
    
    // Header scroll effect
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 0) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.querySelector('.menu-close');
    const menuLinks = document.querySelectorAll('.menu-link');
    
    menuToggle.addEventListener('click', function() {
        document.body.classList.add('menu-active');
    });
    
    menuClose.addEventListener('click', function() {
        document.body.classList.remove('menu-active');
    });
    
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            document.body.classList.remove('menu-active');
        });
    });
    
    // Side navigation
    const sections = document.querySelectorAll('.section');
    const navDots = document.querySelectorAll('.nav-dots li');
    const currentSection = document.querySelector('.current-section');
    const progressBar = document.querySelector('.progress-bar');
    
    function setActiveSection() {
        let current = '';
        let progress = 0;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop - 1) {
                current = section.getAttribute('id');
                progress = (window.scrollY - sectionTop + 1) / sectionHeight * 1;
            }
        });
        
        navDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('data-section') === current) {
                dot.classList.add('active');
                currentSection.textContent = dot.querySelector('.dot-label').textContent;
            }
        });
        
        progressBar.style.width = Math.min(progress, 1) + '%';
    }
    
    window.addEventListener('scroll', setActiveSection);
    window.addEventListener('resize', setActiveSection);
    setActiveSection();
    
    // Smooth scrolling
    navDots.forEach(dot => {
        dot.addEventListener('click', function() {
            const targetId = this.getAttribute('data-section');
            const targetSection = document.getElementById(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
        });
    });
    
    // Section animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const sectionObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Counter animation
    const stats = document.querySelectorAll('.stat-number');
    
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 1;
        const step = target / duration * 1;
        let current = 0;
        
        const timer = setInterval(function() {
            current += step;
            el.textContent = Math.floor(current);
            
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            }
        }, 10);
    }
    
    const statsObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                stats.forEach(stat => {
                    animateCounter(stat);
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    if (stats.length > 0) {
        statsObserver.observe(document.querySelector('.stats-container'));
    }
    
    // Destination tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const mapMarkers = document.querySelectorAll('.map-marker');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            mapMarkers.forEach(marker => marker.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(target).classList.add('active');
            document.querySelector(`.map-marker[data-location="${target}"]`).classList.add('active');
        });
    });
    
    // Map markers
    mapMarkers.forEach(marker => {
        marker.addEventListener('click', function() {
            const location = this.getAttribute('data-location');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            mapMarkers.forEach(m => m.classList.remove('active'));
            
            document.querySelector(`.tab-button[data-tab="${location}"]`).classList.add('active');
            document.getElementById(location).classList.add('active');
            this.classList.add('active');
        });
    });
    
    // Video modal
    const videoTrigger = document.querySelector('.video-trigger');
    const videoModal = document.getElementById('videoModal');
    const modalClose = document.querySelector('.modal-close');
    
    if (videoTrigger) {
        videoTrigger.addEventListener('click', function() {
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            videoModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Cookie consent
    const cookieConsent = document.getElementById('cookieConsent');
    const acceptCookies = document.getElementById('acceptCookies');
    
    if (cookieConsent && acceptCookies) {
        // Check if user has already accepted cookies
        if (!localStorage.getItem('cookiesAccepted')) {
            // Show the cookie consent banner with a slight delay
            setTimeout(() => {
                cookieConsent.classList.add('show');
            }, 2000);
        }
        
        // Handle accept button click
        acceptCookies.addEventListener('click', function() {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieConsent.classList.remove('show');
        });
    }
    
    // Form validation
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            let valid = true;
            const inputs = this.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    valid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (valid) {
                // Here you would normally send the form data to a server
                alert('Mesajınız gönderildi! Teşekkür ederiz.');
                this.reset();
            }
        });
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            
            if (emailInput.value.trim()) {
                alert('Bültenimize abone oldunuz! Teşekkür ederiz.');
                this.reset();
            }
        });
    }
    
    // Initialize the first tab
    if (tabButtons.length > 0) {
        tabButtons[0].click();
    }
});
