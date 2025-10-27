# Reset Leaderboard (If Needed)

## When to Reset

Only reset if you have old leaderboard data with the wrong format (individual games instead of player stats).

## How to Reset

### Option 1: Firebase Console (Recommended)

1. Go to https://console.firebase.google.com/
2. Select your project
3. Click "Realtime Database" in left sidebar
4. Find the "leaderboard" node
5. Click the 3 dots next to it
6. Select "Delete"
7. Confirm deletion

### Option 2: Keep Old Data

If you want to keep the old data for reference:

1. In Firebase Console, go to Realtime Database
2. Find "leaderboard" node
3. Click the 3 dots
4. Select "Export JSON"
5. Save the file as backup
6. Then delete the "leaderboard" node

## After Reset

1. Apply the new database rules from `database.rules.json`
2. Play a game
3. Check leaderboard - should now show unique players!

## New Leaderboard Format

Each player appears ONCE with:
- **Best Score**: Their highest score ever
- **Total Score**: Sum of all their game scores
- **Games Played**: Total number of games
- **Wins**: Number of wins
- **Recent Game**: Their last game (score, role, result)
- **Win Rate**: Calculated percentage

## No Reset Needed If

- You're starting fresh (no old data)
- Your leaderboard already shows unique players
- You just deployed for the first time

---

**The new system automatically updates player stats with each game!**
