let assessmentItems = [];
let currentIndex = 0;
let scores = {};

async function loadAssessment() {
  try {
    const res = await fetch('assessment.json');
    assessmentItems = await res.json();
    console.log('Assessment data loaded:', assessmentItems.length, 'items');
    
    // Wait for DOM to be ready before adding event listener
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
  console.log('assessmentItems length:', assessmentItems ? assessmentItems.length : 'undefined');
  
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
      <div class="question-id">${item.id}</div>
      <h3 class="question-text">${item.question}</h3>
    </div>
    <p class="example"><strong>Example:</strong> ${item.example}</p>
    <p class="regulatory"><em>${item.regulatoryAlignment}</em></p>
    <div class="options">
      ${item.choices.map(c => `
        <label class="option">
          <input type="radio" name="answer" value="${c.level}" />
          <span class="option-text">${c.level} – ${c.text}</span>
        </label>
      `).join('')}
    </div>
  `;
  
  // Restore previous answer if it exists
  const previousAnswer = scores[item.id];
  if (previousAnswer) {
    const radioButton = container.querySelector(`input[value="${previousAnswer}"]`);
    if (radioButton) {
      radioButton.checked = true;
      radioButton.closest('.option').classList.add('selected');
    }
  }
  
  // Update back button visibility
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.style.display = currentIndex > 0 ? 'block' : 'none';
  }
  
  updateProgress();
}

function updateProgress() {
  console.log('updateProgress called - currentIndex:', currentIndex, 'assessmentItems.length:', assessmentItems.length);
  
  const bar = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  
  console.log('Elements found - bar:', !!bar, 'progressText:', !!progressText);
  
  if (!bar || !progressText) {
    console.error('Progress elements not found - bar:', !!bar, 'progressText:', !!progressText);
    return;
  }
  
  // Calculate progress based on answered questions (stored in scores object)
  const answeredQuestions = Object.keys(scores).length;
  const totalQuestions = assessmentItems.length;
  const currentQuestionNumber = currentIndex + 1;
  const percentage = Math.round((answeredQuestions / totalQuestions) * 100);
  
  console.log('Calculated values - answeredQuestions:', answeredQuestions, 'totalQuestions:', totalQuestions, 'percentage:', percentage);
  
  // Update progress bar
  bar.style.width = `${percentage}%`;
  
  // Update progress text
  const questionText = `Question ${currentQuestionNumber} of ${totalQuestions} (${percentage}%)`;
  console.log('Setting progressText to:', questionText);
  progressText.textContent = questionText;
  
  // Force a visual update
  progressText.style.display = 'inline-block';
  bar.style.display = 'block';
}

function nextQuestion() {
  const selected = document.querySelector('input[name="answer"]:checked');
  if (!selected) return alert('Please select an answer.');
  
  // Check if we have valid assessment data and current index is valid
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
  
  // Save the current answer
  scores[currentItem.id] = parseInt(selected.value);
  currentIndex++;
  
  // Check if there are more questions or if we should calculate results
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
  // Hide the assessment section
  document.getElementById('assessment').classList.remove('active');
  
  // Show the existing dashboard section instead of creating a new one
  const dashboard = document.getElementById('dashboard');
  dashboard.classList.remove('hidden');
  dashboard.classList.add('active');
  
  // Calculate pillar scores and overall metrics
  const pillarScores = calculatePillarScores();
  const overallScore = Object.values(pillarScores).reduce((a, b) => a + b, 0) / Object.keys(pillarScores).length;
  const maturityLevel = getMaturityLevel(overallScore);
  
  // Update company name and date - also store in localStorage for PDF
  const companyName = document.getElementById('companyName')?.value || 'Your Organization';
  const contactName = document.getElementById('contactName')?.value || 'Not specified';
  const contactEmail = document.getElementById('contactEmail')?.value || 'Not specified';
  const industry = document.getElementById('industry')?.value || 'Not specified';
  const assessmentDate = new Date().toLocaleDateString();
  
  // Store in localStorage for PDF generation
  localStorage.setItem('companyName', companyName);
  localStorage.setItem('contactName', contactName);
  localStorage.setItem('contactEmail', contactEmail);
  localStorage.setItem('industry', industry);
  localStorage.setItem('assessmentDate', assessmentDate);
  
  document.getElementById('company-name-display').textContent = companyName;
  document.getElementById('contact-name-display').textContent = contactName;
  document.getElementById('company-email-display').textContent = contactEmail;
  document.getElementById('company-industry-display').textContent = industry;
  document.getElementById('assessment-date').textContent = assessmentDate;
  document.getElementById('overall-score').textContent = overallScore.toFixed(1);
  document.getElementById('maturity-level').textContent = maturityLevel;
  
  // Wait for DOM to be ready before creating charts
  setTimeout(() => {
    // Destroy existing charts if they exist
    const radarCanvas = document.getElementById('radarChart');
    const barCanvas = document.getElementById('barChart');
    
    if (radarCanvas && radarCanvas.chart) {
      radarCanvas.chart.destroy();
    }
    if (barCanvas && barCanvas.chart) {
      barCanvas.chart.destroy();
    }
    
    // Create charts
    createRadarChart(pillarScores);
    createBarChart(pillarScores);
  }, 100);
  
  // Generate pillar cards and recommendations
  generatePillarCards(pillarScores);
  generateRecommendations(pillarScores);
  
  // Update restart button functionality
  document.getElementById('restart-assessment').onclick = () => location.reload();
}

function calculatePillarScores() {
  const pillars = {
    'Transparency & Explainability': [],
    'Fairness & Bias Mitigation': [],
    'Privacy & Data Protection': [],
    'Accountability & Governance': [],
    'Human Oversight & Control': [],
    'Robustness & Safety': []
  };
  
  // Group scores by pillar (assuming 12 questions per pillar)
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
  
  // Calculate average score for each pillar
  const pillarAverages = {};
  Object.keys(pillars).forEach(pillar => {
    const pillarScores = pillars[pillar];
    pillarAverages[pillar] = pillarScores.length > 0 
      ? pillarScores.reduce((a, b) => a + b, 0) / pillarScores.length 
      : 0;
  });
  
  return pillarAverages;
}

function getMaturityLevel(score) {
  if (score >= 3.5) return 'Optimized';
  if (score >= 2.5) return 'Managed';
  if (score >= 1.5) return 'Developing';
  return 'Ad Hoc';
}

function createRadarChart(pillarScores) {
  const ctx = document.getElementById('radarChart').getContext('2d');
  
  // Store chart instance for potential cleanup
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
  
  // Store chart instance on canvas for cleanup
  document.getElementById('radarChart').chart = chart;
}

function createBarChart(pillarScores) {
  const ctx = document.getElementById('barChart').getContext('2d');
  
  // Store chart instance for potential cleanup
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
  
  // Store chart instance on canvas for cleanup
  document.getElementById('barChart').chart = chart;
}

function generatePillarCards(pillarScores) {
  const container = document.getElementById('pillar-cards');
  container.innerHTML = '';
  
  Object.entries(pillarScores).forEach(([pillar, score]) => {
    const card = document.createElement('div');
    card.className = 'pillar-card';
    card.innerHTML = `
      <h4>${pillar}</h4>
      <div class="pillar-score">
        <span class="score-number">${score.toFixed(1)}</span>
        <span class="score-max">/4.0</span>
      </div>
      <div class="maturity-indicator ${getMaturityLevel(score).toLowerCase().replace(' ', '-')}">
        ${getMaturityLevel(score)}
      </div>
      <div class="score-bar">
        <div class="score-fill" style="width: ${(score / 4) * 100}%"></div>
      </div>
    `;
    container.appendChild(card);
  });
}

function generateRecommendations(pillarScores) {
  const container = document.getElementById('recommendations-list');
  container.innerHTML = '';
  
  // Sort pillars by score (lowest first) to prioritize recommendations
  const sortedPillars = Object.entries(pillarScores).sort((a, b) => a[1] - b[1]);
  
  const recommendations = {
    'Transparency & Explainability': 'Implement explainable AI techniques and documentation standards for AI decision-making processes.',
    'Fairness & Bias Mitigation': 'Establish bias testing protocols and diverse dataset requirements for AI model development.',
    'Privacy & Data Protection': 'Strengthen data governance frameworks and implement privacy-by-design principles.',
    'Accountability & Governance': 'Create clear AI governance structures with defined roles and responsibilities.',
    'Human Oversight & Control': 'Develop human-in-the-loop processes and meaningful human control mechanisms.',
    'Robustness & Safety': 'Implement comprehensive testing and monitoring systems for AI system reliability.'
  };
  
  // Show top 3 recommendations for lowest scoring pillars
  sortedPillars.slice(0, 3).forEach(([pillar, score], index) => {
    const recommendation = document.createElement('div');
    recommendation.className = 'recommendation-item';
    recommendation.innerHTML = `
      <div class="recommendation-priority">Priority ${index + 1}</div>
      <h4>${pillar}</h4>
      <p>${recommendations[pillar]}</p>
      <div class="current-score">Current Score: ${score.toFixed(1)}/4.0</div>
    `;
    container.appendChild(recommendation);
  });
}

// Event listeners
document.getElementById('next-btn').addEventListener('click', nextQuestion);
document.getElementById('back-btn').addEventListener('click', previousQuestion);

// Enhanced PDF Download functionality with visual content
async function generatePDFReport() {
  console.log('Starting enhanced PDF generation...');
  
  // Check if assessment data exists
  if (!scores || Object.keys(scores).length === 0) {
    console.log('No assessment data found');
    alert('Please complete the assessment first before downloading the PDF report.');
    return;
  }
  
  // Get company information from localStorage
  const companyName = localStorage.getItem('companyName') || 'Company Name';
  const contactName = localStorage.getItem('contactName') || 'Not specified';
  const industry = localStorage.getItem('industry') || 'Not specified';
  const contactEmail = localStorage.getItem('contactEmail') || 'Not specified';
  const assessmentDate = localStorage.getItem('assessmentDate') || new Date().toLocaleDateString();
  
  // Calculate pillar scores
  const pillarScores = calculatePillarScores();
  console.log('Pillar scores calculated:', pillarScores);
  // Initialize jsPDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'mm', 'a4');
  
  // ZOKFORCE Brand Colors
  const colors = {
    primaryBlue: [30, 58, 138], // #1e3a8a
    lightBlue: [59, 130, 246], // #3b82f6
    darkGray: [31, 33, 33], // #1f2121
    lightGray: [119, 124, 124], // #777c7c
    success: [16, 185, 129], // #10b981
    warning: [245, 158, 11], // #f59e0b
    danger: [239, 68, 68] // #ef4444
  };
  
  try {
    // =================== PAGE 1: COVER PAGE ===================
    drawHeader(doc, colors, true); // Full header for cover
    
    // Main Title
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.primaryBlue);
    doc.text('AI ASSESSMENT', 105, 70, { align: 'center' });
    doc.text('COMPREHENSIVE REPORT', 105, 85, { align: 'center' });
    
    // Company Info Box
    doc.setFillColor(247, 250, 252); // Light blue background
    doc.rect(20, 100, 170, 60, 'F');
    doc.setDrawColor(...colors.lightBlue);
    doc.setLineWidth(0.5);
    doc.rect(20, 100, 170, 60);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.darkGray);
    doc.text('COMPANY INFORMATION', 25, 115);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Company Name: ${companyName}`, 25, 130);
    doc.text(`Contact Person: ${contactName}`, 25, 140);
    doc.text(`Industry: ${industry}`, 25, 150);
    doc.text(`Assessment Date: ${assessmentDate}`, 120, 130);
    doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 120, 140);
    
    // Overall Score Section
    const overallScore = Object.values(pillarScores).reduce((a, b) => a + b, 0) / Object.keys(pillarScores).length;
    const maturityLevel = getMaturityLevel(overallScore);
    const scoreColor = getScoreColor(overallScore, colors);
    
    // Score Circle
    doc.setFillColor(...scoreColor);
    doc.circle(105, 200, 25, 'F');
    doc.setFillColor(255, 255, 255);
    doc.circle(105, 200, 20, 'F');
    
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...scoreColor);
    doc.text(overallScore.toFixed(1), 105, 207, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(...colors.darkGray);
    doc.text('OVERALL SCORE', 105, 240, { align: 'center' });
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`${maturityLevel.toUpperCase()}`, 105, 252, { align: 'center' });
    
    // =================== PAGE 2: EXECUTIVE SUMMARY ===================
    doc.addPage();
    drawHeader(doc, colors);
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.primaryBlue);
    doc.text('EXECUTIVE SUMMARY', 20, 40);
    
    // Maturity Level Box
    const levelColor = getScoreColor(overallScore, colors);
    doc.setFillColor(...levelColor);
    doc.rect(20, 50, 170, 8, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(`MATURITY LEVEL: ${maturityLevel.toUpperCase()} (${overallScore.toFixed(1)}/4.0)`, 22, 56);
    
    // Key Findings
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.darkGray);
    doc.text('KEY FINDINGS', 20, 75);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const findings = getKeyFindings(pillarScores);
    let yPos = 85;
    findings.forEach(finding => {
      doc.text(`• ${finding}`, 25, yPos);
      yPos += 8;
    });
    
    // Visual Charts
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PILLAR PERFORMANCE OVERVIEW', 20, yPos);
    
    // Capture and add radar chart
    const radarCanvas = document.getElementById('radarChart');
    if (radarCanvas) {
      const radarImgData = radarCanvas.toDataURL('image/png', 1.0);
      doc.addImage(radarImgData, 'PNG', 20, yPos + 10, 80, 60);
    }
    
    // Capture and add bar chart
    const barCanvas = document.getElementById('barChart');
    if (barCanvas) {
      const barImgData = barCanvas.toDataURL('image/png', 1.0);
      doc.addImage(barImgData, 'PNG', 110, yPos + 10, 80, 60);
    }
    
    // =================== PAGE 3: DETAILED PILLAR ANALYSIS ===================
    doc.addPage();
    drawHeader(doc, colors);
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.primaryBlue);
    doc.text('DETAILED PILLAR ANALYSIS', 20, 40);
    
    yPos = 55;
    Object.entries(pillarScores).forEach(([pillar, score]) => {
      if (yPos > 240) {
        doc.addPage();
        drawHeader(doc, colors);
        yPos = 40;
      }
      
      // Pillar header with score bar
      doc.setFillColor(...colors.lightGray);
      doc.rect(20, yPos - 5, 170, 12, 'F');
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(pillar, 22, yPos + 2);
      
      // Score bar
      const barWidth = (score / 4) * 60;
      const barColor = getScoreColor(score, colors);
      doc.setFillColor(...barColor);
      doc.rect(130, yPos - 3, barWidth, 8, 'F');
      doc.setDrawColor(...colors.lightGray);
      doc.rect(130, yPos - 3, 60, 8);
      
      // Score text - positioned within the bar area
      doc.setTextColor(255, 255, 255); // White text for better visibility on colored bars
      doc.setFont('helvetica', 'bold');
      const scoreText = `${score.toFixed(1)}/4.0`;
      const textWidth = doc.getTextWidth(scoreText);
      const textX = Math.max(135, 130 + barWidth - textWidth - 2); // Position within bar, minimum 5px from left edge
      doc.text(scoreText, textX, yPos + 2);
      
      yPos += 18;
      
      // Pillar description and recommendations
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.darkGray);
      
      const description = getPillarDescription(pillar);
      const descLines = doc.splitTextToSize(description, 170);
      doc.text(descLines, 25, yPos);
      yPos += descLines.length * 4 + 8;
      
      const recommendation = getPillarRecommendation(pillar, score);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(...colors.lightBlue);
      const recLines = doc.splitTextToSize(`Recommendation: ${recommendation}`, 170);
      doc.text(recLines, 25, yPos);
      yPos += recLines.length * 4 + 12;
    });
    
    // =================== PAGE 4: ACTION PLAN ===================
    doc.addPage();
    drawHeader(doc, colors);
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.primaryBlue);
    doc.text('PRIORITY ACTION PLAN', 20, 40);
    
    // Sort pillars by score for priority
    const sortedPillars = Object.entries(pillarScores).sort((a, b) => a[1] - b[1]);
    
    yPos = 55;
    sortedPillars.slice(0, 3).forEach(([pillar, score], index) => {
      // Priority header
      doc.setFillColor(...colors.danger);
      if (index === 1) doc.setFillColor(...colors.warning);
      if (index === 2) doc.setFillColor(...colors.lightBlue);
      
      doc.rect(20, yPos, 170, 10, 'F');
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(`PRIORITY ${index + 1}: ${pillar.toUpperCase()}`, 22, yPos + 7);
      
      yPos += 15;
      
      // Current state and target
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.darkGray);
      doc.text(`Current Score: ${score.toFixed(1)}/4.0 | Target: 3.5/4.0`, 25, yPos);
      
      yPos += 10;
      
      // Action items
      const actions = getActionItems(pillar);
      actions.forEach((action, i) => {
        doc.text(`${i + 1}. ${action}`, 25, yPos);
        yPos += 6;
      });
      
      yPos += 8;
    });
    
    // Footer with ZOKFORCE contact
    drawFooter(doc, colors);
    
    // Save the PDF
    const fileName = `ZOKFORCE_AI_Assessment_Report_${companyName.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    console.log('Professional PDF generated successfully!');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('There was an error generating the PDF. Please try again.');
  }
}

// Helper Functions
function drawHeader(doc, colors, isFullHeader = false) {
  // Header background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, isFullHeader ? 35 : 25, 'F');
  
  // ZOKFORCE Logo (text-based)
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.lightBlue);
  doc.text('ZOKFORCE', 20, isFullHeader ? 20 : 15);
  
  if (isFullHeader) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(119, 124, 124); // light gray
    doc.text('Lead in Tech, Deliver Excellence', 20, 30);
  }
  
  // (Current date removed per request)
}

function drawFooter(doc, colors) {
  doc.setFillColor(...colors.lightGray);
  doc.rect(0, 285, 210, 12, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 255, 255);
  doc.text('ZOKFORCE AI Consulting | service@zokforce.com | www.zokforce.com', 105, 292, { align: 'center' });
}

function getScoreColor(score, colors) {
  if (score >= 3.5) return colors.success;
  if (score >= 2.5) return colors.lightBlue;
  if (score >= 1.5) return colors.warning;
  return colors.danger;
}

function getMaturityLevel(score) {
  if (score >= 3.5) return 'Industry Leadership';
  if (score >= 3.0) return 'Mature Implementation';
  if (score >= 2.0) return 'Developing Capabilities';
  return 'Foundation Required';
}

function getKeyFindings(pillarScores) {
  const findings = [];
  const avgScore = Object.values(pillarScores).reduce((a, b) => a + b, 0) / Object.keys(pillarScores).length;
  
  findings.push(`Overall AI ethics maturity score: ${avgScore.toFixed(1)}/4.0`);
  
  const highest = Object.entries(pillarScores).sort((a, b) => b[1] - a[1])[0];
  const lowest = Object.entries(pillarScores).sort((a, b) => a[1] - b[1])[0];
  
  findings.push(`Strongest pillar: ${highest[0]} (${highest[1].toFixed(1)}/4.0)`);
  findings.push(`Priority improvement area: ${lowest[0]} (${lowest[1].toFixed(1)}/4.0)`);
  
  return findings;
}

function getPillarDescription(pillar) {
  const descriptions = {
    'Transparency & Explainability': 'Measures how well AI systems provide clear, understandable explanations of their decision-making processes to users and stakeholders.',
    'Fairness & Bias Mitigation': 'Evaluates the organization\'s ability to detect, prevent, and mitigate algorithmic bias across different demographic groups.',
    'Privacy & Data Protection': 'Assesses data privacy controls, user consent management, and compliance with data protection regulations.',
    'Accountability & Governance': 'Reviews governance structures, role definitions, and accountability measures for AI systems.',
    'Human Oversight & Control': 'Examines human-in-the-loop processes and meaningful human control over AI decision-making.',
    'Robustness & Safety': 'Evaluates system reliability, safety testing protocols, and failure prevention measures.'
  };
  return descriptions[pillar] || 'AI ethics assessment pillar evaluation.';
}
// set pillar recommendation base on score
// if score is below 2, recommend immediate action
// if score is above 2, recommend improvement 
function getPillarRecommendation(pillar, score) {
  const recommendations = {
    'Transparency & Explainability': score < 2 ? 'Implement explainable AI tools and documentation standards immediately.' : 'Enhance model interpretability measures and stakeholder communication.',
    'Fairness & Bias Mitigation': score < 2 ? 'Establish bias detection protocols and fairness metrics across all AI systems.' : 'Expand intersectional bias testing and fairness optimization.',
    'Privacy & Data Protection': score < 2 ? 'Implement comprehensive data protection measures and privacy impact assessments.' : 'Enhance privacy-preserving techniques and user rights management.',
    'Accountability & Governance': score < 2 ? 'Establish formal AI governance structure and clear role definitions.' : 'Strengthen executive oversight and external audit processes.',
    'Human Oversight & Control': score < 2 ? 'Implement human-in-the-loop processes for high-risk decisions.' : 'Enhance human agency preservation and control mechanisms.',
    'Robustness & Safety': score < 2 ? 'Develop comprehensive testing and validation procedures.' : 'Implement advanced stress testing and continuous monitoring.'
  };
  return recommendations[pillar] || 'Continue improving AI ethics practices.';
}

function getActionItems(pillar) {
  const actions = {
    'Transparency & Explainability': [
      'Implement SHAP or LIME explainability tools',
      'Create user-friendly AI decision documentation',
      'Establish model interpretability metrics',
      'Develop stakeholder communication protocols'
    ],
    'Fairness & Bias Mitigation': [
      'Deploy automated bias detection systems',
      'Conduct demographic parity assessments',
      'Implement fairness constraints in model training',
      'Establish intersectional bias testing protocols'
    ],
    'Privacy & Data Protection': [
      'Conduct Privacy Impact Assessments (PIAs)',
      'Implement data minimization practices',
      'Deploy encryption for data at rest and in transit',
      'Establish user consent management systems'
    ],
    'Accountability & Governance': [
      'Form AI Ethics Board with clear charter',
      'Define RACI matrix for AI responsibilities',
      'Implement AI-specific incident response protocols',
      'Establish executive oversight dashboards'
    ],
    'Human Oversight & Control': [
      'Implement human-in-the-loop workflows',
      'Design manual override capabilities',
      'Establish escalation procedures to human experts',
      'Create user control mechanisms for AI behavior'
    ],
    'Robustness & Safety': [
      'Implement comprehensive model validation procedures',
      'Deploy continuous performance monitoring',
      'Conduct stress testing and edge case analysis',
      'Establish disaster recovery and backup procedures'
    ]
  };
  return actions[pillar] || ['Improve AI ethics practices', 'Implement best practices', 'Regular monitoring and assessment'];
}

// Event listener
document.addEventListener('DOMContentLoaded', function() {
  // Load assessment data first
  loadAssessment();
  
  // Initialize form listener for Begin Assessment button
  addFormListener();
  
  // Initialize PDF download button
  const downloadBtn = document.getElementById('download-pdf');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', generatePDFReport);
  }
});
