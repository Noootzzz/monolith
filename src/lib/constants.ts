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
  { value: 10, label: "Max (Échec)", color: "text-red-600 font-bold" },
  {
    value: 9,
    label: "Très dur (1 en réserve)",
    color: "text-orange-600 font-medium",
  },
  { value: 8, label: "Dur (2 en réserve)", color: "text-amber-600" },
  { value: 7, label: "Moyen", color: "text-yellow-600" },
  { value: 6, label: "Confortable", color: "text-green-600" },
  { value: 5, label: "Échauffement", color: "text-blue-600" },
];
