# @countdown-timer-app/ui

Shared React Native UI components for the Countdown Timer app, compatible with web and iOS.

## Installation

These components are part of the monorepo and should be automatically available when you run:

```bash
yarn install
```

## Components

### CountdownView
The main timer component with display, input, and controls.

```tsx
import { CountdownView } from '@countdown-timer-app/ui';

const App = () => <CountdownView initialSeconds={120} />;
```

### TimerDisplay
Displays formatted time in minutes and seconds (MM:SS).

```tsx
import { TimerDisplay } from '@countdown-timer-app/ui';

const Display = () => <TimerDisplay secondsLeft={120} />;
```

### TimerInput
Input field for setting timer duration.

```tsx
import { TimerInput } from '@countdown-timer-app/ui';

const Input = () => (
  <TimerInput
    inputSeconds="120"
    onChangeText={(text) => console.log(text)}
    disabled={false}
  />
);
```

### TimerControls
Start/Stop and Reset buttons.

```tsx
import { TimerControls } from '@countdown-timer-app/ui';

const Controls = () => (
  <TimerControls
    isRunning={false}
    onStartStop={() => console.log('Start/Stop pressed')}
    onReset={() => console.log('Reset pressed')}
  />
);
```

## Structure

The UI package is organized as follows:

- `src/components/`: React Native components
- `src/types.ts`: TypeScript interfaces for component props
- `__tests__/`: Unit tests for components

## Dependencies

- `@countdown-timer-app/core`: Timer logic
- `react`, `react-native`: Peer dependencies

## Development

### Testing
```bash
yarn workspace @countdown-timer-app/ui test
```

### Type checking
```bash
yarn workspace @countdown-timer-app/ui typecheck
```

### Linting
```bash
yarn workspace @countdown-timer-app/ui lint
```
