import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'var(--accent)',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			bg: 'var(--bg)',
  			surface: {
  				DEFAULT: 'var(--surface)',
  				2: 'var(--surface-2)'
  			},
  			line: {
  				DEFAULT: 'var(--line)',
  				strong: 'var(--line-strong)'
  			},
  			ink: {
  				DEFAULT: 'var(--ink)',
  				soft: 'var(--ink-soft)',
  				faint: 'var(--ink-faint)'
  			},
  			placeholder: 'var(--placeholder)',
  			inverse: {
  				DEFAULT: 'var(--inverse)',
  				ink: 'var(--on-inverse)',
  				soft: 'var(--on-inverse-soft)',
  				line: 'var(--on-inverse-line)'
  			},
  			success: 'var(--success)',
  			danger: 'var(--danger)',
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			frame: 'var(--radius-frame)',
  			card: 'var(--radius-card)',
  			image: 'var(--radius-image)',
  			input: 'var(--radius-input)'
  		},
  		transitionTimingFunction: {
  			'out-strong': 'var(--ease-out-strong)'
  		},
  		fontFamily: {
  			sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
  			mono: ['var(--font-mono)', 'ui-monospace', 'monospace']
  		}
  	}
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
