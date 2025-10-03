// Enhanced AI Assessment Tool with Intelligent Recommendations
// ZOKFORCE AI Consulting - Advanced Logic Engine Implementation

let assessmentItems = [];
let currentIndex = 0;
let scores = {};

// Enhanced logic engine for intelligent recommendations
class AIAssessmentLogicEngine {
    constructor() {
        this.pillars = {
            "Transparency & Explainability": {
                "questions": this.range(1, 13),
                "weight": 1.2,
                "riskMultiplier": 1.3,
                "criticalThreshold": 2.5
            },
            "Fairness & Non-Discrimination": {
                "questions": this.range(13, 25),
                "weight": 1.3,
                "riskMultiplier": 1.5,
                "criticalThreshold": 2.0
            },
            "Privacy & Security": {
                "questions": this.range(25, 37),
                "weight": 1.2,
                "riskMultiplier": 1.4,
                "criticalThreshold": 2.5
            },
            "Accountability & Governance": {
                "questions": this.range(37, 49),
                "weight": 1.1,
                "riskMultiplier": 1.2,
                "criticalThreshold": 2.0
            },
            "Reliability & Safety": {
                "questions": this.range(49, 61),
                "weight": 1.0,
                "riskMultiplier": 1.3,
                "criticalThreshold": 2.5
            },
            "Human Agency & Oversight": {
                "questions": this.range(61, 73),
                "weight": 1.0,
                "riskMultiplier": 1.1,
                "criticalThreshold": 2.0
            }
        };

        this.industryWeights = {
            "Financial Services": {"Privacy & Security": 1.4, "Fairness & Non-Discrimination": 1.5},
            "Healthcare": {"Privacy & Security": 1.5, "Reliability & Safety": 1.4},
            "Technology": {"Transparency & Explainability": 1.3, "Accountability & Governance": 1.2},
            "Manufacturing": {"Reliability & Safety": 1.4, "Human Agency & Oversight": 1.3},
            "Government": {"Accountability & Governance": 1.4, "Transparency & Explainability": 1.3},
            "Education": {"Fairness & Non-Discrimination": 1.3, "Privacy & Security": 1.2},
            "Retail": {"Privacy & Security": 1.2, "Fairness & Non-Discrimination": 1.2},
            "Default": {}
        };

        this.recommendationTemplates = this.initializeRecommendationTemplates();
    }

    range(start, end) {
        return Array.from({length: end - start}, (_, i) => start + i);
    }

    initializeRecommendationTemplates() {
        return {
            "Transparency & Explainability": {
                "level_1": {
                    "immediate": [
                        "Implement basic AI decision logging system with timestamp tracking",
                        "Create simple, plain-language explanations for AI outputs",
                        "Establish basic documentation standards for AI models",
                        "Deploy initial explainability tools for critical decisions"
                    ],
                    "short_term": [
                        "Deploy comprehensive XAI tools (LIME/SHAP) across key models",
                        "Develop user-friendly explanation interfaces with visual elements",
                        "Create detailed model cards for all AI systems in production",
                        "Establish stakeholder-specific communication protocols"
                    ],
                    "long_term": [
                        "Build comprehensive transparency framework with automated reporting",
                        "Implement real-time explanation generation with confidence intervals",
                        "Establish third-party validation processes for AI explanations",
                        "Create predictive transparency metrics and monitoring systems"
                    ]
                },
                "level_2": {
                    "immediate": [
                        "Enhance existing documentation for non-technical user accessibility",
                        "Implement XAI tools for high-impact AI models",
                        "Standardize explanation formats across all AI applications",
                        "Create basic audit trail systems for AI decisions"
                    ],
                    "short_term": [
                        "Deploy comprehensive audit trail systems with version control",
                        "Create multi-level explanations for different stakeholder groups",
                        "Establish quantitative interpretability metrics and benchmarks",
                        "Implement automated transparency reporting mechanisms"
                    ],
                    "long_term": [
                        "Implement dynamic, context-aware explanations",
                        "Create real-time transparency dashboards for stakeholders",
                        "Build advanced regulatory compliance monitoring systems",
                        "Establish continuous explanation quality optimization"
                    ]
                },
                "level_3": {
                    "immediate": [
                        "Optimize existing XAI implementations for better performance",
                        "Enhance stakeholder communication protocols with feedback loops",
                        "Implement automated audit capabilities with anomaly detection",
                        "Create advanced interpretability metrics dashboard"
                    ],
                    "short_term": [
                        "Create real-time interpretability monitoring with alerts",
                        "Establish regular transparency reporting schedule",
                        "Build comprehensive external audit readiness systems",
                        "Implement predictive explanation quality metrics"
                    ],
                    "long_term": [
                        "Deploy AI-powered explanation optimization systems",
                        "Create predictive transparency risk assessment tools",
                        "Implement continuous compliance monitoring with auto-remediation",
                        "Build advanced stakeholder engagement platforms"
                    ]
                }
            },
            "Fairness & Non-Discrimination": {
                "level_1": {
                    "immediate": [
                        "Implement basic bias detection tools for protected characteristics",
                        "Conduct initial data representativeness analysis across demographics",
                        "Establish foundational fairness metrics (demographic parity)",
                        "Create basic bias testing protocols for key AI applications"
                    ],
                    "short_term": [
                        "Deploy systematic bias monitoring with regular assessment cycles",
                        "Implement comprehensive demographic parity testing",
                        "Create fairness constraints in model training pipelines",
                        "Establish algorithmic impact assessment procedures"
                    ],
                    "long_term": [
                        "Build comprehensive fairness framework with multi-metric evaluation",
                        "Implement intersectional bias analysis capabilities",
                        "Create automated bias mitigation systems with feedback loops",
                        "Establish predictive fairness monitoring and prevention"
                    ]
                },
                "level_2": {
                    "immediate": [
                        "Enhance bias testing across all legally protected characteristics",
                        "Implement comprehensive fairness metrics (equality of opportunity)",
                        "Establish regular monitoring schedules with defined thresholds",
                        "Create bias incident response protocols"
                    ],
                    "short_term": [
                        "Deploy intersectional bias testing across characteristic combinations",
                        "Create comprehensive algorithmic impact assessments",
                        "Implement advanced fairness optimization techniques",
                        "Establish continuous bias monitoring with automated alerts"
                    ],
                    "long_term": [
                        "Build real-time bias detection systems with ML-powered analysis",
                        "Create predictive fairness analytics with trend analysis",
                        "Implement adaptive fairness constraints with dynamic adjustment",
                        "Establish fairness performance benchmarking systems"
                    ]
                },
                "level_3": {
                    "immediate": [
                        "Optimize existing fairness implementations for better accuracy",
                        "Enhance intersectional analysis capabilities with advanced metrics",
                        "Implement sophisticated fairness metrics (predictive parity)",
                        "Create fairness performance optimization systems"
                    ],
                    "short_term": [
                        "Create continuous fairness monitoring with real-time dashboards",
                        "Implement automated bias correction with model retraining",
                        "Build comprehensive fairness performance analytics",
                        "Establish fairness testing automation frameworks"
                    ],
                    "long_term": [
                        "Deploy AI-powered fairness optimization with reinforcement learning",
                        "Create predictive discrimination prevention systems",
                        "Implement continuous fairness learning with adaptive algorithms",
                        "Build advanced fairness research and development capabilities"
                    ]
                }
            },
            "Privacy & Security": {
                "level_1": {
                    "immediate": [
                        "Implement basic data encryption for AI training and inference data",
                        "Establish fundamental access controls with role-based permissions",
                        "Create basic privacy policies and user consent mechanisms",
                        "Deploy initial data minimization practices"
                    ],
                    "short_term": [
                        "Implement comprehensive data encryption (at rest and in transit)",
                        "Deploy advanced access controls with multi-factor authentication",
                        "Create detailed Privacy Impact Assessments (PIAs)",
                        "Establish automated data retention and deletion policies"
                    ],
                    "long_term": [
                        "Build privacy-preserving AI techniques (differential privacy)",
                        "Implement advanced threat detection and response systems",
                        "Create comprehensive privacy compliance monitoring",
                        "Establish zero-trust security architecture for AI systems"
                    ]
                },
                "level_2": {
                    "immediate": [
                        "Enhance existing encryption with industry-standard algorithms",
                        "Implement comprehensive access logging and monitoring",
                        "Create detailed user consent management systems",
                        "Establish data anonymization and pseudonymization processes"
                    ],
                    "short_term": [
                        "Deploy advanced privacy-preserving techniques",
                        "Implement comprehensive security monitoring and alerting",
                        "Create automated privacy compliance checking systems",
                        "Establish cross-border data transfer compliance mechanisms"
                    ],
                    "long_term": [
                        "Build advanced privacy-preserving AI capabilities",
                        "Implement predictive privacy risk assessment systems",
                        "Create automated privacy breach detection and response",
                        "Establish privacy-by-design development frameworks"
                    ]
                },
                "level_3": {
                    "immediate": [
                        "Optimize existing privacy controls for better performance",
                        "Enhance security monitoring with advanced threat intelligence",
                        "Implement sophisticated privacy metrics and KPIs",
                        "Create advanced user rights management systems"
                    ],
                    "short_term": [
                        "Deploy cutting-edge privacy-preserving technologies",
                        "Implement advanced security automation and orchestration",
                        "Create real-time privacy compliance dashboards",
                        "Establish advanced privacy research capabilities"
                    ],
                    "long_term": [
                        "Build next-generation privacy-preserving AI systems",
                        "Implement AI-powered privacy optimization",
                        "Create predictive privacy protection systems",
                        "Establish privacy innovation and leadership programs"
                    ]
                }
            },
            "Accountability & Governance": {
                "level_1": {
                    "immediate": [
                        "Establish basic AI governance structure with clear ownership",
                        "Define fundamental roles and responsibilities for AI ethics",
                        "Create basic decision authority mapping for AI initiatives",
                        "Implement initial AI risk assessment processes"
                    ],
                    "short_term": [
                        "Deploy comprehensive AI governance framework",
                        "Implement detailed RACI matrices for all AI processes",
                        "Create formal escalation procedures for AI incidents",
                        "Establish regular AI governance committee meetings"
                    ],
                    "long_term": [
                        "Build mature AI governance organization with specialized roles",
                        "Implement comprehensive AI risk management integration",
                        "Create automated governance compliance monitoring",
                        "Establish external audit and assurance programs"
                    ]
                },
                "level_2": {
                    "immediate": [
                        "Enhance existing governance structure with specialized committees",
                        "Implement comprehensive role definitions with accountability measures",
                        "Create detailed decision authority frameworks",
                        "Establish formal AI incident response protocols"
                    ],
                    "short_term": [
                        "Deploy integrated AI risk management systems",
                        "Implement comprehensive performance monitoring dashboards",
                        "Create systematic compliance tracking mechanisms",
                        "Establish regular executive and board reporting"
                    ],
                    "long_term": [
                        "Build advanced AI governance analytics and reporting",
                        "Implement predictive governance risk assessment",
                        "Create automated governance optimization systems",
                        "Establish governance excellence and maturity programs"
                    ]
                },
                "level_3": {
                    "immediate": [
                        "Optimize existing governance processes for efficiency",
                        "Enhance accountability measures with performance metrics",
                        "Implement advanced governance monitoring capabilities",
                        "Create sophisticated stakeholder engagement processes"
                    ],
                    "short_term": [
                        "Deploy next-generation governance technologies",
                        "Implement advanced governance analytics and insights",
                        "Create real-time governance performance dashboards",
                        "Establish governance innovation and research programs"
                    ],
                    "long_term": [
                        "Build AI-powered governance optimization systems",
                        "Implement predictive governance risk management",
                        "Create autonomous governance monitoring and response",
                        "Establish governance leadership and thought leadership"
                    ]
                }
            },
            "Reliability & Safety": {
                "level_1": {
                    "immediate": [
                        "Implement basic model validation procedures with testing protocols",
                        "Establish fundamental performance monitoring systems",
                        "Create initial safety testing procedures for AI systems",
                        "Deploy basic backup and recovery procedures"
                    ],
                    "short_term": [
                        "Implement comprehensive model validation frameworks",
                        "Deploy continuous performance monitoring with alerting",
                        "Create systematic safety testing protocols",
                        "Establish robust disaster recovery planning"
                    ],
                    "long_term": [
                        "Build advanced reliability engineering capabilities",
                        "Implement predictive failure detection systems",
                        "Create comprehensive safety assurance frameworks",
                        "Establish reliability innovation and research programs"
                    ]
                },
                "level_2": {
                    "immediate": [
                        "Enhance existing validation with advanced testing methods",
                        "Implement comprehensive performance monitoring dashboards",
                        "Create detailed safety testing protocols with edge cases",
                        "Establish advanced backup and recovery systems"
                    ],
                    "short_term": [
                        "Deploy sophisticated robustness assessment frameworks",
                        "Implement advanced failure mode analysis capabilities",
                        "Create comprehensive quality assurance processes",
                        "Establish service level agreement monitoring systems"
                    ],
                    "long_term": [
                        "Build next-generation reliability technologies",
                        "Implement AI-powered reliability optimization",
                        "Create predictive reliability analytics systems",
                        "Establish reliability excellence programs"
                    ]
                },
                "level_3": {
                    "immediate": [
                        "Optimize existing reliability systems for performance",
                        "Enhance safety protocols with advanced methodologies",
                        "Implement sophisticated reliability metrics and KPIs",
                        "Create advanced continuous monitoring capabilities"
                    ],
                    "short_term": [
                        "Deploy cutting-edge reliability technologies",
                        "Implement advanced reliability automation systems",
                        "Create real-time reliability performance dashboards",
                        "Establish reliability research and innovation capabilities"
                    ],
                    "long_term": [
                        "Build autonomous reliability management systems",
                        "Implement predictive reliability optimization",
                        "Create self-healing AI systems with automatic recovery",
                        "Establish reliability thought leadership and standards"
                    ]
                }
            },
            "Human Agency & Oversight": {
                "level_1": {
                    "immediate": [
                        "Implement basic human-in-the-loop processes for critical decisions",
                        "Establish fundamental manual override capabilities",
                        "Create initial human review processes for AI outputs",
                        "Deploy basic user control mechanisms"
                    ],
                    "short_term": [
                        "Implement comprehensive human oversight frameworks",
                        "Deploy advanced manual override and control systems",
                        "Create systematic human review and quality assurance",
                        "Establish detailed escalation procedures to human experts"
                    ],
                    "long_term": [
                        "Build advanced human-AI collaboration systems",
                        "Implement sophisticated agency preservation measures",
                        "Create comprehensive meaningful human control frameworks",
                        "Establish human rights impact assessment programs"
                    ]
                },
                "level_2": {
                    "immediate": [
                        "Enhance existing human oversight with better interfaces",
                        "Implement comprehensive override capabilities across systems",
                        "Create detailed human review protocols with quality metrics",
                        "Establish advanced user control and customization options"
                    ],
                    "short_term": [
                        "Deploy sophisticated human-AI interaction systems",
                        "Implement advanced agency preservation technologies",
                        "Create comprehensive stakeholder participation frameworks",
                        "Establish expert review and validation systems"
                    ],
                    "long_term": [
                        "Build next-generation human-AI collaboration platforms",
                        "Implement advanced democratic oversight mechanisms",
                        "Create comprehensive autonomy protection systems",
                        "Establish human-centered AI innovation programs"
                    ]
                },
                "level_3": {
                    "immediate": [
                        "Optimize existing human oversight for better efficiency",
                        "Enhance human control mechanisms with advanced features",
                        "Implement sophisticated human agency metrics and monitoring",
                        "Create advanced participatory governance systems"
                    ],
                    "short_term": [
                        "Deploy cutting-edge human oversight technologies",
                        "Implement advanced human-AI partnership systems",
                        "Create real-time agency preservation monitoring",
                        "Establish advanced stakeholder engagement platforms"
                    ],
                    "long_term": [
                        "Build AI-enhanced human oversight systems",
                        "Implement predictive agency protection mechanisms",
                        "Create autonomous oversight optimization systems",
                        "Establish human oversight thought leadership programs"
                    ]
                }
            }
        };
    }

    calculateRiskScores(pillarScores, industry = "Default") {
        const riskScores = {};
        const industryWeights = this.industryWeights[industry] || {};
        
        for (const [pillar, score] of Object.entries(pillarScores)) {
            const pillarConfig = this.pillars[pillar];
            const baseRisk = (4 - score) * pillarConfig.riskMultiplier;
            const industryWeight = industryWeights[pillar] || 1.0;
            riskScores[pillar] = baseRisk * industryWeight;
        }
        
        return riskScores;
    }

    identifyCriticalGaps(scores) {
        const criticalGaps = {};
        
        for (const [pillar, config] of Object.entries(this.pillars)) {
            const pillarQuestions = config.questions;
            const criticalQuestions = [];
            
            for (const questionNum of pillarQuestions) {
                const questionId = `AI-${String(questionNum).padStart(3, '0')}`;
                const score = scores[questionId] || 0;
                
                if (score <= 2) {
                    criticalQuestions.push({
                        questionId: questionId,
                        score: score,
                        gapSeverity: 3 - score
                    });
                }
            }
            
            if (criticalQuestions.length > 0) {
                criticalGaps[pillar] = criticalQuestions;
            }
        }
        
        return criticalGaps;
    }

    generateTopPriorities(pillarScores, scores, industry = "Default") {
        const riskScores = this.calculateRiskScores(pillarScores, industry);
        const criticalGaps = this.identifyCriticalGaps(scores);
        
        const priorityScores = {};
        
        for (const [pillar, config] of Object.entries(this.pillars)) {
            const riskComponent = riskScores[pillar];
            const gapComponent = (criticalGaps[pillar] || []).length * 0.5;
            const regulatoryComponent = config.weight * (4 - pillarScores[pillar]);
            const thresholdComponent = pillarScores[pillar] < config.criticalThreshold ? 1.0 : 0;
            
            priorityScores[pillar] = riskComponent + gapComponent + regulatoryComponent + thresholdComponent;
        }
        
        return Object.entries(priorityScores)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3);
    }

    getContextualRecommendations(pillar, currentScore, criticalGaps, industry) {
        const level = Math.min(Math.max(Math.floor(currentScore), 1), 3);
        const levelKey = `level_${level}`;
        const baseRecommendations = this.recommendationTemplates[pillar]?.[levelKey] || {
            immediate: ["No specific recommendations available"],
            short_term: ["No specific recommendations available"],
            long_term: ["No specific recommendations available"]
        };
        
        const customizedRecommendations = {
            immediate: [],
            short_term: [],
            long_term: []
        };
        
        for (const [timeframe, actions] of Object.entries(baseRecommendations)) {
            for (let action of actions) {
                // Add industry-specific context
                if (industry === "Financial Services") {
                    if (action.toLowerCase().includes("regulatory") || action.toLowerCase().includes("compliance")) {
                        action = `${action} (Focus on GDPR/CCPA/PCI-DSS compliance)`;
                    }
                    if (action.toLowerCase().includes("fairness") || action.toLowerCase().includes("bias")) {
                        action = `${action} (Prioritize fair lending regulations)`;
                    }
                } else if (industry === "Healthcare") {
                    if (action.toLowerCase().includes("privacy") || action.toLowerCase().includes("data")) {
                        action = `${action} (Ensure HIPAA compliance)`;
                    }
                    if (action.toLowerCase().includes("safety") || action.toLowerCase().includes("reliability")) {
                        action = `${action} (Meet FDA AI/ML guidance requirements)`;
                    }
                } else if (industry === "Technology") {
                    if (action.toLowerCase().includes("transparency")) {
                        action = `${action} (Focus on algorithmic transparency regulations)`;
                    }
                }
                
                customizedRecommendations[timeframe].push(action);
            }
        }
        
        return customizedRecommendations;
    }
}

// Initialize the logic engine
const logicEngine = new AIAssessmentLogicEngine();

// Original functions (loadAssessment, addFormListener, etc.) remain the same
async function loadAssessment() {
    try {
        const res = await fetch('assessment.json');
        assessmentItems = await res.json();
        console.log('Assessment data loaded:', assessmentItems.length, 'items');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', addFormListener);
        } else {
            addFormListener();
        }
    } catch (error) {
        console.error('Error loading assessment data:', error);
    }
}

function addFormListener() {
    const form = document.getElementById('company-form');
    if (form) {
        console.log('Form found, adding event listener');
        form.addEventListener('submit', startAssessment);
    } else {
        console.error('Company form not found');
    }
}

function startAssessment(e) {
    e.preventDefault();
    console.log('Start assessment called');
    
    const welcomeSection = document.getElementById('welcome');
    const assessmentSection = document.getElementById('assessment');
    
    if (welcomeSection && assessmentSection) {
        console.log('Sections found, switching visibility');
        welcomeSection.classList.remove('active');
        welcomeSection.classList.add('hidden');
        assessmentSection.classList.remove('hidden');
        assessmentSection.classList.add('active');
        showQuestion();
    } else {
        console.error('Welcome or assessment section not found');
    }
}

function showQuestion() {
    console.log('showQuestion called, currentIndex:', currentIndex);
    
    if (!assessmentItems || assessmentItems.length === 0) {
        console.error('Assessment items not loaded yet');
        return;
    }
    
    if (currentIndex >= assessmentItems.length) {
        console.error('Current index out of bounds');
        return;
    }
    
    const item = assessmentItems[currentIndex];
    if (!item) {
        console.error('Assessment item is undefined at index:', currentIndex);
        return;
    }
    
    console.log('Displaying question:', item.question);
    
    const container = document.getElementById('question-container');
    if (!container) {
        console.error('Question container not found');
        return;
    }
    
    container.innerHTML = `
        <div class="question-header">
            <h3>${item.question}</h3>
            <p class="pillar-badge">Pillar: ${item.pillar}</p>
        </div>
        
        <div class="example-box">
            <h4>Example:</h4>
            <p>${item.example}</p>
        </div>
        
        <div class="answer-options">
            ${item.choices.map(choice => `
                <div class="option">
                    <input type="radio" id="level-${choice.level}" name="answer" value="${choice.level}">
                    <label for="level-${choice.level}">
                        <span class="level-number">${choice.level}</span>
                        <span class="level-text">${choice.text}</span>
                    </label>
                </div>
            `).join('')}
        </div>
        
        <div class="regulatory-info">
            <p><strong>Regulatory Alignment:</strong> ${item.regulatoryAlignment}</p>
        </div>
    `;

    // Restore previous answer if it exists and visually mark selected
    const previousAnswer = scores[item.id];
    if (previousAnswer) {
        const radioButton = container.querySelector(`input[value="${previousAnswer}"]`);
        if (radioButton) {
            radioButton.checked = true;
            // Clear any existing selections then apply to the correct option
            container.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
            radioButton.closest('.option')?.classList.add('selected');
        }
    }

    // Add listeners to visually mark selection immediately on click/change
    const optionRadios = container.querySelectorAll('.option input[type="radio"]');
    optionRadios.forEach(radio => {
        // change event fires when label or input is activated
        radio.addEventListener('change', () => {
            // Remove previous selection styles
            container.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
            // Add style to the currently selected option
            radio.closest('.option')?.classList.add('selected');
            // Persist selection so Back/Next and progress can reflect it
            scores[item.id] = parseInt(radio.value, 10);
            updateProgress();
        });
        // Make the entire option clickable for better UX
        const optionEl = radio.closest('.option');
        if (optionEl) {
            optionEl.addEventListener('click', (e) => {
                const target = e.target;
                if (target && typeof target === 'object' && 'tagName' in target && String(target.tagName).toLowerCase() !== 'input') {
                    radio.checked = true;
                    radio.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        }
    });
    
    // Update back button visibility
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.style.display = currentIndex > 0 ? 'block' : 'none';
    }
    
    updateProgress();
}

function updateProgress() {
    const bar = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (!bar || !progressText) {
        console.error('Progress elements not found');
        return;
    }
    
    const answeredQuestions = Object.keys(scores).length;
    const totalQuestions = assessmentItems.length;
    const currentQuestionNumber = currentIndex + 1;
    const percentage = Math.round((answeredQuestions / totalQuestions) * 100);
    
    bar.style.width = `${percentage}%`;
    progressText.textContent = `Question ${currentQuestionNumber} of ${totalQuestions} (${percentage}%)`;
    bar.style.display = 'block';
}

function nextQuestion() {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (!selected) return alert('Please select an answer.');
    
    if (!assessmentItems || assessmentItems.length === 0) {
        console.error('Assessment items not loaded');
        return;
    }
    
    if (currentIndex >= assessmentItems.length) {
        console.error('Current index out of bounds');
        return;
    }
    
    const currentItem = assessmentItems[currentIndex];
    if (!currentItem) {
        console.error('Current assessment item is undefined');
        return;
    }
    
    scores[currentItem.id] = parseInt(selected.value);
    currentIndex++;
    
    if (currentIndex < assessmentItems.length) {
        showQuestion();
    } else {
        calculateResults();
    }
}

function previousQuestion() {
    if (currentIndex > 0) {
        currentIndex--;
        showQuestion();
    }
}

function calculateResults() {
    document.getElementById('assessment').classList.remove('active');
    
    const dashboard = document.getElementById('dashboard');
    dashboard.classList.remove('hidden');
    dashboard.classList.add('active');
    
    const pillarScores = calculatePillarScores();
    const overallScore = Object.values(pillarScores).reduce((a, b) => a + b, 0) / Object.keys(pillarScores).length;
    const maturityLevel = getMaturityLevel(overallScore);
    
    // Get company information
    const companyName = document.getElementById('companyName')?.value || 'Your Organization';
    const contactName = document.getElementById('contactName')?.value || 'Not specified';
    const contactEmail = document.getElementById('contactEmail')?.value || 'Not specified';
    const industry = document.getElementById('industry')?.value || 'Default';
    const assessmentDate = new Date().toLocaleDateString();
    
    // Store in localStorage for PDF generation
    localStorage.setItem('companyName', companyName);
    localStorage.setItem('contactName', contactName);
    localStorage.setItem('contactEmail', contactEmail);
    localStorage.setItem('industry', industry);
    localStorage.setItem('assessmentDate', assessmentDate);
    
    // Update display elements
    document.getElementById('company-name-display').textContent = companyName;
    document.getElementById('contact-name-display').textContent = contactName;
    document.getElementById('company-email-display').textContent = contactEmail;
    document.getElementById('company-industry-display').textContent = industry;
    document.getElementById('assessment-date').textContent = assessmentDate;
    document.getElementById('overall-score').textContent = overallScore.toFixed(1);
    document.getElementById('maturity-level').textContent = maturityLevel;
    
    // Generate enhanced recommendations using the logic engine
    generateEnhancedRecommendations(pillarScores, scores, industry);
    
    setTimeout(() => {
        const radarCanvas = document.getElementById('radarChart');
        const barCanvas = document.getElementById('barChart');
        
        if (radarCanvas && radarCanvas.chart) {
            radarCanvas.chart.destroy();
        }
        if (barCanvas && barCanvas.chart) {
            barCanvas.chart.destroy();
        }
        
        createRadarChart(pillarScores);
        createBarChart(pillarScores);
    }, 100);
    
    generatePillarCards(pillarScores);
    
    document.getElementById('restart-assessment').onclick = () => location.reload();
}

function calculatePillarScores() {
    const pillars = {
        'Transparency & Explainability': [],
        'Fairness & Non-Discrimination': [],
        'Privacy & Security': [],
        'Accountability & Governance': [],
        'Reliability & Safety': [],
        'Human Agency & Oversight': []
    };
    
    const questionIds = Object.keys(scores).sort((a, b) => {
        const numA = parseInt(a.split('-')[1]);
        const numB = parseInt(b.split('-')[1]);
        return numA - numB;
    });
    
    const pillarNames = Object.keys(pillars);
    
    questionIds.forEach((questionId, index) => {
        const pillarIndex = Math.floor(index / 12);
        if (pillarIndex < pillarNames.length) {
            pillars[pillarNames[pillarIndex]].push(scores[questionId]);
        }
    });
    
    const pillarAverages = {};
    Object.keys(pillars).forEach(pillar => {
        const pillarScores = pillars[pillar];
        pillarAverages[pillar] = pillarScores.length > 0
            ? pillarScores.reduce((a, b) => a + b, 0) / pillarScores.length
            : 0;
    });
    
    return pillarAverages;
}

function generateEnhancedRecommendations(pillarScores, scores, industry) {
    const topPriorities = logicEngine.generateTopPriorities(pillarScores, scores, industry);
    const criticalGaps = logicEngine.identifyCriticalGaps(scores);
    
    // Generate top 3 priorities
    const prioritiesContainer = document.getElementById('top-priorities');
    if (prioritiesContainer) {
        prioritiesContainer.innerHTML = '<h2>Top 3 Priority Actions</h2>';
        
        topPriorities.forEach(([pillar, priorityScore], index) => {
            const currentScore = pillarScores[pillar];
            const recommendations = logicEngine.getContextualRecommendations(pillar, currentScore, criticalGaps[pillar], industry);
            
            const priorityDiv = document.createElement('div');
            priorityDiv.className = 'priority-item';
            priorityDiv.innerHTML = `
                <div class="priority-header">
                    <h3>Priority ${index + 1}: ${pillar}</h3>
                    <div class="priority-metrics">
                        <span class="current-score">Current: ${currentScore.toFixed(1)}/4.0</span>
                        <span class="priority-score">Priority Score: ${priorityScore.toFixed(1)}</span>
                        <span class="critical-gaps">Critical Gaps: ${(criticalGaps[pillar] || []).length}</span>
                    </div>
                </div>
                
                <div class="priority-actions">
                    <div class="action-timeframe">
                        <h4>Immediate Actions (0-30 days)</h4>
                        <ul>
                            ${recommendations.immediate.map(action => `<li>${action}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="action-timeframe">
                        <h4>Short-term Actions (1-6 months)</h4>
                        <ul>
                            ${recommendations.short_term.map(action => `<li>${action}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="action-timeframe">
                        <h4>Long-term Actions (6-18 months)</h4>
                        <ul>
                            ${recommendations.long_term.map(action => `<li>${action}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
            
            prioritiesContainer.appendChild(priorityDiv);
        });
    }
    
    // Generate detailed recommendations for each pillar
    generateDetailedPillarRecommendations(pillarScores, criticalGaps, industry);
}

function generateDetailedPillarRecommendations(pillarScores, criticalGaps, industry) {
    const recommendationsContainer = document.getElementById('detailed-recommendations');
    if (recommendationsContainer) {
        recommendationsContainer.innerHTML = '<h2>Detailed Pillar Recommendations</h2>';
        
        Object.entries(pillarScores).forEach(([pillar, score]) => {
            const recommendations = logicEngine.getContextualRecommendations(pillar, score, criticalGaps[pillar], industry);
            const gaps = criticalGaps[pillar] || [];
            
            const pillarDiv = document.createElement('div');
            pillarDiv.className = 'pillar-recommendations';
            pillarDiv.innerHTML = `
                <div class="pillar-rec-header">
                    <h3>${pillar}</h3>
                    <div class="pillar-metrics">
                        <span class="score">Score: ${score.toFixed(1)}/4.0</span>
                        <span class="maturity">Maturity: ${getMaturityLevel(score)}</span>
                        <span class="gaps">Critical Gaps: ${gaps.length}</span>
                    </div>
                </div>
                
                ${gaps.length > 0 ? `
                    <div class="critical-gaps-section">
                        <h4>Critical Areas Needing Immediate Attention</h4>
                        <ul>
                            ${gaps.map(gap => `
                                <li>Question ${gap.questionId}: Score ${gap.score}/4 (Severity: ${gap.gapSeverity})</li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <div class="recommendation-timeline">
                    <div class="timeline-section">
                        <h4>Immediate Actions (0-30 days)</h4>
                        <ol>
                            ${recommendations.immediate.map(action => `<li>${action}</li>`).join('')}
                        </ol>
                    </div>
                    
                    <div class="timeline-section">
                        <h4>Short-term Actions (1-6 months)</h4>
                        <ol>
                            ${recommendations.short_term.map(action => `<li>${action}</li>`).join('')}
                        </ol>
                    </div>
                    
                    <div class="timeline-section">
                        <h4>Long-term Actions (6-18 months)</h4>
                        <ol>
                            ${recommendations.long_term.map(action => `<li>${action}</li>`).join('')}
                        </ol>
                    </div>
                </div>
            `;
            
            recommendationsContainer.appendChild(pillarDiv);
        });
    }
}

function getMaturityLevel(score) {
    if (score >= 3.5) return 'Optimized';
    if (score >= 2.5) return 'Managed';
    if (score >= 1.5) return 'Developing';
    return 'Ad Hoc';
}

// Chart creation functions remain the same
function createRadarChart(pillarScores) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    
    const chart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: Object.keys(pillarScores),
            datasets: [{
                label: 'Current Maturity Level',
                data: Object.values(pillarScores),
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(59, 130, 246, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 4,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'AI Ethics Maturity Radar'
                }
            }
        }
    });
    
    document.getElementById('radarChart').chart = chart;
}

function createBarChart(pillarScores) {
    const ctx = document.getElementById('barChart').getContext('2d');
    
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(pillarScores),
            datasets: [{
                label: 'Maturity Score',
                data: Object.values(pillarScores),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(236, 72, 153, 0.8)'
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(236, 72, 153, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 4,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Pillar Performance Comparison'
                }
            }
        }
    });
    
    document.getElementById('barChart').chart = chart;
}

function generatePillarCards(pillarScores) {
    const container = document.getElementById('pillar-cards');
    if (!container) return;
    
    container.innerHTML = '';
    
    Object.entries(pillarScores).forEach(([pillar, score]) => {
        const card = document.createElement('div');
        card.className = 'pillar-card';
        card.innerHTML = `
            <h3>${pillar}</h3>
            <div class="score-circle">
                <span class="score">${score.toFixed(1)}</span>
                <span class="max">/4.0</span>
            </div>
            <div class="maturity-level">${getMaturityLevel(score)}</div>
        `;
        
        container.appendChild(card);
    });
}

// Initialize the assessment when the page loads
document.addEventListener('DOMContentLoaded', loadAssessment);