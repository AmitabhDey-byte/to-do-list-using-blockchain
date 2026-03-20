<img width="1918" height="948" alt="image" src="https://github.com/user-attachments/assets/9dd89b34-391c-410c-a26d-56d96eafc000" />


# 📝 On-Chain ToDo DApp (Stellar Soroban)

A **fully permissionless ToDo List DApp** built on the Stellar network using Soroban smart contracts.
No accounts, no centralized control — just pure on-chain productivity 🚀

---

## 🌐 Live Concept

> “Write your tasks once. Store them forever.”

This app lets anyone:

* Create tasks
* Toggle completion status
* Retrieve tasks directly from the blockchain

All without any admin or backend.

---

## 🔗 Deployed Smart Contract

**Contract Address:**

```
CCLOGIBS3JGU5HQ2J3HCH2B4QPMKKFOTRBMW25SZS65O7JE3NPHQO5RW
```

---

## ⚙️ Tech Stack

* **Frontend:** React (Vite)
* **Blockchain:** Stellar Soroban
* **Wallet:** Freighter
* **SDKs:**

  * @stellar/stellar-sdk
  * @stellar/freighter-api

---

## ✨ Features

* 🔓 **Permissionless by Design**
  No admin functions. Any user can interact freely.

* ⛓️ **Fully On-Chain Storage**
  Tasks are stored on the blockchain, not locally.

* 🔐 **Wallet-Based Authentication**
  Uses Freighter wallet for signing transactions.

* ⚡ **Real-Time Updates**
  UI updates after every blockchain interaction.

* 🧊 **Modern UI + Animated Background**
  Clean, responsive interface with immersive visuals.

---

## 🧠 Smart Contract Overview

### Data Structure

```rust
struct Task {
    content: String,
    completed: bool,
    timestamp: u64,
}
```

### Functions

* `create_task(user, content)`
  → Adds a new task

* `toggle_task(user, index)`
  → Toggles completion status

* `get_tasks(user)`
  → Returns all tasks for a user

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/onchain-todo
cd onchain-todo
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Start the app

```bash
npm run dev
```

Open:

```
http://localhost:5173
```

---

## 🔐 Wallet Setup

1. Install Freighter Wallet
2. Switch to **Testnet**
3. Fund your wallet via Friendbot
4. Approve connection when prompted

---

## 🧪 How It Works

1. User enters a task
2. Freighter prompts transaction signing
3. Task is stored on-chain
4. UI fetches and displays updated tasks

---

## ⚠️ Important Notes

* Ensure correct **Contract ID** is set in frontend
* Wallet must be on **Testnet**
* Transactions require signing via Freighter

---

## 🌟 Future Improvements

* 🗑️ Delete task functionality
* 🏷️ Task categories/tags
* 📱 Mobile optimization
* 🔔 Notifications
* 🔍 Search & filter

---

## 🤝 Contribution

Feel free to fork, improve, and build on top of this project.

---

## 📜 License

MIT License

---

## 💡 Inspiration

Built with the idea that:

> “Productivity tools shouldn’t need permission.”

---

## 👨‍💻 Author

**Amitabh Dey**

---

🚀 If you liked this project, consider starring the repo!
