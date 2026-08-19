# Lyric — Space & Swimming

A modern, single-page site celebrating **Lyric**: a 14-year-old aspiring astrophysicist
and Wisconsin state-level competitive swimmer. It showcases his own astrophotography —
the Lagoon Nebula (M8), the Veil Nebula, and a video of the Moon captured through his
telescope — alongside his swimming and his goal of studying astrophysics.

**Live site:** https://ievangelist.github.io/lyric/

## Tech stack

- [Vite](https://vite.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) (base-nova)

## Local development

```bash
npm install      # install dependencies
npm run dev      # start the dev server
npm run build    # type-check and build to dist/
npm run preview  # preview the production build at /lyric/
```

## Deployment

Pushing to `main` triggers the [GitHub Actions workflow](.github/workflows/deploy.yml),
which builds the site and publishes `dist/` to GitHub Pages.

## Media credits

All nebula and Moon imagery was captured by Lyric through his own telescope. Family
photo taken at Kennedy Space Center. Please do not reuse the photography without
permission.

## License

Code is released under the [MIT License](LICENSE). The photography and video remain the
property of their subjects and are not covered by the MIT license.