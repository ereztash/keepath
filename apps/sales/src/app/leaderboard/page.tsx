'use client';

import { Trophy, Medal } from 'lucide-react';
import { formatCurrency } from '@keepath/shared-ui';

export default function LeaderboardPage() {
  const leaderboard = [
    { rank: 1, name: 'Sarah Johnson', sales: 12, revenue: 35000, winRate: 68 },
    { rank: 2, name: 'Mike Brown', sales: 10, revenue: 28500, winRate: 55 },
    { rank: 3, name: 'Alex Chen', sales: 8, revenue: 21000, winRate: 50 },
    { rank: 4, name: 'Emily Davis', sales: 6, revenue: 15000, winRate: 45 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Sales Leaderboard</h2>
        <p className="text-muted-foreground">Top performers this month</p>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-8 text-white">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="h-12 w-12" />
          </div>
          <h3 className="text-center text-xl font-bold mb-2">Top Seller</h3>
          <p className="text-center text-3xl font-bold">{leaderboard[0].name}</p>
          <p className="text-center text-lg mt-2">{formatCurrency(leaderboard[0].revenue)} in sales</p>
        </div>

        <div className="p-6">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Rank</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Sales</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Revenue</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Win Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaderboard.map((person) => (
                <tr key={person.rank} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      {person.rank <= 3 && (
                        <Medal
                          className={`h-5 w-5 mr-2 ${
                            person.rank === 1
                              ? 'text-yellow-500'
                              : person.rank === 2
                              ? 'text-gray-400'
                              : 'text-orange-600'
                          }`}
                        />
                      )}
                      <span className="font-semibold">{person.rank}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900">{person.name}</td>
                  <td className="px-4 py-4 text-gray-900">{person.sales}</td>
                  <td className="px-4 py-4 font-semibold text-green-600">
                    {formatCurrency(person.revenue)}
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-purple-600 font-medium">{person.winRate}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
