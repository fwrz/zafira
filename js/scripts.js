/*==================== MENU SHOW Y HIDDEN ====================*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== CHANGE BACKGROUND HEADER ====================*/
function scrollHeader(){
    const nav = document.getElementById('header')
    // When the scroll is greater than 80 viewport height, add the scroll-header class to the header tag
    if(this.scrollY >= 80) nav.classList.add('scroll-header'); else nav.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

/*==================== SHOW SCROLL UP ====================*/ 
function scrollUp(){
    const scrollUp = document.getElementById('scroll-up');
    // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if(scrollUp) {
        if(this.scrollY >= 560) scrollUp.classList.add('show-scroll'); else scrollUp.classList.remove('show-scroll')
    }
}
window.addEventListener('scroll', scrollUp)

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*==================== SMOOTH SCROLLING ====================*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/*==================== GALLERY FILTER ====================*/
const galleryFilters = document.querySelectorAll('.gallery__filter');
const galleryItems = document.querySelectorAll('.gallery__item');

galleryFilters.forEach(filter => {
    filter.addEventListener('click', () => {
        // Remove active class from all filters
        galleryFilters.forEach(f => f.classList.remove('active'));
        // Add active class to clicked filter
        filter.classList.add('active');
        
        const filterValue = filter.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.5s ease';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

/*==================== GALLERY MODAL ====================*/
const galleryModal = document.getElementById('gallery-modal');
const modalImage = document.getElementById('modal-image');
const modalClose = document.querySelector('.gallery-modal__close');

// Open modal when clicking on gallery items
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const imgSrc = item.querySelector('.gallery__image').src;
        const imgAlt = item.querySelector('.gallery__image').alt;
        
        modalImage.src = imgSrc;
        modalImage.alt = imgAlt;
        galleryModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
});

// Close modal
modalClose.addEventListener('click', () => {
    galleryModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside the image
galleryModal.addEventListener('click', (e) => {
    if (e.target === galleryModal) {
        galleryModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && galleryModal.style.display === 'block') {
        galleryModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

/*==================== CONTACT FORM ====================*/
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Validate required fields
    if (!data.nome || !data.telefone || !data.email || !data.mensagem) {
        formMessage.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Por favor, preencha todos os campos obrigatórios.';
        formMessage.className = 'form__message error';
        formMessage.style.display = 'block';
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
        return;
    }
    
    // Show loading state
    const submitButton = contactForm.querySelector('.form__button');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitButton.disabled = true;
    
    try {
        console.log('Enviando dados:', data);
        
        // Send data to webhook
        const response = await fetch('https://tauros-n8n.agkcyg.easypanel.host/webhook/d12f9636-2484-4713-ad23-8da288c46878', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        console.log('Response:', response);
        
        // With no-cors mode, we can't read the response status or body
        // So we assume success if no error was thrown
        if (response.type === 'opaque') {
            // Success message
            formMessage.innerHTML = '<i class="fas fa-check-circle"></i> Mensagem enviada! Em breve entraremos em contato.';
            formMessage.className = 'form__message success';
            formMessage.style.display = 'block';
            
            // Reset form
            contactForm.reset();
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        } else {
            throw new Error('Resposta inesperada do servidor');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        
        // Error message
        formMessage.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Ocorreu um erro. Tente novamente ou nos chame no WhatsApp.';
        formMessage.className = 'form__message error';
        formMessage.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    } finally {
        // Restore button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
});

/*==================== FORM VALIDATION ====================*/
const formInputs = document.querySelectorAll('.form__input, .form__textarea');

formInputs.forEach(input => {
    input.addEventListener('blur', validateInput);
    input.addEventListener('input', clearValidation);
});

function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    
    // Remove previous validation classes
    input.classList.remove('valid', 'invalid');
    
    if (input.hasAttribute('required') && !value) {
        input.classList.add('invalid');
        return false;
    }
    
    // Email validation
    if (input.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            input.classList.add('invalid');
            return false;
        }
    }
    
    // Phone validation (basic)
    if (input.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\(\)\+]+$/;
        if (!phoneRegex.test(value) || value.length < 10) {
            input.classList.add('invalid');
            return false;
        }
    }
    
    input.classList.add('valid');
    return true;
}

function clearValidation(e) {
    const input = e.target;
    input.classList.remove('valid', 'invalid');
}

/*==================== PHONE MASK ====================*/
const phoneInput = document.querySelector('input[name="telefone"]');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            if (value.length <= 10) {
                value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            } else {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            }
        }
        
        e.target.value = value;
    });
}

/*==================== SCROLL ANIMATIONS ====================*/
// Initialize AOS
AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});

/*==================== LOADING ANIMATION ====================*/
window.addEventListener('load', () => {
    // Add loaded class to body for any loading animations
    document.body.classList.add('loaded');
});

/*==================== INTERSECTION OBSERVER FOR ANIMATIONS ====================*/
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.servicos__card, .depoimento__card, .gallery__item').forEach(el => {
    observer.observe(el);
});

/*==================== PERFORMANCE OPTIMIZATIONS ====================*/
// Lazy loading for images
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

/*==================== PRELOAD CRITICAL RESOURCES ====================*/
// Preload hero image
const heroImage = new Image();
heroImage.src = 'images/home-bg.jpg';

/*==================== ERROR HANDLING ====================*/
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

/*==================== ACCESSIBILITY IMPROVEMENTS ====================*/
// Skip to main content
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.focus();
            e.preventDefault();
        }
    }
});

// Focus management for modal
const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function trapFocus(element) {
    const focusableContent = element.querySelectorAll(focusableElements);
    const firstFocusableElement = focusableContent[0];
    const lastFocusableElement = focusableContent[focusableContent.length - 1];

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// Apply focus trap when modal is open
const modalObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            const modal = mutation.target;
            if (modal.style.display === 'block') {
                trapFocus(modal);
                modal.querySelector('.gallery-modal__close').focus();
            }
        }
    });
});

modalObserver.observe(galleryModal, { attributes: true });

/*==================== ANALYTICS AND TRACKING ====================*/
// Track button clicks
document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', (e) => {
        const buttonText = e.target.textContent.trim();
        console.log('Button clicked:', buttonText);
        
        // Add your analytics tracking code here
        // Example: gtag('event', 'click', { 'event_category': 'button', 'event_label': buttonText });
    });
});

// Track form submissions
contactForm.addEventListener('submit', () => {
    console.log('Contact form submitted');
    
    // Add your analytics tracking code here
    // Example: gtag('event', 'form_submit', { 'event_category': 'contact' });
});

/*==================== CONSOLE WELCOME MESSAGE ====================*/
console.log('%c🦷 Zafira Odontologia', 'color: #00A8CC; font-size: 24px; font-weight: bold;');
console.log('%cSite desenvolvido com ❤️', 'color: #666; font-size: 14px;');

