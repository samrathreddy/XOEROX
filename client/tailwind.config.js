/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      typography: {
        invert: {
          css: {
            '--tw-prose-body': 'rgb(209, 213, 219)',
            '--tw-prose-headings': 'rgb(255, 255, 255)',
            '--tw-prose-links': 'rgb(96, 165, 250)',
            '--tw-prose-links-hover': 'rgb(147, 197, 253)',
            '--tw-prose-underline': 'rgb(96, 165, 250)',
            '--tw-prose-underline-hover': 'rgb(147, 197, 253)',
            '--tw-prose-bold': 'rgb(255, 255, 255)',
            '--tw-prose-counters': 'rgb(209, 213, 219)',
            '--tw-prose-bullets': 'rgb(209, 213, 219)',
            '--tw-prose-hr': 'rgb(75, 85, 99)',
            '--tw-prose-quote-borders': 'rgb(75, 85, 99)',
            '--tw-prose-captions': 'rgb(156, 163, 175)',
            '--tw-prose-code': 'rgb(255, 255, 255)',
            '--tw-prose-code-bg': 'rgb(31, 41, 55)',
            '--tw-prose-pre-code': 'rgb(255, 255, 255)',
            '--tw-prose-pre-bg': 'rgb(31, 41, 55)',
            '--tw-prose-pre-border': 'rgb(75, 85, 99)',
            '--tw-prose-th-borders': 'rgb(75, 85, 99)',
            '--tw-prose-td-borders': 'rgb(75, 85, 99)',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};