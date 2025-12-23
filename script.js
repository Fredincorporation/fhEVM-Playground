/* ============================================================================
   fhEVM Playground Pro - Main JavaScript
   Interactivity: Filtering, Searching, CLI Modal, Smooth Scrolling, Animations
   ============================================================================ */

// ============================================================================
// Data: All fhEVM Examples with Metadata
// ============================================================================

const examplesData = [
    // ===== MANDATORY / CORE CONCEPTS =====
    {
        id: 'basic-counter',
        name: 'Basic Counter',
        category: 'mandatory',
        complexity: 'beginner',
        description: 'Simple encrypted counter demonstrating fundamental fhEVM operations.',
        details: 'Learn the basics of storing and manipulating encrypted values with Hardhat.',
        repo: 'https://github.com/Fredincorporation/fhEVM-Playground/tree/main/central-repo/examples/basic-counter-premium',
        tags: ['Counter', 'State', 'Encryption']
    },
    {
        id: 'arithmetic',
        name: 'Arithmetic Operations',
        category: 'mandatory',
        complexity: 'beginner',
        description: 'Add, subtract, multiply encrypted numbers securely.',
        details: 'Master encrypted arithmetic: addition, subtraction, multiplication, and division.',
        repo: 'https://github.com/Fredincorporation/fhEVM-Playground/tree/main/central-repo/examples/arithmetic-premium',
        tags: ['Math', 'Operations', 'Encryption']
    },
    {
        id: 'comparisons',
        name: 'Comparisons & Inequalities',
        category: 'mandatory',
        complexity: 'beginner',
        description: 'Compare encrypted values without decryption.',
        details: 'Perform encrypted comparisons (==, <, >, <=, >=) maintaining confidentiality.',
        repo: 'https://github.com/Fredincorporation/fhEVM-Playground/tree/main/central-repo/examples/comparisons-premium',
        tags: ['Comparison', 'Logic', 'FHE']
    },
    {
        id: 'single-encryption',
        name: 'User-Side Encryption & Decryption',
        category: 'mandatory',
        complexity: 'intermediate',
        description: 'Encrypt data client-side before sending to contract.',
        details: 'Learn how users encrypt sensitive data locally and submit proofs to the contract.',
        repo: 'https://github.com/Fredincorporation/fhEVM-Playground/tree/main/central-repo/examples/single-encryption-premium',
        tags: ['Encryption', 'User', 'Privacy']
    },
    {
        id: 'multiple-encryption',
        name: 'Multiple Encryption',
        category: 'mandatory',
        complexity: 'intermediate',
        description: 'Encrypt and manage multiple encrypted values.',
        details: 'Handle batches of encrypted values efficiently in your contracts.',
        repo: 'https://github.com/Fredincorporation/fhEVM-Playground/tree/main/central-repo/examples/multiple-encryption-premium',
        tags: ['Encryption', 'Batch', 'Multiple']
    },
    {
        id: 'single-decryption-public',
        name: 'Public Encryption & Decryption',
        category: 'mandatory',
        complexity: 'intermediate',
        description: 'Encrypt and decrypt values within the contract.',
        details: 'Handle contract-level encryption/decryption for transparent computations.',
        repo: 'https://github.com/Fredincorporation/fhEVM-Playground/tree/main/central-repo/examples/single-decryption-public-premium',
        tags: ['Public', 'Encryption', 'Contract']
    },
    {
        id: 'single-decryption-user',
        name: 'User-Authorized Decryption',
        category: 'mandatory',
        complexity: 'intermediate',
        description: 'User-authorized decryption with FHE.allow().',
        details: 'Control who can decrypt specific encrypted values securely.',
        repo: 'https://github.com/Fredincorporation/fhEVM-Playground/tree/main/central-repo/examples/single-decryption-user-premium',
        tags: ['Decryption', 'User', 'Authorization']
    },
    {
        id: 'multiple-decryption',
        name: 'Multiple Decryption',
        category: 'mandatory',
        complexity: 'intermediate',
        description: 'Decrypt multiple encrypted values efficiently.',
        details: 'Handle efficient decryption of multiple encrypted values.',
        repo: 'https://github.com/Fredincorporation/fhEVM-Playground/tree/main/central-repo/examples/multiple-decryption-premium',
        tags: ['Decryption', 'Batch', 'Multiple']
    },
    {
        id: 'access-control',
        name: 'Access Control (FHE.allow)',
        category: 'mandatory',
        complexity: 'intermediate',
        description: 'Control who can decrypt specific encrypted values.',
        details: 'Use FHE.allow() and allowTransient() to manage decryption permissions securely.',
        repo: 'https://github.com/Fredincorporation/fhEVM-Playground/tree/main/central-repo/examples/access-control-premium',
        tags: ['Access Control', 'Permissions', 'FHE']
    },
    {
        id: 'input-verification-proofs',
        name: 'Input Proofs & Verification',
        category: 'mandatory',
        complexity: 'advanced',
        description: 'Prove encrypted inputs without revealing them.',
        details: 'Implement zero-knowledge proofs for encrypted input verification.',
        repo: 'https://github.com/Fredincorporation/fhEVM-Playground/tree/main/central-repo/examples/input-proofs-premium',
        tags: ['Proofs', 'Verification', 'ZK']
    },
    {
        id: 'anti-patterns-guide',
        name: 'Anti-Patterns & Edge Cases',
        category: 'mandatory',
        complexity: 'advanced',
        description: 'Learn what NOT to do and why patterns fail.',
        details: 'Comprehensive demonstration of common mistakes and their security implications.',
        repo: 'https://github.com/Fredincorporation/fhEVM-Playground/tree/main/central-repo/examples/anti-patterns-premium',
        tags: ['Security', 'Best Practices', 'Pitfalls']
    },
    {
        id: 'handles-lifecycle',
        name: 'Handles & Lifecycle Management',
        category: 'mandatory',
        complexity: 'advanced',
        description: 'Manage encrypted handle lifecycles and expiration.',
        details: 'Understand how encrypted handles work, persist, and expire in fhEVM.',
        repo: 'https://github.com/Fredincorporation/fhEVM-Playground/tree/main/central-repo/examples/handles-lifecycle-premium',
        tags: ['Handles', 'Lifecycle', 'Advanced']
    },
    {
        id: 'oz-erc7984-basic',
        name: 'OpenZeppelin - ERC7984 Standard',
        category: 'mandatory',
        complexity: 'intermediate',
        description: 'Implement ERC7984 confidential token standard.',
        details: 'Full implementation of OpenZeppelin\'s encrypted token specification.',
        repo: 'https://github.com/Fredincorporation/fhEVM-Playground/tree/main/central-repo/examples/erc7984-premium',
        tags: ['ERC7984', 'Token', 'Standard']
    },
    {
        id: 'oz-erc20-wrapper',
        name: 'OpenZeppelin - Wrappers & Utilities',
        category: 'mandatory',
        complexity: 'intermediate',
        description: 'Use OpenZeppelin wrappers for confidential operations.',
        details: 'Leverage pre-built confidential contract utilities and patterns.',
        repo: 'https://github.com/Fredincorporation/fhEVM-Playground/tree/main/central-repo/examples/private-erc20-premium',
        tags: ['Utilities', 'Wrappers', 'Libraries']
    },
    {
        id: 'swaps',
        name: 'OpenZeppelin - Confidential Swaps',
        category: 'mandatory',
        complexity: 'advanced',
        description: 'Privacy-preserving DEX swap implementation.',
        details: 'Private token swaps protecting amounts and counterparties.',
        repo: 'https://github.com/Fredincorporation/fhEVM-Playground/tree/main/central-repo/examples/swaps-premium',
        tags: ['Swap', 'DEX', 'Privacy']
    },
    {
        id: 'vesting',
        name: 'OpenZeppelin - Confidential Vesting Wallet',
        category: 'mandatory',
        complexity: 'advanced',
        description: 'Privacy-protected token vesting schedule.',
        details: 'Private vesting wallet with encrypted release schedules.',
        repo: 'https://github.com/Fredincorporation/fhEVM-Playground/tree/main/central-repo/examples/vesting-premium',
        tags: ['Vesting', 'Token', 'Schedule']
    },
    {
        id: 'blind-auction',
        name: 'Blind Auction Pro',
        category: 'mandatory',
        complexity: 'advanced',
        description: 'Sealed-bid auction with encrypted bids.',
        details: 'Complete blind auction where bid amounts remain confidential throughout.',
        repo: 'https://github.com/Fredincorporation/fhEVM-Playground/tree/main/central-repo/examples/blind-auction-premium',
        tags: ['Auction', 'Sealed-Bid', 'Privacy']
    },

    // ===== PRO BONUS / INNOVATIVE REAL-WORLD APPS =====
    {
        id: 'dao-voting-pro',
        name: 'Confidential DAO Voting',
        category: 'bonus',
        complexity: 'pro',
        description: 'Private governance with encrypted votes and homomorphic tallying.',
        details: 'DAO voting where individual votes remain private until final tally is revealed. Uses homomorphic encryption for vote aggregation.',
        repo: 'https://github.com/Fredincorporation/fhEVM-Playground/tree/main/central-repo/examples/dao-voting-premium',
        tags: ['DAO', 'Governance', 'Privacy', 'Voting']
    },
    {
        id: 'private-lending-pro',
        name: 'Private Lending Pool',
        category: 'bonus',
        complexity: 'pro',
        description: 'Confidential DeFi lending with encrypted loan terms.',
        details: 'Lending protocol where loan amounts, collateral, and interest rates remain confidential. Perfect for institutional finance.',
        repo: 'https://github.com/Fredincorporation/fhEVM-Playground/tree/main/central-repo/examples/private-lending-premium',
        tags: ['Lending', 'DeFi', 'Collateral', 'Privacy']
    },
    {
        id: 'blind-dex-pro',
        name: 'Blind DEX Order Book',
        category: 'bonus',
        complexity: 'pro',
        description: 'MEV-resistant private DEX with encrypted order matching.',
        details: 'Decentralized exchange with encrypted order books preventing MEV attacks and front-running.',
        repo: 'https://github.com/Fredincorporation/fhEVM-Playground/tree/main/central-repo/examples/blind-dex-premium',
        tags: ['DEX', 'MEV', 'Orders', 'Privacy']
    },
    {
        id: 'poker-game-pro',
        name: 'Encrypted Poker Game',
        category: 'bonus',
        complexity: 'pro',
        description: 'Fair poker game with encrypted hands and provably fair mechanics.',
        details: 'Fully confidential poker where card hands, bets, and outcomes are encrypted and verifiable.',
        repo: 'https://github.com/Fredincorporation/fhEVM-Playground/tree/main/central-repo/examples/encrypted-poker-premium',
        tags: ['Gaming', 'Poker', 'Fair Play', 'Privacy']
    },
    {
        id: 'yield-farming-pro',
        name: 'Private Yield Farming Positions',
        category: 'bonus',
        complexity: 'pro',
        description: 'Confidential liquidity provision and yield tracking.',
        details: 'Yield farming where deposited amounts, earned yields, and position details remain private from other users.',
        repo: 'https://github.com/Fredincorporation/fhEVM-Playground/tree/main/central-repo/examples/private-yield-premium',
        tags: ['Farming', 'Yield', 'DeFi', 'Privacy']
    },
    {
        id: 'mev-arbitrage-pro',
        name: 'MEV-Resistant Arbitrage Demo',
        category: 'bonus',
        complexity: 'pro',
        description: 'Encrypted arbitrage opportunities protected from extractors.',
        details: 'Arbitrage bot with encrypted trade paths preventing sandwich attacks and MEV extraction.',
        repo: 'https://github.com/Fredincorporation/fhEVM-Playground/tree/main/central-repo/examples/mev-arbitrage-premium',
        tags: ['Arbitrage', 'MEV', 'Trading', 'Privacy']
    },
    {
        id: 'confidential-stablecoin-pro',
        name: 'Confidential Stablecoin Mint/Burn',
        category: 'bonus',
        complexity: 'pro',
        description: 'Privacy-preserving stablecoin with encrypted issuance and burning.',
        details: 'Stablecoin protocol where mint/burn operations, reserves, and user balances are confidential.',
        repo: 'https://github.com/Fredincorporation/fhEVM-Playground/tree/main/central-repo/examples/confidential-stablecoin-premium',
        tags: ['Stablecoin', 'Mint', 'Burn', 'Privacy']
    }
];

// ============================================================================
// Utility Functions
// ============================================================================

function getTagColor(tag) {
    const colorMap = {
        'Counter': 'teal',
        'State': 'teal',
        'Encryption': 'teal',
        'Math': 'purple',
        'Operations': 'purple',
        'Comparison': 'purple',
        'Logic': 'teal',
        'FHE': 'teal',
        'User': 'purple',
        'Privacy': 'teal',
        'Public': 'purple',
        'Contract': 'purple',
        'Access Control': 'purple',
        'Permissions': 'teal',
        'Proofs': 'teal',
        'Verification': 'purple',
        'ZK': 'teal',
        'Security': 'teal',
        'Best Practices': 'purple',
        'Pitfalls': 'red',
        'Handles': 'purple',
        'Lifecycle': 'teal',
        'Advanced': 'teal',
        'Analysis': 'purple',
        'Testing': 'teal',
        'ERC7984': 'teal',
        'Token': 'purple',
        'Standard': 'teal',
        'Utilities': 'purple',
        'Wrappers': 'teal',
        'Libraries': 'purple',
        'Swap': 'teal',
        'DEX': 'purple',
        'Vesting': 'teal',
        'Schedule': 'purple',
        'Auction': 'teal',
        'Sealed-Bid': 'purple',
        'DAO': 'teal',
        'Governance': 'purple',
        'Voting': 'teal',
        'Lending': 'teal',
        'DeFi': 'purple',
        'Collateral': 'teal',
        'MEV': 'purple',
        'Orders': 'teal',
        'Gaming': 'teal',
        'Poker': 'purple',
        'Fair Play': 'teal',
        'Farming': 'purple',
        'Yield': 'teal',
        'Trading': 'purple',
        'Arbitrage': 'teal',
        'Stablecoin': 'purple',
        'Mint': 'teal',
        'Burn': 'purple'
    };
    return colorMap[tag] || 'teal';
}

function copyToClipboard(text, button) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            const originalText = button.textContent;
            button.textContent = '✓ Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        }).catch((err) => {
            console.error('Copy failed:', err);
            alert('Failed to copy. Please try again.');
        });
    } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            const originalText = button.textContent;
            button.textContent = '✓ Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        } catch (err) {
            console.error('Copy failed:', err);
            alert('Failed to copy. Please try again.');
        }
        document.body.removeChild(textarea);
    }
}

// ============================================================================
// Category Card Rendering
// ============================================================================

function createCategoryCard(example) {
    const tagClass = example.category === 'mandatory' ? 'tag-basic' : 'tag-pro';
    const tagLabel = example.category === 'mandatory' ? 'Core Concept' : 'Innovative App';

    return `
        <div class="category-card" data-category="${example.category}" data-id="${example.id}">
            <span class="category-tag ${tagClass}">${tagLabel}</span>
            <h3>${example.name}</h3>
            <p class="category-description">${example.description}</p>
            <div class="category-card-actions">
                <a href="${example.repo}" target="_blank" class="btn-small btn-view">View Repo →</a>
                <button class="btn-small btn-copy" onclick="copyCLI(this, '${example.id}')">Copy CLI</button>
            </div>
        </div>
    `;
}

function renderCategories(examples = examplesData) {
    const grid = document.getElementById('categoriesGrid');
    grid.innerHTML = examples.map(createCategoryCard).join('');
}

// ============================================================================
// Filtering & Searching
// ============================================================================

function filterCategories(filterType) {
    let filtered = examplesData;

    if (filterType === 'mandatory') {
        filtered = examplesData.filter(ex => ex.category === 'mandatory');
    } else if (filterType === 'bonus') {
        filtered = examplesData.filter(ex => ex.category === 'bonus');
    }

    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(ex =>
            ex.name.toLowerCase().includes(searchTerm) ||
            ex.description.toLowerCase().includes(searchTerm) ||
            ex.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }

    renderCategories(filtered);
    updateActiveFilter(filterType);
}

function updateActiveFilter(filterType) {
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filterType}"]`).classList.add('active');
}

// ============================================================================
// Search Functionality
// ============================================================================

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const activeFilter = document.querySelector('.filter-tab.active')?.getAttribute('data-filter') || 'all';

        let filtered = examplesData;

        if (activeFilter === 'mandatory') {
            filtered = examplesData.filter(ex => ex.category === 'mandatory');
        } else if (activeFilter === 'bonus') {
            filtered = examplesData.filter(ex => ex.category === 'bonus');
        }

        if (searchTerm) {
            filtered = filtered.filter(ex =>
                ex.name.toLowerCase().includes(searchTerm) ||
                ex.description.toLowerCase().includes(searchTerm) ||
                ex.details.toLowerCase().includes(searchTerm) ||
                ex.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }

        renderCategories(filtered);
    });
}

// ============================================================================
// Filter Tab Event Listeners
// ============================================================================

function setupFilterTabs() {
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const filterType = e.target.getAttribute('data-filter');
            filterCategories(filterType);
        });
    });
}

// ============================================================================
// CLI Modal & Clipboard
// ============================================================================

function openCliModal() {
    const modal = document.getElementById('cliModal');
    modal.classList.add('show');
}

function closeCliModal() {
    const modal = document.getElementById('cliModal');
    modal.classList.remove('show');
}

function copyCLI(button, categoryId = null) {
    // Generate command - clone, install dependencies, then run via npm start
    let text = 'git clone https://github.com/Fredincorporation/fhEVM-Playground.git && cd fhEVM-Playground/central-repo && npm install && npm start -- create --name "my-example" --category basic-counter';

    if (categoryId) {
        const example = examplesData.find(ex => ex.id === categoryId);
        if (example) {
            const projectName = example.name.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '').substring(0, 30);
            const proFlag = example.complexity === 'pro' ? ' --pro' : '';
            text = `git clone https://github.com/Fredincorporation/fhEVM-Playground.git && cd fhEVM-Playground/central-repo && npm install && npm start -- create --name "${projectName}" --category ${categoryId}${proFlag}`;
        }
    }

    copyToClipboard(text, button);
}

function selectCategory(categoryId) {
    document.querySelectorAll('.category-option').forEach(opt => {
        opt.classList.remove('active');
    });
    event.target.classList.add('active');

    const example = examplesData.find(ex => ex.id === categoryId);
    if (example) {
        copyCLI(event.target, categoryId);
    }
}

// ============================================================================
// Modal Event Listeners
// ============================================================================

function setupModal() {
    const modal = document.getElementById('cliModal');
    const closeBtn = document.querySelector('.modal-close');
    const quickStartBtn = document.getElementById('quickStartBtn');

    quickStartBtn.addEventListener('click', openCliModal);
    closeBtn.addEventListener('click', closeCliModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeCliModal();
        }
    });

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCliModal();
        }
    });
}

// ============================================================================
// Scroll to Top Button
// ============================================================================

function setupScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================================================
// Smooth Scroll for Internal Links
// ============================================================================

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================================================
// Animation on Scroll
// ============================================================================

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.category-card, .feature-card, .quick-start-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 600ms ease-out, transform 600ms ease-out';
        observer.observe(el);
    });
}

// ============================================================================
// Navigation Active State
// ============================================================================

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';

        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// ============================================================================
// Initialize Everything on DOM Ready
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Render initial categories
    renderCategories();

    // Setup all interactive features
    setupSearch();
    setupFilterTabs();
    setupModal();
    setupScrollToTop();
    setupSmoothScroll();
    setupScrollAnimations();
    setupNavigation();

    console.log('fhEVM Playground Pro initialized! 🎉');
});

// ============================================================================
// Prerequisites Tab Switching
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.os-tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const os = this.getAttribute('data-os');
            
            // Remove active from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active to clicked button and corresponding pane
            this.classList.add('active');
            const activePane = document.querySelector(`.tab-pane[data-os="${os}"]`);
            if (activePane) {
                activePane.classList.add('active');
            }
        });
    });
});

// ============================================================================
// Dark Mode (Always On)
// ============================================================================

function initThemeToggle() {
    // Force dark mode permanently
    document.body.classList.add('dark-mode');
}

// ============================================================================
// Preload animations for better performance
// ============================================================================

window.addEventListener('load', () => {
    initThemeToggle();
    document.body.style.opacity = '1';
});

