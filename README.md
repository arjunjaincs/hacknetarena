# 🎮 HackNet Arena

> **A strategic cybersecurity card game where you learn real hacking and defense techniques through gameplay.**

[![Live Demo](https://img.shields.io/badge/🎮-Play_Now-00f5ff?style=for-the-badge)](https://hacknetarena.vercel.app/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Realtime-FFCA28?style=flat&logo=firebase)](https://firebase.google.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

---

## 🚀 What Is This?

**HackNet Arena** is a turn-based strategy game that teaches cybersecurity through interactive combat. Play as a **Hacker** (offensive) or **Defender** (protective) and battle an intelligent AI using real-world cyber tactics.

### Why It's Awesome:
- 🎯 **24 Unique Actions** - 12 per role, 6 random each game
- ⚡ **18 Powerful Combos** - Chain actions for massive damage
- 🤖 **Smart AI** - Learns your patterns and adapts
- 🏆 **Global Leaderboard** - Compete with players worldwide
- 📚 **Learn Real Security** - Every action teaches actual concepts

---

## ✨ Features

### 🎮 Gameplay
- **Rotation System**: 6 random actions per game from 12 total → Every game feels unique
- **Energy Management**: 100 energy, +15 regen/round → Strategic resource planning
- **Combo System**: 18 combos with +13-22 bonus damage → Reward skillful play
- **Momentum**: Win streaks give +5% success (max +25%) → Snowball advantage
- **Counter System**: AI predicts patterns → -40% penalty for predictability

### 🎨 Visual Polish
- **3D Background**: Three.js animated cyber grid
- **Dynamic UI**: Responsive design for mobile/tablet/desktop
- **Sound Effects**: Audio feedback for combos, counters, threats
- **Animations**: Smooth 60 FPS with particle effects
- **Color Coding**: Red (Network), Yellow (Human), Purple (Software)

### 🔥 Competitive
- **Unique Leaderboard**: Shows best score + total score per player
- **Profile Stats**: Track wins, losses, win rate, total games
- **Guest Mode**: Play without login, save scores when ready
- **Firebase Sync**: Real-time score updates

---

## 🎯 How to Play

### Choose Your Role:

**🎯 Hacker (Offensive)**
- **Goal**: Raise threat to 100 OR reduce network integrity to 0
- **Strategy**: Chain high-damage attacks, build combos, overwhelm defenses
- **Playstyle**: Aggressive, high-risk/high-reward

**🛡️ Defender (Protective)**
- **Goal**: Keep threat < 40 for 3 rounds OR survive until hacker runs out of energy
- **Strategy**: Block attacks, reduce threat, manage resources
- **Playstyle**: Reactive, consistent, patient

### Action Tiers:
- **Weak (8-10 energy)**: Spam-able, 75-80% success, low damage
- **Medium (12-16 energy)**: Balanced, 60-70% success, moderate damage
- **Strong (17-21 energy)**: Powerful, 45-60% success, high damage
- **Ultimate (22-25 energy)**: Game-changers, 35-50% success, massive damage

---

## 🎴 All 24 Actions

### 🎯 Hacker Actions (12)

**Network (4):**
- 🔍 **Port Scanning** (8E) - Find vulnerabilities → Weak but reliable
- 💥 **DDoS Attack** (12E) - Flood servers → Medium power
- 🕵️ **Man-in-the-Middle** (17E) - Intercept comms → Strong
- 🔨 **Brute Force** (22E) - Crack passwords → Ultimate power

**Human (4):**
- 🚪 **Tailgating** (9E) - Physical breach → Simple
- 🎪 **Pretexting** (13E) - False scenarios → Moderate
- 🎣 **Phishing** (16E) - Fake emails → Strong
- 🎭 **Social Engineering** (20E) - Manipulation → Very powerful

**Software (4):**
- 💉 **SQL Injection** (10E) - Database attack → Quick
- 🦠 **Deploy Malware** (15E) - Malicious code → Balanced
- 🔐 **Ransomware** (21E) - Encrypt & demand → Very damaging
- ⚡ **Zero-Day Exploit** (25E) - Unknown bugs → Ultimate

### 🛡️ Defender Actions (12)

**Network (4):**
- 🚨 **Intrusion Detection** (8E) - Monitor threats → Basic
- 🔥 **Deploy Firewall** (12E) - Block traffic → Solid
- 🔒 **VPN Encryption** (17E) - Secure tunnel → Strong
- 🧱 **Network Segmentation** (22E) - Isolate sections → Ultimate

**Human (4):**
- 👁️ **Security Awareness** (9E) - Vigilance culture → Simple
- 📚 **Security Training** (13E) - Educate staff → Effective
- 🚫 **Access Control** (16E) - Restrict permissions → Strong
- 🔑 **Multi-Factor Auth** (20E) - Multiple verifications → Very secure

**Software (4):**
- 💾 **Backup Data** (10E) - Recovery points → Essential
- 🛡️ **Antivirus Scan** (14E) - Remove malware → Standard
- 🔧 **Patch Systems** (18E) - Fix vulnerabilities → Proactive
- 🔐 **Data Encryption** (23E) - Protect data → Maximum security

---

## ⚡ Combo System (18 Total)

### 🎯 Hacker Combos:
- 🔍 **Recon Strike**: Port Scan → MITM (+14)
- 💥 **Network Assault**: DDoS → Brute Force (+18)
- 🎣 **Social Chain**: Phishing → Social Eng (+18)
- 🦠 **Escalation**: Malware → Ransomware (+19)
- 🔐 **Total Lockdown**: Ransomware → Zero-Day (+22)

### 🛡️ Defender Combos:
- 🚨 **Detect & Block**: IDS → Firewall (+14)
- 🔥 **Layered Defense**: Firewall → VPN (+17)
- 📚 **Smart Restrictions**: Training → Access Control (+17)
- 🛡️ **Proactive Defense**: Antivirus → Patch (+18)
- 🔧 **Hardened Security**: Patch → Encryption (+21)

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Tailwind CSS, Three.js
- **Backend**: Firebase (Auth + Realtime Database)
- **Deployment**: Vercel
- **Build**: Vite
- **State**: React Hooks

---

## 🚀 Quick Start

### Play Online:
**👉 [hacknetarena.vercel.app](https://hacknetarena.vercel.app/)**

### Local Development:

```bash
# Clone
git clone https://github.com/arjunjaincs/hacknetarena
cd hacknetarena

# Install
npm install

# Run
npm run dev

# Build
npm run build
```

### Firebase Setup (Optional):

1. Create Firebase project
2. Enable Authentication + Realtime Database
3. Create `.env`:
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_DATABASE_URL=your_db_url
VITE_FIREBASE_PROJECT_ID=your_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender
VITE_FIREBASE_APP_ID=your_app_id
```
4. Apply database rules from `database.rules.json`

---

## 📊 Game Stats

- **24 Actions** (12 per role)
- **18 Combos** (9 per role)
- **6 Actions/Game** (rotation system)
- **4 Win Conditions**
- **~50/50 Win Rate** (balanced AI)
- **Infinite Replayability**

---

## 🎯 Learning Outcomes

Players learn:
- **Network Security**: DDoS, MITM, Firewalls, VPNs
- **Social Engineering**: Phishing, Pretexting, Training
- **Software Security**: Malware, Ransomware, Encryption, Patching
- **Defense Strategies**: Layered security, Zero Trust, Backups
- **Risk Management**: Energy costs, success rates, trade-offs

---

## 📱 Responsive Design

- **Mobile**: Touch-friendly, compact UI, icon navigation
- **Tablet**: Balanced layout, readable text
- **Desktop**: Full experience, all features visible

---

## 🤝 Contributing

Pull requests welcome! Please:
1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a PR

---

## 📄 License

MIT License - Free to use for learning and projects!

---

## 🌟 Star This Repo!

If you found this helpful, give it a ⭐ on GitHub!

**Built with 💙 by [Arjun Jain](https://github.com/arjunjaincs)**

---

**🎮 Ready to play? [Launch HackNet Arena →](https://hacknetarena.vercel.app/)**
