// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCh7XG4gICAgICAvLyBCYWJlbCB0cmFuc2Zvcm0gbWFpIHJhcGlkXG4gICAgICBiYWJlbDoge1xuICAgICAgICBwbHVnaW5zOiBbXSxcbiAgICAgIH0sXG4gICAgfSksXG4gIF0sXG5cbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZXhjbHVkZTogWydsdWNpZGUtcmVhY3QnXSxcbiAgICAvLyBQcmUtYnVuZGxlYXpcdTAxMDMgZGVwZW5kZW5cdTAyMUJlbGUgaW1wb3J0YW50ZVxuICAgIGluY2x1ZGU6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlci1kb20nXSxcbiAgfSxcblxuICBidWlsZDoge1xuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICB2ZW5kb3I6ICBbJ3JlYWN0JywgJ3JlYWN0LWRvbSddLFxuICAgICAgICAgIHJvdXRlcjogIFsncmVhY3Qtcm91dGVyLWRvbSddLFxuICAgICAgICAgIGx1Y2lkZTogIFsnbHVjaWRlLXJlYWN0J10sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiA2MDAsXG4gICAgLy8gTWluaWZpY2FyZSBhZ3Jlc2l2XHUwMTAzIFx1MDBFRW4gcHJvZHVjXHUwMjFCaWVcbiAgICBtaW5pZnk6ICd0ZXJzZXInLFxuICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgIGNvbXByZXNzOiB7XG4gICAgICAgIGRyb3BfY29uc29sZTogdHJ1ZSwgICAgLy8gZWxpbWluXHUwMTAzIHRvYXRlIGNvbnNvbGUubG9nXG4gICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWUsXG4gICAgICAgIHB1cmVfZnVuY3M6IFsnY29uc29sZS5sb2cnLCAnY29uc29sZS53YXJuJ10sXG4gICAgICB9LFxuICAgICAgbWFuZ2xlOiB0cnVlLFxuICAgIH0sXG4gICAgLy8gQ1NTIHNlcGFyYXQgXHUyMDE0IHNlIFx1MDBFRW5jYXJjXHUwMTAzIG1haSByYXBpZFxuICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcbiAgICAvLyBTb3VyY2VtYXBzIGRvYXIgXHUwMEVFbiBkZXZcbiAgICBzb3VyY2VtYXA6IGZhbHNlLFxuICAgIC8vIEFzc2V0LXVyaSBtaWNpIGlubGluZSBcdTIwMTQgbWFpIHB1XHUwMjFCaW5lIHJlcXVlc3R1cmlcbiAgICBhc3NldHNJbmxpbmVMaW1pdDogNDA5NixcbiAgfSxcblxuICBjc3M6IHtcbiAgICBkZXZTb3VyY2VtYXA6IGZhbHNlLFxuICB9LFxuXG4gIC8vIFNlcnZlciBkZXYgbWFpIHJhcGlkXG4gIHNlcnZlcjoge1xuICAgIGhtcjoge1xuICAgICAgb3ZlcmxheTogZmFsc2UsXG4gICAgfSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLG9CQUFvQjtBQUN0UCxPQUFPLFdBQVc7QUFFbEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBO0FBQUEsTUFFSixPQUFPO0FBQUEsUUFDTCxTQUFTLENBQUM7QUFBQSxNQUNaO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBRUEsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLGNBQWM7QUFBQTtBQUFBLElBRXhCLFNBQVMsQ0FBQyxTQUFTLGFBQWEsa0JBQWtCO0FBQUEsRUFDcEQ7QUFBQSxFQUVBLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQSxVQUNaLFFBQVMsQ0FBQyxTQUFTLFdBQVc7QUFBQSxVQUM5QixRQUFTLENBQUMsa0JBQWtCO0FBQUEsVUFDNUIsUUFBUyxDQUFDLGNBQWM7QUFBQSxRQUMxQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSx1QkFBdUI7QUFBQTtBQUFBLElBRXZCLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQSxRQUNSLGNBQWM7QUFBQTtBQUFBLFFBQ2QsZUFBZTtBQUFBLFFBQ2YsWUFBWSxDQUFDLGVBQWUsY0FBYztBQUFBLE1BQzVDO0FBQUEsTUFDQSxRQUFRO0FBQUEsSUFDVjtBQUFBO0FBQUEsSUFFQSxjQUFjO0FBQUE7QUFBQSxJQUVkLFdBQVc7QUFBQTtBQUFBLElBRVgsbUJBQW1CO0FBQUEsRUFDckI7QUFBQSxFQUVBLEtBQUs7QUFBQSxJQUNILGNBQWM7QUFBQSxFQUNoQjtBQUFBO0FBQUEsRUFHQSxRQUFRO0FBQUEsSUFDTixLQUFLO0FBQUEsTUFDSCxTQUFTO0FBQUEsSUFDWDtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
