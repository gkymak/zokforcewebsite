// COMPLETE QUESTION-LEVEL RECOMMENDATION ENGINE
// ZOKFORCE AI Ethics Assessment - All 72 Questions with Detailed Recommendations

class ComprehensiveQuestionLevelEngine {
    constructor() {
        this.questionRecommendations = null;
        // Expose a promise to allow UI code to await readiness
        this.loadPromise = this.loadRecommendationsDatabase();
    }

    async loadRecommendationsDatabase() {
        try {
            const response = await fetch('comprehensive_question_recommendations.json');
            this.questionRecommendations = await response.json();
            console.log(`✅ Loaded ${Object.keys(this.questionRecommendations).length} question-specific recommendations`);
        } catch (error) {
            console.error('Error loading recommendations database:', error);
            this.questionRecommendations = this.createFallbackDatabase();
        }
    }

    // Generate comprehensive recommendations based on individual question scores
    generateQuestionLevelRecommendations(questionScores, companyInfo = {}) {
        if (!this.questionRecommendations) {
            console.warn('Recommendations database not loaded yet');
            return this.generateBasicRecommendations(questionScores);
        }

        const recommendations = {
            criticalActions: [],
            highPriorityActions: [],
            mediumPriorityActions: [],
            optimizationActions: [],
            pillarSummaries: {},
            overallRiskScore: 0,
            complianceGaps: [],
            quickWins: [],
            detailedRecommendations: {},
            resourceRequirements: {
                immediate: { budget: 0, actions: 0, timeframe: "0-30 days", personnel: new Set() },
                shortTerm: { budget: 0, actions: 0, timeframe: "30-90 days", personnel: new Set() },
                mediumTerm: { budget: 0, actions: 0, timeframe: "3-6 months", personnel: new Set() },
                longTerm: { budget: 0, actions: 0, timeframe: "6-12 months", personnel: new Set() }
            }
        };

        let totalRiskScore = 0;
        let questionCount = 0;

        // Analyze each question individually
        for (const [questionId, score] of Object.entries(questionScores)) {
            if (!score || score < 1 || score > 4) continue;

            questionCount++;
            const riskContribution = (5 - score) / 4 * 100;
            totalRiskScore += riskContribution;

            // Get question-specific recommendations
            const questionData = this.questionRecommendations[questionId];
            if (!questionData) {
                console.warn(`No specific recommendations found for ${questionId}`);
                continue;
            }

            const recommendation = questionData.recommendations[score];
            if (!recommendation) {
                console.warn(`No recommendation found for ${questionId} level ${score}`);
                continue;
            }

            // Create detailed recommendation object
            const detailedRecommendation = {
                questionId,
                pillar: questionData.pillar,
                questionTitle: questionData.question_title,
                questionText: questionData.question_text,
                example: questionData.example,
                currentScore: score,
                currentLevel: questionData.level_descriptions[score],
                targetScore: Math.min(score + 1, 4),
                targetLevel: questionData.level_descriptions[Math.min(score + 1, 4)],
                priority: recommendation.priority,
                urgency: recommendation.urgency,
                riskLevel: recommendation.risk_level,
                actions: recommendation.actions,
                expectedOutcome: recommendation.expected_outcome,
                resourcesNeeded: recommendation.resources_needed,
                successMetrics: recommendation.success_metrics,
                regulatoryAlignment: questionData.regulatory_alignment,
                riskContribution: riskContribution,
                improvementPotential: this.calculateImprovementPotential(score, questionData.question_title)
            };

            // Store detailed recommendation
            recommendations.detailedRecommendations[questionId] = detailedRecommendation;

            // Categorize by priority
            this.categorizeRecommendation(detailedRecommendation, recommendations);

            // Track compliance gaps (scores of 1-2)
            if (score <= 2) {
                recommendations.complianceGaps.push({
                    questionId,
                    questionTitle: questionData.question_title,
                    pillar: questionData.pillar,
                    score,
                    riskLevel: recommendation.risk_level,
                    regulatoryAlignment: questionData.regulatory_alignment,
                    urgency: recommendation.urgency
                });
            }

            // Identify quick wins (score 2->3 with manageable actions)
            if (score === 2 && recommendation.actions.length <= 4) {
                recommendations.quickWins.push(detailedRecommendation);
            }

            // Update resource requirements
            this.updateResourceRequirements(recommendation, recommendations);
        }

        // Calculate overall risk score
        recommendations.overallRiskScore = questionCount > 0 ? Math.round(totalRiskScore / questionCount) : 0;

        // Sort recommendations by risk contribution and impact
        this.sortRecommendationsByPriority(recommendations);

        // Generate pillar summaries
        recommendations.pillarSummaries = this.generatePillarSummaries(questionScores, recommendations.detailedRecommendations);

        return recommendations;
    }

    categorizeRecommendation(recommendation, recommendations) {
        switch (recommendation.priority) {
            case "CRITICAL":
                recommendations.criticalActions.push(recommendation);
                break;
            case "HIGH":
                recommendations.highPriorityActions.push(recommendation);
                break;
            case "MEDIUM":
                recommendations.mediumPriorityActions.push(recommendation);
                break;
            case "LOW":
                recommendations.optimizationActions.push(recommendation);
                break;
        }
    }

    updateResourceRequirements(recommendation, recommendations) {
        const budgetMap = {
            "CRITICAL": 15000,
            "HIGH": 8000,
            "MEDIUM": 5000,
            "LOW": 3000
        };

        const timeframeMap = {
            "CRITICAL": "immediate",
            "HIGH": "shortTerm", 
            "MEDIUM": "mediumTerm",
            "LOW": "longTerm"
        };

        const timeframe = timeframeMap[recommendation.priority];
        if (timeframe && recommendations.resourceRequirements[timeframe]) {
            recommendations.resourceRequirements[timeframe].budget += budgetMap[recommendation.priority];
            recommendations.resourceRequirements[timeframe].actions++;

            // Extract personnel needs from resources_needed text
            const personnelNeeds = this.extractPersonnelNeeds(recommendation.resources_needed);
            personnelNeeds.forEach(person => {
                recommendations.resourceRequirements[timeframe].personnel.add(person);
            });
        }
    }

    extractPersonnelNeeds(resourceText) {
        const personnel = [];
        const commonRoles = [
            'Technical writer', 'Data scientist', 'Security engineer', 'Compliance officer',
            'Legal counsel', 'UX designer', 'Privacy officer', 'Audit specialist',
            'DevOps engineer', 'ML engineer', 'Business analyst', 'Project manager'
        ];

        commonRoles.forEach(role => {
            if (resourceText.toLowerCase().includes(role.toLowerCase())) {
                personnel.push(role);
            }
        });

        return personnel;
    }

    sortRecommendationsByPriority(recommendations) {
        const sortByRiskAndImpact = (a, b) => {
            // Primary sort: by risk contribution (higher first)
            if (b.riskContribution !== a.riskContribution) {
                return b.riskContribution - a.riskContribution;
            }
            // Secondary sort: by improvement potential (higher first)
            return b.improvementPotential - a.improvementPotential;
        };

        recommendations.criticalActions.sort(sortByRiskAndImpact);
        recommendations.highPriorityActions.sort(sortByRiskAndImpact);
        recommendations.mediumPriorityActions.sort(sortByRiskAndImpact);
        recommendations.optimizationActions.sort(sortByRiskAndImpact);
        recommendations.quickWins.sort(sortByRiskAndImpact);
    }

    calculateImprovementPotential(currentScore, questionTitle) {
        // Calculate improvement potential based on current score and question importance
        const baseImpact = (5 - currentScore) * 25; // 0-100 scale
        
        // Weight by question importance (compliance/regulatory questions get higher weight)
        let importanceMultiplier = 1.0;
        
        const highImportanceKeywords = ['audit', 'compliance', 'regulatory', 'privacy', 'security', 'governance'];
        const mediumImportanceKeywords = ['documentation', 'monitoring', 'oversight', 'control'];
        
        const titleLower = questionTitle.toLowerCase();
        
        if (highImportanceKeywords.some(keyword => titleLower.includes(keyword))) {
            importanceMultiplier = 1.3;
        } else if (mediumImportanceKeywords.some(keyword => titleLower.includes(keyword))) {
            importanceMultiplier = 1.1;
        }
        
        return Math.min(100, Math.round(baseImpact * importanceMultiplier));
    }

    generatePillarSummaries(questionScores, detailedRecommendations) {
        const pillarGroups = {
            "Transparency & Explainability": { range: [1, 12], scores: [], recommendations: [] },
            "Fairness & Non-Discrimination": { range: [13, 24], scores: [], recommendations: [] },
            "Privacy & Security": { range: [25, 36], scores: [], recommendations: [] },
            "Accountability & Governance": { range: [37, 48], scores: [], recommendations: [] },
            "Reliability & Safety": { range: [49, 60], scores: [], recommendations: [] },
            "Human Agency & Oversight": { range: [61, 72], scores: [], recommendations: [] }
        };

        const summaries = {};

        for (const [pillarName, pillarData] of Object.entries(pillarGroups)) {
            let criticalCount = 0;
            let highCount = 0;
            let totalRisk = 0;

            for (let i = pillarData.range[0]; i <= pillarData.range[1]; i++) {
                const questionId = `AI-${String(i).padStart(3, '0')}`;
                const score = questionScores[questionId];
                const recommendation = detailedRecommendations[questionId];

                if (score) {
                    pillarData.scores.push(score);
                    if (recommendation) {
                        pillarData.recommendations.push(recommendation);
                        totalRisk += recommendation.riskContribution;
                        
                        if (score === 1) criticalCount++;
                        if (score === 2) highCount++;
                    }
                }
            }

            const averageScore = pillarData.scores.length > 0
                ? pillarData.scores.reduce((a, b) => a + b, 0) / pillarData.scores.length
                : 0;

            const averageRisk = pillarData.recommendations.length > 0
                ? totalRisk / pillarData.recommendations.length
                : 0;

            summaries[pillarName] = {
                averageScore: Math.round(averageScore * 10) / 10,
                criticalIssues: criticalCount,
                highPriorityIssues: highCount,
                totalQuestions: pillarData.range[1] - pillarData.range[0] + 1,
                riskLevel: this.calculatePillarRiskLevel(averageScore, criticalCount),
                maturityLevel: this.getMaturityLevel(averageScore),
                averageRisk: Math.round(averageRisk),
                topRecommendations: pillarData.recommendations
                    .sort((a, b) => b.riskContribution - a.riskContribution)
                    .slice(0, 3)
                    .map(rec => ({
                        questionId: rec.questionId,
                        questionTitle: rec.questionTitle,
                        priority: rec.priority,
                        riskContribution: rec.riskContribution
                    }))
            };
        }

        return summaries;
    }

    calculatePillarRiskLevel(averageScore, criticalCount) {
        if (criticalCount > 2 || averageScore < 1.5) return "VERY HIGH";
        if (criticalCount > 0 || averageScore < 2.0) return "HIGH";
        if (averageScore < 2.5) return "MEDIUM-HIGH";
        if (averageScore < 3.0) return "MEDIUM";
        if (averageScore < 3.5) return "MEDIUM-LOW";
        return "LOW";
    }

    getMaturityLevel(score) {
        if (score >= 3.5) return "Industry Leadership";
        if (score >= 3.0) return "Mature Implementation";
        if (score >= 2.0) return "Developing Capabilities";
        return "Foundation Required";
    }

    // Convert Set objects to arrays for JSON serialization
    finalizeResourceRequirements(recommendations) {
        Object.keys(recommendations.resourceRequirements).forEach(timeframe => {
            const req = recommendations.resourceRequirements[timeframe];
            req.personnel = Array.from(req.personnel);
        });
        return recommendations;
    }

    // Fallback database with basic structure
    createFallbackDatabase() {
        console.log('Using fallback recommendation database');
        const fallback = {};
        
        for (let i = 1; i <= 72; i++) {
            const questionId = `AI-${String(i).padStart(3, '0')}`;
            fallback[questionId] = {
                id: questionId,
                pillar: "General",
                question_title: `AI Ethics Question ${i}`,
                recommendations: {
                    1: {
                        priority: "CRITICAL",
                        urgency: "Immediate (0-30 days)",
                        risk_level: "VERY HIGH",
                        actions: [`Immediately address ${questionId} implementation gap`],
                        expected_outcome: `Basic ${questionId} capability established`,
                        resources_needed: "Technical team, compliance review",
                        success_metrics: `${questionId} compliance achieved`
                    },
                    2: {
                        priority: "HIGH",
                        urgency: "Short-term (30-90 days)", 
                        risk_level: "MEDIUM-HIGH",
                        actions: [`Enhance ${questionId} implementation`],
                        expected_outcome: `Improved ${questionId} performance`,
                        resources_needed: "Development team, testing resources",
                        success_metrics: `${questionId} optimization completed`
                    },
                    3: {
                        priority: "MEDIUM",
                        urgency: "Medium-term (3-6 months)",
                        risk_level: "MEDIUM", 
                        actions: [`Optimize ${questionId} for advanced performance`],
                        expected_outcome: `Advanced ${questionId} capabilities`,
                        resources_needed: "Specialized expertise, advanced tools",
                        success_metrics: `${questionId} excellence achieved`
                    },
                    4: {
                        priority: "LOW",
                        urgency: "Long-term (6-12 months)",
                        risk_level: "LOW",
                        actions: [`Innovate ${questionId} for industry leadership`],
                        expected_outcome: `Industry-leading ${questionId} innovation`,
                        resources_needed: "R&D team, cutting-edge technology",
                        success_metrics: `${questionId} thought leadership established`
                    }
                }
            };
        }
        
        return fallback;
    }

    // Public method to get recommendation summary
    getRecommendationSummary(questionScores) {
        const recommendations = this.generateQuestionLevelRecommendations(questionScores);
        
        return {
            overallRiskScore: recommendations.overallRiskScore,
            totalCriticalActions: recommendations.criticalActions.length,
            totalHighPriorityActions: recommendations.highPriorityActions.length,
            totalComplianceGaps: recommendations.complianceGaps.length,
            totalQuickWins: recommendations.quickWins.length,
            estimatedBudget: {
                immediate: recommendations.resourceRequirements.immediate.budget,
                total: Object.values(recommendations.resourceRequirements).reduce((sum, req) => sum + req.budget, 0)
            },
            topPriorities: recommendations.criticalActions.slice(0, 5).map(rec => ({
                questionId: rec.questionId,
                title: rec.questionTitle,
                riskContribution: rec.riskContribution,
                priority: rec.priority
            }))
        };
    }
    // Basic generator used as fallback when DB not yet loaded
    generateBasicRecommendations(questionScores) {
        const recommendations = {
            criticalActions: [],
            highPriorityActions: [],
            mediumPriorityActions: [],
            optimizationActions: [],
            pillarSummaries: {},
            overallRiskScore: 0,
            complianceGaps: [],
            quickWins: [],
            detailedRecommendations: {},
            resourceRequirements: {
                immediate: { budget: 0, actions: 0, timeframe: "0-30 days", personnel: new Set() },
                shortTerm: { budget: 0, actions: 0, timeframe: "30-90 days", personnel: new Set() },
                mediumTerm: { budget: 0, actions: 0, timeframe: "3-6 months", personnel: new Set() },
                longTerm: { budget: 0, actions: 0, timeframe: "6-12 months", personnel: new Set() }
            }
        };

        let totalRiskScore = 0;
        let count = 0;
        for (const [questionId, score] of Object.entries(questionScores)) {
            if (!score || score < 1 || score > 4) continue;
            count++;
            const riskContribution = (5 - score) / 4 * 100;
            totalRiskScore += riskContribution;

            const fb = this.createFallbackDatabase()[questionId];
            const rec = fb.recommendations[score];
            const detailed = {
                questionId,
                pillar: fb.pillar,
                questionTitle: fb.question_title,
                currentScore: score,
                priority: rec.priority,
                urgency: rec.urgency,
                riskLevel: rec.risk_level,
                actions: rec.actions,
                expectedOutcome: rec.expected_outcome,
                resourcesNeeded: rec.resources_needed,
                successMetrics: rec.success_metrics,
                riskContribution
            };
            recommendations.detailedRecommendations[questionId] = detailed;
            this.categorizeRecommendation(detailed, recommendations);
            this.updateResourceRequirements(rec, recommendations);
        }

        recommendations.overallRiskScore = count ? Math.round(totalRiskScore / count) : 0;
        this.sortRecommendationsByPriority(recommendations);
        return recommendations;
    }
}

// Export the class for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComprehensiveQuestionLevelEngine;
}

// Global instance for browser usage
if (typeof window !== 'undefined') {
    window.ComprehensiveQuestionLevelEngine = ComprehensiveQuestionLevelEngine;
}