'use client';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Marketing Analytics</h2>
        <p className="text-muted-foreground">Deep dive into channel performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Channel Comparison</h3>
          <p className="text-sm text-muted-foreground">Performance trends across channels</p>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Cost Per Lead Trends</h3>
          <p className="text-sm text-muted-foreground">CPL over time</p>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Conversion Rates</h3>
          <p className="text-sm text-muted-foreground">Funnel conversion metrics</p>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Best Performers</h3>
          <p className="text-sm text-muted-foreground">Top channels by ROI</p>
        </div>
      </div>
    </div>
  );
}
