# Survivor Simulator

The Survivor builder is organised into small ES modules so new gameplay systems can be added without turning the application entry point into one large file.

## Structure

- `index.html` — page shell and stylesheet/module entry points.
- `styles/main.css` — current shared stylesheet. The other style layers are reserved for the layout, reusable components and page-specific rules as the UI grows.
- `js/app.js` — application bootstrap and UI event delegation.
- `js/state.js` — shared season state and default data.
- `js/storage.js` — localStorage persistence.
- `js/navigation.js` — sidebar navigation state.
- `js/utils.js` — shared formatting and rendering helpers.
- `js/data/` — reusable game data such as archetypes, twists and relationship types.
- `js/pages/` — markup/rendering for each builder page.
- `js/systems/` — game logic shared by pages, such as team assignment, season generation and relationships.

## Adding features

Put page-specific UI in the relevant file under `js/pages/`. Put reusable game rules or state-changing logic in `js/systems/`. Keep constants and preset lists in `js/data/`. Import the pieces needed into `js/app.js` and pass shared state/helpers into page renderers.
