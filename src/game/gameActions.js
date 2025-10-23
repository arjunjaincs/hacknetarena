/**
 * Game Actions - Enhanced with Synergies
 * 
 * Each action has:
 * - Category (Network/Human/Software)
 * - Energy Cost (8-25)
 * - Cooldown (0-3 rounds)
 * - Base Success Chance (30-75%)
 * - Impact Range
 * - Threat Impact
 * 
 * SYNERGIES:
 * - Phishing → Social Engineering = "Social Chain" (+10 bonus)
 * - DDoS → Brute Force = "Network Assault" (+12 bonus)
 * - Malware → Zero-Day = "Exploit Chain" (+15 bonus)
 * - And more...
 */

// ============================================================================
// HACKER ACTIONS
// ============================================================================

export const HACKER_ACTIONS = [
  {
    id: 'ddos',
    name: 'DDoS Attack',
    icon: '💥',
    category: 'Network',
    description: 'Flood servers with traffic',
    baseChance: 65,
    energyCost: 10,
    impactRange: [8, 14],
    threatImpact: 8,
    cooldown: 0,
    educationalNote: 'Distributed Denial of Service overwhelms systems with requests. Countered by Firewalls. Combos with Brute Force for "Network Assault".'
  },
  {
    id: 'phishing',
    name: 'Phishing',
    icon: '🎣',
    category: 'Human',
    description: 'Trick users via fake emails',
    baseChance: 70,
    energyCost: 12,
    impactRange: [10, 16],
    threatImpact: 10,
    cooldown: 0,
    educationalNote: 'Social engineering via deceptive emails. Countered by Security Training. Combos with Social Engineering for "Social Chain" or Malware for "Trojan Horse".'
  },
  {
    id: 'malware',
    name: 'Deploy Malware',
    icon: '🦠',
    category: 'Software',
    description: 'Install malicious code',
    baseChance: 60,
    energyCost: 15,
    impactRange: [12, 20],
    threatImpact: 12,
    cooldown: 1,
    educationalNote: 'Malicious software that steals data. Countered by Antivirus. Combos with Zero-Day for "Exploit Chain".'
  },
  {
    id: 'socialeng',
    name: 'Social Engineering',
    icon: '🎭',
    category: 'Human',
    description: 'Manipulate employees',
    baseChance: 65,
    energyCost: 14,
    impactRange: [11, 17],
    threatImpact: 11,
    cooldown: 0,
    educationalNote: 'Psychological manipulation for access. Countered by Security Training. Combos with Phishing for "Social Chain" or Brute Force for "Inside Job".'
  },
  {
    id: 'bruteforce',
    name: 'Brute Force',
    icon: '🔨',
    category: 'Network',
    description: 'Crack passwords rapidly',
    baseChance: 50,
    energyCost: 18,
    impactRange: [15, 24],
    threatImpact: 15,
    cooldown: 2,
    educationalNote: 'Automated password cracking. Countered by Firewalls. Combos with DDoS for "Network Assault".'
  },
  {
    id: 'zeroday',
    name: 'Zero-Day Exploit',
    icon: '⚡',
    category: 'Software',
    description: 'Exploit unknown vulnerability',
    baseChance: 40,
    energyCost: 25,
    impactRange: [20, 32],
    threatImpact: 20,
    cooldown: 3,
    educationalNote: 'Exploits unknown bugs before patches exist. Very powerful but risky and exhausting. Combos with Malware for "Zero Infection".'
  }
];

// ============================================================================
// DEFENDER ACTIONS
// ============================================================================

export const DEFENDER_ACTIONS = [
  {
    id: 'firewall',
    name: 'Deploy Firewall',
    icon: '🛡️',
    category: 'Network',
    description: 'Block unauthorized access',
    baseChance: 75,
    energyCost: 12,
    impactRange: [8, 14],
    threatImpact: 10,
    cooldown: 0,
    educationalNote: 'Controls network traffic. Counters Network attacks (DDoS, Brute Force). Combos with Monitoring for "Fortified Watch" or Antivirus for "Full Shield".'
  },
  {
    id: 'training',
    name: 'Security Training',
    icon: '📚',
    category: 'Human',
    description: 'Educate employees',
    baseChance: 70,
    energyCost: 10,
    impactRange: [6, 12],
    threatImpact: 8,
    cooldown: 0,
    educationalNote: 'Creates "human firewall". Counters Human attacks (Phishing, Social Engineering). Combos with Antivirus for "Aware Defense".'
  },
  {
    id: 'antivirus',
    name: 'Update Antivirus',
    icon: '💊',
    category: 'Software',
    description: 'Scan and remove malware',
    baseChance: 72,
    energyCost: 13,
    impactRange: [10, 16],
    threatImpact: 12,
    cooldown: 1,
    educationalNote: 'Detects and removes malicious software. Counters Software attacks (Malware, Zero-Day). Combos with Training for "Aware Defense" or Firewall for "Full Shield".'
  },
  {
    id: 'monitoring',
    name: 'Network Monitoring',
    icon: '👁️',
    category: 'Network',
    description: 'Watch for suspicious activity',
    baseChance: 68,
    energyCost: 8,
    impactRange: [5, 10],
    threatImpact: 6,
    cooldown: 0,
    educationalNote: 'Continuous surveillance detects attacks early. Combos with Firewall for "Fortified Watch" or Patch for "Vigilant Update".'
  },
  {
    id: 'patch',
    name: 'Patch Systems',
    icon: '🔧',
    category: 'Software',
    description: 'Fix vulnerabilities',
    baseChance: 75,
    energyCost: 15,
    impactRange: [12, 18],
    threatImpact: 15,
    cooldown: 2,
    educationalNote: 'Updates fix security holes. Very effective but takes time. Combos with Backup for "Secure Foundation".'
  },
  {
    id: 'backup',
    name: 'Backup Data',
    icon: '💾',
    category: 'Software',
    description: 'Create secure copies',
    baseChance: 80,
    energyCost: 12,
    impactRange: [8, 14],
    threatImpact: 10,
    cooldown: 1,
    educationalNote: 'Ensures recovery from attacks. High success rate. Combos with Patch for "Secure Foundation".'
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getActionsForRole(role) {
  return role === 'hacker' ? HACKER_ACTIONS : DEFENDER_ACTIONS;
}

export function getActionById(id, role) {
  const actions = getActionsForRole(role);
  return actions.find(a => a.id === id);
}

export function isActionAvailable(action, energy, cooldowns) {
  const onCooldown = cooldowns[action.id] > 0;
  const hasEnergy = energy >= action.energyCost;
  return !onCooldown && hasEnergy;
}

export function getAvailableActions(role, energy, cooldowns) {
  const actions = getActionsForRole(role);
  return actions.filter(a => isActionAvailable(a, energy, cooldowns));
}

// Get synergy description for UI
export function getSynergyDescription(currentActionId, previousActionId) {
  const combos = {
    'phishing->socialeng': 'Social Chain',
    'socialeng->phishing': 'Social Chain',
    'ddos->bruteforce': 'Network Assault',
    'bruteforce->ddos': 'Brute Flood',
    'malware->zeroday': 'Exploit Chain',
    'zeroday->malware': 'Zero Infection',
    'phishing->malware': 'Trojan Horse',
    'socialeng->bruteforce': 'Inside Job',
    'firewall->monitoring': 'Fortified Watch',
    'monitoring->firewall': 'Alert Defense',
    'training->antivirus': 'Aware Defense',
    'antivirus->training': 'Tech Training',
    'patch->backup': 'Secure Foundation',
    'backup->patch': 'Recovery Ready',
    'firewall->antivirus': 'Full Shield',
    'monitoring->patch': 'Vigilant Update'
  };
  
  const key = `${previousActionId}->${currentActionId}`;
  return combos[key] || null;
}
