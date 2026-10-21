# Security update, 2026-10-21

Pin Node.js 22.23.4 and add an npm workspace lockfile. Upgrade Next.js 12 to patched 15.5.28, Expo SDK 46 to 54, React/React Native/Web and Expo modules to the corresponding compatible versions, and replace the obsolete backend ts-node-dev runner with tsx. The native app now has an Expo registration entrypoint. Transpile Expo/React Native packages for Next server rendering.

The build exposed existing TimerDisplay callers passing formatted text where numeric seconds are required and label props missing from component contracts. Pass seconds to the formatter and connect the existing labels and accessibility labels to their native components.

Validation: web production build, backend TypeScript build and iOS Metro bundle export pass. Critical audit alerts reduced from 2 to zero. Remaining npm alerts are recorded in the security report: braces, node-forge and sprintf-js have no published patch; the image-size patch is incompatible with this Metro version. A targeted image-loading test failed with image-size 2.0.4 and passed after restoring the compatible version. Alerts remain visible, not suppressed.

This is a draft migration. It has not been built with Xcode, tested on a device, or deployed. Rebuild native binaries and accept audio, countdown, task and collection flows before release. A newer coordinated Expo/Metro migration is still required for image-size.
