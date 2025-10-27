# 🎮 HackNet Arena

**A strategic cybersecurity card game where you battle as a Hacker or Defender!**

[![Made with React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Powered by Firebase](https://img.shields.io/badge/Firebase-Realtime-orange.svg)](https://firebase.google.com/)
[![Styled with Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8.svg)](https://tailwindcss.com/)

🎮 **[Play Now](https://hacknetarena.vercel.app/)** | 📖 **[Full Documentation](docs/FINAL_PROJECT_DOCUMENTATION.md)** | 🎯 **[Game Guide](docs/GAME_GUIDE.md)**

---

## 🌟 **Features**

### **Gameplay:**
- ⚔️ **Turn-based strategy** with 12 unique actions
- 🔥 **6 powerful combos** for bonus damage
- 📈 **Momentum system** rewards consecutive wins
- 🛡️ **Counter mechanics** for strategic depth
- ⚡ **Energy management** with cooldowns
- 🎯 **4 win conditions** for varied gameplay
- ♾️ **Infinite rounds** until win condition

### **User Features:**
- 🔐 **Firebase Authentication** (persistent login)
- 👤 **Profile page** with game history
- 📊 **Stats tracking** (wins, losses, win rate)
- 🏆 **Dynamic leaderboard** with filters
- 📖 **In-game guide** with tips and strategies
- 🎨 **Beautiful UI/UX** with animations
- 📱 **Responsive design** (mobile/tablet/desktop)

### **Visual Polish:**
- 🌌 **3D background** with Three.js (full on home, subtle in-game)
- 🎨 **Color-coded cards** (red/blue/green)
- 💫 **Animated threat meter** (shakes, pulses, color zones)
- 🎉 **Mini-reward popups** (combos, counters, momentum, threats)
- 🔊 **Sound effects** (clicks, success/fail, combos, counters)
- ✨ **Smooth animations** (60 FPS)
- ⚡ **Energy warnings** (red glow when low)
- 📊 **Visual feedback** (pulses, glows, particle effects)
- 🎯 **Static navbar** (professional, always accessible)

---

## 🚀 **Quick Start**

### **Play Online:**
🎮 **[Play HackNet Arena](https://hacknetarena.vercel.app/)**

### **Local Development:**

```bash
# Clone repository
git clone https://github.com/arjunjaincs/hacknetarena
cd hacknetarena

# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser
http://localhost:3000
```

---

## 🎯 **How to Play**

### **Choose Your Role:**
- **🎯 Hacker**: Raise threat to 100 or destroy network
- **🛡️ Defender**: Keep threat < 40 for 3 rounds

### **Each Round:**
1. Select an action card
2. Confirm (or double-click for instant submit)
3. AI opponent takes their turn
4. See results and plan next move

### **Win Conditions:**
- **Hacker**: Threat ≥ 100 OR Network ≤ 0
- **Defender**: Threat < 40 for 3 consecutive rounds
- **Draw**: Both players energy < 15

---

## 🔥 **Key Mechanics**

### **6 Essential Combos:**

**Hacker:**
- 🎣 **Social Chain**: Phishing → Social Engineering (+15)
- 💥 **Network Assault**: DDoS → Brute Force (+18)
- ⚡ **Exploit Chain**: Malware → Zero-Day (+20)

**Defender:**
- 🛡️ **Fortified Watch**: Firewall → Monitoring (+15)
- 🔧 **Secure Foundation**: Patch → Backup (+18)
- 📚 **Aware Defense**: Training → Antivirus (+15)

### **Momentum System:**
- Build momentum with consecutive wins
- +5% success chance per win (max +25%)
- Creates comeback mechanics

### **Counter System:**
- Network counters Software (-40%)
- Human counters Network (-40%)
- Software counters Human (-40%)

---

## 🏆 **Leaderboard Features**

### **Filters:**
- **Role**: All / Hackers / Defenders
- **Time**: All Time / Today / Week / Month
- **Dynamic**: Updates in real-time
- **Highlight**: Your rank shown in cyan

### **Stats:**
- Top score
- Total players
- Average score
- Your position

---

## 👤 **Profile System**

### **View Your:**
- Game history (last 20 games)
- Win/loss record
- Win rate percentage
- Best score
- Average score
- Total rounds played

### **Each Game Shows:**
- Score and result
- Role played
- Rounds completed
- Threat level
- Network integrity
- Combos earned

---

## 🛠️ **Tech Stack**

### **Frontend:**
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Three.js** - 3D background

### **Backend:**
- **Firebase Auth** - User authentication
- **Firebase Realtime Database** - Data storage
- **Firebase Hosting** - Deployment

### **Audio:**
- **Web Audio API** - Sound effects

---

## 📁 **Project Structure**

```
src/
├── components/       # Reusable UI components
├── firebase/         # Backend integration
├── game/             # Core game logic
├── pages/            # Main screens
└── App.jsx           # Main router

public/               # Static assets
dist/                 # Production build
```

---

## 🎨 **Screenshots**

### **Home Screen:**
Choose your role and start playing!

### **Game Screen:**
Strategic card-based gameplay with visual feedback.

### **Profile Page:**
Track your progress and game history.

### **Leaderboard:**
Compete with players worldwide!

---

## 🔧 **Configuration**

### **Environment Variables:**

Create `.env` file:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### **Firebase Database Rules:**

**IMPORTANT:** Apply these rules to fix the leaderboard indexing error:

```bash
# Deploy database rules
firebase deploy --only database
```

The `database.rules.json` file includes required indexes for:
- Leaderboard sorting by score, timestamp, and role
- Game history sorting by timestamp
- Proper read/write permissions

---

## 🚀 **Deployment**

### **Vercel (Recommended):**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **Firebase Hosting:**

```bash
# Install Firebase CLI
npm i -g firebase-tools

# Login
firebase login

# Deploy
firebase deploy
```

---


## 🎓 **Educational Value**

Learn real cybersecurity concepts:
- **DDoS Attacks** - Distributed Denial of Service
- **Phishing** - Social engineering tactics
- **Zero-Day Exploits** - Unknown vulnerabilities
- **Firewalls** - Network protection
- **Patch Management** - Fixing vulnerabilities
- **Backup Strategies** - Data recovery

---

## 🤝 **Contributing**

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📝 **License**

MIT License - feel free to use for learning and projects!

---

## 🎮 **Game Stats**

- **12 Actions** (6 Hacker, 6 Defender)
- **6 Combos** (3 per role)
- **4 Win Conditions**
- **Infinite Rounds**
- **~50/50 Win Rate** (balanced AI)

---

## 🌟 **Highlights**

### **Strategic Depth:**
- Plan combos 2 rounds ahead
- Predict opponent patterns
- Manage energy and cooldowns
- Counter opponent's strategy

### **Visual Feedback:**
- Color-coded action cards
- Animated threat meter
- Mini-reward popups
- Smooth transitions

### **Competitive:**
- Real-time leaderboard
- Multiple time periods
- Role-specific rankings
- Profile statistics

---

## 🔮 **Future Enhancements**

- [ ] Weekly tournaments
- [ ] Streak rewards
- [ ] AI difficulty levels
- [ ] Replay system
- [ ] Share results
- [ ] More action cards
- [ ] Custom game modes
- [ ] Achievements system

---

## 💡 **Tips**

### **For Hackers:**
- Build momentum early
- Save Zero-Day for high momentum
- Use combos for burst damage
- Watch defender patterns

### **For Defenders:**
- Keep threat below 40
- Counter hacker patterns
- Use high-success actions
- Build defensive combos

---

## 🙏 **Acknowledgments**

Built with:
- React for amazing framework
- Firebase for backend services
- Tailwind CSS for styling
- Three.js for 3D graphics
- Vercel for hosting

---

## 🎉 **Start Playing!**

```bash
npm install
npm run dev
```

**Have fun and learn cybersecurity!** 🎮✨

---

**Made with ❤️ by Arjun Jain**

⭐ **Star this repo if you enjoyed the game!**
