export const MUSCLE_CATEGORIES = [
  "Pectoraux",
  "Dos",
  "Quadriceps",
  "Ischios-jambiers",
  "Adducteurs",
  "Fessiers",
  "Mollets",
  "Épaules",
  "Biceps",
  "Triceps",
  "Trapèzes",
  "Avant-bras",
  "Abdos",
  "Cardio",
  "Autre",
] as const;

export const RPE_OPTIONS = [
  { value: 10, label: "10 - Max (Échec)", color: "text-red-600 font-bold" },
  {
    value: 9,
    label: "9 - Très dur (1 en réserve)",
    color: "text-orange-600 font-bold",
  },
  {
    value: 8,
    label: "8 - Dur (2 en réserve)",
    color: "text-amber-600 font-semibold",
  },
  {
    value: 7,
    label: "7 - Difficile (3 en réserve)",
    color: "text-yellow-600 font-medium",
  },
  { value: 6, label: "6 - Moyen (4 en réserve)", color: "text-lime-600" },
  { value: 5, label: "5 - Confortable", color: "text-green-600" },
  { value: 4, label: "4 - Facile", color: "text-emerald-600" },
  { value: 3, label: "3 - Très facile", color: "text-teal-600" },
  { value: 2, label: "2 - Léger", color: "text-cyan-600" },
  { value: 1, label: "1 - Très léger", color: "text-sky-600" },
];

export const MUSCLE_COLORS: Record<string, string> = {
  // PUSH
  Pectoraux:
    "bg-red-500/10 text-red-700 border-red-200 dark:text-red-400 dark:border-red-900/50",
  Épaules:
    "bg-orange-500/10 text-orange-700 border-orange-200 dark:text-orange-400 dark:border-orange-900/50",
  Triceps:
    "bg-amber-500/10 text-amber-700 border-amber-200 dark:text-amber-400 dark:border-amber-900/50",

  // PULL
  Dos: "bg-blue-500/10 text-blue-700 border-blue-200 dark:text-blue-400 dark:border-blue-900/50",
  Biceps:
    "bg-indigo-500/10 text-indigo-700 border-indigo-200 dark:text-indigo-400 dark:border-indigo-900/50",
  "Avant-bras":
    "bg-sky-500/10 text-sky-700 border-sky-200 dark:text-sky-400 dark:border-sky-900/50",
  Trapèzes:
    "bg-indigo-500/10 text-indigo-700 border-indigo-200 dark:text-indigo-400 dark:border-indigo-900/50",

  // LEGS
  Jambes:
    "bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:text-emerald-400 dark:border-emerald-900/50",
  Quadriceps:
    "bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:text-emerald-400 dark:border-emerald-900/50",
  Ischios:
    "bg-green-500/10 text-green-700 border-green-200 dark:text-green-400 dark:border-green-900/50",
  "Ischio-jambiers":
    "bg-green-500/10 text-green-700 border-green-200 dark:text-green-400 dark:border-green-900/50",
  "Ischios-jambiers":
    "bg-green-500/10 text-green-700 border-green-200 dark:text-green-400 dark:border-green-900/50",
  Adducteurs:
    "bg-lime-500/10 text-lime-700 border-lime-200 dark:text-lime-400 dark:border-lime-900/50",
  Mollets:
    "bg-lime-500/10 text-lime-700 border-lime-200 dark:text-lime-400 dark:border-lime-900/50",
  Fessiers:
    "bg-teal-500/10 text-teal-700 border-teal-200 dark:text-teal-400 dark:border-teal-900/50",

  // AUTRES
  Abdos:
    "bg-pink-500/10 text-pink-700 border-pink-200 dark:text-pink-400 dark:border-pink-900/50",
  Cardio:
    "bg-purple-500/10 text-purple-700 border-purple-200 dark:text-purple-400 dark:border-purple-900/50",
};

export const getMuscleColor = (muscle: string) => {
  return (
    MUSCLE_COLORS[muscle] ||
    "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700"
  );
};
