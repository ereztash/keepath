import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Keepath Product',
  description: 'Strategic thinking and mission planning',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                  <div className="flex items-center">
                    <h1 className="text-xl font-bold text-purple-600">Keepath Product</h1>
                  </div>
                  <div className="flex space-x-4">
                    <a href="/" className="text-gray-900 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
                      Missions
                    </a>
                    <a href="/planner" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                      Goal Planner
                    </a>
                    <a href="/coach" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                      AI Coach
                    </a>
                  </div>
                </div>
              </div>
            </nav>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
