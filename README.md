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
    <a href="#how-to-play"><strong>How to Play</strong></a>
    ·
    <a href="#game-rules-and-validations"><strong>Game Rules & Validations</strong></a>
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
> **Estimated Play Time:** 20 minutes

Game Center Game Platform's Bingo brings this classic to life in a dynamic digital environment. Experience real-time gameplay, rich social features, and a user-friendly interface, making it a unique entertainment and community experience.

---

<h2 id="key-features">🚀 Key Features (within GameHub)</h2>

As a module of GameHub, Bingo benefits from the platform's robust features:

*   **🕹️ Part of a Multi-Game Platform:** Bingo is one of the exciting games offered, with more to come.
*   **👥 Social Interaction Focused:** Create or join Bingo lobbies, chat with friends, and enjoy the game together.
*   **⚡ Real-Time Live Gaming Experience:** Instant updates, synchronized gameplay, and real-time competition powered by WebSocket.
*   **🎨 User-Friendly and Stylish Interface:** Modern and intuitive design using React and Material UI.
*   **📱 Fully Responsive Design:** Seamless Bingo experience on desktop, tablet, and mobile devices.
*   **🌈 Customizable Theme Options:** Play Bingo in Light, Dark, or the vibrant Neon-Ocean theme.
*   **🌐 Multi-Language Support:** Bingo interface available in English and Turkish.
*   **🔔 Smart Notification System:** Instant notifications for game events, lobby activities, and invitations.
*   **📊 Detailed Player Profile:** Track your Bingo statistics, game history, and achievements.
*   **💬 Community and Chat Areas:** In-lobby chat enhances the social aspect of Bingo.

---

<h2 id="how-to-play">📖 How to Play Bingo</h2>

1.  **Join a Lobby:** Find an active Bingo lobby on the GameHub main screen or game detail page, or create your own.
2.  **Get Your Cards:** Once in the lobby and the game starts, you'll receive your unique Bingo card(s).
3.  **Listen for Numbers:** The game will call out numbers one by one (either automatically or manually by the host, depending on game mode).
4.  **Mark Your Card:** If a called number matches one on your card, mark it.
5.  **Shout BINGO!:** Be the first to complete a required pattern (e.g., a line, full house) and click the "Call Bingo!" button to win.

---

<h2 id="game-rules-and-validations">📜 Game Rules & Validations</h2>

To ensure fair and smooth gameplay, the following rules and validations are in place for Bingo:

*   **Host Start Conditions:**
    *   The host (or any member in the lobby) must not be actively participating in another game elsewhere on the platform before starting a new Bingo game.
*   **No New Entries During Active Game:**
    *   Once a Bingo game has started in a lobby, new users cannot join that specific game session. They will receive a message indicating the game is in progress. They can, however, join the lobby to wait for the next game or chat.
*   **Player Leaving Mid-Game:**
    *   If a player leaves the lobby while a Bingo game is in progress, they are automatically removed from the current game. Their cards will no longer be active for that round.
*   **Host Kicking Player Mid-Game:**
    *   The host has the ability to remove any player from the lobby at any time.
    *   If a player is kicked during an active Bingo game, they are immediately removed from that game session and the lobby.
    *   **Manual Drawing Mode:** If the kicked player was the one responsible for manually drawing numbers in a Bingo game, the game will automatically switch to an "automatic number drawing" mode to ensure continuity.
*   **Incorrect Bingo Call:**
    *   If a player calls "Bingo!" incorrectly, they will receive a notification (audible and visual), and the game continues.

---

<h2 id="bingo-game-screen-experience">🎲 Bingo Game Screen Experience</h2>

This section details the features and interactions on the Bingo game screen, as provided by the GameHub platform.

**Bingo in Normal Lobby:**

*   **👑 Host Control:** Lobby creator's authority over game settings and starting.
*   **🚪 Easy User Participation:** Quick participation via lobby link, main screen, or game detail page.
*   **🏁 Game Start:** Start by host and 5-second countdown timer.
*   **⚙️ Game Mode and Style Selection (Host):** Flexibility to adjust mode and style before game starts.
*   **⚡ Real-Time Gaming Experience:** Real-time and synchronized game flow.
*   **🔊 In-Game Sound Control:** Option to turn sound effects on/off.
*   **💬 In-Game Messaging (Chat):** Communication with animated chat area and emoji support.
*   **😄 Quick Emoji Sending:** Ability to quickly express emotions.
*   **<img src="https://cdn-icons-png.flaticon.com/512/446/446833.png" alt="Area" width="20" style="vertical-align: middle;"> Game Area:** Basic interface of the Bingo game.
*   **📣 "Call Bingo!" Button:** Button activated when Bingo is achieved.
*   **<img src="https://cdn-icons-png.flaticon.com/512/446/446847.png" alt="Draw" width="20" style="vertical-align: middle;"> "Draw Number" Button (Manual Mode):** Manual number drawing control.
*   **🔢 Drawn Numbers List:** Ability to track all drawn numbers.
*   **🔥 Active Numbers Area:** Highlighting the latest drawn numbers.
*   **🎫 Bingo Ticket (Your Ticket):** Player's personal bingo card.
*   **<img src="https://cdn-icons-png.flaticon.com/512/446/446823.png" alt="Card" width="20" style="vertical-align: middle;"> Card Selection:** Switching between multiple tickets.
*   **🏆 Completing Players List:** Real-time list of players who have achieved Bingo.
*   **<img src="https://cdn-icons-png.flaticon.com/512/446/446854png" alt="Ranking" width="20" style="vertical-align: middle;"> Game Over and Ranking Table:** Game results, ranking, and "Play Again" options.
*   **💾 Game History Recording (Database):** Permanently storing game results.
*   **⏳ If Host Leaves Lobby:** Lobby automatically closes if they do not return within 8 hours.

**Bingo in Event Lobby:**

*   **⏱️ Event Timer:** Dynamically showing the time remaining until the event starts.
*   **👑 Host Control (Event Lobby):** Event owner host's authority to start the game.
*   **🔔 Event Start Notification:** Instant notification to lobby members when the event starts.
*   **🚀 Starting Game in Event Lobby:** Start with game mode selection modal.
*   **<img src="https://cdn-icons-png.flaticon.com/512/446/446831.png" alt="Countdown" width="20" style="vertical-align: middle;"> Countdown and Game Start (Event Lobby):** Exciting start with a 3-second countdown.
*   **🎲 Bingo in Event Lobby:** Same rich gaming experience as normal lobby.
*   **💬 In-Game Snackbar Notifications:** Instant notifications during gameplay.
*   **⏰ Event End Warning 5 Minutes Before:** Warning notification to players 5 minutes before the event time expires.
*   **<img src="https://cdn-icons-png.flaticon.com/512/446/446835.png" alt="Joining" width="20" style="vertical-align: middle;"> Notifications to Users When Joining Game:** Instant notification when a new player joins.
*   **❌ Incorrect Bingo Call Notification (Audible and Silent):** Instant feedback and buzzer sound in case of error.
*   **🚪 User Joining Lobby Notification (Audible and Silent):** Instant notification when a new player joins the lobby.
*   **<img src="https://cdn-icons-png.flaticon.com/512/446/446851.png" alt="Deletion" width="20" style="vertical-align: middle;"> Notification When Lobby is Deleted (Animated Modal):** Animated notification when lobby is deleted or event ends.
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
    ```bash
    git clone https://github.com/yusufinann/bingo-game.git
    ```
    This will create a `bingo-game` folder within your `packages` directory.

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
*   **Functionality:** Without the surrounding GameHub infrastructure, full functionality (like user authentication, lobby management outside the game, profile integration, etc.) may not be available or may require significant adaptation.
*   **Primary Use:** The primary and recommended way to use this Bingo game is by cloning and running the entire [GameHub Platform](https://github.com/yusufinann/GameHub) as instructed in its main README.

---

## 🛠️ Technology Stack

The Bingo game module leverages the core technology stack of the [GameHub platform](https://github.com/yusufinann/GameHub):

*   **Frontend:** React, Material UI, React Context, Axios, react-router-dom
*   **Backend:** Node.js, Express, MongoDB, Mongoose, Jsonwebtoken
*   **Real-time Communication:** WebSocket
*   **Monorepo Management:** Lerna

---

## 🔗 Integration within GameHub (Primary Setup)

*   This Bingo game is a submodule intended for use within the `GameHub` Lerna monorepo.
*   Its source code is typically located in the `packages/bingo-game` (or a similarly named, if you rename it after cloning) directory within the main [GameHub repository](https://github.com/yusufinann/GameHub).
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
