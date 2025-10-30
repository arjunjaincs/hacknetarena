/**
 * Game Actions - Expanded Edition v2.0
 * 
 * 12 actions per role (24 total)
 * 6 actions shown per game (randomly selected)
 * Balanced energy costs and damage
 * 
 * ROTATION SYSTEM:
 * - Each game randomly selects 6 actions from the 12 available
 * - Ensures variety and replayability
 * - Maintains balance across categories
 */

// ============================================================================
// ALL HACKER ACTIONS (12 total)
// ============================================================================

export const ALL_HACKER_ACTIONS = [
  // Network Category (4 actions) - WEAK to STRONG
  {
    id: 'portscan',
    name: 'Port Scanning',
    icon: '🔍',
    category: 'Network',
    description: 'Scan for open ports and vulnerabilities. Low cost, high reliability. Perfect opener!',
    baseChance: 80,
    energyCost: 8,
    impactRange: [5, 9],
    threatImpact: 5,
    cooldown: 0,
    educationalNote: 'Reconnaissance phase: Identifies entry points. 💡 Combo Hint: Follow with MITM for Recon Strike (+14 bonus)!'
  },
  {
    id: 'ddos',
    name: 'DDoS Attack',
    icon: '💥',
    category: 'Network',
    description: 'Overwhelm servers with massive traffic. Balanced power and cost. Great follow-up!',
    baseChance: 65,
    energyCost: 12,
    impactRange: [9, 15],
    threatImpact: 9,
    cooldown: 0,
    educationalNote: 'DDoS floods systems with requests. 💡 Combo Hint: Chain with Brute Force for Network Assault (+18 bonus)!'
  },
  {
    id: 'mitm',
    name: 'Man-in-the-Middle',
    icon: '🕵️',
    category: 'Network',
    description: 'Spy on network traffic and steal data. High damage, moderate risk. Stealth attack!',
    baseChance: 55,
    energyCost: 17,
    impactRange: [13, 20],
    threatImpact: 13,
    cooldown: 1,
    educationalNote: 'Intercepts communications secretly. 💡 Combo Hint: Use after Port Scan for Recon Strike (+14)!'
  },
  {
    id: 'bruteforce',
    name: 'Brute Force',
    icon: '🔨',
    category: 'Network',
    description: 'Systematically crack passwords. Expensive but devastating. Ultimate network attack!',
    baseChance: 45,
    energyCost: 22,
    impactRange: [14, 22],
    threatImpact: 14,
    cooldown: 2,
    educationalNote: 'Automated password cracking. 💡 Combo Hint: After DDoS for Network Assault (+18)!'
  },

  // Human Category (4 actions) - WEAK to STRONG
  {
    id: 'tailgating',
    name: 'Tailgating',
    icon: '🚪',
    category: 'Human',
    description: 'Sneak in behind authorized personnel. Simple physical breach. Easy entry!',
    baseChance: 75,
    energyCost: 9,
    impactRange: [6, 11],
    threatImpact: 6,
    cooldown: 0,
    educationalNote: 'Physical security bypass. 💡 Combo Hint: Start social engineering chains here!'
  },
  {
    id: 'pretexting',
    name: 'Pretexting',
    icon: '🎪',
    category: 'Human',
    description: 'Fabricate convincing scenarios to extract info. Moderate power. Deception works!',
    baseChance: 65,
    energyCost: 13,
    impactRange: [10, 16],
    threatImpact: 10,
    cooldown: 0,
    educationalNote: 'Social manipulation via false scenarios. 💡 Combo Hint: Build trust before phishing!'
  },
  {
    id: 'phishing',
    name: 'Phishing',
    icon: '🎣',
    category: 'Human',
    description: 'Send convincing fake emails to steal credentials. Reliable damage. Classic attack!',
    baseChance: 60,
    energyCost: 16,
    impactRange: [12, 19],
    threatImpact: 12,
    cooldown: 1,
    educationalNote: 'Email-based social engineering. 💡 Combo Hint: Chain with Social Eng for Social Chain (+15)!'
  },
  {
    id: 'socialeng',
    name: 'Social Engineering',
    icon: '🎭',
    category: 'Human',
    description: 'Master psychological manipulation. Expensive but powerful. Human weakness!',
    baseChance: 50,
    energyCost: 20,
    impactRange: [12, 19],
    threatImpact: 12,
    cooldown: 2,
    educationalNote: 'Advanced manipulation tactics. 💡 Combo Hint: After Phishing for Social Chain (+15)!'
  },

  // Software Category (4 actions) - WEAK to STRONG
  {
    id: 'sqlinjection',
    name: 'SQL Injection',
    icon: '💉',
    category: 'Software',
    description: 'Inject malicious SQL to access databases. Quick and cheap. Web classic!',
    baseChance: 70,
    energyCost: 10,
    impactRange: [7, 13],
    threatImpact: 7,
    cooldown: 0,
    educationalNote: 'Database manipulation via SQL injection. 💡 Combo Hint: Gateway to malware deployment!'
  },
  {
    id: 'malware',
    name: 'Deploy Malware',
    icon: '🦠',
    category: 'Software',
    description: 'Deploy persistent malicious code. Balanced stats. Infection spreads!',
    baseChance: 60,
    energyCost: 15,
    impactRange: [11, 18],
    threatImpact: 11,
    cooldown: 1,
    educationalNote: 'Persistent malicious software. 💡 Combo Hint: Escalate to Ransomware (+19) or Zero-Day!'
  },
  {
    id: 'ransomware',
    name: 'Ransomware',
    icon: '🔐',
    category: 'Software',
    description: 'Encrypt critical files and demand ransom. High damage. Modern threat!',
    baseChance: 50,
    energyCost: 21,
    impactRange: [14, 21],
    threatImpact: 14,
    cooldown: 2,
    educationalNote: 'File encryption attack. 💡 Combo Hint: After Malware for Escalation (+19) or before Zero-Day (+22)!'
  },
  {
    id: 'zeroday',
    name: 'Zero-Day Exploit',
    icon: '⚡',
    category: 'Software',
    description: 'Exploit undiscovered vulnerabilities. Ultimate power! Game changer!',
    baseChance: 35,
    energyCost: 25,
    impactRange: [17, 28],
    threatImpact: 17,
    cooldown: 3,
    educationalNote: 'Unknown vulnerability exploitation. 💡 Combo Hint: After Ransomware for Total Lockdown (+22)!'
  }
];

// ============================================================================
// ALL DEFENDER ACTIONS (12 total)
// ============================================================================

export const ALL_DEFENDER_ACTIONS = [
  // Network Category (4 actions) - WEAK to STRONG
  {
    id: 'ids',
    name: 'Intrusion Detection',
    icon: '🚨',
    category: 'Network',
    description: 'Monitor network for threats. Low cost, high reliability. Essential baseline!',
    baseChance: 80,
    energyCost: 8,
    impactRange: [5, 10],
    threatImpact: -5,
    cooldown: 0,
    educationalNote: 'Network monitoring system. 💡 Combo Hint: Follow with Firewall for Detect & Block (+14)!'
  },
  {
    id: 'firewall',
    name: 'Deploy Firewall',
    icon: '🔥',
    category: 'Network',
    description: 'Filter and block malicious traffic. Balanced defense. Core protection!',
    baseChance: 70,
    energyCost: 12,
    impactRange: [9, 15],
    threatImpact: -9,
    cooldown: 0,
    educationalNote: 'Traffic filtering system. 💡 Combo Hint: After IDS for Detect & Block (+14) or before VPN (+17)!'
  },
  {
    id: 'vpn',
    name: 'VPN Encryption',
    icon: '🔒',
    category: 'Network',
    description: 'Create secure encrypted tunnels. High protection. Privacy shield!',
    baseChance: 60,
    energyCost: 17,
    impactRange: [13, 20],
    threatImpact: -13,
    cooldown: 1,
    educationalNote: 'Encrypted communication channels. 💡 Combo Hint: After Firewall for Layered Defense (+17)!'
  },
  {
    id: 'segmentation',
    name: 'Network Segmentation',
    icon: '🧱',
    category: 'Network',
    description: 'Divide network into isolated zones. Ultimate defense! Containment!',
    baseChance: 50,
    energyCost: 22,
    impactRange: [20, 30],
    threatImpact: -20,
    cooldown: 2,
    educationalNote: 'Network isolation strategy. 💡 Combo Hint: Final layer in defense chain!'
  },

  // Human Category (4 actions) - WEAK to STRONG
  {
    id: 'awareness',
    name: 'Security Awareness',
    icon: '👁️',
    category: 'Human',
    description: 'Build security-aware culture. Simple and effective. Human firewall!',
    baseChance: 75,
    energyCost: 9,
    impactRange: [6, 11],
    threatImpact: -6,
    cooldown: 0,
    educationalNote: 'Security awareness program. 💡 Combo Hint: Foundation for training programs!'
  },
  {
    id: 'training',
    name: 'Security Training',
    icon: '📚',
    category: 'Human',
    description: 'Train staff to recognize attacks. Moderate power. Knowledge is power!',
    baseChance: 65,
    energyCost: 13,
    impactRange: [10, 16],
    threatImpact: -10,
    cooldown: 0,
    educationalNote: 'Employee security training. 💡 Combo Hint: Chain with Access Control for Smart Restrictions (+17)!'
  },
  {
    id: 'accesscontrol',
    name: 'Access Control',
    icon: '🚫',
    category: 'Human',
    description: 'Implement least-privilege access. Strong defense. Zero trust!',
    baseChance: 55,
    energyCost: 16,
    impactRange: [12, 19],
    threatImpact: -12,
    cooldown: 1,
    educationalNote: 'Role-based access control. 💡 Combo Hint: After Training for Smart Restrictions (+17)!'
  },
  {
    id: 'mfa',
    name: 'Multi-Factor Auth',
    icon: '🔑',
    category: 'Human',
    description: 'Enforce multi-factor authentication. Expensive but secure. Extra layer!',
    baseChance: 45,
    energyCost: 20,
    impactRange: [15, 24],
    threatImpact: -15,
    cooldown: 2,
    educationalNote: 'Multiple authentication factors. 💡 Combo Hint: Ultimate human defense!'
  },

  // Software Category (4 actions) - WEAK to STRONG
  {
    id: 'backup',
    name: 'Backup Data',
    icon: '💾',
    category: 'Software',
    description: 'Create data recovery points. Essential safety net. Always backup!',
    baseChance: 80,
    energyCost: 10,
    impactRange: [7, 13],
    threatImpact: -7,
    cooldown: 0,
    educationalNote: 'Data backup system. 💡 Combo Hint: Foundation for software defense!'
  },
  {
    id: 'antivirus',
    name: 'Antivirus Scan',
    icon: '🛡️',
    category: 'Software',
    description: 'Scan and eliminate malware. Reliable cleanup. Virus hunter!',
    baseChance: 65,
    energyCost: 14,
    impactRange: [10, 17],
    threatImpact: -10,
    cooldown: 1,
    educationalNote: 'Malware detection and removal. 💡 Combo Hint: Follow with Patch for Proactive Defense (+18)!'
  },
  {
    id: 'patch',
    name: 'Patch Systems',
    icon: '🔧',
    category: 'Software',
    description: 'Update systems to fix vulnerabilities. Proactive defense. Stay current!',
    baseChance: 55,
    energyCost: 18,
    impactRange: [14, 21],
    threatImpact: -14,
    cooldown: 1,
    educationalNote: 'System patching and updates. 💡 Combo Hint: After Antivirus (+18) or before Encryption (+21)!'
  },
  {
    id: 'encryption',
    name: 'Data Encryption',
    icon: '🔐',
    category: 'Software',
    description: 'Encrypt all sensitive data. Ultimate protection! Unbreakable!',
    baseChance: 40,
    energyCost: 23,
    impactRange: [22, 32],
    threatImpact: -22,
    cooldown: 2,
    educationalNote: 'Data encryption at rest. 💡 Combo Hint: After Patch for Hardened Security (+21)!'
  }
];

// ============================================================================
// ROTATION SYSTEM
// ============================================================================

/**
 * Select 6 random actions from the 12 available
 * Ensures 2 from each category for balance
 */
export function getRandomActions(allActions) {
  const network = allActions.filter(a => a.category === 'Network');
  const human = allActions.filter(a => a.category === 'Human');
  const software = allActions.filter(a => a.category === 'Software');
  
  // Shuffle each category
  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  
  // Pick 2 from each category
  const selected = [
    ...shuffleArray(network).slice(0, 2),
    ...shuffleArray(human).slice(0, 2),
    ...shuffleArray(software).slice(0, 2)
  ];
  
  // Shuffle final selection
  return shuffleArray(selected);
}

/**
 * Get actions for current game (6 per role)
 */
export function getGameActions() {
  return {
    hackerActions: getRandomActions(ALL_HACKER_ACTIONS),
    defenderActions: getRandomActions(ALL_DEFENDER_ACTIONS)
  };
}

// ============================================================================
// LEGACY EXPORTS (for compatibility)
// ============================================================================

// Default to first 6 actions if not using rotation
export const HACKER_ACTIONS = ALL_HACKER_ACTIONS.slice(0, 6);
export const DEFENDER_ACTIONS = ALL_DEFENDER_ACTIONS.slice(0, 6);

// ============================================================================
// SYNERGY/COMBO DEFINITIONS (18 total)
// ============================================================================

export const COMBO_DEFINITIONS = [
  // Hacker Network Combos (4) - Linear progression, no loops
  { from: 'portscan', to: 'mitm', name: '🔍 Recon Strike', bonus: 14, description: 'Scan then intercept' },
  { from: 'portscan', to: 'bruteforce', name: '🔍 Targeted Breach', bonus: 16, description: 'Find weakness, exploit it' },
  { from: 'mitm', to: 'bruteforce', name: '🕵️ Intercept & Crack', bonus: 17, description: 'Intercept then brute force' },
  { from: 'ddos', to: 'bruteforce', name: '💥 Network Assault', bonus: 18, description: 'Overwhelm then crack' },
  
  // Hacker Human Combos (4) - Linear progression, no loops
  { from: 'tailgating', to: 'pretexting', name: '🚪 Inside Job', bonus: 13, description: 'Physical then social' },
  { from: 'pretexting', to: 'phishing', name: '🎪 Trust Exploit', bonus: 16, description: 'Build trust, then strike' },
  { from: 'phishing', to: 'socialeng', name: '🎣 Social Chain', bonus: 18, description: 'Email to manipulation' },
  { from: 'tailgating', to: 'socialeng', name: '🚪 Direct Manipulation', bonus: 15, description: 'Enter then manipulate' },
  
  // Hacker Software Combos (4) - Linear progression, no loops
  { from: 'sqlinjection', to: 'malware', name: '💉 Database Infection', bonus: 15, description: 'Inject then deploy' },
  { from: 'malware', to: 'ransomware', name: '🦠 Escalation', bonus: 19, description: 'Infect then encrypt' },
  { from: 'ransomware', to: 'zeroday', name: '🔐 Total Lockdown', bonus: 22, description: 'Encrypt then exploit' },
  { from: 'phishing', to: 'malware', name: '🎣 Trojan Horse', bonus: 17, description: 'Trick into installing' },
  
  // Defender Network Combos (3) - Linear progression
  { from: 'ids', to: 'firewall', name: '🚨 Detect & Block', bonus: 14, description: 'Spot then stop' },
  { from: 'firewall', to: 'vpn', name: '🔥 Layered Defense', bonus: 17, description: 'Block then encrypt' },
  { from: 'vpn', to: 'segmentation', name: '🔒 Isolation Protocol', bonus: 20, description: 'Encrypt then isolate' },
  
  // Defender Human Combos (3) - Linear progression
  { from: 'awareness', to: 'training', name: '👁️ Educated Defense', bonus: 15, description: 'Aware then trained' },
  { from: 'training', to: 'accesscontrol', name: '📚 Smart Restrictions', bonus: 17, description: 'Train then restrict' },
  { from: 'accesscontrol', to: 'mfa', name: '🚫 Zero Trust', bonus: 19, description: 'Restrict then verify' },
  
  // Defender Software Combos (3) - Linear progression
  { from: 'backup', to: 'antivirus', name: '💾 Protected Recovery', bonus: 16, description: 'Backup then clean' },
  { from: 'antivirus', to: 'patch', name: '🛡️ Proactive Defense', bonus: 18, description: 'Clean then fix' },
  { from: 'patch', to: 'encryption', name: '🔧 Hardened Security', bonus: 21, description: 'Fix then encrypt' }
];

/**
 * Get synergy description for action pair
 */
export function getSynergyDescription(currentActionId, previousActionId) {
  const combo = COMBO_DEFINITIONS.find(
    c => c.from === previousActionId && c.to === currentActionId
  );
  return combo ? { name: combo.name, bonus: combo.bonus, description: `${combo.name}!` } : null;
}

/**
 * Get available actions (not on cooldown, enough energy)
 */
export function getAvailableActions(role, energy, cooldowns, gameActions = null) {
  // Use provided game actions or default
  const actions = gameActions 
    ? (role === 'hacker' ? gameActions.hackerActions : gameActions.defenderActions)
    : (role === 'hacker' ? HACKER_ACTIONS : DEFENDER_ACTIONS);
  
  return actions.filter(action => {
    const onCooldown = (cooldowns[action.id] || 0) > 0;
    const hasEnergy = energy >= action.energyCost;
    return !onCooldown && hasEnergy;
  });
}

/**
 * Get action by ID from any list
 */
export function getActionById(actionId, gameActions = null) {
  const allActions = gameActions
    ? [...gameActions.hackerActions, ...gameActions.defenderActions]
    : [...ALL_HACKER_ACTIONS, ...ALL_DEFENDER_ACTIONS];
  
  return allActions.find(a => a.id === actionId);
}
