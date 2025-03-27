# Task Management App

A modern task management application built with React, Redux, and Mantine UI. Features include task organization, theme switching, and inspirational quotes.

## Features

- Create, edit, and delete tasks
- Drag-and-drop task status management
- Filter tasks by status (All, Pending, Completed)
- Dark/Light theme switching
- Random inspirational quotes
- Responsive design
- Toast notifications for user actions

## Tech Stack

- **Frontend Framework**: React
- **State Management**: Redux Toolkit
- **UI Components**: Mantine UI
- **Drag and Drop**: @hello-pangea/dnd
- **Notifications**: react-toastify
- **API Client**: Axios
- **Testing**: Jest + React Testing Library
- **Build Tool**: Vite
- **Language**: TypeScript

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mini-task
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```
This will start the development server at `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## Testing

Run the test suite:
```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Project Structure

```
mini-task/
├── src/
│   ├── components/        # React components
│   ├── store/            # Redux store and slices
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   └── App.tsx           # Main application component
├── public/               # Static assets
└── tests/               # Test files
```

## Features in Detail

### Task Management
- Create tasks with title, description, and due date
- Edit existing tasks
- Mark tasks as complete/incomplete
- Delete tasks
- Drag and drop tasks between status columns
- Prevent duplicate task titles

### Theme Switching
- Toggle between light and dark themes
- Persistent theme preference
- Smooth transition animations

### Quote Display
- Fetch and display random inspirational quotes
- Manual quote refresh option
- Error handling for API failures


## License

This project is licensed under the MIT License - see the LICENSE file for details.
