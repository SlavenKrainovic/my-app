# Gearbox Calculator

A modern, interactive web application for calculating and visualizing vehicle speed versus RPM based on gearbox and wheel configuration. Built with React and Vite.

## Features
- Select car brand and gearbox from dynamic lists
- Edit gear ratios and final drive
- Configure wheel and tire parameters
- Visualize speed vs RPM for each gear with a modern chart
- Responsive, accessible, and clean UI

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation
```bash
# Clone the repository
 git clone <your-repo-url>
 cd my-app

# Install dependencies
 npm install
# or
yarn install
```

### Running the App
```bash
npm run dev
# or
yarn dev
```
The app will be available at [http://localhost:5173](http://localhost:5173) by default.

### Building for Production
```bash
npm run build
# or
yarn build
```

## API
This app relies on several backend API endpoints for full functionality:

- **Calculate Speeds**: `POST http://localhost:8081/api/v1/gearbox/calculateSpeeds` — Calculates speed data for the selected gearbox and wheel configuration.
- **Car Brands**: `GET http://localhost:8081/api/v1/brands` — Returns a list of available car brands.
- **Gearboxes**: `GET http://localhost:8081/api/v1/gearboxes` — Returns a list of available gearboxes (optionally filtered by brand).

Make sure the backend is running for all features to work correctly.

## Project Structure
- `src/App.jsx` — Main application component
- `src/components/` — UI components (SpeedChart, CarBrandSelect, GearboxSelect, etc.)
- `src/hooks/` — Custom React hooks
- `src/App.css`, `src/index.css` — Stylesheets

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
MIT (or specify your license here)

---
Made with ❤️ using React, Vite, and MUI.
