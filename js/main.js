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

let allBlogPosts = [];
const contentArea = document.getElementById('content-area');

// --- DATA FETCHING ---
async function fetchBlogData() {
    if (allBlogPosts.length > 0) return;
    try {
        const response = await fetch('/blog-data.json');
        if (!response.ok) throw new Error('Network response was not ok');
        allBlogPosts = await response.json();
    } catch (error) {
        console.error('Failed to fetch blog data:', error);
    }
}

// --- PAGE LOADING ---
async function loadStaticPage(url) {
    try {
        const response = await fetch(`/${url}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        contentArea.innerHTML = await response.text();

        // Initialize components specific to the page
        if (url === 'home.html') {
            initializeSlider();
            initializeCounters();
        }
        if (url === 'gallery.html') initializeGallery();
        if (url === 'work.html') initializeWorkPage();
        if (url === 'about.html') initializeCounters();
    } catch (error) {
        console.error('Failed to load page:', error);
        contentArea.innerHTML = `<p class="text-center text-red-500 py-20">Failed to load content.</p>`;
    }
}

async function loadBlogListPage() {
    await loadStaticPage('blog.html');
    const blogGrid = document.getElementById('blog-grid');
    if (!blogGrid) return;

    blogGrid.innerHTML = allBlogPosts.map(post => `
        <a href="/blog/${post.slug}" class="block bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group">
            <img class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" src="${post.imageUrl}" alt="${post.title}">
            <div class="p-6">
                <p class="text-sm text-gray-500 mb-2">${post.date} &bull; ${post.readTime}</p>
                <h3 class="font-bold text-xl text-primary-blue-dark mb-3">${post.title}</h3>
                <p class="text-gray-700 mb-4">${post.summary}</p>
                <span class="font-bold text-primary-blue-light group-hover:text-primary-blue-dark">Read More &rarr;</span>
            </div>
        </a>
    `).join('');
}

// --- THIS FUNCTION HAS BEEN CORRECTED ---
async function loadBlogDetailPage(slug) {
    // 1. Load the generic blog detail template
    await loadStaticPage('blog-detail.html');

    // 2. Find the specific post data using the slug from the URL
    const post = allBlogPosts.find(p => p.slug === slug);
    const wrapper = document.getElementById('blog-content-wrapper');

    if (post && wrapper) {
        // 3. Construct the full HTML for the post
        const postHTML = `
            <div class="text-center border-b pb-8 mb-8">
                <p class="text-gray-500">${post.date} &bull; ${post.readTime}</p>
                <h1 class="text-primary-blue-dark !mt-2">${post.title}</h1>
            </div>
<img src="/${post.imageUrl.replace('600x400', '1200x600')}" alt="${post.title}" class="rounded-lg mb-8 w-full">
            <div>${post.content}</div>
        `;
        // 4. Inject the HTML into the template's wrapper
        wrapper.innerHTML = postHTML;
    } else if (wrapper) {
        wrapper.innerHTML = '<h1 class="text-center">Post not found</h1>';
    }
}

function loadFooter() {
    const footerContainer = document.querySelector('footer');
    if (!footerContainer) return;
    fetch('/footer.html')
        .then(response => response.ok ? response.text() : Promise.reject('Failed to load footer'))
        .then(html => footerContainer.innerHTML = html)
        .catch(error => console.error(error));
}

// --- ROUTER & NAVIGATION ---
async function router() {
    const path = location.pathname;
    window.scrollTo(0, 0);
    const routes = {
        '/': 'home.html', '/home': 'home.html', '/about': 'about.html',
        '/work': 'work.html', '/gallery': 'gallery.html', '/free-courses': 'free-courses.html',
        '/contact': 'contact.html', '/privacy-policy': 'privacy-policy.html',
        '/terms-of-service': 'terms-of-service.html', '/refund-policy': 'refund-policy.html',
        '/get-involved': 'get-involved.html', '/donate': 'donate.html'
    };
    if (routes[path]) await loadStaticPage(routes[path]);
    else if (path === '/blog') await loadBlogListPage();
    else if (path.startsWith('/blog/')) await loadBlogDetailPage(path.split('/')[2]);
    else await loadStaticPage('home.html');

    // Initialize contact form listener if on contact page
    if (path === '/contact') {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', handleContactFormSubmit);
        }
    }

    closeMobileMenu();
}

function handleNavigation(event) {
    const link = event.target.closest('a');
    if (link && link.target !== '_blank' && link.href.startsWith(location.origin)) {
        event.preventDefault();
        const url = new URL(link.href);
        if (url.pathname !== location.pathname) {
            history.pushState({}, '', url.pathname);
            router();
        }
    }
}

// Keep all other helper functions (initializeSlider, initializeCounters, etc.) as they are.
function closeMobileMenu() { 
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = '';
        const mobileMenuIcon = document.querySelector('#mobile-menu-button svg');
        if (mobileMenuIcon) {
            mobileMenuIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>`;
        }
    }
 }

function initializeScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    if (!scrollToTopBtn) return;

    // Show or hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.remove('opacity-0', 'invisible', 'translate-y-4');
            scrollToTopBtn.classList.add('opacity-100', 'visible', 'translate-y-0');
        } else {
            scrollToTopBtn.classList.add('opacity-0', 'invisible', 'translate-y-4');
            scrollToTopBtn.classList.remove('opacity-100', 'visible', 'translate-y-0');
        }
    });

    // Scroll smoothly to top when button clicked
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initializeCounters() {
    const impactSection = document.getElementById('impact-section');
    if (!impactSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(impactSection);
}

function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 100; // Adjusted speed for smoother animation

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            // Remove any non-digit characters before parsing
            const count = +counter.innerText.replace(/\D/g, '');

            // Calculate increment
            const inc = Math.ceil(target / speed);

            if (count < target) {
                counter.innerText = count + inc > target ? target : count + inc;
                setTimeout(updateCount, 20); // Adjusted delay for smoother animation
            } else {
                counter.innerText = target + '+';
            }
        };

        updateCount();
    });
}

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

function handleContactFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const name = encodeURIComponent(form.name.value.trim());
    const email = encodeURIComponent(form.email.value.trim());
    const subject = encodeURIComponent(form.subject.value.trim());
    const message = encodeURIComponent(form.message.value.trim());

    if (!name || !email || !subject || !message) {
        alert('Please fill in all fields before submitting.');
        return;
    }

    const mailto = `mailto:info@wingerfoundation.org?subject=${subject}&body=Name:%20${name}%0AEmail:%20${email}%0A%0A${message}`;
    window.location.href = mailto;
}

document.addEventListener('DOMContentLoaded', async () => {
    await fetchBlogData();
    loadFooter();
    initializeScrollToTop();
    document.body.addEventListener('click', handleNavigation);
    window.addEventListener('popstate', router);
    router();
});
