# Dormitory Inspection Checklist

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

## Overview

This Angular application provides a comprehensive dormitory inspection checklist tool designed to help users prepare for dormitory inspections. The application features:

- Interactive checklist with collapsible regions and sections
- Real-time completion tracking with a persistent progress bar
- Local storage of checklist progress
- Mobile-responsive design
- Accessibility features including keyboard navigation

The checklist is a supplemental tool that works alongside the official Dormitory Standard Operating Procedure (SOP) and helps users track their progress through various inspection requirements.

## Development

### Prerequisites

- Node.js LTS
- npm or yarn

### Installation

```sh
npm install
# or
yarn install
```

### Running the Application

To start the development server:

```sh
npx nx serve som
```

The application will be available at `http://localhost:4200/`.

### Building for Production

To create a production build:

```sh
npx nx build som
```

The build artifacts will be stored in the `dist/` directory.

### Running Tests

To execute the unit tests:

```sh
npx nx test som
```

To run end-to-end tests:

```sh
npx nx e2e som-e2e
```

## Project Structure

This application is built using an Nx workspace with Angular. Key components include:

- **ChecklistComponent**: The main component that displays the interactive checklist
- **ChecklistService**: Service that loads checklist data from JSON
- **Angular Material**: Used for UI components like cards, buttons, and progress bars
- **Tailwind CSS**: Used for responsive styling and layout

## Technologies Used

- Angular 15+
- Angular Material 20.1
- Tailwind CSS
- Nx Build System
- Local Storage for progress persistence

## Features

- **Collapsible Regions**: Organize checklist items into expandable/collapsible regions
- **Progress Tracking**: Real-time calculation of completion percentage
- **Responsive Design**: Works on both desktop and mobile devices
- **Accessibility**: Keyboard navigation and proper ARIA attributes
- **Local Storage**: Saves checklist progress in the browser's local storage