// Influencer Pricing Calculator JavaScript

// Data constants
const DATA = {
  platformRates: {
    "Instagram": 10,
    "TikTok": 12,
    "YouTube": 15,
    "LinkedIn": 25,
    "Facebook": 8,
    "Twitter": 8
  },
  followerTiers: {
    "Nano (1K-10K)": { min: 1000, max: 10000, label: "Nano" },
    "Micro (10K-100K)": { min: 10000, max: 100000, label: "Micro" },
    "Mid-tier (100K-500K)": { min: 100000, max: 500000, label: "Mid-tier" },
    "Macro (500K-1M)": { min: 500000, max: 1000000, label: "Macro" },
    "Mega (1M+)": { min: 1000000, max: 10000000, label: "Mega" }
  },
  contentMultipliers: {
    "Story": 0.7,
    "Static Post": 1.0,
    "Carousel": 1.1,
    "Reel": 1.2,
    "Video": 1.5,
    "Multi-Post Campaign": 2.5
  },
  engagementMultipliers: {
    "1-2%": 0.8,
    "2-4%": 1.0,
    "4-7%": 1.3,
    "7-10%": 1.5,
    "10%+": 1.8
  },
  industryMultipliers: {
    "General/Lifestyle": 1.0,
    "Graphic Design": 1.4,
    "Tech": 1.5,
    "Beauty": 1.3,
    "Fashion": 1.2,
    "Food": 1.1,
    "Travel": 1.4,
    "Fitness": 1.2
  },
  usageRights: {
    "None": 0,
    "Limited (30 days)": 0.2,
    "Extended (90 days)": 0.35,
    "Full Rights": 0.5
  },
  geographicMultipliers: {
    "US": 1.0,
    "UK": 0.85,
    "EU": 0.9,
    "Global": 1.1,
    "Emerging Markets": 0.6
  },
  timelineMultipliers: {
    "Standard (7+ days)": 1.0,
    "Rush (48 hours)": 1.3,
    "Emergency (24 hours)": 1.6
  },
  exclusivityPremiums: {
    "None": 0,
    "30 days": 0.15,
    "90 days": 0.25,
    "6 months": 0.4,
    "12 months": 0.6
  },
  benchmarkData: {
    averageCPM: {
      "Instagram": 8.5,
      "TikTok": 9.2,
      "YouTube": 12.0,
      "LinkedIn": 18.0,
      "Facebook": 7.5,
      "Twitter": 7.5
    }
  },
  campaignPresets: {
    "standard-ig-post": {
      platform: "Instagram",
      contentType: "Static Post",
      engagement: 3,
      industry: "Graphic Design",
      usageRights: "Limited (30 days)",
      followerTier: "Micro (10K-100K)"
    },
    "video-campaign": {
      platform: "YouTube",
      contentType: "Video",
      engagement: 2,
      industry: "Graphic Design",
      usageRights: "Extended (90 days)",
      followerTier: "Mid-tier (100K-500K)"
    },
    "multi-platform": {
      platform: "Instagram",
      contentType: "Multi-Post Campaign",
      engagement: 3,
      industry: "Graphic Design",
      usageRights: "Full Rights",
      followerTier: "Mid-tier (100K-500K)"
    }
  }
};

// State management
let currentCalculation = {};
let savedScenarios = [];

// DOM Elements - Initialize after DOM loads
let elements = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeElements();
  initializeEventListeners();
  initializeCollapsibleSections();
  calculatePrice();
});

function initializeElements() {
  elements = {
    preset: document.getElementById('preset'),
    followerTier: document.getElementById('followerTier'),
    exactFollowers: document.getElementById('exactFollowers'),
    platform: document.getElementById('platform'),
    contentType: document.getElementById('contentType'),
    engagement: document.getElementById('engagement'),
    engagementValue: document.getElementById('engagementValue'),
    industry: document.getElementById('industry'),
    usageRights: document.getElementsByName('usageRights'),
    deliverables: document.getElementById('deliverables'),
    geography: document.getElementById('geography'),
    timeline: document.getElementById('timeline'),
    exclusivity: document.getElementById('exclusivity'),
    complexity: document.getElementById('complexity'),
    complexityValue: document.getElementById('complexityValue'),
    premiumBrand: document.getElementById('premiumBrand'),
    // Results elements
    finalPrice: document.getElementById('finalPrice'),
    priceMin: document.getElementById('priceMin'),
    priceMax: document.getElementById('priceMax'),
    basePrice: document.getElementById('basePrice'),
    contentMult: document.getElementById('contentMult'),
    engagementMult: document.getElementById('engagementMult'),
    industryMult: document.getElementById('industryMult'),
    usageRightsPct: document.getElementById('usageRightsPct'),
    geoMult: document.getElementById('geoMult'),
    timelineMult: document.getElementById('timelineMult'),
    deliverablesCount: document.getElementById('deliverablesCount'),
    cpm: document.getElementById('cpm'),
    platformCPM: document.getElementById('platformCPM'),
    // Actions
    generateQuote: document.getElementById('generateQuote'),
    saveScenario: document.getElementById('saveScenario'),
    resetCalculator: document.getElementById('resetCalculator'),
    // Modal
    quoteModal: document.getElementById('quoteModal'),
    quoteContent: document.getElementById('quoteContent'),
    closeQuote: document.getElementById('closeQuote'),
    closeQuoteBtn: document.getElementById('closeQuoteBtn'),
    copyQuote: document.getElementById('copyQuote')
  };
}

function initializeEventListeners() {
  // Form element listeners
  if (elements.preset) elements.preset.addEventListener('change', applyPreset);
  if (elements.followerTier) elements.followerTier.addEventListener('change', calculatePrice);
  if (elements.exactFollowers) elements.exactFollowers.addEventListener('input', calculatePrice);
  if (elements.platform) elements.platform.addEventListener('change', handlePlatformChange);
  if (elements.contentType) elements.contentType.addEventListener('change', calculatePrice);
  if (elements.engagement) elements.engagement.addEventListener('input', updateEngagementValue);
  if (elements.industry) elements.industry.addEventListener('change', calculatePrice);
  if (elements.deliverables) elements.deliverables.addEventListener('input', calculatePrice);
  if (elements.geography) elements.geography.addEventListener('change', calculatePrice);
  if (elements.timeline) elements.timeline.addEventListener('change', calculatePrice);
  if (elements.exclusivity) elements.exclusivity.addEventListener('change', calculatePrice);
  if (elements.complexity) elements.complexity.addEventListener('input', updateComplexityValue);
  if (elements.premiumBrand) elements.premiumBrand.addEventListener('change', calculatePrice);

  // Usage rights radio buttons
  if (elements.usageRights) {
    Array.from(elements.usageRights).forEach(radio => {
      radio.addEventListener('change', calculatePrice);
    });
  }

  // Action buttons
  if (elements.generateQuote) elements.generateQuote.addEventListener('click', generateQuote);
  if (elements.saveScenario) elements.saveScenario.addEventListener('click', saveScenario);
  if (elements.resetCalculator) elements.resetCalculator.addEventListener('click', resetCalculator);

  // Modal handlers
  if (elements.closeQuote) elements.closeQuote.addEventListener('click', closeModal);
  if (elements.closeQuoteBtn) elements.closeQuoteBtn.addEventListener('click', closeModal);
  if (elements.copyQuote) elements.copyQuote.addEventListener('click', copyQuoteToClipboard);

  // Close modal on outside click
  if (elements.quoteModal) {
    elements.quoteModal.addEventListener('click', function(e) {
      if (e.target === elements.quoteModal) {
        closeModal();
      }
    });
  }
}

function handlePlatformChange() {
  console.log('Platform changed to:', elements.platform.value);
  calculatePrice();
}

function initializeCollapsibleSections() {
  const toggles = document.querySelectorAll('.collapse-toggle');
  toggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const target = document.getElementById(targetId);
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      this.setAttribute('aria-expanded', !isExpanded);
      if (target) {
        target.classList.toggle('show');
      }
    });
  });
}

function updateEngagementValue() {
  const value = parseInt(elements.engagement.value);
  const labels = ['1-2%', '2-4%', '4-7%', '7-10%', '10%+'];
  if (elements.engagementValue) {
    elements.engagementValue.textContent = labels[value - 1] || '4-7%';
  }
  calculatePrice();
}

function updateComplexityValue() {
  const value = parseInt(elements.complexity.value);
  const labels = ['Simple', 'Basic', 'Medium', 'Complex', 'High-End'];
  if (elements.complexityValue) {
    elements.complexityValue.textContent = labels[value - 1] || 'Medium';
  }
  calculatePrice();
}

function getSelectedUsageRights() {
  if (!elements.usageRights) return 'Limited (30 days)';
  
  for (let radio of elements.usageRights) {
    if (radio.checked) {
      return radio.value;
    }
  }
  return 'Limited (30 days)';
}

function getFollowerCount() {
  const exactFollowers = parseInt(elements.exactFollowers?.value);
  if (exactFollowers && exactFollowers > 0) {
    return exactFollowers;
  }
  
  // Use tier average if no exact count
  const tierValue = elements.followerTier?.value || 'Micro (10K-100K)';
  const tier = DATA.followerTiers[tierValue];
  if (tier) {
    return Math.round((tier.min + tier.max) / 2);
  }
  return 50000; // Default fallback
}

function calculatePrice() {
  try {
    const followerCount = getFollowerCount();
    const platform = elements.platform?.value || 'Instagram';
    const contentType = elements.contentType?.value || 'Static Post';
    const engagementValue = parseInt(elements.engagement?.value || 3);
    const industry = elements.industry?.value || 'Graphic Design';
    const usageRights = getSelectedUsageRights();
    const deliverables = parseInt(elements.deliverables?.value || 1);
    const geography = elements.geography?.value || 'US';
    const timeline = elements.timeline?.value || 'Standard (7+ days)';
    const exclusivity = elements.exclusivity?.value || 'None';
    const complexity = parseInt(elements.complexity?.value || 3);
    const premiumBrand = elements.premiumBrand?.checked || false;

    // Get multipliers
    const platformRate = DATA.platformRates[platform] || 10;
    const contentMultiplier = DATA.contentMultipliers[contentType] || 1.0;
    const engagementLabels = ['1-2%', '2-4%', '4-7%', '7-10%', '10%+'];
    const engagementMultiplier = DATA.engagementMultipliers[engagementLabels[engagementValue - 1]] || 1.0;
    const industryMultiplier = DATA.industryMultipliers[industry] || 1.0;
    const usageRightsPremium = DATA.usageRights[usageRights] || 0;
    const geoMultiplier = DATA.geographicMultipliers[geography] || 1.0;
    const timelineMultiplier = DATA.timelineMultipliers[timeline] || 1.0;
    const exclusivityPremium = DATA.exclusivityPremiums[exclusivity] || 0;

    // Base price calculation
    const basePrice = (followerCount / 1000) * platformRate;
    
    // Apply multipliers
    let finalPrice = basePrice * contentMultiplier * engagementMultiplier * industryMultiplier;
    
    // Add usage rights premium
    finalPrice = finalPrice * (1 + usageRightsPremium);
    
    // Apply geographic and timeline adjustments
    finalPrice = finalPrice * geoMultiplier * timelineMultiplier;
    
    // Add exclusivity premium
    finalPrice = finalPrice * (1 + exclusivityPremium);
    
    // Add complexity adjustment (simple multiplier based on slider)
    const complexityMultiplier = 0.8 + (complexity - 1) * 0.15; // Range: 0.8x to 1.4x
    finalPrice = finalPrice * complexityMultiplier;
    
    // Add premium brand bonus
    if (premiumBrand) {
      finalPrice = finalPrice * 1.1;
    }
    
    // Multiply by deliverables
    finalPrice = finalPrice * deliverables;

    // Calculate price range (-20% to +30%)
    const priceMin = Math.round(finalPrice * 0.8);
    const priceMax = Math.round(finalPrice * 1.3);
    finalPrice = Math.round(finalPrice);

    // Calculate CPM
    const cpm = Math.round((finalPrice / (followerCount / 1000)) * 100) / 100;
    const platformCPM = DATA.benchmarkData.averageCPM[platform] || 0;

    // Store current calculation
    currentCalculation = {
      finalPrice,
      priceMin,
      priceMax,
      basePrice: Math.round(basePrice),
      contentMultiplier,
      engagementMultiplier,
      industryMultiplier,
      usageRightsPremium,
      geoMultiplier,
      timelineMultiplier,
      deliverables,
      cpm,
      platformCPM,
      followerCount,
      platform,
      contentType,
      industry,
      usageRights
    };

    // Update UI
    updateResultsDisplay();
    
  } catch (error) {
    console.error('Error calculating price:', error);
  }
}

function updateResultsDisplay() {
  const calc = currentCalculation;
  
  if (elements.finalPrice) elements.finalPrice.textContent = calc.finalPrice.toLocaleString();
  if (elements.priceMin) elements.priceMin.textContent = calc.priceMin.toLocaleString();
  if (elements.priceMax) elements.priceMax.textContent = calc.priceMax.toLocaleString();
  if (elements.basePrice) elements.basePrice.textContent = calc.basePrice.toLocaleString();
  if (elements.contentMult) elements.contentMult.textContent = calc.contentMultiplier.toFixed(1);
  if (elements.engagementMult) elements.engagementMult.textContent = calc.engagementMultiplier.toFixed(1);
  if (elements.industryMult) elements.industryMult.textContent = calc.industryMultiplier.toFixed(1);
  if (elements.usageRightsPct) elements.usageRightsPct.textContent = Math.round(calc.usageRightsPremium * 100);
  if (elements.geoMult) elements.geoMult.textContent = calc.geoMultiplier.toFixed(2);
  if (elements.timelineMult) elements.timelineMult.textContent = calc.timelineMultiplier.toFixed(1);
  if (elements.deliverablesCount) elements.deliverablesCount.textContent = calc.deliverables;
  if (elements.cpm) elements.cpm.textContent = calc.cpm.toFixed(2);
  if (elements.platformCPM) elements.platformCPM.textContent = calc.platformCPM.toFixed(1);
}

function applyPreset() {
  const presetKey = elements.preset.value;
  if (!presetKey || !DATA.campaignPresets[presetKey]) return;
  
  const preset = DATA.campaignPresets[presetKey];
  
  // Apply preset values
  if (elements.platform) elements.platform.value = preset.platform;
  if (elements.contentType) elements.contentType.value = preset.contentType;
  if (elements.engagement) elements.engagement.value = preset.engagement;
  if (elements.industry) elements.industry.value = preset.industry;
  if (elements.followerTier) elements.followerTier.value = preset.followerTier;
  
  // Set usage rights
  if (elements.usageRights) {
    Array.from(elements.usageRights).forEach(radio => {
      radio.checked = radio.value === preset.usageRights;
    });
  }
  
  // Update slider labels
  updateEngagementValue();
  
  // Recalculate
  calculatePrice();
}

function generateQuote() {
  console.log('Generate quote clicked', currentCalculation);
  
  if (!currentCalculation.finalPrice) {
    showFeedback('Please calculate a price first', 'error');
    return;
  }

  const calc = currentCalculation;
  const timestamp = new Date().toLocaleDateString();
  
  const quoteHTML = `
    <div class="quote-content">
      <h4>INFLUENCER COLLABORATION QUOTE</h4>
      
      <p><strong>Generated:</strong> ${timestamp}<br>
      <strong>Campaign:</strong> ${calc.contentType} - ${calc.platform}<br>
      <strong>Industry:</strong> ${calc.industry}</p>

      <h4>INFLUENCER DETAILS</h4>
      <p>• Follower Count: ${calc.followerCount.toLocaleString()}<br>
      • Platform: ${calc.platform}<br>
      • Engagement Rate: ${elements.engagementValue?.textContent || 'N/A'}</p>

      <h4>CAMPAIGN SPECIFICATIONS</h4>
      <p>• Content Type: ${calc.contentType}<br>
      • Number of Deliverables: ${calc.deliverables}<br>
      • Usage Rights: ${calc.usageRights}<br>
      • Geographic Market: ${elements.geography?.value || 'US'}<br>
      • Timeline: ${elements.timeline?.value || 'Standard'}</p>

      <h4>PRICING BREAKDOWN</h4>
      <p>• Base Price: $${calc.basePrice.toLocaleString()}<br>
      • Content Multiplier: ${calc.contentMultiplier.toFixed(1)}x<br>
      • Engagement Multiplier: ${calc.engagementMultiplier.toFixed(1)}x<br>
      • Industry Multiplier: ${calc.industryMultiplier.toFixed(1)}x<br>
      • Usage Rights Premium: +${Math.round(calc.usageRightsPremium * 100)}%<br>
      • Geographic Adjustment: ${calc.geoMultiplier.toFixed(2)}x<br>
      • Timeline Adjustment: ${calc.timelineMultiplier.toFixed(1)}x<br>
      • Total Deliverables: ${calc.deliverables}x</p>

      <div class="quote-price">
        FINAL QUOTE: $${calc.finalPrice.toLocaleString()}
      </div>
      
      <p><strong>Negotiation Range:</strong> $${calc.priceMin.toLocaleString()} - $${calc.priceMax.toLocaleString()}</p>

      <h4>KEY METRICS</h4>
      <p>• Cost per 1K followers: $${calc.cpm.toFixed(2)}<br>
      • Platform average CPM: $${calc.platformCPM.toFixed(2)}</p>

      <p><em>This quote is valid for 14 days and subject to influencer availability.</em></p>
    </div>
  `;

  if (elements.quoteContent) {
    elements.quoteContent.innerHTML = quoteHTML;
  }
  
  if (elements.quoteModal) {
    elements.quoteModal.classList.remove('hidden');
    console.log('Modal should now be visible');
  }
}

function saveScenario() {
  if (!currentCalculation.finalPrice) {
    showFeedback('Please calculate a price first', 'error');
    return;
  }

  const scenario = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    calculation: { ...currentCalculation },
    parameters: {
      followerTier: elements.followerTier?.value,
      exactFollowers: elements.exactFollowers?.value,
      platform: elements.platform?.value,
      contentType: elements.contentType?.value,
      engagement: elements.engagement?.value,
      industry: elements.industry?.value,
      usageRights: getSelectedUsageRights(),
      deliverables: elements.deliverables?.value,
      geography: elements.geography?.value,
      timeline: elements.timeline?.value,
      exclusivity: elements.exclusivity?.value,
      complexity: elements.complexity?.value,
      premiumBrand: elements.premiumBrand?.checked
    }
  };

  savedScenarios.push(scenario);
  showFeedback('Scenario saved successfully!', 'success');
}

function resetCalculator() {
  // Reset all form elements to defaults
  if (elements.preset) elements.preset.value = '';
  if (elements.followerTier) elements.followerTier.value = 'Micro (10K-100K)';
  if (elements.exactFollowers) elements.exactFollowers.value = '';
  if (elements.platform) elements.platform.value = 'Instagram';
  if (elements.contentType) elements.contentType.value = 'Static Post';
  if (elements.engagement) elements.engagement.value = 3;
  if (elements.industry) elements.industry.value = 'Graphic Design';
  if (elements.deliverables) elements.deliverables.value = 1;
  if (elements.geography) elements.geography.value = 'US';
  if (elements.timeline) elements.timeline.value = 'Standard (7+ days)';
  if (elements.exclusivity) elements.exclusivity.value = 'None';
  if (elements.complexity) elements.complexity.value = 3;
  if (elements.premiumBrand) elements.premiumBrand.checked = false;
  
  // Reset usage rights to Limited
  if (elements.usageRights) {
    Array.from(elements.usageRights).forEach(radio => {
      radio.checked = radio.value === 'Limited (30 days)';
    });
  }
  
  // Update slider displays
  updateEngagementValue();
  updateComplexityValue();
  
  // Recalculate with defaults
  calculatePrice();
  
  showFeedback('Calculator reset to defaults', 'success');
}

function closeModal() {
  if (elements.quoteModal) {
    elements.quoteModal.classList.add('hidden');
  }
}

function copyQuoteToClipboard() {
  const quoteElement = elements.quoteContent;
  if (!quoteElement) return;
  
  const quoteText = quoteElement.textContent || quoteElement.innerText;
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(quoteText).then(() => {
      showFeedback('Quote copied to clipboard!', 'success');
    }).catch(() => {
      showFeedback('Failed to copy quote', 'error');
    });
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = quoteText;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showFeedback('Quote copied to clipboard!', 'success');
    } catch (err) {
      showFeedback('Failed to copy quote', 'error');
    }
    document.body.removeChild(textArea);
  }
}

function showFeedback(message, type = 'success') {
  // Remove any existing feedback
  const existingFeedback = document.querySelector('.success-feedback');
  if (existingFeedback) {
    existingFeedback.remove();
  }
  
  const feedback = document.createElement('div');
  feedback.className = 'success-feedback';
  feedback.textContent = message;
  
  if (type === 'error') {
    feedback.style.background = 'var(--color-error)';
  }
  
  document.body.appendChild(feedback);
  
  // Show with animation
  setTimeout(() => feedback.classList.add('show'), 100);
  
  // Hide after 3 seconds
  setTimeout(() => {
    feedback.classList.remove('show');
    setTimeout(() => feedback.remove(), 300);
  }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
  // Escape key to close modal
  if (e.key === 'Escape' && elements.quoteModal && !elements.quoteModal.classList.contains('hidden')) {
    closeModal();
  }
  
  // Ctrl/Cmd + R to reset (prevent page reload)
  if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
    e.preventDefault();
    resetCalculator();
  }
  
  // Ctrl/Cmd + G to generate quote
  if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
    e.preventDefault();
    generateQuote();
  }
});