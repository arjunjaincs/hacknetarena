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
    description: 'Find open network ports',
    baseChance: 80,
    energyCost: 8,
    impactRange: [5, 9],
    threatImpact: 5,
    cooldown: 0,
    educationalNote: 'Reconnaissance to identify vulnerable entry points. Weak but reliable.'
  },
  {
    id: 'ddos',
    name: 'DDoS Attack',
    icon: '💥',
    category: 'Network',
    description: 'Flood servers with traffic',
    baseChance: 65,
    energyCost: 12,
    impactRange: [9, 15],
    threatImpact: 9,
    cooldown: 0,
    educationalNote: 'Distributed Denial of Service overwhelms systems with requests. Medium power.'
  },
  {
    id: 'mitm',
    name: 'Man-in-the-Middle',
    icon: '🕵️',
    category: 'Network',
    description: 'Intercept communications',
    baseChance: 55,
    energyCost: 17,
    impactRange: [13, 20],
    threatImpact: 13,
    cooldown: 1,
    educationalNote: 'Secretly intercepts and relays messages. Strong but risky.'
  },
  {
    id: 'bruteforce',
    name: 'Brute Force',
    icon: '🔨',
    category: 'Network',
    description: 'Crack passwords rapidly',
    baseChance: 45,
    energyCost: 22,
    impactRange: [18, 28],
    threatImpact: 18,
    cooldown: 2,
    educationalNote: 'Automated password cracking. Very powerful but expensive.'
  },

  // Human Category (4 actions) - WEAK to STRONG
  {
    id: 'tailgating',
    name: 'Tailgating',
    icon: '🚪',
    category: 'Human',
    description: 'Follow authorized person',
    baseChance: 75,
    energyCost: 9,
    impactRange: [6, 11],
    threatImpact: 6,
    cooldown: 0,
    educationalNote: 'Physical security breach. Simple and cheap.'
  },
  {
    id: 'pretexting',
    name: 'Pretexting',
    icon: '🎪',
    category: 'Human',
    description: 'Create false scenario',
    baseChance: 65,
    energyCost: 13,
    impactRange: [10, 16],
    threatImpact: 10,
    cooldown: 0,
    educationalNote: 'Fabricated scenario to obtain information. Moderate effectiveness.'
  },
  {
    id: 'phishing',
    name: 'Phishing',
    icon: '🎣',
    category: 'Human',
    description: 'Trick users via fake emails',
    baseChance: 60,
    energyCost: 16,
    impactRange: [12, 19],
    threatImpact: 12,
    cooldown: 1,
    educationalNote: 'Social engineering via deceptive emails. Strong and reliable.'
  },
  {
    id: 'socialeng',
    name: 'Social Engineering',
    icon: '🎭',
    category: 'Human',
    description: 'Manipulate employees',
    baseChance: 50,
    energyCost: 20,
    impactRange: [15, 24],
    threatImpact: 15,
    cooldown: 2,
    educationalNote: 'Advanced psychological manipulation. Very powerful.'
  },

  // Software Category (4 actions) - WEAK to STRONG
  {
    id: 'sqlinjection',
    name: 'SQL Injection',
    icon: '💉',
    category: 'Software',
    description: 'Manipulate database queries',
    baseChance: 70,
    energyCost: 10,
    impactRange: [7, 13],
    threatImpact: 7,
    cooldown: 0,
    educationalNote: 'Inserts malicious SQL code. Quick and cheap.'
  },
  {
    id: 'malware',
    name: 'Deploy Malware',
    icon: '🦠',
    category: 'Software',
    description: 'Install malicious code',
    baseChance: 60,
    energyCost: 15,
    impactRange: [11, 18],
    threatImpact: 11,
    cooldown: 1,
    educationalNote: 'Malicious software that steals or corrupts data. Balanced.'
  },
  {
    id: 'ransomware',
    name: 'Ransomware',
    icon: '🔐',
    category: 'Software',
    description: 'Encrypt and demand payment',
    baseChance: 50,
    energyCost: 21,
    impactRange: [17, 26],
    threatImpact: 17,
    cooldown: 2,
    educationalNote: 'Encrypts files and demands ransom. Very damaging.'
  },
  {
    id: 'zeroday',
    name: 'Zero-Day Exploit',
    icon: '⚡',
    category: 'Software',
    description: 'Exploit unknown vulnerability',
    baseChance: 35,
    energyCost: 25,
    impactRange: [22, 35],
    threatImpact: 22,
    cooldown: 3,
    educationalNote: 'Exploits unknown bugs. Ultimate power but very risky and expensive.'
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
    description: 'Detect suspicious activity',
    baseChance: 80,
    energyCost: 8,
    impactRange: [5, 10],
    threatImpact: -5,
    cooldown: 0,
    educationalNote: 'Monitors network for malicious activity. Basic but reliable.'
  },
  {
    id: 'firewall',
    name: 'Deploy Firewall',
    icon: '🔥',
    category: 'Network',
    description: 'Block malicious traffic',
    baseChance: 70,
    energyCost: 12,
    impactRange: [9, 15],
    threatImpact: -9,
    cooldown: 0,
    educationalNote: 'Filters network traffic to block threats. Solid defense.'
  },
  {
    id: 'vpn',
    name: 'VPN Encryption',
    icon: '🔒',
    category: 'Network',
    description: 'Encrypt all communications',
    baseChance: 60,
    energyCost: 17,
    impactRange: [13, 20],
    threatImpact: -13,
    cooldown: 1,
    educationalNote: 'Creates secure encrypted tunnel. Strong protection.'
  },
  {
    id: 'segmentation',
    name: 'Network Segmentation',
    icon: '🧱',
    category: 'Network',
    description: 'Isolate network sections',
    baseChance: 50,
    energyCost: 22,
    impactRange: [18, 27],
    threatImpact: -18,
    cooldown: 2,
    educationalNote: 'Divides network to contain breaches. Ultimate network defense.'
  },

  // Human Category (4 actions) - WEAK to STRONG
  {
    id: 'awareness',
    name: 'Security Awareness',
    icon: '👁️',
    category: 'Human',
    description: 'Promote vigilance culture',
    baseChance: 75,
    energyCost: 9,
    impactRange: [6, 11],
    threatImpact: -6,
    cooldown: 0,
    educationalNote: 'Creates security-conscious workplace. Simple and cheap.'
  },
  {
    id: 'training',
    name: 'Security Training',
    icon: '📚',
    category: 'Human',
    description: 'Educate staff on threats',
    baseChance: 65,
    energyCost: 13,
    impactRange: [10, 16],
    threatImpact: -10,
    cooldown: 0,
    educationalNote: 'Teaches employees to recognize social engineering. Effective.'
  },
  {
    id: 'accesscontrol',
    name: 'Access Control',
    icon: '🚫',
    category: 'Human',
    description: 'Restrict user permissions',
    baseChance: 55,
    energyCost: 16,
    impactRange: [12, 19],
    threatImpact: -12,
    cooldown: 1,
    educationalNote: 'Limits access based on role and need. Strong security.'
  },
  {
    id: 'mfa',
    name: 'Multi-Factor Auth',
    icon: '🔑',
    category: 'Human',
    description: 'Require multiple verifications',
    baseChance: 45,
    energyCost: 20,
    impactRange: [15, 24],
    threatImpact: -15,
    cooldown: 2,
    educationalNote: 'Requires multiple forms of authentication. Very secure.'
  },

  // Software Category (4 actions) - WEAK to STRONG
  {
    id: 'backup',
    name: 'Backup Data',
    icon: '💾',
    category: 'Software',
    description: 'Create recovery points',
    baseChance: 80,
    energyCost: 10,
    impactRange: [7, 13],
    threatImpact: -7,
    cooldown: 0,
    educationalNote: 'Ensures data can be restored after attack. Essential baseline.'
  },
  {
    id: 'antivirus',
    name: 'Antivirus Scan',
    icon: '🛡️',
    category: 'Software',
    description: 'Detect and remove malware',
    baseChance: 65,
    energyCost: 14,
    impactRange: [10, 17],
    threatImpact: -10,
    cooldown: 1,
    educationalNote: 'Scans for and removes malicious software. Standard protection.'
  },
  {
    id: 'patch',
    name: 'Patch Systems',
    icon: '🔧',
    category: 'Software',
    description: 'Fix known vulnerabilities',
    baseChance: 55,
    energyCost: 18,
    impactRange: [14, 21],
    threatImpact: -14,
    cooldown: 1,
    educationalNote: 'Updates software to fix security holes. Proactive defense.'
  },
  {
    id: 'encryption',
    name: 'Data Encryption',
    icon: '🔐',
    category: 'Software',
    description: 'Encrypt sensitive data',
    baseChance: 40,
    energyCost: 23,
    impactRange: [19, 29],
    threatImpact: -19,
    cooldown: 2,
    educationalNote: 'Protects data even if stolen. Maximum software protection.'
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
  // Hacker Network Combos (4)
  { from: 'portscan', to: 'mitm', name: '🔍 Recon Strike', bonus: 14, description: 'Scan then intercept' },
  { from: 'portscan', to: 'bruteforce', name: '🔍 Targeted Breach', bonus: 16, description: 'Find weakness, exploit it' },
  { from: 'ddos', to: 'bruteforce', name: '💥 Network Assault', bonus: 18, description: 'Overwhelm then crack' },
  { from: 'mitm', to: 'ddos', name: '🕵️ Disruption Chain', bonus: 15, description: 'Intercept then flood' },
  
  // Hacker Human Combos (4)
  { from: 'tailgating', to: 'pretexting', name: '🚪 Inside Job', bonus: 13, description: 'Physical then social' },
  { from: 'pretexting', to: 'phishing', name: '🎪 Trust Exploit', bonus: 16, description: 'Build trust, then strike' },
  { from: 'phishing', to: 'socialeng', name: '🎣 Social Chain', bonus: 18, description: 'Email to manipulation' },
  { from: 'socialeng', to: 'tailgating', name: '🎭 Full Access', bonus: 17, description: 'Manipulate then enter' },
  
  // Hacker Software Combos (4)
  { from: 'sqlinjection', to: 'malware', name: '💉 Database Infection', bonus: 15, description: 'Inject then deploy' },
  { from: 'malware', to: 'ransomware', name: '🦠 Escalation', bonus: 19, description: 'Infect then encrypt' },
  { from: 'ransomware', to: 'zeroday', name: '🔐 Total Lockdown', bonus: 22, description: 'Encrypt then exploit' },
  { from: 'phishing', to: 'malware', name: '🎣 Trojan Horse', bonus: 17, description: 'Trick into installing' },
  
  // Defender Network Combos (3)
  { from: 'ids', to: 'firewall', name: '🚨 Detect & Block', bonus: 14, description: 'Spot then stop' },
  { from: 'firewall', to: 'vpn', name: '🔥 Layered Defense', bonus: 17, description: 'Block then encrypt' },
  { from: 'vpn', to: 'segmentation', name: '🔒 Isolation Protocol', bonus: 20, description: 'Encrypt then isolate' },
  
  // Defender Human Combos (3)
  { from: 'awareness', to: 'training', name: '👁️ Educated Defense', bonus: 15, description: 'Aware then trained' },
  { from: 'training', to: 'accesscontrol', name: '📚 Smart Restrictions', bonus: 17, description: 'Train then restrict' },
  { from: 'accesscontrol', to: 'mfa', name: '🚫 Zero Trust', bonus: 19, description: 'Restrict then verify' },
  
  // Defender Software Combos (3)
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
