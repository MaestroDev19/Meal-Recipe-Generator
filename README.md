# Meal Recipe Generator

This is a Next.js project that generates meal recipes using AI. It's designed to help users create unique recipes based on their preferences and dietary requirements.

## Features

- AI-powered recipe generation
- Customizable meal preferences
- Responsive design using Tailwind CSS
- Dark mode support

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for production
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Google Generative AI](https://www.npmjs.com/package/@google/generative-ai) - AI model for recipe generation
- [Shadcn UI](https://ui.shadcn.com/) - UI component library

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/Meal-Recipe-Generator.git
cd Meal-Recipe-Generator
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Google AI API key:

```
GOOGLE_AI_API_KEY=your_api_key_here
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/` - Contains the main application code
- `components/` - Reusable React components
- `lib/` - Utility functions and helpers
- `public/` - Static assets

## AI Integration

The project uses Google's Generative AI for recipe generation. The integration is handled in the `gemini.ts` file:

```typescript:gemini.ts
startLine: 32
endLine: 79
```

## Styling

The project uses Tailwind CSS for styling. The main configuration can be found in:

```typescript:tailwind.config.ts
startLine: 1
endLine: 80
```

## Components

The project uses various UI components from Shadcn UI, which are customized and integrated into the `components/ui/` directory. Some key components include:

- Button
- Input
- Select
- Textarea
- Drawer
- Form

## Configuration Files

- `next.config.mjs` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `postcss.config.mjs` - PostCSS configuration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgements

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Google AI Documentation](https://ai.google.dev/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com/)
