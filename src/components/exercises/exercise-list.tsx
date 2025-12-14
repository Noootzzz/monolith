import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, User } from "lucide-react";
import { ExerciseActions } from "./exercise-actions";
import { cn } from "@/lib/utils";
import { getMuscleColor } from "@/lib/constants";

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
        let statusBadge;
        if (exo.isSystem) {
          statusBadge = (
            <Badge
              variant="secondary"
              className="text-[10px] px-2 h-5 gap-1 font-medium bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700 hover:bg-zinc-200"
            >
              <ShieldCheck className="h-3 w-3" />
              Officiel
            </Badge>
          );
        } else {
          statusBadge = (
            <Badge
              variant="secondary"
              className="text-[10px] px-2 h-5 gap-1 font-medium bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50 hover:bg-blue-100"
            >
              <User className="h-3 w-3" />
              Personnel
            </Badge>
          );
        }

        return (
          <Card
            key={exo.id}
            className="flex flex-col justify-between transition-all hover:shadow-md border-l-4 hover:border-l-primary/50"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-lg font-semibold leading-tight tracking-tight line-clamp-2">
                  {exo.name}
                </CardTitle>

                {!exo.isSystem && <ExerciseActions exercise={exo} />}
              </div>
            </CardHeader>

            <CardContent className="pt-2">
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] px-2 py-0.5 border font-normal capitalize",
                    getMuscleColor(exo.targetMuscle)
                  )}
                >
                  {exo.targetMuscle}
                </Badge>

                {statusBadge}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
