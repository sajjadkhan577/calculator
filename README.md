# Simple Calculator - Premium Utility Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://github.com/sajjadkhan577/calculator)
[![Status](https://img.shields.io/badge/status-production--ready-success.svg)](https://github.com/sajjadkhan577/calculator)

**Simple Calculator** is a premium, multi-page web application designed for high-precision arithmetic and utility conversions. Built with a focus on modern aesthetics, it features a glassmorphic UI, responsive layouts, and persistent local storage.

[**🚀 Live Demo**](https://sajjadkhan577.github.io/calculator/index.html)

![App Preview](assets/img/previews/index-preview.png)

---

## ✨ Features

### 🖥️ Standard Calculator
- **Full Precision**: Robust arithmetic engine with keyboard support.
- **Micro-animations**: Interactive button feedback and result pulsing.
- **History Integration**: Automatically saves results for later use.

### 🧪 Scientific Calculator
- **Advanced Math**: Trigonometric functions (sin, cos, tan), square roots, powers ($x^y$), and logarithms.
- **Flexible Modes**: Support for both Degree (DEG) and Radian (RAD) modes.
- **Memory Recall**: Reuse previous scientific expressions with one click.

### 🔄 Unit Converter
- **Multi-category**: Length, Weight, Temperature, and Currency.
- **Live Sync**: Instant conversion results as you type.
- **Smart Swapping**: Effortlessly reverse conversion directions.

### 📂 Shared Workspace
- **Persistent History**: Unified timeline for all calculations and conversions.
- **Application Settings**: Customize the interface with dark/light themes, blur intensity, and decimal precision.
- **User Profiles**: Manage local identity and preferences within the app.

---

## 🛠️ Technology Stack

- **Frontend**: Semantic HTML5, CSS3 (Vanilla), JavaScript (ES6+)
- **Storage**: Local Storage & Session Storage for offline persistence
- **Design System**: Responsive Glassmorphism with custom CSS variables
- **Typography**: Inter (via Google Fonts)

---

## 🚀 Getting Started

### Prerequisites
No installation required! Just a modern web browser.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/sajjadkhan577/calculator.git
   ```
2. Navigate to the project directory:
   ```bash
   cd calculator
   ```
3. Open `index.html` in your favorite browser.

### Local Development
To serve the project with live-reloading or for a better local experience, you can use a simple static server:

**Using Python:**
```bash
python -m http.server 8000
```

**Using Node.js (npx):**
```bash
npx serve .
```

---

## 📁 Repository Structure

```text
.
├── assets/
│   ├── css/          # Modularized stylesheets
│   ├── img/          # UI assets and previews
│   └── js/           # Core application logic
├── docs/             # Reference designs and documentation
├── index.html        # Main Standard Calculator entry point
├── scientific.html   # Scientific Workspace
├── converter.html    # Unit Conversion Engine
├── history.html      # Persistent Activity History
├── settings.html     # Application Preferences
└── profile.html      # Local User Profile
```

---

## 📜 License
Published under the MIT License. See `LICENSE` for more information (if applicable).

## 👤 Author
**Sajjad Khan**
- GitHub: [@sajjadkhan577](https://github.com/sajjadkhan577)

---

*Designed with ❤️ for clarity and precision.*
