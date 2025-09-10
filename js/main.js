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

        // After loading the content, check for and initialize components.
        initializeSlider();
        if (url === 'gallery.html') {
            initializeGallery();
        }
        if (url === 'work.html') {
            initializeWorkPage();
        }

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

const navGallery = document.getElementById('nav-gallery');
    const navGalleryMobile = document.getElementById('nav-gallery-mobile'); // Add this if you have a mobile gallery link

    if (navGallery) {
        navGallery.addEventListener('click', (e) => {
            e.preventDefault();
            loadPage('gallery.html');
            closeMobileMenu();
        });
    }

    if (navGalleryMobile) {
        navGalleryMobile.addEventListener('click', (e) => {
            e.preventDefault();
            loadPage('gallery.html');
            closeMobileMenu();
        });
    }

    const navFreeCourses = document.getElementById('nav-free-courses');
    const navFreeCoursesMobile = document.getElementById('nav-free-courses-mobile');

    if (navFreeCourses) {
        navFreeCourses.addEventListener('click', (e) => {
            e.preventDefault();
            loadPage('free-courses.html');
            closeMobileMenu();
        });
    }

    if (navFreeCoursesMobile) {
        navFreeCoursesMobile.addEventListener('click', (e) => {
            e.preventDefault();
            loadPage('free-courses.html');
            closeMobileMenu();
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



// --- GALLERY PAGE LOGIC ---
function initializeGallery() {
    const filters = document.querySelectorAll('#gallery-filters .filter-btn');
    const galleryItems = document.querySelectorAll('#gallery-grid .gallery-item');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImageContent');
    const closeButton = document.querySelector('.modal-close');

    if (!filters.length || !galleryItems.length || !modal) {
        console.warn('Gallery elements not found. Skipping initialization.');
        return;
    }

    // --- Filter Logic ---
    filters.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button style
            filters.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            // Show/hide gallery items
            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (filterValue === 'all' || filterValue === itemCategory) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // --- Modal Logic ---
    const openModal = (imgSrc) => {
        modalImage.src = imgSrc;
        modal.classList.remove('invisible', 'opacity-0', 'pointer-events-none');
        modal.classList.add('visible'); // Custom visible class if needed
        setTimeout(() => modal.querySelector('img').style.transform = 'scale(1)', 50);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.add('invisible', 'opacity-0', 'pointer-events-none');
        modal.querySelector('img').style.transform = 'scale(0.95)';
        document.body.style.overflow = '';
    };

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) openModal(img.src);
        });
    });

    if(closeButton) closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('invisible')) {
            closeModal();
        }
    });
    
    // Add a simple 'active' class for styling the filter buttons
    const style = document.createElement('style');
    style.innerHTML = `.filter-btn { padding: 0.5rem 1.25rem; border: 2px solid transparent; border-radius: 9999px; background-color: #e2e8f0; color: #4a5568; cursor: pointer; transition: all 0.3s; font-weight: 600; } .filter-btn:hover { background-color: #cbd5e0; } .filter-btn.active { border-color: #0e3d59; background-color: #0e3d59; color: white; }`;
    document.head.appendChild(style);
}

// --- WORK PAGE MODAL LOGIC ---
function initializeWorkPage() {
    const learnMoreButtons = document.querySelectorAll('.learn-more-btn');
    const modal = document.getElementById('contentModal');
    if (!modal || !learnMoreButtons.length) return; // Exit if elements aren't on the page

    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const closeButton = document.getElementById('modalCloseBtn');
    const modalDialog = modal.querySelector('.bg-white');

    const openModal = (title, description) => {
        modalTitle.textContent = title;
        modalDescription.innerHTML = description.replace(/\n/g, '<br>'); // Format description
        modal.classList.remove('invisible', 'opacity-0', 'pointer-events-none');
        modalDialog.style.transform = 'scale(1)';
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.add('invisible', 'opacity-0', 'pointer-events-none');
        modalDialog.style.transform = 'scale(0.95)';
        document.body.style.overflow = '';
    };

    learnMoreButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.project-card');
            const title = card.dataset.title;
            const description = card.dataset.description;
            openModal(title, description);
        });
    });

    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('invisible')) {
            closeModal();
        }
    });


}
