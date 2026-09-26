import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Vite is the tool that turns our code into a web page.
// Tailwind is the tool that gives us easy colors and spacing.
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
