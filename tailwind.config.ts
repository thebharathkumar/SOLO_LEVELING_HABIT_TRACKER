import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        // Solo Leveling Color Palette
        midnight: "var(--midnight)",
        electric: "var(--electric)",
        gold: "var(--gold)",
        blood: "var(--blood)",
        ethereal: "var(--ethereal)",
        
        // Base theme colors
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
        orbitron: ["var(--font-orbitron)"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        glow: {
          "0%": { 
            boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)" 
          },
          "100%": { 
            boxShadow: "0 0 30px rgba(139, 92, 246, 0.6), 0 0 40px rgba(255, 215, 0, 0.3)" 
          },
        },
        float: {
          "0%, 100%": { 
            transform: "translateY(0px)" 
          },
          "50%": { 
            transform: "translateY(-10px)" 
          },
        },
        levelUp: {
          "0%": { 
            transform: "scale(1) rotate(0deg)", 
            opacity: "1" 
          },
          "50%": { 
            transform: "scale(1.2) rotate(180deg)", 
            opacity: "0.8" 
          },
          "100%": { 
            transform: "scale(1) rotate(360deg)", 
            opacity: "1" 
          },
        },
        expFill: {
          "0%": { 
            width: "0%" 
          },
          "100%": { 
            width: "var(--exp-width)" 
          },
        },
        particle: {
          "0%": { 
            transform: "translateY(0) scale(1)", 
            opacity: "1" 
          },
          "100%": { 
            transform: "translateY(-50px) scale(0)", 
            opacity: "0" 
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        glow: "glow 2s ease-in-out infinite alternate",
        float: "float 3s ease-in-out infinite",
        "level-up": "levelUp 0.8s ease-out",
        "exp-fill": "expFill 1s ease-out",
        particle: "particle 2s ease-out infinite",
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-lg': '0 0 30px rgba(139, 92, 246, 0.6), 0 0 40px rgba(255, 215, 0, 0.3)',
        'gold-glow': '0 0 20px rgba(255, 215, 0, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'midnight-gradient': 'linear-gradient(135deg, var(--midnight) 0%, hsl(230, 40%, 12%) 50%, var(--midnight) 100%)',
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
