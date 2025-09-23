# BoxTimer Pro

A professional timer application built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- ⏱️ Timer functionality
- ⏱️ Stopwatch functionality  
- ⚙️ Settings management
- 📱 Responsive design
- 🌙 Dark mode support

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Linting**: ESLint

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd BoxTimer-Pro
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout component
│   └── page.tsx         # Home page component
├── components/          # Reusable components (to be created)
└── lib/                 # Utility functions (to be created)
```

## Development

This project uses:
- **App Router** for routing
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **ESLint** for code linting

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
