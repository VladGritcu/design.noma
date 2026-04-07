// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  plugins: [
    react({
      // Babel transform mai rapid
      babel: {
        plugins: []
      }
    })
  ],
  optimizeDeps: {
    exclude: ["lucide-react"],
    // Pre-bundlează dependențele importante
    include: ["react", "react-dom", "react-router-dom"]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          lucide: ["lucide-react"]
        }
      }
    },
    chunkSizeWarningLimit: 600,
    // Minificare agresivă în producție
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        // elimină toate console.log
        drop_debugger: true,
        pure_funcs: ["console.log", "console.warn"]
      },
      mangle: true
    },
    // CSS separat — se încarcă mai rapid
    cssCodeSplit: true,
    // Sourcemaps doar în dev
    sourcemap: false,
    // Asset-uri mici inline — mai puține requesturi
    assetsInlineLimit: 4096
  },
  css: {
    devSourcemap: false
  },
  // Server dev mai rapid
  server: {
    hmr: {
      overlay: false
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3Qoe1xuICAgICAgLy8gQmFiZWwgdHJhbnNmb3JtIG1haSByYXBpZFxuICAgICAgYmFiZWw6IHtcbiAgICAgICAgcGx1Z2luczogW10sXG4gICAgICB9LFxuICAgIH0pLFxuICBdLFxuXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFsnbHVjaWRlLXJlYWN0J10sXG4gICAgLy8gUHJlLWJ1bmRsZWF6XHUwMTAzIGRlcGVuZGVuXHUwMjFCZWxlIGltcG9ydGFudGVcbiAgICBpbmNsdWRlOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJ10sXG4gIH0sXG5cbiAgYnVpbGQ6IHtcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgdmVuZG9yOiAgWydyZWFjdCcsICdyZWFjdC1kb20nXSxcbiAgICAgICAgICByb3V0ZXI6ICBbJ3JlYWN0LXJvdXRlci1kb20nXSxcbiAgICAgICAgICBsdWNpZGU6ICBbJ2x1Y2lkZS1yZWFjdCddLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogNjAwLFxuICAgIC8vIE1pbmlmaWNhcmUgYWdyZXNpdlx1MDEwMyBcdTAwRUVuIHByb2R1Y1x1MDIxQmllXG4gICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICB0ZXJzZXJPcHRpb25zOiB7XG4gICAgICBjb21wcmVzczoge1xuICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsICAgIC8vIGVsaW1pblx1MDEwMyB0b2F0ZSBjb25zb2xlLmxvZ1xuICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlLFxuICAgICAgICBwdXJlX2Z1bmNzOiBbJ2NvbnNvbGUubG9nJywgJ2NvbnNvbGUud2FybiddLFxuICAgICAgfSxcbiAgICAgIG1hbmdsZTogdHJ1ZSxcbiAgICB9LFxuICAgIC8vIENTUyBzZXBhcmF0IFx1MjAxNCBzZSBcdTAwRUVuY2FyY1x1MDEwMyBtYWkgcmFwaWRcbiAgICBjc3NDb2RlU3BsaXQ6IHRydWUsXG4gICAgLy8gU291cmNlbWFwcyBkb2FyIFx1MDBFRW4gZGV2XG4gICAgc291cmNlbWFwOiBmYWxzZSxcbiAgICAvLyBBc3NldC11cmkgbWljaSBpbmxpbmUgXHUyMDE0IG1haSBwdVx1MDIxQmluZSByZXF1ZXN0dXJpXG4gICAgYXNzZXRzSW5saW5lTGltaXQ6IDQwOTYsXG4gIH0sXG5cbiAgY3NzOiB7XG4gICAgZGV2U291cmNlbWFwOiBmYWxzZSxcbiAgfSxcblxuICAvLyBTZXJ2ZXIgZGV2IG1haSByYXBpZFxuICBzZXJ2ZXI6IHtcbiAgICBobXI6IHtcbiAgICAgIG92ZXJsYXk6IGZhbHNlLFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBb0I7QUFDdFAsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUZqQixJQUFNLG1DQUFtQztBQUl6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUE7QUFBQSxNQUVKLE9BQU87QUFBQSxRQUNMLFNBQVMsQ0FBQztBQUFBLE1BQ1o7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFFQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsY0FBYztBQUFBO0FBQUEsSUFFeEIsU0FBUyxDQUFDLFNBQVMsYUFBYSxrQkFBa0I7QUFBQSxFQUNwRDtBQUFBLEVBRUEsT0FBTztBQUFBLElBQ0wsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLFVBQ1osUUFBUyxDQUFDLFNBQVMsV0FBVztBQUFBLFVBQzlCLFFBQVMsQ0FBQyxrQkFBa0I7QUFBQSxVQUM1QixRQUFTLENBQUMsY0FBYztBQUFBLFFBQzFCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLHVCQUF1QjtBQUFBO0FBQUEsSUFFdkIsUUFBUTtBQUFBLElBQ1IsZUFBZTtBQUFBLE1BQ2IsVUFBVTtBQUFBLFFBQ1IsY0FBYztBQUFBO0FBQUEsUUFDZCxlQUFlO0FBQUEsUUFDZixZQUFZLENBQUMsZUFBZSxjQUFjO0FBQUEsTUFDNUM7QUFBQSxNQUNBLFFBQVE7QUFBQSxJQUNWO0FBQUE7QUFBQSxJQUVBLGNBQWM7QUFBQTtBQUFBLElBRWQsV0FBVztBQUFBO0FBQUEsSUFFWCxtQkFBbUI7QUFBQSxFQUNyQjtBQUFBLEVBRUEsS0FBSztBQUFBLElBQ0gsY0FBYztBQUFBLEVBQ2hCO0FBQUE7QUFBQSxFQUdBLFFBQVE7QUFBQSxJQUNOLEtBQUs7QUFBQSxNQUNILFNBQVM7QUFBQSxJQUNYO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
