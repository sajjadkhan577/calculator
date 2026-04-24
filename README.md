# LuminaCalc

LuminaCalc is a premium multi-page calculator web app built with plain HTML, CSS, and JavaScript. It combines a polished glassmorphic interface with fully functional tools for standard calculation, scientific evaluation, unit conversion, persistent history, profile management, and shared application settings.

## Features

- Standard calculator with keyboard support, chained operations, percentage, sign toggle, and saved results
- Scientific calculator with trigonometric functions, logarithms, constants, powers, square root, and DEG/RAD modes
- Unit converter for length, weight, temperature, and currency
- Shared history page with filtering, copy, and reuse actions
- Settings page with theme, blur, precision, motion, sound, and default angle preferences
- User profile page with local persistence
- Fully framework-free implementation using only HTML, CSS, and JavaScript
- Responsive layout for desktop and mobile

## Project Structure

```text
.
├── index.html
├── standard-calculator.html
├── scientific-calculator.html
├── unit-converter.html
├── calculation-history.html
├── application-settings.html
├── user-profile.html
├── README.md
├── assets
│   ├── css
│   │   └── luminacalc-styles.css
│   ├── imgs
│   │   └── previews
│   └── js
│       └── luminacalc-app.js
└── docs
    └── reference-designs
```

## Pages

- `standard-calculator.html`: standard arithmetic workspace
- `scientific-calculator.html`: advanced scientific functions
- `unit-converter.html`: multi-category converter
- `calculation-history.html`: saved activity timeline
- `application-settings.html`: shared preferences and export/reset tools
- `user-profile.html`: editable local profile

## Getting Started

1. Clone the repository.
2. Open `index.html` in a browser.
3. Or launch the project with any local static server.

Example:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Design Assets

- UI preview images are stored in `assets/imgs/previews`
- original reference mockups are stored in `docs/reference-designs`

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Local Storage for persistence

## Author

Sajjad Khan
