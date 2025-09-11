# Create SVG icons with CSS styles for ZOKFORCE website
# Based on the generated PNG icons, creating clean SVG versions

svg_icons = {
    "ai-strategy": """<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" class="service-icon">
  <defs>
    <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4F76F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#77F2A1;stop-opacity:1" />
    </linearGradient>
  </defs>
  <!-- Brain outline -->
  <path d="M40 15C28 15 18 25 18 37c0 8 4 15 10 19v6c0 2 2 4 4 4h16c2 0 4-2 4-4v-6c6-4 10-11 10-19 0-12-10-22-22-22z" fill="url(#brainGradient)"/>
  <!-- Circuit lines -->
  <path d="M30 25h20M25 35h30M28 45h24" stroke="white" stroke-width="2" fill="none"/>
  <!-- Circuit nodes -->
  <circle cx="25" cy="25" r="2" fill="white"/>
  <circle cx="55" cy="25" r="2" fill="white"/>
  <circle cx="20" cy="35" r="2" fill="white"/>
  <circle cx="60" cy="35" r="2" fill="white"/>
  <circle cx="28" cy="45" r="2" fill="white"/>
  <circle cx="52" cy="45" r="2" fill="white"/>
</svg>""",

    "llm-integration": """<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" class="service-icon">
  <defs>
    <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4F76F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#77F2A1;stop-opacity:1" />
    </linearGradient>
  </defs>
  <!-- Network connections -->
  <line x1="25" y1="25" x2="40" y2="40" stroke="url(#networkGradient)" stroke-width="3"/>
  <line x1="55" y1="25" x2="40" y2="40" stroke="url(#networkGradient)" stroke-width="3"/>
  <line x1="25" y1="55" x2="40" y2="40" stroke="url(#networkGradient)" stroke-width="3"/>
  <line x1="55" y1="55" x2="40" y2="40" stroke="url(#networkGradient)" stroke-width="3"/>
  <line x1="25" y1="25" x2="55" y2="25" stroke="url(#networkGradient)" stroke-width="2"/>
  <line x1="25" y1="55" x2="55" y2="55" stroke="url(#networkGradient)" stroke-width="2"/>
  <!-- Network nodes -->
  <circle cx="40" cy="40" r="8" fill="url(#networkGradient)"/>
  <circle cx="25" cy="25" r="6" fill="#4F76F6"/>
  <circle cx="55" cy="25" r="6" fill="#4F76F6"/>
  <circle cx="25" cy="55" r="6" fill="#4F76F6"/>
  <circle cx="55" cy="55" r="6" fill="#4F76F6"/>
</svg>""",

    "smart-chatbots": """<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" class="service-icon">
  <defs>
    <linearGradient id="chatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4F76F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#77F2A1;stop-opacity:1" />
    </linearGradient>
  </defs>
  <!-- Chat bubble -->
  <path d="M15 20c0-5 5-10 10-10h30c5 0 10 5 10 10v20c0 5-5 10-10 10H35l-10 10v-10H25c-5 0-10-5-10-10V20z" fill="url(#chatGradient)"/>
  <!-- AI circuit pattern inside bubble -->
  <circle cx="35" cy="30" r="3" fill="white"/>
  <circle cx="45" cy="30" r="3" fill="white"/>
  <path d="M30 38h20" stroke="white" stroke-width="2"/>
  <path d="M32 42h16" stroke="white" stroke-width="2"/>
  <!-- Small circuit lines -->
  <path d="M25 25h5M50 25h5M25 35h5M50 35h5" stroke="white" stroke-width="1"/>
</svg>""",

    "process-automation": """<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" class="service-icon">
  <defs>
    <linearGradient id="gearGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4F76F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#77F2A1;stop-opacity:1" />
    </linearGradient>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#77F2A1"/>
    </marker>
  </defs>
  <!-- Main gear -->
  <circle cx="40" cy="40" r="15" fill="url(#gearGradient)"/>
  <circle cx="40" cy="40" r="8" fill="white"/>
  <!-- Gear teeth -->
  <rect x="38" y="20" width="4" height="8" fill="url(#gearGradient)"/>
  <rect x="38" y="52" width="4" height="8" fill="url(#gearGradient)"/>
  <rect x="20" y="38" width="8" height="4" fill="url(#gearGradient)"/>
  <rect x="52" y="38" width="8" height="4" fill="url(#gearGradient)"/>
  <!-- Circular arrows -->
  <path d="M25 15 Q15 15 15 25" stroke="#77F2A1" stroke-width="3" fill="none" marker-end="url(#arrow)"/>
  <path d="M55 15 Q65 15 65 25" stroke="#77F2A1" stroke-width="3" fill="none" marker-end="url(#arrow)"/>
  <path d="M25 65 Q15 65 15 55" stroke="#77F2A1" stroke-width="3" fill="none" marker-end="url(#arrow)"/>
  <path d="M55 65 Q65 65 65 55" stroke="#77F2A1" stroke-width="3" fill="none" marker-end="url(#arrow)"/>
</svg>""",

    "data-analytics": """<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" class="service-icon">
  <defs>
    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4F76F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#77F2A1;stop-opacity:1" />
    </linearGradient>
  </defs>
  <!-- Bar chart -->
  <rect x="20" y="50" width="8" height="20" fill="url(#chartGradient)"/>
  <rect x="32" y="40" width="8" height="30" fill="url(#chartGradient)"/>
  <rect x="44" y="30" width="8" height="40" fill="url(#chartGradient)"/>
  <rect x="56" y="20" width="8" height="50" fill="url(#chartGradient)"/>
  <!-- Trend line -->
  <path d="M24 50 L36 40 L48 30 L60 20" stroke="#77F2A1" stroke-width="3" fill="none"/>
  <!-- Data points -->
  <circle cx="24" cy="50" r="3" fill="#77F2A1"/>
  <circle cx="36" cy="40" r="3" fill="#77F2A1"/>
  <circle cx="48" cy="30" r="3" fill="#77F2A1"/>
  <circle cx="60" cy="20" r="3" fill="#77F2A1"/>
  <!-- Axis lines -->
  <line x1="15" y1="70" x2="70" y2="70" stroke="#4F76F6" stroke-width="2"/>
  <line x1="15" y1="15" x2="15" y2="70" stroke="#4F76F6" stroke-width="2"/>
</svg>""",

    "digital-twin": """<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" class="service-icon">
  <defs>
    <linearGradient id="buildingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4F76F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#77F2A1;stop-opacity:1" />
    </linearGradient>
  </defs>
  <!-- 3D Building blocks -->
  <rect x="25" y="35" width="15" height="15" fill="url(#buildingGradient)"/>
  <rect x="40" y="25" width="15" height="25" fill="#4F76F6"/>
  <rect x="25" y="50" width="30" height="10" fill="url(#buildingGradient)"/>
  <!-- IoT connection points -->
  <circle cx="20" cy="20" r="3" fill="#77F2A1"/>
  <circle cx="60" cy="20" r="3" fill="#77F2A1"/>
  <circle cx="20" cy="60" r="3" fill="#77F2A1"/>
  <circle cx="60" cy="60" r="3" fill="#77F2A1"/>
  <!-- Connection lines -->
  <line x1="20" y1="20" x2="32" y2="35" stroke="#77F2A1" stroke-width="2" stroke-dasharray="3,3"/>
  <line x1="60" y1="20" x2="48" y2="25" stroke="#77F2A1" stroke-width="2" stroke-dasharray="3,3"/>
  <line x1="20" y1="60" x2="25" y2="50" stroke="#77F2A1" stroke-width="2" stroke-dasharray="3,3"/>
  <line x1="60" y1="60" x2="55" y2="50" stroke="#77F2A1" stroke-width="2" stroke-dasharray="3,3"/>
  <!-- Digital overlay grid -->
  <path d="M15 15 L65 15 L65 65 L15 65 Z" stroke="#77F2A1" stroke-width="1" fill="none" opacity="0.3"/>
  <path d="M15 40 L65 40 M40 15 L40 65" stroke="#77F2A1" stroke-width="1" opacity="0.3"/>
</svg>"""
}

# Create the CSS styles for the icons
css_styles = """/* ZOKFORCE Service Icons CSS */
.service-icon {
    width: 80px;
    height: 80px;
    transition: all 0.3s ease;
    filter: drop-shadow(0 2px 8px rgba(79, 118, 246, 0.15));
}

.service-icon:hover {
    transform: scale(1.1);
    filter: drop-shadow(0 4px 16px rgba(79, 118, 246, 0.25));
}

.service-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    background: white;
    border-radius: 12px;
    border: 1px solid #e9ecef;
    transition: all 0.3s ease;
    text-align: center;
}

.service-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 35px rgba(79, 118, 246, 0.1);
    border-color: rgba(79, 118, 246, 0.2);
}

.service-card__icon {
    margin-bottom: 1.5rem;
}

.service-card__title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1F2B37;
    margin-bottom: 1rem;
}

.service-card__description {
    color: #666;
    line-height: 1.6;
    margin-bottom: 1.5rem;
}

.service-card__link {
    color: #4F76F6;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s ease;
}

.service-card__link:hover {
    color: #77F2A1;
}

/* Services Grid */
.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2rem;
    margin: 3rem 0;
}

/* Responsive Design */
@media (max-width: 768px) {
    .services-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
    
    .service-card {
        padding: 1.5rem;
    }
    
    .service-icon {
        width: 64px;
        height: 64px;
    }
}"""

# Save all SVG files
for name, svg_content in svg_icons.items():
    with open(f"zokforce-{name}-icon.svg", "w") as f:
        f.write(svg_content)
    print(f"Created zokforce-{name}-icon.svg")

# Save CSS file
with open("zokforce-service-icons.css", "w") as f:
    f.write(css_styles)
print("Created zokforce-service-icons.css")

print("\n✅ All ZOKFORCE service icons and CSS created successfully!")
print("\nFiles created:")
for name in svg_icons.keys():
    print(f"- zokforce-{name}-icon.svg")
print("- zokforce-service-icons.css")