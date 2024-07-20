import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
  return {
    server: {
      open: true,
    },
    plugins: [react(), tsconfigPaths()],
    define: {
      APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
  };
});
