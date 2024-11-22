# Meal Generator

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). The application is designed to help users generate personalized meal recipes based on their dietary preferences and restrictions.

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Learn More](#learn-more)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

To get started with the project, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/meal-generator.git
   cd meal-generator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application in action.

## Usage

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file. 

### Recipe Generation

The application allows users to generate recipes based on their preferences. Users can select from various themes such as Fitness, Vegan, and Normal. Additionally, they can specify allergies and preferred ingredients to tailor the recipes to their needs.

### Customization

The project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel. You can customize the themes and styles in the `app/globals.css` file.

## Features

- Dynamic recipe generation based on user preferences.
- User-friendly interface with customizable themes (Fitness, Vegan, Normal).
- Responsive design for mobile and desktop.
- Integration with generative AI for recipe suggestions.

## Technologies Used

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Groq SDK for data fetching
- **State Management:** React Hook Form for form handling
- **Styling:** Tailwind CSS for utility-first styling

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Next.js GitHub Repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
