<div align="center">
  <br />
  <h1 align="center">Bingo Game Module</h1>
  <p align="center">
    A core game module for the <a href="https://github.com/yusufinann/GameHub"><strong>GameHub Platform</strong></a>.
    <br />
    Enjoy the classic game of Bingo with real-time multiplayer action!
  </p>
  <p align="center">
    <a href="#about-bingo"><strong>About Bingo</strong></a>
    ·
    <a href="#key-features"><strong>Key Features</strong></a>
    ·
    <a href="#gameplay-modes--styles"><strong>Gameplay Modes & Styles</strong></a>
    ·
    <a href="#how-to-play"><strong>How to Play</strong></a>
    ·
    <a href="#uninterrupted-gameplay-with-redis-integration"><strong>Resilience with Redis</strong></a>
    ·
    <a href="#bingo-game-screen-experience"><strong>Game Screen Experience</strong></a>
    ·
    <a href="#installation-as-a-module"><strong>Installation (as a Module)</strong></a>
  </p>
</div>

---

## 🎯 Overview

The **Bingo Game Module** is an integral part of the [GameHub Platform](https://github.com/yusufinann/GameHub), a web-based live game and social interaction platform. This module provides the complete Bingo gaming experience, designed to be seamlessly integrated within the GameHub's Lerna monorepo structure (typically found under the `packages/` directory).

Our goal with Bingo is to offer a fun, engaging, and social game of chance where players can connect with friends, compete, and enjoy the thrill of shouting "BINGO!" from the comfort of their homes.

---

<h2 id="about-bingo">✨ About Bingo</h2>

> Bingo is a game of chance. Mark numbers on your card as they are called. Be the first to complete a pattern and shout 'BINGO!' to win. Enjoy various modes and fun with friends.
> **Estimated Play Time:** 5-20 minutes (depending on mode)

Game Center Game Platform's Bingo brings this classic to life in a dynamic digital environment. Experience real-time gameplay, rich social features, and a user-friendly interface, making it a unique entertainment and community experience.

---

<h2 id="key-features">🚀 Key Features (within GameHub)</h2>

As a module of GameHub, Bingo benefits from the platform's robust features:

*   **🕹️ Part of a Multi-Game Platform:** Bingo is one of the exciting games offered, with more to come.
*   **👥 Social Interaction Focused:** Create or join Bingo lobbies, chat with friends, and enjoy the game together.
*   **⚡ Real-Time Live Gaming Experience:** Instant updates, synchronized gameplay, and real-time competition powered by WebSocket.
*   **🎨 Dynamic & Themed Tickets:** Each player receives a uniquely colored and laid-out Bingo ticket at the start of every game. These vibrant designs adapt to GameHub's active theme (Light, Dark, Neon-Ocean), ensuring a fresh and visually appealing experience every time you play.
*   **📱 Fully Responsive Design:** Seamless Bingo experience on desktop, tablet, and mobile devices.
*   **🌈 Customizable Theme Options:** Play Bingo in Light, Dark, or the vibrant Neon-Ocean theme.
*   **🌐 Multi-Language Support:** Bingo interface available in English and Turkish.
*   **🔔 Smart Notification System:** Instant notifications for game events, lobby activities, and invitations.
*   **📊 Detailed Player Profile:** Track your Bingo statistics, game history, and achievements.
*   **💬 Community and Chat Areas:** In-lobby chat enhances the social aspect of Bingo.
*   **🔄 Concurrent Gameplay:** Players can participate in Bingo games across multiple lobbies simultaneously on the GameHub platform.

---

<h2 id="gameplay-modes--styles">⚙️ Gameplay Modes & Styles</h2>

Bingo in GameHub offers flexible gameplay options to suit every player's preference, controlled by the lobby host:

### Drawing Mechanics

*   **Automatic Draw:** Numbers are drawn automatically by the system at a set interval.
*   **Manual Draw:** The host can designate a player (or themselves) to manually draw numbers, giving a more traditional feel to the game.
    *   *Resilience Note:* If a player designated for manual drawing is kicked or leaves, the game automatically switches to "Automatic Draw" mode to ensure continuity.

### Game Speed Modes (for Automatic Draw)

1.  **Classic Bingo**
    *   **Speed:** 5 seconds per number
    *   **Features:**
        *   Dive into timeless fun with standard rules!
        *   Perfect pace for endless excitement.
        *   Stay sharp—complacency is not allowed!
2.  **Extended Time Bingo**
    *   **Speed:** 10 seconds per number
    *   **Features:**
        *   Savor every number with 10s to spare.
        *   Relaxed vibes for a laid-back game.
        *   Extra time to mark and chill.
3.  **Super Fast Bingo**
    *   **Speed:** 3 seconds per number
    *   **Features:**
        *   Lightning-speed calls—think quick!
        *   Only 3s to spot your number—ready, set, go!

### Competition Styles

1.  **Competitive Mode**
    *   **Features:**
        *   Ranked play: Players earn points based on their ranking (1st to call Bingo, 2nd, etc.).
        *   Full game duration: The game continues until a set number of winners or conditions are met.
        *   Score tracking for player statistics.
2.  **Casual Mode (Non-Competitive)**
    *   **Features:**
        *   First win ends game: The first player to correctly call Bingo wins the round, and the game concludes.
        *   Friendly play focused on quick fun.
        *   Ideal for quick matches.

---

<h2 id="how-to-play">📖 How to Play Bingo</h2>

1.  **Join a Lobby:** Find an active Bingo lobby on the GameHub main screen or game detail page, or create your own.
2.  **Get Your Cards:** Once in the lobby and the host starts the game, you'll receive your unique, dynamically styled Bingo card(s).
3.  **Listen for Numbers:** The game will call out numbers one by one (either automatically or manually by the host/designated player, depending on the selected game mode).
4.  **Mark Your Card:** If a called number matches one on your card, mark it.
5.  **Shout BINGO!:** Be the first to complete a required pattern (e.g., a line, full house – specific patterns depend on host settings if applicable) and click the "Call Bingo!" button.
    *   *(Note: Players can participate in Bingo games across multiple lobbies simultaneously, though managing several active games might require keen attention!)*

---

<h2 id="uninterrupted-gameplay-with-redis-integration">🛡️ Uninterrupted Gameplay with Redis Integration</h2>

The Bingo module benefits significantly from GameHub's robust backend **Redis integration**, ensuring an exceptionally stable and resilient gaming experience.

*   **Game State Persistence:** Critical in-game data, such as drawn numbers, player card states, current game progress, and active timers (like auto-draw intervals), is actively managed and persisted in Redis. You can explore the backend implementation details [here](https://github.com/yusufinann/GameHub/tree/master/backend).
*   **Resilience to Disruptions:** In the event of temporary backend restarts or network interruptions, the active Bingo game state is preserved in Redis. Once the backend services are restored, players can seamlessly resume their game exactly where they left off. This prevents data loss and frustrating game freezes, ensuring continuity.
*   **Automatic Timer Recovery:** Game-critical timers, including the 3s/5s/10s auto-draw intervals, are meticulously managed and persisted. Should the backend restart, these timer states are recovered, allowing games to resume their pace without missing a beat.

This Redis-powered architecture ensures that your Bingo sessions are shielded from common backend issues, providing maximum durability and high performance for in-game interactions.

---

<h2 id="bingo-game-screen-experience">🎲 Bingo Game Screen Experience</h2>

This section details the features and interactions on the Bingo game screen, as provided by the GameHub platform.

**Bingo in Normal Lobby:**

*   **👑 Host Control:** Lobby creator's authority over game settings (drawing mechanics, speed, competition style) and starting the game.
*   **🚪 Easy User Participation:** Quick participation via lobby link, main screen, or game detail page.
*   **🏁 Game Start:** Initiated by the host, often with a 5-second countdown timer.
*   **⚡ Real-Time Gaming Experience:** Real-time and synchronized game flow for all players.
*   **🔊 In-Game Sound Control:** Option to turn sound effects on/off.
*   **💬 In-Game Messaging (Chat):** Communication with animated chat area and emoji support.
*   **😄 Quick Emoji Sending:** Ability to quickly express emotions.
*   **<img src="https://cdn-icons-png.flaticon.com/512/446/446833.png" alt="Area" width="20" style="vertical-align: middle;"> Game Area:** The main interface displaying Bingo cards, drawn numbers, etc.
*   **📣 "Call Bingo!" Button:** Button activated when a player believes they have achieved Bingo.
*   **<img src="https://cdn-icons-png.flaticon.com/512/446/446847.png" alt="Draw" width="20" style="vertical-align: middle;"> "Draw Number" Button (Manual Mode):** Control for the designated player to draw numbers.
*   **🔢 Drawn Numbers List:** Ability to track all numbers called during the game.
*   **🔥 Active Numbers Area:** Highlighting the latest drawn numbers for easy visibility.
*   **🎫 Bingo Ticket (Your Ticket):** Player's personal, uniquely styled bingo card(s).
*   **<img src="https://cdn-icons-png.flaticon.com/512/446/446823.png" alt="Card" width="20" style="vertical-align: middle;"> Card Selection:** If multiple cards are in play, ability to switch between them.
*   **🏆 Completing Players List:** Real-time list of players who have successfully called Bingo.
*   **<img src="https://cdn-icons-png.flaticon.com/512/446/446854png" alt="Ranking" width="20" style="vertical-align: middle;"> Game Over and Ranking Table:** Display of game results, player rankings (in competitive mode), and options to "Play Again."
*   **💾 Game History Recording (Database & Redis Cache):** Game results are persisted in MongoDB for long-term player statistics, with recent final scores potentially cached in Redis for quick access (as per GameHub's caching strategy).
*   **⏳ If Host Leaves Lobby:** Lobby automatically closes if they do not return within 8 hours.
*   **🛠️ Host Kicking Player:** If a host removes a player who was manually drawing numbers, the game intelligently switches to an automatic number drawing mode.

**Bingo in Event Lobby:**

*   **⏱️ Event Timer:** Dynamically showing the time remaining until the event starts.
*   **👑 Host Control (Event Lobby):** Event owner host's authority to start the game.
*   **🔔 Event Start Notification:** Instant notification to lobby members when the event starts.
*   **🚀 Starting Game in Event Lobby:** Start with game mode selection modal presented by the host.
*   **<img src="https://cdn-icons-png.flaticon.com/512/446/446831.png" alt="Countdown" width="20" style="vertical-align: middle;"> Countdown and Game Start (Event Lobby):** Exciting start with a 3-second countdown.
*   **🎲 Bingo in Event Lobby:** Same rich gaming experience as normal lobby, respecting event time constraints.
*   **💬 In-Game Snackbar Notifications:** Instant notifications during gameplay for various events.
*   **<img src="https://cdn-icons-png.flaticon.com/512/446/446835.png" alt="Joining" width="20" style="vertical-align: middle;"> Notifications to Users When Joining Game:** Instant notification when a new player joins.
*   **❌ Incorrect Bingo Call Notification (Audible and Silent):** Instant feedback and buzzer sound in case of an erroneous "Bingo!" call.
*   **🚪 User Joining Lobby Notification (Audible and Silent):** Instant notification when a new player joins the lobby.
*   **<img src="https://cdn-icons-png.flaticon.com/512/446/446851.png" alt="Deletion" width="20" style="vertical-align: middle;"> Notification When Lobby is Deleted (Animated Modal):** Animated notification when lobby is deleted by host or the event time expires.
    *   **🗑️ Lobby Deleted by Host:** "Lobby No Longer Available" modal and countdown.
    *   **⌛ Event Lobby Time Expired:** "Lobby No Longer Available" modal and countdown.

---

<h2 id="installation-as-a-module">🔧 Installation (as a Module)</h2>

This section outlines how to add the Bingo game module to an existing Lerna monorepo project.

**Prerequisites:**

*   An existing Lerna monorepo setup.
*   Git installed.

**Steps:**

1.  **Navigate to your Lerna project's `packages` directory:**
    ```bash
    cd path/to/your-lerna-project/packages
    ```

2.  **Clone the Bingo game repository:**
    (Assuming your Bingo module repository is `https://github.com/yusufinann/bingo-game.git` - replace if different)
    ```bash
    git clone https://github.com/yusufinann/bingo-game.git bingo-game-module 
    ```
    This will create a `bingo-game-module` folder (or your chosen name) within your `packages` directory.

3.  **Bootstrap Lerna (from your monorepo root):**
    After cloning, navigate back to the root of your Lerna project and run:
    ```bash
    cd ../ # If you were in the packages directory
    lerna bootstrap
    # or if you are using yarn workspaces with your Lerna project
    # yarn install 
    ```
    This command will link the local packages and install their dependencies.

**Important Considerations:**

*   **Dependencies & Integration:** This Bingo module is **designed and optimized to work within the [GameHub Platform](https://github.com/yusufinann/GameHub)**. While you can clone it as a standalone package, it relies on certain frontend components, backend APIs, context providers, and WebSocket communication established by the GameHub's `game-center` (frontend) and `backend` packages.
*   **Functionality:** Without the surrounding GameHub infrastructure, full functionality (like user authentication, lobby management outside the game, profile integration, Redis-backed resilience for game state, etc.) may not be available or may require significant adaptation.
*   **Primary Use:** The primary and recommended way to use this Bingo game is by cloning and running the entire [GameHub Platform](https://github.com/yusufinann/GameHub) as instructed in its main README.

---

## 🛠️ Technology Stack

The Bingo game module leverages the core technology stack of the [GameHub platform](https://github.com/yusufinann/GameHub):

*   **Frontend:** React, Material UI, React Context, Axios, react-router-dom
*   **Backend Communication:** Via GameHub's Node.js, Express, MongoDB, Mongoose, Jsonwebtoken backend.
*   **Real-time Communication:** WebSocket (managed by GameHub)
*   **State Resilience:** Redis (via GameHub's backend integration)
*   **Monorepo Management:** Lerna

---

## 🔗 Integration within GameHub (Primary Setup)

*   This Bingo game is a submodule intended for use within the `GameHub` Lerna monorepo.
*   Its source code is typically located in a directory like `packages/bingo-game-module` within the main [GameHub repository](https://github.com/yusufinann/GameHub).
*   All primary installation, setup, and execution are handled from the root of the `GameHub` project. Please refer to the [main GameHub README](https://github.com/yusufinann/GameHub#installation-and-setup) for comprehensive setup instructions.

---

## 🤝 Contributing & Issues

Contributions, issues, and feature requests are welcome! Please raise them in the [main GameHub repository's issues section](https://github.com/yusufinann/GameHub/issues).

---

<div align="center">
  <p>
    <a href="https://github.com/yusufinann/GameHub">
      <img src="https://img.shields.io/badge/Main%20Project-GameHub-blueviolet.svg?style=for-the-badge&logo=github" alt="Main Project">
    </a>
    <a href="#">
      <img src="https://img.shields.io/badge/Game-Bingo-orange.svg?style=for-the-badge" alt="Game: Bingo">
    </a>
  </p>
</div>
