"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import {
  exercises,
  workouts,
  workoutExercises,
  sets,
  workoutTemplates,
  workoutTemplateExercises,
} from "@/db/schema";
import { eq, and, desc, lt, gt, asc, inArray, or } from "drizzle-orm";
import { redirect } from "next/navigation";

// --- EXERCICES ---

export const createExercise = async (formData: FormData) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const name = formData.get("name") as string;
  const muscle = formData.get("targetMuscle") as string;
  const trackWeightInput = formData.get("trackWeight");
  const trackWeight = trackWeightInput === "on";

  if (!name || !muscle) {
    throw new Error("Missing data");
  }

  const existingExercise = await db.query.exercises.findFirst({
    where: and(eq(exercises.userId, userId), eq(exercises.name, name)),
  });

  if (existingExercise) {
    throw new Error("Exercise already exists");
  }

  await db.insert(exercises).values({
    userId,
    name,
    targetMuscle: muscle,
    isSystem: false,
    trackWeight: trackWeight,
  });

  // ⚡ CORRECTION ICI : Ajout du 2ème argument pour votre version de Next.js
  revalidateTag("exercises", { expire: 0 });

  revalidatePath("/dashboard");
  return { success: true };
};

export async function deleteExercise(exerciseId: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  await db
    .delete(exercises)
    .where(
      and(
        eq(exercises.id, exerciseId),
        eq(exercises.userId, session.user.id),
        eq(exercises.isSystem, false)
      )
    );

  // ⚡ CORRECTION ICI
  revalidateTag("exercises", { expire: 0 });
  revalidatePath("/exercises");
}

export async function updateExercise(exerciseId: number, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const targetMuscle = formData.get("targetMuscle") as string;

  await db
    .update(exercises)
    .set({ name, targetMuscle })
    .where(
      and(eq(exercises.id, exerciseId), eq(exercises.userId, session.user.id))
    );

  // ⚡ CORRECTION ICI
  revalidateTag("exercises", { expire: 0 });
  revalidatePath("/exercises");
}

export const toggleExerciseFavorite = async (exerciseId: number) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Unauthorized");

  const exercise = await db.query.exercises.findFirst({
    where: eq(exercises.id, exerciseId),
  });

  if (!exercise) throw new Error("Exercise not found");

  await db
    .update(exercises)
    .set({ isFavorite: !exercise.isFavorite })
    .where(eq(exercises.id, exerciseId));

  // ⚡ CORRECTION ICI
  revalidateTag("exercises", { expire: 0 });
  revalidatePath("/exercises");
  revalidatePath("/workout/[id]", "page");
};

// --- SÉANCES (WORKOUTS) ---

export async function createEmptyWorkout() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Non autorisé");
  }

  const now = new Date();
  const dayName = new Intl.DateTimeFormat("fr-FR", { weekday: "long" }).format(
    now
  );
  const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  const time = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(now)
    .replace(":", "h");

  const workoutName = `${capitalizedDay} ${time}`;

  const [newWorkout] = await db
    .insert(workouts)
    .values({
      userId: session.user.id,
      name: workoutName,
      status: "PLANNING",
      startTime: null,
    })
    .returning();

  redirect(`/workout/${newWorkout.id}`);
}

export async function startWorkout(workoutId: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) throw new Error("Unauthorized");

  await db
    .update(workouts)
    .set({
      status: "IN_PROGRESS",
      startTime: new Date(),
    })
    .where(eq(workouts.id, workoutId));

  revalidatePath(`/workout/${workoutId}`, "page");
}

export async function startWorkoutWithConfig(
  workoutId: number,
  exercisesConfig: any[]
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  await db
    .update(workouts)
    .set({
      status: "IN_PROGRESS",
      startTime: new Date(),
    })
    .where(eq(workouts.id, workoutId));

  for (const exo of exercisesConfig) {
    if (!exo.sets || exo.sets.length === 0) {
      await db.delete(workoutExercises).where(eq(workoutExercises.id, exo.id));
      await db.delete(sets).where(eq(sets.workoutExerciseId, exo.id));
      continue;
    }

    await db
      .update(workoutExercises)
      .set({ restTime: exo.restTime })
      .where(eq(workoutExercises.id, exo.id));

    await db.delete(sets).where(eq(sets.workoutExerciseId, exo.id));

    if (exo.sets && exo.sets.length > 0) {
      const setsToInsert = exo.sets.map((s: any, index: number) => ({
        workoutExerciseId: exo.id,
        orderIndex: index + 1,
        weight: s.weight ? String(s.weight) : "0",
        reps: Number(s.reps) || 0,
        isCompleted: false,
      }));

      await db.insert(sets).values(setsToInsert);
    }
  }

  revalidatePath(`/workout/${workoutId}`, "page");
}

export async function startWorkoutFromTemplate(templateId: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const [template] = await db
    .select()
    .from(workoutTemplates)
    .where(eq(workoutTemplates.id, templateId));
  const templateExos = await db
    .select()
    .from(workoutTemplateExercises)
    .where(eq(workoutTemplateExercises.templateId, templateId));

  const [newWorkout] = await db
    .insert(workouts)
    .values({
      userId: session.user.id,
      name: template?.name || "Séance",
      status: "PLANNING",
      startTime: null,
    })
    .returning({ id: workouts.id });

  if (templateExos.length > 0) {
    const exercisesToInsert = templateExos.map((tExo) => ({
      workoutId: newWorkout.id,
      exerciseId: tExo.exerciseId,
      orderIndex: tExo.orderIndex,
    }));
    await db.insert(workoutExercises).values(exercisesToInsert);
  }

  return newWorkout.id;
}

export async function startTimer(workoutId: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  await db
    .update(workouts)
    .set({
      status: "IN_PROGRESS",
      startTime: new Date(),
    })
    .where(eq(workouts.id, workoutId));

  revalidatePath(`/workout/${workoutId}`);
}

export async function finishWorkout(workoutId: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const [workout] = await db
    .select()
    .from(workouts)
    .where(
      and(eq(workouts.id, workoutId), eq(workouts.userId, session.user.id))
    );

  if (!workout) throw new Error("Workout not found");

  const workoutExos = await db
    .select({ id: workoutExercises.id })
    .from(workoutExercises)
    .where(eq(workoutExercises.workoutId, workoutId));

  const workoutExoIds = workoutExos.map((we) => we.id);

  if (workoutExoIds.length > 0) {
    await db
      .delete(sets)
      .where(
        and(
          inArray(sets.workoutExerciseId, workoutExoIds),
          or(eq(sets.isCompleted, false), eq(sets.reps, 0))
        )
      );

    const exosWithSets = await db
      .select({ id: sets.workoutExerciseId })
      .from(sets)
      .where(inArray(sets.workoutExerciseId, workoutExoIds))
      .groupBy(sets.workoutExerciseId);

    const validExoIds = exosWithSets.map((e) => e.id);
    const exosToDelete = workoutExoIds.filter(
      (id) => !validExoIds.includes(id)
    );

    if (exosToDelete.length > 0) {
      await db
        .delete(workoutExercises)
        .where(inArray(workoutExercises.id, exosToDelete));
    }
  }

  const endTime = new Date();
  let duration = 0;

  if (workout.startTime) {
    const start = new Date(workout.startTime).getTime();
    const end = endTime.getTime();
    duration = Math.round((end - start) / 1000);
  }

  await db
    .update(workouts)
    .set({
      status: "COMPLETED",
      endTime: endTime,
      duration: duration,
    })
    .where(eq(workouts.id, workoutId));

  redirect("/dashboard");
}

export async function cancelWorkout(workoutId: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  await db
    .delete(workouts)
    .where(
      and(eq(workouts.id, workoutId), eq(workouts.userId, session.user.id))
    );

  redirect("/workout");
}

export async function addExercisesToWorkout(
  workoutId: number,
  exerciseIds: number[]
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  if (exerciseIds.length === 0) return;

  const existingExercises = await db
    .select()
    .from(workoutExercises)
    .where(eq(workoutExercises.workoutId, workoutId));

  let nextIndex = existingExercises.length;

  const valuesToInsert = exerciseIds.map((exoId) => {
    const entry = {
      workoutId,
      exerciseId: exoId,
      orderIndex: nextIndex,
    };
    nextIndex++;
    return entry;
  });

  await db.insert(workoutExercises).values(valuesToInsert);

  revalidatePath(`/workout/${workoutId}`);
}

export async function removeExerciseFromWorkout(workoutExerciseId: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  await db
    .delete(workoutExercises)
    .where(eq(workoutExercises.id, workoutExerciseId));

  revalidatePath("/workout/[id]", "page");
}

export async function moveExercise(
  workoutExerciseId: number,
  direction: "up" | "down"
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const [currentLink] = await db
    .select()
    .from(workoutExercises)
    .where(eq(workoutExercises.id, workoutExerciseId));

  if (!currentLink) return;

  const [neighbor] = await db
    .select()
    .from(workoutExercises)
    .where(
      and(
        eq(workoutExercises.workoutId, currentLink.workoutId),
        direction === "up"
          ? lt(workoutExercises.orderIndex, currentLink.orderIndex)
          : gt(workoutExercises.orderIndex, currentLink.orderIndex)
      )
    )
    .orderBy(
      direction === "up"
        ? desc(workoutExercises.orderIndex)
        : workoutExercises.orderIndex
    )
    .limit(1);

  if (!neighbor) return;

  await db
    .update(workoutExercises)
    .set({ orderIndex: neighbor.orderIndex })
    .where(eq(workoutExercises.id, currentLink.id));

  await db
    .update(workoutExercises)
    .set({ orderIndex: currentLink.orderIndex })
    .where(eq(workoutExercises.id, neighbor.id));

  revalidatePath(`/workout/${currentLink.workoutId}`);
}

export async function reorderExercises(
  items: { id: number; orderIndex: number }[]
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  await Promise.all(
    items.map((item) =>
      db
        .update(workoutExercises)
        .set({ orderIndex: item.orderIndex })
        .where(eq(workoutExercises.id, item.id))
    )
  );

  revalidatePath("/workout/[id]", "page");
}

export async function addSet(workoutExerciseId: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const existingSets = await db
    .select()
    .from(sets)
    .where(eq(sets.workoutExerciseId, workoutExerciseId))
    .orderBy(asc(sets.orderIndex));

  const nextIndex = existingSets.length + 1;
  const lastSet = existingSets[existingSets.length - 1];
  const defaultWeight = lastSet ? lastSet.weight : "0";
  const defaultReps = lastSet ? lastSet.reps : 0;

  await db.insert(sets).values({
    workoutExerciseId,
    orderIndex: nextIndex,
    weight: defaultWeight,
    reps: defaultReps,
    isCompleted: false,
  });

  revalidatePath("/workout/[id]", "page");
}

export async function updateSet(
  setId: number,
  field: "weight" | "reps" | "isCompleted" | "rpe",
  value: string | number | boolean
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  let valueToUpdate = value;

  if (field === "weight" || field === "reps" || field === "rpe") {
    if (value === "" || value === undefined || value === null) {
      if (field === "weight") valueToUpdate = "0";
      else if (field === "reps") valueToUpdate = 0;
      else valueToUpdate = null as any;
    } else {
      const parsed = Number(value);
      if (isNaN(parsed)) {
        if (field === "weight") valueToUpdate = "0";
        else if (field === "reps") valueToUpdate = 0;
        else valueToUpdate = null as any;
      } else {
        valueToUpdate = parsed;
        if (field === "weight") {
          valueToUpdate = valueToUpdate.toString();
        }
      }
    }
  }

  await db
    .update(sets)
    .set({ [field]: valueToUpdate })
    .where(eq(sets.id, setId));

  revalidatePath("/workout/[id]", "page");
}

export async function removeSet(setId: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  await db.delete(sets).where(eq(sets.id, setId));
  revalidatePath("/workout/[id]", "page");
}

export async function saveAsTemplate(workoutId: number, templateName: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const [newTemplate] = await db
    .insert(workoutTemplates)
    .values({
      userId: session.user.id,
      name: templateName,
    })
    .returning({ id: workoutTemplates.id });

  const currentExos = await db
    .select()
    .from(workoutExercises)
    .where(eq(workoutExercises.workoutId, workoutId));

  if (currentExos.length > 0) {
    await db.insert(workoutTemplateExercises).values(
      currentExos.map((exo) => ({
        templateId: newTemplate.id,
        exerciseId: exo.exerciseId,
        orderIndex: exo.orderIndex,
      }))
    );
  }

  revalidatePath("/workout/[id]", "page");
}

export async function deleteTemplate(templateId: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  await db
    .delete(workoutTemplates)
    .where(
      and(
        eq(workoutTemplates.id, templateId),
        eq(workoutTemplates.userId, session.user.id)
      )
    );
  revalidatePath("/workout");
}

export async function createWorkout(name: string = "Séance du jour") {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Unauthorized");

  const [newWorkout] = await db
    .insert(workouts)
    .values({
      userId: session.user.id,
      name: name,
      status: "PLANNING",
      startTime: null,
    })
    .returning({ id: workouts.id });

  return newWorkout.id;
}

export async function updateWorkoutExerciseRest(
  workoutExerciseId: number,
  seconds: number
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  await db
    .update(workoutExercises)
    .set({ restTime: seconds })
    .where(eq(workoutExercises.id, workoutExerciseId));

  revalidatePath("/workout/[id]");
}
