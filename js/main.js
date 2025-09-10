// --- Modern Navigation Bar Logic ---
// This part remains unchanged as it controls the header, which is static.
const header = document.getElementById('main-header');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton) {
    const mobileMenuIcon = mobileMenuButton.querySelector('svg');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    mobileMenuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const isMenuOpen = !mobileMenu.classList.contains('hidden');
        if (isMenuOpen) {
            mobileMenu.classList.add('hidden');
            mobileMenuIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>`;
            document.body.style.overflow = '';
        } else {
            mobileMenu.classList.remove('hidden');
            mobileMenuIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>`;
            document.body.style.overflow = 'hidden';
        }
    });

    mobileMenu.addEventListener('click', () => {
         mobileMenu.classList.add('hidden');
         mobileMenuIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>`;
         document.body.style.overflow = '';
    });
}


// --- Hero Image Slider Logic ---
// This logic needs to run *after* the content is loaded, so we wrap it in a function.
function initializeSlider() {
    const sliderTrack = document.getElementById('slider-track');
    if (!sliderTrack) return;

    const slides = Array.from(sliderTrack.children);
    const nextButton = document.getElementById('next-slide');
    const prevButton = document.getElementById('prev-slide');
    const dotsNav = document.getElementById('slider-dots');
    let currentSlide = 0;
    let autoPlayInterval;
    
    // Clear existing dots to prevent duplication on re-load
    if(dotsNav) dotsNav.innerHTML = '';

    // Create dots
    slides.forEach((slide, index) => {
        const dot = document.createElement('button');
        dot.classList.add('w-3', 'h-3', 'rounded-full', 'bg-white', 'bg-opacity-50', 'transition-all', 'duration-300', 'hover:bg-opacity-75');
        dotsNav.appendChild(dot);
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoPlay();
        });
    });

    const dots = Array.from(dotsNav.children);

    const updateDots = (targetIndex) => {
        dots.forEach((dot, index) => {
            dot.classList.remove('bg-opacity-100', 'scale-125');
            if (index === targetIndex) {
                dot.classList.add('bg-opacity-100', 'scale-125');
            }
        });
    };
    
    const goToSlide = (targetIndex) => {
        if (sliderTrack) {
            sliderTrack.style.transform = 'translateX(-' + 100 * targetIndex + '%)';
            currentSlide = targetIndex;
            updateDots(targetIndex);
        }
    };

    const moveToNextSlide = () => {
        const nextSlideIndex = (currentSlide + 1) % slides.length;
        goToSlide(nextSlideIndex);
    };

    if(nextButton) {
        nextButton.addEventListener('click', () => {
            moveToNextSlide();
            resetAutoPlay();
        });
    }

    if(prevButton) {
        prevButton.addEventListener('click', () => {
            const prevSlideIndex = (currentSlide - 1 + slides.length) % slides.length;
            goToSlide(prevSlideIndex);
            resetAutoPlay();
        });
    }

    const startAutoPlay = () => {
        autoPlayInterval = setInterval(moveToNextSlide, 4000);
    };

    const resetAutoPlay = () => {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    };

    goToSlide(0);
    startAutoPlay();
}

// --- DYNAMIC PAGE LOADING ---
async function loadPage(url) {
    const contentArea = document.getElementById('content-area');
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        contentArea.innerHTML = html;

        // After loading the content, check for and initialize any components like the slider.
        initializeSlider();

    } catch (error) {
        console.error('Failed to load page:', error);
        contentArea.innerHTML = '<p class="text-center text-red-500 py-20">Failed to load content. Please try again later.</p>';
    }
}

function setupNavigation() {
    const navHome = document.getElementById('nav-home');
    const navAbout = document.getElementById('nav-about');
    const navHomeMobile = document.getElementById('nav-home-mobile');
    const navAboutMobile = document.getElementById('nav-about-mobile');

    if (navHome) {
        navHome.addEventListener('click', (e) => {
            e.preventDefault();
            loadPage('home.html');
            closeMobileMenu();
        });
    }

    if (navAbout) {
        navAbout.addEventListener('click', (e) => {
            e.preventDefault();
            loadPage('about.html');
            closeMobileMenu();
        });
    }

    if (navHomeMobile) {
        navHomeMobile.addEventListener('click', (e) => {
            e.preventDefault();
            loadPage('home.html');
            closeMobileMenu();
        });
    }

    if (navAboutMobile) {
        navAboutMobile.addEventListener('click', (e) => {
            e.preventDefault();
            loadPage('about.html');
            closeMobileMenu();
        });
    }

    const navWork = document.getElementById('nav-work');
    const navWorkMobile = document.getElementById('nav-work-mobile');

    if (navWork) {
        navWork.addEventListener('click', (e) => {
            e.preventDefault();
            loadPage('work.html');
            closeMobileMenu();
        });
    }

    if (navWorkMobile) {
        navWorkMobile.addEventListener('click', (e) => {
            e.preventDefault();
            loadPage('work.html');
            closeMobileMenu();
        });
    }

    const navGetInvolved = document.getElementById('nav-get-involved');
    const navGetInvolvedMobile = document.getElementById('nav-get-involved-mobile');

    if (navGetInvolved) {
        navGetInvolved.addEventListener('click', (e) => {
            e.preventDefault();
            loadPage('get-involved.html');
            closeMobileMenu();
        });
    }

    if (navGetInvolvedMobile) {
        navGetInvolvedMobile.addEventListener('click', (e) => {
            e.preventDefault();
            loadPage('get-involved.html');
            closeMobileMenu();
        });
    }

    const navContact = document.getElementById('nav-contact');
    const navContactMobile = document.getElementById('nav-contact-mobile');

    if (navContact) {
        navContact.addEventListener('click', (e) => {
            e.preventDefault();
            loadPage('contact.html');
            closeMobileMenu();
        });
    }

    if (navContactMobile) {
        navContactMobile.addEventListener('click', (e) => {
            e.preventDefault();
            loadPage('contact.html');
            closeMobileMenu();
        });
    }

    const navPrivacyPolicy = document.getElementById('nav-privacy-policy');
    const navPrivacyPolicyMobile = document.getElementById('nav-privacy-policy-mobile');

    if (navPrivacyPolicy) {
        navPrivacyPolicy.addEventListener('click', (e) => {
            e.preventDefault();
            loadPage('privacy-policy.html');
            closeMobileMenu();
        });
    }

    if (navPrivacyPolicyMobile) {
        navPrivacyPolicyMobile.addEventListener('click', (e) => {
            e.preventDefault();
            loadPage('privacy-policy.html');
            closeMobileMenu();
        });
    }

    const footerTermsOfService = document.getElementById('footer-terms-of-service');
    if (footerTermsOfService) {
        footerTermsOfService.addEventListener('click', (e) => {
            e.preventDefault();
            loadPage('terms-of-service.html');
        });
    }

    const footerRefundPolicy = document.getElementById('footer-refund-policy');
    if (footerRefundPolicy) {
        footerRefundPolicy.addEventListener('click', (e) => {
            e.preventDefault();
            loadPage('refund-policy.html');
        });
    }
}

function loadFooter() {
    const footer = document.querySelector('footer');
    if (!footer) return;

    fetch('footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            footer.innerHTML = html;
        })
        .catch(error => {
            console.error('Failed to load footer:', error);
            footer.innerHTML = '<p class="text-center text-red-500 py-4">Failed to load footer. Please try again later.</p>';
        });
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenuIcon = mobileMenuButton ? mobileMenuButton.querySelector('svg') : null;

    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        if (mobileMenuIcon) {
            mobileMenuIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>`;
        }
        document.body.style.overflow = '';
    }
}

// Load the initial page and footer when the DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
    loadPage('home.html');
    loadFooter();
    setupNavigation();
});

