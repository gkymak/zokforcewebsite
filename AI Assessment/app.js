// ZOKFORCE AI Ethics Assessment Platform - JavaScript

// Assessment data from provided JSON
const assessmentData = {
    "pillars": [
        {
            "id": "transparency",
            "name": "Transparency & Explainability",
            "description": "Ensuring AI decisions are understandable and communicable",
            "items": [
                "AI Decision Documentation",
                "Explainable AI Implementation", 
                "Algorithm Audit Trails",
                "User Communication Protocols",
                "Technical Documentation Standards",
                "Stakeholder Accessibility",
                "Decision Rationale Provision",
                "Model Interpretability Measures",
                "Transparency Reporting",
                "External Audit Readiness",
                "Regulatory Disclosure Compliance",
                "Third-party Explanation Validation"
            ]
        },
        {
            "id": "fairness",
            "name": "Fairness & Non-Discrimination", 
            "description": "Eliminating bias and ensuring equitable treatment",
            "items": [
                "Bias Detection and Monitoring",
                "Fairness Metrics Implementation",
                "Data Representativeness Assessment",
                "Algorithmic Impact Evaluation", 
                "Protected Characteristics Analysis",
                "Intersectional Bias Testing",
                "Fairness Constraint Implementation",
                "Demographic Parity Measurement",
                "Equal Opportunity Assessment",
                "Predictive Parity Evaluation",
                "Individual Fairness Testing",
                "Group Fairness Optimization"
            ]
        },
        {
            "id": "privacy",
            "name": "Privacy & Security",
            "description": "Protecting data and maintaining user trust", 
            "items": [
                "Data Privacy Protection",
                "Security Infrastructure",
                "Access Control Implementation",
                "Data Minimization Practices",
                "Consent Management Systems",
                "Anonymization Techniques",
                "Encryption Standards",
                "Data Retention Policies",
                "Third-party Data Sharing Controls",
                "Privacy Impact Assessments",
                "Cross-border Data Transfer Compliance",
                "User Rights Management"
            ]
        },
        {
            "id": "accountability",
            "name": "Accountability & Governance",
            "description": "Establishing clear responsibility and oversight",
            "items": [
                "Governance Structure Establishment",
                "Role and Responsibility Definition", 
                "Decision Authority Mapping",
                "Escalation Procedures",
                "Risk Management Integration",
                "Performance Monitoring Systems",
                "Incident Response Protocols",
                "Compliance Tracking",
                "Executive Oversight",
                "Board-level Reporting",
                "External Audit Coordination",
                "Stakeholder Accountability Measures"
            ]
        },
        {
            "id": "reliability",
            "name": "Reliability & Safety",
            "description": "Ensuring consistent and safe AI performance",
            "items": [
                "Model Validation Procedures",
                "Performance Monitoring",
                "Safety Testing Protocols",
                "Robustness Assessment",
                "Edge Case Handling",
                "Failure Mode Analysis",
                "Quality Assurance Processes", 
                "Stress Testing Implementation",
                "Backup System Procedures",
                "Disaster Recovery Planning",
                "Service Level Agreement Compliance",
                "Continuous Reliability Monitoring"
            ]
        },
        {
            "id": "human_agency",
            "name": "Human Agency & Oversight", 
            "description": "Maintaining human control and intervention capabilities",
            "items": [
                "Human-in-the-Loop Implementation",
                "Override Capability Design",
                "Human Review Processes",
                "Escalation to Human Decision-makers",
                "User Control Mechanisms",
                "Agency Preservation Measures",
                "Meaningful Human Control",
                "Expert Review Systems",
                "Stakeholder Participation",
                "Human Rights Impact Assessment",
                "Autonomy Protection Measures",
                "Democratic Oversight Integration"
            ]
        }
    ],
    "scoringLevels": [
        {
            "level": 1,
            "label": "Ad Hoc",
            "description": "Informal, reactive practices with minimal documentation"
        },
        {
            "level": 2, 
            "label": "Developing",
            "description": "Basic policies exist but implementation is inconsistent"
        },
        {
            "level": 3,
            "label": "Managed", 
            "description": "Systematic processes with regular monitoring and review"
        },
        {
            "level": 4,
            "label": "Optimized",
            "description": "Continuous improvement with industry-leading practices"
        }
    ],
    "maturityCategories": [
        {
            "range": "1.0-1.9",
            "label": "Foundation Required",
            "description": "Immediate action needed",
            "color": "#dc2626",
            "recommendations": "Executive-level intervention and dedicated resources required"
        },
        {
            "range": "2.0-2.9", 
            "label": "Developing Capabilities",
            "description": "Systematic improvement required",
            "color": "#ea580c",
            "recommendations": "Focus on policy formalization and process standardization"
        },
        {
            "range": "3.0-3.4",
            "label": "Mature Implementation", 
            "description": "Optimization opportunities exist",
            "color": "#16a34a",
            "recommendations": "Focus on advanced techniques and industry leadership"
        },
        {
            "range": "3.5-4.0",
            "label": "Industry Leadership",
            "description": "Continuous innovation focus", 
            "color": "#0ea5e9",
            "recommendations": "Focus on innovation and knowledge sharing"
        }
    ]
};

// Application state
let currentState = {
    currentQuestionIndex: 0,
    answers: {},
    companyInfo: {},
    pillarScores: {},
    overallScore: 0,
    maturityLevel: ''
};

// Generate all questions from pillars
const allQuestions = [];
assessmentData.pillars.forEach((pillar, pillarIndex) => {
    pillar.items.forEach((item, itemIndex) => {
        allQuestions.push({
            id: `${pillar.id}_${itemIndex}`,
            pillarId: pillar.id,
            pillarName: pillar.name,
            pillarIndex: pillarIndex,
            text: item,
            score: null
        });
    });
});

// DOM Elements
const welcomePage = document.getElementById('welcome-page');
const assessmentPage = document.getElementById('assessment-page');
const resultsPage = document.getElementById('results-page');
const companyForm = document.getElementById('company-form');

// Page navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    initializeEventListeners();
    updateQuestion();
});

function initializeEventListeners() {
    console.log('Setting up event listeners...');
    
    // Company form submission
    const form = document.getElementById('company-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted');
            
            currentState.companyInfo = {
                companyName: document.getElementById('company-name').value,
                contactName: document.getElementById('contact-name').value,
                contactEmail: document.getElementById('contact-email').value,
                industry: document.getElementById('industry').value
            };
            
            console.log('Company info:', currentState.companyInfo);
            showPage('assessment-page');
            updateQuestion(); // Ensure question is properly loaded
        });
    }

    // Score option selection - Use event delegation
    const assessmentContent = document.querySelector('.assessment-content');
    if (assessmentContent) {
        assessmentContent.addEventListener('click', function(e) {
            const scoreOption = e.target.closest('.score-option');
            if (scoreOption) {
                handleScoreSelection(scoreOption);
            }
        });
    }

    // Navigation buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Previous button clicked');
            goToPreviousQuestion();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Next button clicked');
            goToNextQuestion();
        });
    }

    // Results page actions
    const downloadBtn = document.getElementById('download-pdf');
    const restartBtn = document.getElementById('restart-assessment');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', generatePDF);
    }
    
    if (restartBtn) {
        restartBtn.addEventListener('click', restartAssessment);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.target.matches('input, textarea, select')) {
            const currentPage = document.querySelector('.page.active');
            if (currentPage && currentPage.id === 'assessment-page') {
                const nextBtn = document.getElementById('next-btn');
                if (nextBtn && !nextBtn.disabled) {
                    goToNextQuestion();
                }
            }
        }
    });
}

function handleScoreSelection(scoreOption) {
    const score = parseInt(scoreOption.dataset.score);
    console.log('Score selected:', score);
    
    // Clear previous selections
    document.querySelectorAll('.score-option').forEach(opt => {
        opt.classList.remove('selected');
        const radio = opt.querySelector('input[type="radio"]');
        if (radio) radio.checked = false;
    });
    
    // Set new selection
    scoreOption.classList.add('selected');
    const radio = scoreOption.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;
    
    // Store answer
    const questionId = allQuestions[currentState.currentQuestionIndex].id;
    currentState.answers[questionId] = score;
    allQuestions[currentState.currentQuestionIndex].score = score;
    
    console.log('Answer stored for question:', questionId, 'score:', score);
    
    // Enable next button
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        nextBtn.disabled = false;
    }
}

function goToPreviousQuestion() {
    if (currentState.currentQuestionIndex > 0) {
        currentState.currentQuestionIndex--;
        console.log('Going to question:', currentState.currentQuestionIndex + 1);
        updateQuestion();
    }
}

function goToNextQuestion() {
    const totalQuestions = allQuestions.length;
    
    if (currentState.currentQuestionIndex < totalQuestions - 1) {
        currentState.currentQuestionIndex++;
        console.log('Going to question:', currentState.currentQuestionIndex + 1);
        updateQuestion();
    } else {
        // Assessment complete
        console.log('Assessment completed, calculating results...');
        calculateResults();
        showResults();
        showPage('results-page');
    }
}

function updateQuestion() {
    const question = allQuestions[currentState.currentQuestionIndex];
    const totalQuestions = allQuestions.length;
    const progressPercentage = ((currentState.currentQuestionIndex + 1) / totalQuestions) * 100;
    
    console.log('Updating question:', currentState.currentQuestionIndex + 1, 'of', totalQuestions);
    
    // Update progress elements
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const pillarName = document.getElementById('pillar-name');
    const currentPillar = document.getElementById('current-pillar');
    const questionText = document.getElementById('question-text');
    
    if (progressFill) progressFill.style.width = `${progressPercentage}%`;
    if (progressText) progressText.textContent = `Question ${currentState.currentQuestionIndex + 1} of ${totalQuestions}`;
    if (pillarName) pillarName.textContent = question.pillarName;
    if (currentPillar) currentPillar.textContent = `Pillar ${question.pillarIndex + 1} of 6`;
    if (questionText) questionText.textContent = question.text;
    
    // Reset selections
    document.querySelectorAll('.score-option').forEach(opt => {
        opt.classList.remove('selected');
        const radio = opt.querySelector('input[type="radio"]');
        if (radio) radio.checked = false;
    });
    
    // Restore previous selection if exists
    const questionId = question.id;
    const savedScore = currentState.answers[questionId];
    
    if (savedScore) {
        const selectedOption = document.querySelector(`.score-option[data-score="${savedScore}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
            const radio = selectedOption.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        }
    }
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) {
        prevBtn.disabled = currentState.currentQuestionIndex === 0;
    }
    
    if (nextBtn) {
        nextBtn.disabled = !savedScore; // Enable only if question is answered
        nextBtn.textContent = currentState.currentQuestionIndex === totalQuestions - 1 ? 'Complete Assessment' : 'Next';
    }
}

function calculateResults() {
    console.log('Calculating results...');
    console.log('All answers:', currentState.answers);
    
    // Calculate pillar scores
    assessmentData.pillars.forEach(pillar => {
        const pillarQuestions = allQuestions.filter(q => q.pillarId === pillar.id);
        let pillarSum = 0;
        let answeredQuestions = 0;
        
        pillarQuestions.forEach(q => {
            const answer = currentState.answers[q.id];
            if (answer) {
                pillarSum += answer;
                answeredQuestions++;
            }
        });
        
        const pillarAverage = answeredQuestions > 0 ? pillarSum / answeredQuestions : 0;
        currentState.pillarScores[pillar.id] = {
            score: Number(pillarAverage.toFixed(1)),
            name: pillar.name,
            description: pillar.description
        };
    });
    
    // Calculate overall score
    const pillarScoreValues = Object.values(currentState.pillarScores).map(p => p.score);
    const totalScore = pillarScoreValues.reduce((sum, score) => sum + score, 0);
    currentState.overallScore = Number((totalScore / pillarScoreValues.length).toFixed(1));
    
    // Determine maturity level
    const maturityCategory = assessmentData.maturityCategories.find(cat => {
        const [min, max] = cat.range.split('-').map(parseFloat);
        return currentState.overallScore >= min && currentState.overallScore <= max;
    });
    
    currentState.maturityLevel = maturityCategory;
    
    console.log('Results calculated:', {
        overallScore: currentState.overallScore,
        pillarScores: currentState.pillarScores,
        maturityLevel: currentState.maturityLevel
    });
}

function showResults() {
    console.log('Showing results...');
    
    // Update company information
    const companyNameDisplay = document.getElementById('company-name-display');
    const assessmentDate = document.getElementById('assessment-date');
    
    if (companyNameDisplay) companyNameDisplay.textContent = currentState.companyInfo.companyName;
    if (assessmentDate) assessmentDate.textContent = new Date().toLocaleDateString();
    
    // Update overall score
    const overallScoreElement = document.getElementById('overall-score');
    const maturityBadge = document.getElementById('maturity-level');
    
    if (overallScoreElement) overallScoreElement.textContent = currentState.overallScore.toFixed(1);
    if (maturityBadge && currentState.maturityLevel) {
        maturityBadge.textContent = currentState.maturityLevel.label;
        const labelClass = currentState.maturityLevel.label.toLowerCase().replace(/\s+/g, '-');
        maturityBadge.className = `maturity-badge ${labelClass}`;
    }
    
    // Generate charts
    setTimeout(() => {
        generateCharts();
    }, 100);
    
    // Generate pillar cards
    generatePillarCards();
    
    // Generate recommendations
    generateRecommendations();
}

function generateCharts() {
    const pillarNames = assessmentData.pillars.map(p => p.name);
    const pillarScores = assessmentData.pillars.map(p => currentState.pillarScores[p.id].score);
    
    // Radar Chart
    const radarCanvas = document.getElementById('radar-chart');
    if (radarCanvas) {
        const radarCtx = radarCanvas.getContext('2d');
        new Chart(radarCtx, {
            type: 'radar',
            data: {
                labels: pillarNames,
                datasets: [{
                    label: 'Current Score',
                    data: pillarScores,
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: '#3b82f6',
                    borderWidth: 2,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2
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
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Pillar Performance Overview'
                    }
                }
            }
        });
    }
    
    // Bar Chart
    const barCanvas = document.getElementById('bar-chart');
    if (barCanvas) {
        const barCtx = barCanvas.getContext('2d');
        new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: pillarNames.map(name => name.split(' ')[0]), // Shortened labels
                datasets: [{
                    label: 'Score',
                    data: pillarScores,
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545'],
                    borderColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545'],
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
                        text: 'Individual Pillar Scores'
                    }
                }
            }
        });
    }
}

function generatePillarCards() {
    const pillarCardsContainer = document.getElementById('pillar-cards');
    if (!pillarCardsContainer) return;
    
    pillarCardsContainer.innerHTML = '';
    
    assessmentData.pillars.forEach(pillar => {
        const pillarData = currentState.pillarScores[pillar.id];
        const maturityCategory = getMaturityCategory(pillarData.score);
        
        const cardHTML = `
            <div class="pillar-card">
                <div class="pillar-card-header">
                    <span class="pillar-name">${pillarData.name}</span>
                    <span class="pillar-score">${pillarData.score.toFixed(1)}</span>
                </div>
                <p class="pillar-description">${pillarData.description}</p>
                <span class="pillar-status" style="background: ${maturityCategory.color}15; color: ${maturityCategory.color}">
                    ${maturityCategory.label}
                </span>
            </div>
        `;
        pillarCardsContainer.innerHTML += cardHTML;
    });
}

function generateRecommendations() {
    const recommendationsContainer = document.getElementById('recommendations-list');
    if (!recommendationsContainer) return;
    
    recommendationsContainer.innerHTML = '';
    
    // Sort pillars by score (lowest first) to prioritize recommendations
    const sortedPillars = Object.entries(currentState.pillarScores)
        .sort(([,a], [,b]) => a.score - b.score)
        .slice(0, 3); // Top 3 priority areas
    
    sortedPillars.forEach(([pillarId, pillarData], index) => {
        const priority = index === 0 ? 'HIGH' : index === 1 ? 'MEDIUM' : 'LOW';
        const maturityCategory = getMaturityCategory(pillarData.score);
        
        const recommendationHTML = `
            <div class="recommendation-item">
                <div class="recommendation-priority">${priority} PRIORITY</div>
                <div class="recommendation-text">
                    <strong>${pillarData.name}</strong>: ${maturityCategory.recommendations}. 
                    Focus on improving processes and implementing systematic approaches to achieve better governance in this area.
                </div>
            </div>
        `;
        recommendationsContainer.innerHTML += recommendationHTML;
    });
}

function getMaturityCategory(score) {
    return assessmentData.maturityCategories.find(cat => {
        const [min, max] = cat.range.split('-').map(parseFloat);
        return score >= min && score <= max;
    });
}

function generatePDF() {
    if (!window.jsPDF) {
        console.error('jsPDF not loaded');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(30, 58, 138);
    doc.text('ZOKFORCE', 20, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text('AI Ethics Assessment Report', 20, 28);
    
    // Company Information
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('Assessment Summary', 20, 45);
    doc.setFontSize(10);
    doc.text(`Company: ${currentState.companyInfo.companyName}`, 20, 55);
    doc.text(`Contact: ${currentState.companyInfo.contactName}`, 20, 62);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 69);
    
    // Overall Score
    doc.setFontSize(14);
    doc.text('Overall Maturity Score', 20, 85);
    doc.setFontSize(24);
    doc.setTextColor(30, 58, 138);
    doc.text(currentState.overallScore.toFixed(1), 20, 100);
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(currentState.maturityLevel.label, 50, 100);
    
    // Pillar Scores
    doc.text('Pillar Performance', 20, 120);
    let yPosition = 130;
    
    assessmentData.pillars.forEach(pillar => {
        const pillarData = currentState.pillarScores[pillar.id];
        doc.setFontSize(10);
        doc.text(`${pillarData.name}: ${pillarData.score.toFixed(1)}`, 20, yPosition);
        yPosition += 8;
    });
    
    // Recommendations
    doc.text('Priority Recommendations', 20, yPosition + 10);
    yPosition += 20;
    
    const sortedPillars = Object.entries(currentState.pillarScores)
        .sort(([,a], [,b]) => a.score - b.score)
        .slice(0, 3);
    
    sortedPillars.forEach(([pillarId, pillarData], index) => {
        const priority = index === 0 ? 'HIGH' : index === 1 ? 'MEDIUM' : 'LOW';
        const maturityCategory = getMaturityCategory(pillarData.score);
        
        doc.setFontSize(9);
        doc.text(`${priority}: ${pillarData.name}`, 20, yPosition);
        yPosition += 6;
        
        // Word wrap for recommendations
        const splitText = doc.splitTextToSize(maturityCategory.recommendations, 170);
        doc.text(splitText, 20, yPosition);
        yPosition += splitText.length * 4 + 5;
    });
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('Generated by ZOKFORCE AI Ethics Assessment Platform', 20, 280);
    
    // Save PDF
    doc.save(`${currentState.companyInfo.companyName}_AI_Ethics_Assessment.pdf`);
}

function restartAssessment() {
    currentState = {
        currentQuestionIndex: 0,
        answers: {},
        companyInfo: {},
        pillarScores: {},
        overallScore: 0,
        maturityLevel: ''
    };
    
    // Reset all question scores
    allQuestions.forEach(question => {
        question.score = null;
    });
    
    // Clear form
    if (companyForm) {
        companyForm.reset();
    }
    
    // Show welcome page
    showPage('welcome-page');
}