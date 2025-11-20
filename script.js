// Terminal Animation
const terminalOutput = document.getElementById('terminal-output');
const outputLines = [
    { text: '🔍 Analyzing project...', delay: 0, class: '' },
    { text: '✓ Detected: React + Vite + Express', delay: 800, class: 'success' },
    { text: '📦 Found 47 dependencies', delay: 1600, class: '' },
    { text: '✓ Node.js v18.16.0 detected', delay: 2400, class: 'success' },
    { text: '⚙️  Installing dependencies...', delay: 3200, class: '' },
    { text: '  → react (18/47)', delay: 4000, class: 'installing' },
    { text: '  → express (19/47)', delay: 4800, class: 'installing' },
    { text: '✓ Installation complete', delay: 5600, class: 'success' },
    { text: '🚀 Starting dev server...', delay: 6400, class: '' },
    { text: '✓ Server running at http://localhost:5173', delay: 7200, class: 'success' }
];

let currentLine = 0;

function animateTerminal() {
    if (currentLine < outputLines.length) {
        setTimeout(() => {
            const line = outputLines[currentLine];
            const lineElement = document.createElement('div');
            lineElement.className = `output-line ${line.class}`;
            lineElement.textContent = line.text;
            lineElement.style.opacity = '0';
            terminalOutput.appendChild(lineElement);
            
            setTimeout(() => {
                lineElement.style.transition = 'opacity 0.3s';
                lineElement.style.opacity = '1';
            }, 50);
            
            currentLine++;
            animateTerminal();
        }, outputLines[currentLine].delay);
    } else {
        // Reset animation after completion
        setTimeout(() => {
            terminalOutput.innerHTML = '';
            currentLine = 0;
            animateTerminal();
        }, 3000);
    }
}

// Start animation when page loads
window.addEventListener('load', () => {
    setTimeout(animateTerminal, 500);
});

// OS Selector
const osBtns = document.querySelectorAll('.os-btn');
const selectedOsSpan = document.getElementById('selected-os');

osBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        osBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const os = btn.dataset.os;
        const osNames = {
            'windows': 'Windows',
            'macos': 'macOS',
            'linux': 'Linux'
        };
        selectedOsSpan.textContent = osNames[os];
    });
});

// Smooth Scroll
function scrollToDownload() {
    document.getElementById('download').scrollIntoView({ behavior: 'smooth' });
}

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards and steps
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .step');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Detect user's OS and pre-select
function detectOS() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    let os = 'windows';
    
    if (userAgent.indexOf('mac') !== -1) {
        os = 'macos';
    } else if (userAgent.indexOf('linux') !== -1) {
        os = 'linux';
    }
    
    const osBtn = document.querySelector(`.os-btn[data-os="${os}"]`);
    if (osBtn) {
        osBtn.click();
    }
}

// Detect OS on load
window.addEventListener('load', detectOS);

// Feedback Modal Functions
let selectedRating = 0;

function openFeedback(e) {
    e.preventDefault();
    document.getElementById('feedback-modal').style.display = 'flex';
}

function closeFeedback() {
    document.getElementById('feedback-modal').style.display = 'none';
    document.getElementById('feedback-form').reset();
    selectedRating = 0;
    document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
}

// Star rating
document.addEventListener('DOMContentLoaded', () => {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.rating);
            document.getElementById('rating-value').value = selectedRating;
            stars.forEach((s, i) => {
                s.classList.toggle('active', i < selectedRating);
            });
        });
    });

    // Other issue toggle
    document.getElementById('issue-other').addEventListener('change', (e) => {
        document.getElementById('other-issue-text').style.display = e.target.checked ? 'block' : 'none';
    });

    // Character count
    const textarea = document.querySelector('textarea[name="feedback"]');
    textarea?.addEventListener('input', (e) => {
        document.getElementById('char-count').textContent = e.target.value.length;
    });

    // File upload
    const fileInput = document.getElementById('file-input');
    fileInput?.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        const fileList = document.getElementById('file-list');
        const consentGroup = document.getElementById('consent-group');
        
        fileList.innerHTML = '';
        if (files.length > 0) {
            consentGroup.style.display = 'block';
            files.forEach((file, i) => {
                if (i < 4) {
                    const div = document.createElement('div');
                    div.className = 'file-item';
                    div.innerHTML = `<span>${file.name}</span><button type="button" onclick="removeFile(${i})">×</button>`;
                    fileList.appendChild(div);
                }
            });
        } else {
            consentGroup.style.display = 'none';
        }
    });
});

function removeFile(index) {
    const fileInput = document.getElementById('file-input');
    const dt = new DataTransfer();
    const files = Array.from(fileInput.files);
    files.forEach((file, i) => {
        if (i !== index) dt.items.add(file);
    });
    fileInput.files = dt.files;
    fileInput.dispatchEvent(new Event('change'));
}

async function submitFeedback(e) {
    e.preventDefault();
    
    if (!selectedRating) {
        alert('Please provide a rating');
        return;
    }

    const files = document.getElementById('file-input').files;
    if (files.length > 0 && !document.getElementById('consent-check').checked) {
        alert('Please consent to share files for debugging');
        return;
    }

    const formData = new FormData(e.target);
    const issues = formData.getAll('issues');
    
    // Convert files to base64
    const filePromises = Array.from(files).map(file => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                resolve({
                    name: file.name,
                    mimeType: file.type,
                    data: e.target.result.split(',')[1]
                });
            };
            reader.readAsDataURL(file);
        });
    });
    
    const fileData = await Promise.all(filePromises);
    
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        profession: formData.get('profession'),
        rating: selectedRating,
        smoothness: formData.get('smoothness'),
        detection: formData.get('detection'),
        issues: issues.join(', '),
        files: fileData,
        feedback: formData.get('feedback')
    };
    
    console.log('Submitting data:', data);
    
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbyzdckrpKE7syBeIAtCbRF5iLStQ3CB2Q-nO3ey6gwSaT97H_grtp8GV3N6v_26VtuB3A/exec', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        console.log('Response status:', response.status);
        const result = await response.text();
        console.log('Response data:', result);
        
        // Show success message
        document.querySelector('.feedback-form-content').style.display = 'none';
        document.querySelector('.feedback-success').style.display = 'block';
        
        if (data.email) {
            document.getElementById('success-message').textContent = 'We read every submission. If you provided an email, we may follow up for clarification.';
        }
        
        setTimeout(() => {
            closeFeedback();
            document.querySelector('.feedback-form-content').style.display = 'block';
            document.querySelector('.feedback-success').style.display = 'none';
        }, 3000);
    } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('Error submitting feedback. Please try again.');
    }
}

// FAQ Toggle Functionality
function toggleFAQ(button) {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Add parallax effect to hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < 500) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Download function for SnapSetup
function downloadSnapSetup() {
    const link = document.createElement('a');
    link.href = 'https://github.com/Jubed437/SnapSetup/releases/download/V1.0.0/SnapSetup.Setup.1.0.0.exe';
    link.download = 'SnapSetup.Setup.1.0.0.exe';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Enhanced navigation for new sections
document.addEventListener('DOMContentLoaded', () => {
    // Update navigation to include new sections
    const navLinks = document.querySelector('.nav-links');
    if (navLinks && window.innerWidth > 968) {
        navLinks.innerHTML = `
            <a href="#features">Features</a>
            <a href="#why-snapsetup">Why SnapSetup</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#faq">FAQ</a>
            <a href="#download">Download</a>
            <a href="#" onclick="openFeedback(event)">Feedback</a>
        `;
    }
    
    // Animate new sections on scroll
    const newSections = document.querySelectorAll('.why-card, .persona-card, .use-case-card, .testimonial-card, .community-card, .security-feature');
    newSections.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Stats counter animation
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            const suffix = stat.textContent.includes('+') ? '+' : '';
            stat.textContent = Math.floor(current).toLocaleString() + suffix;
        }, 20);
    });
}

// Trigger stats animation when footer comes into view
const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            footerObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const footer = document.querySelector('.footer');
if (footer) {
    footerObserver.observe(footer);
}
// Mobile menu toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    navLinks.classList.toggle('active');
    menuBtn.classList.toggle('active');
}

// Close mobile menu when clicking on links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            document.querySelector('.nav-links').classList.remove('active');
            document.querySelector('.mobile-menu-btn').classList.remove('active');
        });
    });
});