---
name: Aura Precision
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#ccc3d8'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#958da1'
  outline-variant: '#4a4455'
  surface-tint: '#d2bbff'
  primary: '#d2bbff'
  on-primary: '#3f008e'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#732ee4'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#fda9ff'
  on-tertiary: '#580063'
  tertiary-container: '#b006c4'
  on-tertiary-container: '#ffdafb'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#ffd6fb'
  tertiary-fixed-dim: '#fda9ff'
  on-tertiary-fixed: '#36003d'
  on-tertiary-fixed-variant: '#7d008c'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-md:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
  button-text:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.0'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-padding: 2rem
  grid-gap: 1rem
  button-size: 4.5rem
  display-margin-bottom: 2.5rem
---

## Brand & Style

This design system is built to evoke a sense of high-end, futuristic sophistication. It merges the depth of **Glassmorphism** with a high-contrast, neon-infused color palette to transform a utility tool into an immersive digital object. The target audience values aesthetic excellence and tactile feedback, seeking a calculator that feels more like a cockpit interface than a standard office tool.

The emotional response is one of "Atmospheric Focus"—a dark, moody environment where primary interactions are highlighted by vibrant, ethereal glows. The style utilizes heavy backdrop blurs to create a sense of physical layering, while subtle gradients provide a sense of curvature and premium finish.

## Colors

The color strategy centers on a "Midnight Spectrum." The background is a near-black ink, allowing neon accents to pop without causing eye strain. 

- **Primary & Secondary:** Vivid purples and cyans are reserved for operators and active states, utilizing "glow" values (box-shadows) to simulate light emission.
- **Neutrals:** Deep slates and matte blacks form the foundation of the numeric keys, providing a tactile, grounded feel against the more ethereal functional keys.
- **Gradients:** Use linear gradients (45-degree angle) for buttons, blending from deep indigo to vibrant violet to add dimension.

## Typography

The design system utilizes **Inter** for its mathematical clarity and modern geometric balance. 

- **Calculated Values:** Use `display-lg` for the primary result. It should feature a slight outer glow when the calculation is finalized.
- **Input History:** Use `display-md` with reduced opacity (60%) for the current equation string above the main result.
- **Button Labels:** Centered vertically and horizontally. Operator symbols (×, ÷, +, -) should be slightly larger and bolder than numeric digits to ensure clear functional distinction.

## Layout & Spacing

The layout follows a **Fixed Grid** model optimized for the specific constraints of a calculator interface. 

- **Grid Structure:** A 4-column layout is standard. The spacing between buttons (gutters) is kept generous (16px) to prevent accidental taps and to allow the "glow" of each button to breathe.
- **Hierarchy:** The display area occupies the top 30% of the interface, with the keypad occupying the remaining 70%.
- **Safe Areas:** A 32px margin surrounds the entire component to separate the glass container from the deep-purple background environment.

## Elevation & Depth

This design system relies on **Glassmorphism** and **Luminous Depth** rather than traditional shadows.

- **The Main Chassis:** A semi-transparent layer with a `backdrop-filter: blur(20px)`. It features a 1px solid border at 20% opacity (white) on the top and left to simulate a light source hitting the edge of the glass.
- **Button Depth:**
    - **Idle:** Matte finish with a subtle inner shadow to look slightly recessed.
    - **Hover:** The background opacity increases, and a soft 15px outer glow of the button's primary color appears.
    - **Active (Press):** The button scales down to 96% and the glow intensifies, simulating a tactile physical compression into the glass.

## Shapes

The shape language is consistently **Rounded**, striking a balance between organic comfort and technical precision.

- **Main Container:** Uses `rounded-xl` (1.5rem/24px) for a soft, premium feel.
- **Buttons:** Uses `rounded-lg` (1rem/16px). This creates a "squircle" aesthetic that feels more modern than a perfect circle but more approachable than a sharp square.
- **Display Readout:** The top glass panel should have a slightly higher corner radius than the buttons to frame the numbers elegantly.

## Components

### Buttons
- **Number Keys:** Matte dark slate (`#1E293B`) with white text. No glow on idle.
- **Operator Keys:** Translucent purple or blue with neon borders. These possess a constant 5px "ambient glow."
- **Action Keys (AC, Delete):** Subtle red or amber tint to signify destructive actions, using the same glass effect.

### Result Display
The display component is a "sunken" glass panel. It features a subtle gradient overlay from top-to-bottom (black to transparent) to suggest depth behind the glass surface.

### Toggle Switches (Scientific Mode)
Pill-shaped toggles with a neon "on" indicator. The sliding handle should be a frosted glass circle that carries the color of the background it slides over.

### Calculation History (List)
Appears as a slide-down tray from the top. Items are separated by low-opacity "ghost lines" (1px solid white at 5% opacity).