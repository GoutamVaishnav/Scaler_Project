import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatsCards({ stats }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <CardTitle className="text-3xl">{stat.value}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{stat.caption}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

