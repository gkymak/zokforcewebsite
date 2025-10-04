// ZOKFORCE AI Ethics Assessment - Enhanced with Question-Level Recommendations
// Professional AI consulting platform with sophisticated recommendation engine

let assessmentItems = [];
let currentIndex = 0;
let scores = {};

// Enhanced recommendation engine with question-level analysis
class QuestionLevelRecommendationEngine {
    constructor() {
        this.initializeQuestionDatabase();
    }

    initializeQuestionDatabase() {
        // Initialize with sample critical questions - in production, this would include all 72
        this.questionRecommendations = {
            "AI-010": {
                id: "AI-010",
                pillar: "Transparency & Explainability",
                question: "External Audit Readiness",
                recommendations: {
                    1: {
                        priority: "CRITICAL",
                        urgency: "Immediate (0-30 days)",
                        risk_level: "VERY HIGH",
                        actions: [
                            "Conduct immediate audit readiness assessment across all AI systems",
                            "Create emergency audit documentation packages for high-risk systems",
                            "Establish audit coordinator role and external audit firm relationship",
                            "Implement basic audit trail systems for all AI decisions"
                        ],
                        expected_outcome: "Basic audit preparedness established, regulatory violation risk minimized",
                        resources_needed: "Legal counsel, compliance team, audit firm consultation",
                        success_metrics: "Audit-ready documentation for 100% of high-risk AI systems"
                    },
                    2: {
                        priority: "HIGH",
                        urgency: "Short-term (30-90 days)",
                        risk_level: "MEDIUM-HIGH",
                        actions: [
                            "Complete comprehensive audit trail implementation",
                            "Create detailed performance and bias assessment reports",
                            "Establish stakeholder feedback collection systems",
                            "Implement regular internal audit processes"
                        ],
                        expected_outcome: "Comprehensive audit packages ready for external inspection",
                        resources_needed: "Audit team, data analysts, documentation specialists",
                        success_metrics: "Complete audit packages for all AI systems"
                    }
                }
            },
            "AI-033": {
                id: "AI-033",
                pillar: "Privacy & Security",
                question: "Third-party Data Sharing Controls",
                recommendations: {
                    4: {
                        priority: "LOW",
                        urgency: "Long-term (6-12 months)",
                        risk_level: "LOW",
                        actions: [
                            "Implement next-generation privacy-preserving data sharing technologies",
                            "Create advanced secure multi-party computation capabilities",
                            "Develop federated learning partnerships with industry leaders",
                            "Establish privacy innovation research program"
                        ],
                        expected_outcome: "Industry-leading privacy-preserving data collaboration",
                        resources_needed: "Advanced privacy engineers, R&D budget",
                        success_metrics: "Recognition as privacy technology leader"
                    },
                    3: {
                        priority: "MEDIUM", 
                        urgency: "Medium-term (3-6 months)",
                        risk_level: "MEDIUM",
                        actions: [
                            "Optimize existing data sharing governance for performance",
                            "Implement advanced privacy metrics and monitoring",
                            "Create data sharing partnership evaluation frameworks"
                        ],
                        expected_outcome: "Optimized data sharing with enhanced privacy protections",
                        resources_needed: "Privacy engineers, data governance team",
                        success_metrics: "Improved data sharing efficiency with privacy guarantees"
                    }
                }
            }
        };
    }

    generateQuestionLevelRecommendations(questionScores, companyInfo = {}) {
        const recommendations = {
            criticalActions: [],
            highPriorityActions: [],
            mediumPriorityActions: [],
            optimizationActions: [],
            overallRiskScore: 0,
            complianceGaps: [],
            resourceRequirements: {
                immediate: { budget: 0, actions: 0, timeframe: "0-30 days" },
                shortTerm: { budget: 0, actions: 0, timeframe: "30-90 days" },
                mediumTerm: { budget: 0, actions: 0, timeframe: "3-6 months" },
                longTerm: { budget: 0, actions: 0, timeframe: "6-12 months" }
            }
        };

        let totalRiskScore = 0;
        let questionCount = 0;

        // Analyze each question individually
        for (const [questionId, score] of Object.entries(questionScores)) {
            questionCount++;
            
            // Calculate risk contribution (inverse of score)
            const riskContribution = (5 - score) / 4 * 100;
            totalRiskScore += riskContribution;

            // Get question-specific recommendations if available
            const questionData = this.questionRecommendations[questionId];
            let recommendation;

            if (questionData && questionData.recommendations[score]) {
                recommendation = {
                    ...questionData.recommendations[score],
                    questionId,
                    pillar: questionData.pillar,
                    question: questionData.question,
                    currentScore: score,
                    riskContribution: riskContribution
                };
            } else {
                // Fallback to generic recommendations based on score
                recommendation = this.generateGenericRecommendation(questionId, score, riskContribution);
            }

            // Categorize by priority
            switch (recommendation.priority) {
                case "CRITICAL":
                    recommendations.criticalActions.push(recommendation);
                    recommendations.resourceRequirements.immediate.actions++;
                    recommendations.resourceRequirements.immediate.budget += 15000;
                    break;
                case "HIGH":
                    recommendations.highPriorityActions.push(recommendation);
                    recommendations.resourceRequirements.shortTerm.actions++;
                    recommendations.resourceRequirements.shortTerm.budget += 8000;
                    break;
                case "MEDIUM":
                    recommendations.mediumPriorityActions.push(recommendation);
                    recommendations.resourceRequirements.mediumTerm.actions++;
                    recommendations.resourceRequirements.mediumTerm.budget += 5000;
                    break;
                case "LOW":
                    recommendations.optimizationActions.push(recommendation);
                    recommendations.resourceRequirements.longTerm.actions++;
                    recommendations.resourceRequirements.longTerm.budget += 3000;
                    break;
            }

            // Track compliance gaps (scores of 1-2)
            if (score <= 2) {
                recommendations.complianceGaps.push({
                    questionId,
                    score,
                    riskLevel: recommendation.risk_level,
                    pillar: recommendation.pillar || "Unknown"
                });
            }
        }

        // Calculate overall risk score
        recommendations.overallRiskScore = questionCount > 0 ? Math.round(totalRiskScore / questionCount) : 0;

        // Sort by risk contribution
        recommendations.criticalActions.sort((a, b) => b.riskContribution - a.riskContribution);
        recommendations.highPriorityActions.sort((a, b) => b.riskContribution - a.riskContribution);

        return recommendations;
    }

    generateGenericRecommendation(questionId, score, riskContribution) {
        const priorities = {
            1: { priority: "CRITICAL", urgency: "Immediate (0-30 days)", risk_level: "HIGH" },
            2: { priority: "HIGH", urgency: "Short-term (30-90 days)", risk_level: "MEDIUM-HIGH" },
            3: { priority: "MEDIUM", urgency: "Medium-term (3-6 months)", risk_level: "MEDIUM" },
            4: { priority: "LOW", urgency: "Long-term (6-12 months)", risk_level: "LOW" }
        };

        const scoreData = priorities[score] || priorities[2];
        
        return {
            questionId,
            currentScore: score,
            priority: scoreData.priority,
            urgency: scoreData.urgency,
            risk_level: scoreData.risk_level,
            actions: [`Improve ${questionId} from level ${score} to level ${Math.min(score + 1, 4)}`],
            expected_outcome: `Enhanced performance in ${questionId}`,
            resources_needed: "Technical team, compliance review",
            success_metrics: `Achieve level ${Math.min(score + 1, 4)} performance`,
            riskContribution
        };
    }
}

// Original assessment functions
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
        console.error('Assessment item is undefined at index', currentIndex);
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
            <h4>Example</h4>
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
    
    // Restore previous answer if exists
    const previousAnswer = scores[item.id];
    if (previousAnswer) {
        const radioButton = container.querySelector(`input[value="${previousAnswer}"]`);
        if (radioButton) {
            radioButton.checked = true;
            radioButton.closest('.option')?.classList.add('selected');
        }
    }
    
    // Add event listeners for option selection
    const optionRadios = container.querySelectorAll('.option input[type="radio"]');
    optionRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            container.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
            radio.closest('.option')?.classList.add('selected');
            scores[item.id] = parseInt(radio.value, 10);
            updateProgress();
        });
        
        const optionEl = radio.closest('.option');
        if (optionEl) {
            optionEl.addEventListener('click', (e) => {
                const target = e.target;
                if (target && typeof target === 'object' && 'tagName' in target && 
                    String(target.tagName).toLowerCase() !== 'input') {
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

    // Update next button label: 'Submit' on last question, otherwise 'Next'
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        const isLast = currentIndex === assessmentItems.length - 1;
        nextBtn.textContent = isLast ? 'Submit' : 'Next';
        nextBtn.classList.toggle('submit', isLast);
        nextBtn.classList.toggle('primary', !isLast);
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
    if (!selected) {
        return alert('Please select an answer.');
    }
    
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
    
    // Store for PDF generation
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
    
    // Generate enhanced recommendations using question-level analysis
    generateEnhancedRecommendations(pillarScores, scores, industry);
    
    // Create charts
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
    
    // Group questions by pillar
    const questionIds = Object.keys(scores).sort((a, b) => {
        const numA = parseInt(a.split('-')[1]);
        const numB = parseInt(b.split('-')[1]);
        return numA - numB;
    });
    
    questionIds.forEach((questionId, index) => {
        const pillarIndex = Math.floor(index / 12);
        const pillarNames = Object.keys(pillars);
        if (pillarIndex < pillarNames.length) {
            pillars[pillarNames[pillarIndex]].push(scores[questionId]);
        }
    });
    
    // Calculate averages
    const pillarAverages = {};
    Object.keys(pillars).forEach(pillar => {
        const pillarScores = pillars[pillar];
        pillarAverages[pillar] = pillarScores.length > 0 
            ? pillarScores.reduce((a, b) => a + b, 0) / pillarScores.length 
            : 0;
    });
    
    return pillarAverages;
}

// Replace basic engine with comprehensive engine when available
let recommendationEngine;
if (typeof window !== 'undefined' && window.ComprehensiveQuestionLevelEngine) {
  recommendationEngine = new window.ComprehensiveQuestionLevelEngine();
} else {
  recommendationEngine = new QuestionLevelRecommendationEngine();
}

// Make recommendation generation async to wait for database load
async function generateEnhancedRecommendations(pillarScores, questionScores, industry) {
    // Ensure comprehensive engine has loaded its database
    if (recommendationEngine && recommendationEngine.loadPromise) {
        try { await recommendationEngine.loadPromise; } catch (e) { console.error('Recommendation DB load failed:', e); }
    }

    // Use the question-level recommendation engine
    const detailedRecommendations = recommendationEngine.generateQuestionLevelRecommendations(
        questionScores,
        { industry }
    );
    
    // Update the UI with detailed recommendations
    displayDetailedRecommendations(detailedRecommendations);
    
    return detailedRecommendations;
}

function displayDetailedRecommendations(recommendations) {
    // Display overall risk score with enhanced summary
    const riskScoreElement = document.getElementById('overall-risk-score');
    if (riskScoreElement) {
        const riskLevel = recommendations.overallRiskScore > 70 ? 'high' : 
                         recommendations.overallRiskScore > 40 ? 'medium' : 'low';
        const riskDescription = recommendations.overallRiskScore > 70 ? 'High Risk - Immediate Action Required' :
                               recommendations.overallRiskScore > 40 ? 'Medium Risk - Systematic Improvement Needed' :
                               'Low Risk - Optimization Opportunities';

        const rr = recommendations.resourceRequirements || { immediate:{budget:0,actions:0,personnel:new Set()}, shortTerm:{budget:0,actions:0,personnel:new Set()}, mediumTerm:{budget:0,actions:0,personnel:new Set()}, longTerm:{budget:0,actions:0,personnel:new Set()} };
        const totalBudget = (rr.immediate.budget + rr.shortTerm.budget + rr.mediumTerm.budget + rr.longTerm.budget);

        const counts = {
            critical: (recommendations.criticalActions || []).length,
            high: (recommendations.highPriorityActions || []).length,
            medium: (recommendations.mediumPriorityActions || []).length,
            low: (recommendations.optimizationActions || []).length
        };
        const totalActions = counts.critical + counts.high + counts.medium + counts.low;
        
        riskScoreElement.innerHTML = `
            <div class="risk-meter">
                <h3>Overall Risk Score</h3>
                <div class="risk-score-circle ${riskLevel}">
                    <span class="score">${recommendations.overallRiskScore}</span>
                    <span class="max">/100</span>
                </div>
                <div class="risk-description">${riskDescription}</div>
                <div class="compliance-gaps"><strong>Compliance Gaps:</strong> ${(recommendations.complianceGaps || []).length} critical issues</div>
                <div class="action-counts">
                    <span><strong>Total Actions:</strong> ${totalActions}</span><br>
                    <span class="badge critical">Critical: ${counts.critical}</span>
                    <span class="badge high">High: ${counts.high}</span>
                    <span class="badge medium">Medium: ${counts.medium}</span>
                    <span class="badge optional">Optional: ${counts.low}</span>
                </div>
            </div>
        `;
    }

    // Display critical and high priority actions
    const criticalContainer = document.getElementById('top-priorities');
    if (criticalContainer) {
        let priorityContent = '<h2>Priority Action Plan</h2><p style="font-size: 12px; color: var(--color-slate-500); margin-top: 6px;">To access the full set of Medium and Optional recommendations, please reach out to a ZOKFORCE consultant.</p>';
        
        // Group critical actions by pillar with collapsible sections
        const criticalActions = recommendations.criticalActions || [];
        if (criticalActions.length > 0) {
            // Build groups
            const groups = {};
            criticalActions.forEach(rec => {
                const pillar = rec.pillar || 'General';
                if (!groups[pillar]) groups[pillar] = [];
                groups[pillar].push(rec);
            });

            priorityContent += `
                <div class="priority-section critical-section">
                    <h3>🚨 Critical Actions Required (Immediate)</h3>
                    <div class="priority-summary">
                        <span class="risk-high">HIGH RISK</span>
                        <span class="action-count">${criticalActions.length} critical issues</span>
                    </div>
                    <div class="recommendations-list">
            `;

            Object.keys(groups).forEach(pillarName => {
                const pillarRecs = groups[pillarName];
                priorityContent += `
                    <details class="pillar-group" open>
                        <summary>
                            <strong>${pillarName}</strong>
                            <span class="count-badge">${pillarRecs.length} items</span>
                        </summary>
                        <div class="pillar-recommendations">
                            ${pillarRecs.slice(0, 10).map(rec => {
                                const actionsList = Array.isArray(rec.actions) ? rec.actions : [];
                                const expectedOutcome = rec.expectedOutcome || rec.expected_outcome || '';
                                const successMetrics = rec.successMetrics || rec.success_metrics || '';
                                const resourcesNeeded = rec.resourcesNeeded || rec.resources_needed || '';
                                return `
                                    <div class="recommendation-item critical">
                                        <div class="rec-header">
                                            <h4>${rec.questionId}: ${rec.questionTitle || rec.question || 'AI Maturity Question'}</h4>
                                            <span class="priority-badge critical">CRITICAL</span>
                                            <span class="risk-score">Risk: ${Math.round(rec.riskContribution)}%</span>
                                        </div>
                                        <div class="current-state"><strong>Current Score:</strong> ${rec.currentScore}/4</div>
                                        <div class="actions-list">
                                            <strong>Required Actions:</strong>
                                            <ul>
                                                ${actionsList.map(action => `<li>${action}</li>`).join('')}
                                            </ul>
                                        </div>
                                        ${expectedOutcome ? `<div class="expected-outcome"><strong>Expected Outcome:</strong> ${expectedOutcome}</div>` : ''}
                                        ${successMetrics ? `<div class="success-metrics"><strong>Success Metrics:</strong> ${successMetrics}</div>` : ''}
                                        <div class="rec-footer">
                                            <span class="urgency">${rec.urgency}</span>
                                            ${resourcesNeeded ? `<span class="resources">${resourcesNeeded}</span>` : ''}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </details>
                `;
            });

            priorityContent += '</div></div>';
        }
        
        // High priority actions (kept simple)
        const highActions = recommendations.highPriorityActions || [];
        if (highActions.length > 0) {
            priorityContent += `
                <div class="priority-section high-section">
                    <h3>⚠️ High Priority Actions (30-90 days)</h3>
                    <div class="priority-summary">
                        <span class="risk-medium-high">MEDIUM-HIGH RISK</span>
                        <span class="action-count">${highActions.length} high priority issues</span>
                    </div>
                    <div class="recommendations-list">
                        ${highActions.slice(0, 5).map(rec => {
                            const actionsList = Array.isArray(rec.actions) ? rec.actions.slice(0, 3) : [];
                            const expectedOutcome = rec.expectedOutcome || rec.expected_outcome || '';
                            const successMetrics = rec.successMetrics || rec.success_metrics || '';
                            const resourcesNeeded = rec.resourcesNeeded || rec.resources_needed || '';
                            return `
                                <div class="recommendation-item high">
                                    <div class="rec-header">
                                        <h4>${rec.questionId}: ${rec.questionTitle || rec.question || 'AI Maturity Question'}</h4>
                                        <span class="priority-badge high">HIGH</span>
                                    </div>
                                    <div class="actions-list">
                                        <ul>
                                            ${actionsList.map(action => `<li>${action}</li>`).join('')}
                                        </ul>
                                    </div>
                                    ${expectedOutcome ? `<div class="expected-outcome"><strong>Expected Outcome:</strong> ${expectedOutcome}</div>` : ''}
                                    ${successMetrics ? `<div class="success-metrics"><strong>Success Metrics:</strong> ${successMetrics}</div>` : ''}
                                    <div class="rec-footer">
                                        <span class="urgency">${rec.urgency}</span>
                                        ${resourcesNeeded ? `<span class="resources">${resourcesNeeded}</span>` : ''}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }
        

        criticalContainer.innerHTML = priorityContent;
    }
}

function getMaturityLevel(score) {
    if (score >= 3.5) return 'Industry Leadership';
    if (score >= 3.0) return 'Mature Implementation';
    if (score >= 2.0) return 'Developing Capabilities';
    return 'Foundation Required';
}

// Chart creation functions
function createRadarChart(pillarScores) {
    const ctx = document.getElementById('radarChart')?.getContext('2d');
    if (!ctx) return;
    
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
                    text: 'AI Maturity Radar'
                }
            }
        }
    });
    
    document.getElementById('radarChart').chart = chart;
}

function createBarChart(pillarScores) {
    const ctx = document.getElementById('barChart')?.getContext('2d');
    if (!ctx) return;
    
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