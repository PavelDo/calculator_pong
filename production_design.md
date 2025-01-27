# Production Design Document: React Calculator with Basic & Scientific Modes + Easter Egg

## Introduction
This document outlines how to develop a React-based calculator application that includes:
1. A Basic Mode with standard arithmetic operations.
2. A Scientific Mode offering advanced calculation features (e.g., trigonometry, logarithms, exponents).
3. An Easter Egg feature that allows the user to play a Pong game when pressing "cmd+1."

This guide is intended to help a junior developer structure their workflow, implement best practices, and produce a high-quality application.

---

## Prerequisites and Setup
1. **Development Environment**:
   - Node.js (>= 14) and npm (or Yarn).
   - A code editor or IDE (VSCode preferred).
   - Git for version control.

2. **Project Initialization**:
   - Create a new React application using Create React App or another preferred stack:
     ```bash
     npx create-react-app react-calculator
     ```
   - Navigate into the project folder:
     ```bash
     cd react-calculator
     ```
   - Open the project in your code editor:
     ```bash
     code .
     ```

3. **Package Dependencies** (Optional):
   - Libraries for scientific calculations (for example, mathjs).
   - A small game library for Pong if you don't want to implement Pong logic from scratch (optional).

---

## Architecture Overview

### Components
1. **Calculator**:
   - **Display**: Responsible for showing the current input, results, or errors.
   - **Keypad**: A collection of buttons for digits (0–9), basic operations (+, −, ×, ÷), advanced operations (sin, cos, tan, log, etc.), and the equals sign.
   - **ModeToggle**: A switch or button to toggle between Basic and Scientific modes.
   - **Easter Egg Hook**: A keyboard event listener to detect "cmd+1" for triggering Pong.

2. **Pong** (Easter Egg):
   - Embeddable component that appears when triggered.
   - Simple logic to move paddles and a ball on key presses.
   - A close button or key press to exit Pong and return to the calculator.

3. **App**:
   - Manages the overall state (current mode: Basic or Scientific, whether Pong is active, etc.).
   - Renders the Calculator or Pong component conditionally.

---

## Detailed Implementation Steps

### Step 1: Project Structure
- Create a folder structure that keeps the application organized:
  ```
  src/
    components/
      Calculator/
        Calculator.jsx
        Calculator.css
      Pong/
        Pong.jsx
        Pong.css
      ...
    App.js
    index.js
  ```

### Step 2: Implement Basic Mode
1. **UI Layout**: 
   - A numeric keypad (digits 0-9).
   - Basic operators (+, −, ×, ÷).
   - A display to show the current input and result.
   - An equals (=) button to compute the result.
   - Clear (C) or all-clear (AC) buttons for resetting.

2. **State Management**:
   - For a simple approach, manage local component state in Calculator using useState hooks.
   - Keep track of:
     - Current input.
     - Operator in use.
     - Previous result.

3. **Calculation Logic**:
   - Handle button presses and update the display accordingly.
   - On pressing equals, perform the operation and display the new result.

### Step 3: Implement Scientific Mode
1. **UI Layout**:
   - Additional buttons: sin, cos, tan, log, ln, sqrt, power (x^y), etc.
   - Toggle button or switch to show/hide scientific features.

2. **Calculation Logic**:
   - Consider using mathjs or other libraries for advanced functions to reduce code complexity.
   - Expand the existing handleButtonClick logic to incorporate new operations.

3. **Mode Toggle**:
   - Use a button (e.g., <button>Scientific Mode</button>) or switch to set a boolean flag in state.
   - Conditionally render scientific buttons or place them in a separate section using conditional logic.

### Step 4: Easter Egg (Pong)
1. **Key Event Listener**:
   - Add an event listener for keydown events in App or a higher-level component.
   - Check if user is pressing "cmd+1" (or "Meta+1" in JavaScript).
   - When detected, show the Pong component instead of the Calculator.

2. **Pong Implementation**:
   - For a simple approach, use a canvas or an HTML element to draw the ball and paddles.
   - Keep track of the paddle positions, ball position, and velocity in state.
   - Respond to arrow keys or WASD for paddle movement.
   - On hitting edges or missing the ball, bounce or reset accordingly.
   - Provide a method to exit the game and return to the calculator.

### Step 5: Styling and Responsiveness
- Use modern CSS (e.g., Flexbox or Grid) to ensure a clean and responsive UI.
- Keep consistent styling across Basic and Scientific modes.
- The Pong game area should be sized appropriately for various screen dimensions.

### Step 6: Testing
1. **Unit Testing**:
   - Test the calculation functions (especially edge cases in advanced functions).
2. **Integration Testing**:
   - Ensure that toggling between Basic and Scientific modes maintains or resets the correct state.
3. **Manual/E2E Testing**:
   - Verify "cmd+1" reliably toggles Pong.
   - Confirm consistent rendering on different screen sizes and device types.

### Step 7: Deployment
- Production build with:
  ```bash
  npm run build
  ```
- Deploy via any hosting solution (e.g., Netlify, Vercel, or a dedicated server).
- Ensure environment variables and secrets (if any) are handled securely.

---

## Tips and Best Practices
- Keep the Calculator logic self-contained. This makes it easier to maintain.
- Write clean, modular components that follow the Single Responsibility Principle (SRP).
- Use descriptive variable and function names, avoiding abbreviations for clarity.
- Leverage React's lifecycle hooks and context if the state grows in complexity beyond basic calculations.

---

## Conclusion
By following this plan, a junior developer will be equipped to build a React calculator that offers both basic and scientific capabilities, along with an entertaining Pong easter egg triggered by "cmd+1." Adhering to best practices for structure, testing, and deployment will ensure a robust and user-friendly application. 