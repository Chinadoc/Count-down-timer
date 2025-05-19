# Cross-Platform Countdown Timer

A robust, cross-platform countdown timer application built with React Native for Web, Expo, and Next.js in a TypeScript monorepo. This project demonstrates best practices for code sharing between mobile and web platforms.

## Project Structure

This is a monorepo using Yarn workspaces with the following structure:

```
/countdown-timer-app
├── /apps                   # Platform-specific application shells
│   ├── /mobile            # Expo (React Native) project for iOS
│   └── /web               # Next.js project for web
├── /packages              # Shared code used by the apps
│   ├── /core              # Pure business logic (platform-agnostic)
│   └── /ui                # Shared React Native components
```

## Features

- **Shared Core Logic**: Platform-agnostic countdown timer functionality
- **Shared UI Components**: React Native components that work on both mobile and web
- **TypeScript Support**: Full type safety throughout the codebase
- **Monorepo Structure**: Efficient code sharing and dependency management
- **Gamification System**: Achievement tracking and unlockable rewards
- **Illustration Collection**: Gacha-style system for collecting rare illustrations
- **Sound Integration**: Custom timer completion sounds via Eleven Labs API

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Yarn package manager
- For iOS development: Xcode and CocoaPods
- For Android development (optional): Android Studio

### Installation

1. Clone this repository:
   ```
   git clone <repository-url>
   cd countdown-timer-app
   ```

2. Install dependencies:
   ```
   yarn install
   ```

### Running the Applications

#### Web App (Next.js)

```
yarn web
```

This starts the Next.js development server at http://localhost:3000.

#### Mobile App (Expo)

```
yarn mobile
```

This starts the Expo development server. You can run the app on:
- iOS simulator: Press `i` in the terminal
- Android emulator: Press `a` in the terminal
- Physical device: Scan the QR code using the Expo Go app

#### Running on iOS Simulator Directly

```
yarn ios
```

## Technology Stack

- **React & React Native**: Core UI libraries
- **Expo**: For mobile app development
- **Next.js**: For web app development
- **TypeScript**: For static typing
- **Yarn Workspaces**: For monorepo management

## Core Architecture

The application follows a clear separation of concerns:

### 1. Core Package (`packages/core`)

Contains pure business logic, including:
- `CountdownTimerController`: Manages timer state and operations
- Type definitions and interfaces

### 2. UI Package (`packages/ui`)

Contains shared React Native components that work on both platforms:
- `CountdownView`: Main countdown timer UI component
- UI utilities and styling

### 3. Platform-Specific Apps

- **Mobile (`apps/mobile`)**: Expo/React Native app for iOS/Android
- **Web (`apps/web`)**: Next.js app for web browsers

## Customization

You can easily customize the timer functionality by modifying the `CountdownTimerController` in the core package, or change the appearance by modifying the `CountdownView` component in the UI package.

## Extending the Project

### Adding State Management

For more complex state requirements, consider adding:
- React Context API for simple state sharing
- Redux or Zustand for more complex state management

### Adding Navigation

- For web: Next.js router
- For mobile: React Navigation
- For both: Consider a shared navigation abstraction

### Adding Persistence

- Web: localStorage or IndexedDB
- Mobile: AsyncStorage via Expo

## License

MIT
