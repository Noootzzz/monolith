import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, User } from "lucide-react";
import { ExerciseActions } from "./exercise-actions";

interface Exercise {
  id: number;
  name: string;
  targetMuscle: string;
  isSystem: boolean;
}

export function ExerciseList({ data }: { data: Exercise[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.map((exo) => {
        let badge;

        if (exo.isSystem) {
          badge = (
            <Badge
              variant="secondary"
              className="text-[10px] px-2 h-5 gap-1 font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100/80"
            >
              <ShieldCheck className="h-3 w-3" />
              Officiel
            </Badge>
          );
        } else {
          badge = (
            <Badge
              variant="secondary"
              className="text-[10px] px-2 h-5 gap-1 font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100/80"
            >
              <User className="h-3 w-3" />
              Personnel
            </Badge>
          );
        }

        return (
          <Card
            key={exo.id}
            className="transition-all hover:shadow-md border-l-4 hover:border-l-primary/50"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-lg font-semibold leading-tight tracking-tight">
                    {exo.name}
                  </CardTitle>
                  <div className="flex">{badge}</div>
                </div>

                {!exo.isSystem && <ExerciseActions exercise={exo} />}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md capitalize">
                  {exo.targetMuscle}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
