import "dotenv/config";
import { db } from "./index";
import { exercises } from "./schema";
import { eq } from "drizzle-orm";

const SYSTEM_EXERCISES = [
  // --- PECTORAUX ---
  { name: "Développé Couché (Barre)", targetMuscle: "Pectoraux" },
  { name: "Développé Couché (Haltères)", targetMuscle: "Pectoraux" },
  { name: "Développé Couché (Machine)", targetMuscle: "Pectoraux" },
  { name: "Développé Couché Serré", targetMuscle: "Pectoraux" },
  { name: "Développé Incliné (Barre)", targetMuscle: "Pectoraux" },
  { name: "Développé Incliné (Haltères)", targetMuscle: "Pectoraux" },
  { name: "Développé Incliné (Machine)", targetMuscle: "Pectoraux" },
  { name: "Développé Décliné", targetMuscle: "Pectoraux" },
  { name: "Dips", targetMuscle: "Pectoraux" },
  { name: "Écarté Couché (Haltères)", targetMuscle: "Pectoraux" },
  { name: "Écarté Incliné (Haltères)", targetMuscle: "Pectoraux" },
  { name: "Écarté Poulie Vis-à-vis (Haut)", targetMuscle: "Pectoraux" },
  { name: "Écarté Poulie Vis-à-vis (Bas)", targetMuscle: "Pectoraux" },
  { name: "Pec Deck (Machine)", targetMuscle: "Pectoraux" },
  { name: "Pull-over", targetMuscle: "Pectoraux" },
  { name: "Pompes Classiques", targetMuscle: "Pectoraux" },
  { name: "Pompes Diamant", targetMuscle: "Pectoraux" },

  // --- DOS ---
  { name: "Tractions Pronation (Pull-ups)", targetMuscle: "Dos" },
  { name: "Tractions Supination (Chin-ups)", targetMuscle: "Dos" },
  { name: "Tirage Poitrine (Poulie Haute)", targetMuscle: "Dos" },
  { name: "Tirage Nuque", targetMuscle: "Dos" },
  { name: "Tirage Prise Serrée (Triangle)", targetMuscle: "Dos" },
  { name: "Tirage Horizontal (Poulie Basse)", targetMuscle: "Dos" },
  { name: "Rowing Barre (Pronation)", targetMuscle: "Dos" },
  { name: "Rowing Barre (Supination)", targetMuscle: "Dos" },
  { name: "Rowing Haltère Unilatéral", targetMuscle: "Dos" },
  { name: "Rowing T-Bar", targetMuscle: "Dos" },
  { name: "Rowing Machine", targetMuscle: "Dos" },
  { name: "Tirage Vertical Machine", targetMuscle: "Dos" },
  { name: "Pull-over Poulie Haute", targetMuscle: "Dos" },
  { name: "Extensions Lombaires (Banc)", targetMuscle: "Dos" },
  { name: "Shrugs (Trapèzes)", targetMuscle: "Trapèzes" },

  // --- QUADRICEPS (Avant de la cuisse) ---
  { name: "Squat Arrière (Back Squat)", targetMuscle: "Quadriceps" },
  { name: "Squat Avant (Front Squat)", targetMuscle: "Quadriceps" },
  { name: "Goblet Squat", targetMuscle: "Quadriceps" },
  { name: "Hack Squat Machine", targetMuscle: "Quadriceps" },
  { name: "Presse à Cuisses (Leg Press)", targetMuscle: "Quadriceps" },
  { name: "Fentes (Lunges)", targetMuscle: "Quadriceps" },
  { name: "Fentes Bulgares", targetMuscle: "Quadriceps" },
  { name: "Leg Extension", targetMuscle: "Quadriceps" },
  { name: "Sissy Squat", targetMuscle: "Quadriceps" },
  { name: "Pistol Squat", targetMuscle: "Quadriceps" },

  // --- ISCHIOS-JAMBIERS (Arrière de la cuisse) ---
  { name: "Soulevé de Terre Roumain (RDL)", targetMuscle: "Ischios-jambiers" },
  { name: "Soulevé de Terre Jambes Tendues", targetMuscle: "Ischios-jambiers" },
  { name: "Leg Curl Assis", targetMuscle: "Ischios-jambiers" },
  { name: "Leg Curl Allongé", targetMuscle: "Ischios-jambiers" },
  { name: "Nordic Hamstring Curl", targetMuscle: "Ischios-jambiers" },
  { name: "Good Morning", targetMuscle: "Ischios-jambiers" },

  // --- FESSIERS ---
  { name: "Hip Thrust (Barre)", targetMuscle: "Fessiers" },
  { name: "Glute Bridge", targetMuscle: "Fessiers" },
  { name: "Kickback Poulie", targetMuscle: "Fessiers" },
  { name: "Machine à Abducteurs (Extérieur)", targetMuscle: "Fessiers" },
  { name: "Fentes Croisées (Curtsy Lunge)", targetMuscle: "Fessiers" },

  // --- ADDUCTEURS (Intérieur de la cuisse) ---
  { name: "Machine à Adducteurs (Intérieur)", targetMuscle: "Adducteurs" },
  { name: "Squat Sumo", targetMuscle: "Adducteurs" },
  { name: "Copenhague Plank", targetMuscle: "Adducteurs" },

  // --- MOLLETS ---
  { name: "Mollets Debout (Machine)", targetMuscle: "Mollets" },
  { name: "Mollets Assis (Machine)", targetMuscle: "Mollets" },
  { name: "Mollets à la Presse", targetMuscle: "Mollets" },

  // --- ÉPAULES ---
  { name: "Développé Militaire (Barre Debout)", targetMuscle: "Épaules" },
  { name: "Développé Militaire Assis (Haltères)", targetMuscle: "Épaules" },
  { name: "Développé Épaules Machine", targetMuscle: "Épaules" },
  { name: "Développé Arnold", targetMuscle: "Épaules" },
  { name: "Élévations Latérales (Haltères)", targetMuscle: "Épaules" },
  { name: "Élévations Latérales (Poulie)", targetMuscle: "Épaules" },
  { name: "Élévations Frontales", targetMuscle: "Épaules" },
  { name: "Oiseau (Buste penché)", targetMuscle: "Épaules" },
  { name: "Face Pull", targetMuscle: "Épaules" },
  { name: "Tirage Menton", targetMuscle: "Épaules" },

  // --- BICEPS ---
  { name: "Curl Barre Droite", targetMuscle: "Biceps" },
  { name: "Curl Barre EZ", targetMuscle: "Biceps" },
  { name: "Curl Haltères (Supination)", targetMuscle: "Biceps" },
  { name: "Curl Marteau (Hammer Curl)", targetMuscle: "Biceps" },
  { name: "Curl Pupitre (Larry Scott)", targetMuscle: "Biceps" },
  { name: "Curl Incliné", targetMuscle: "Biceps" },
  { name: "Curl Araignée", targetMuscle: "Biceps" },
  { name: "Curl Poulie Basse", targetMuscle: "Biceps" },

  // --- TRICEPS ---
  { name: "Barre au Front", targetMuscle: "Triceps" },
  { name: "Extension Triceps Poulie Haute (Corde)", targetMuscle: "Triceps" },
  { name: "Extension Triceps Poulie Haute (Barre)", targetMuscle: "Triceps" },
  { name: "Extension Nuque (Haltère)", targetMuscle: "Triceps" },
  { name: "Kickback", targetMuscle: "Triceps" },
  { name: "Dips Triceps (Banc)", targetMuscle: "Triceps" },
  { name: "Pompes Prise Serrée", targetMuscle: "Triceps" },

  // --- AVANT-BRAS ---
  { name: "Curl Poignet (Supination)", targetMuscle: "Avant-bras" },
  { name: "Curl Poignet (Pronation)", targetMuscle: "Avant-bras" },
  { name: "Suspension Barre (Dead Hang)", targetMuscle: "Avant-bras" },

  // --- ABDOS / GAINAGE ---
  { name: "Crunch", targetMuscle: "Abdos" },
  { name: "Crunch Poulie Haute", targetMuscle: "Abdos" },
  { name: "Relevé de Jambes (Suspendu)", targetMuscle: "Abdos" },
  { name: "Relevé de Genoux", targetMuscle: "Abdos" },
  { name: "Planche (Gainage)", targetMuscle: "Abdos" },
  { name: "Planche Latérale", targetMuscle: "Abdos" },
  { name: "Russian Twist", targetMuscle: "Abdos" },
  { name: "Ab Wheel (Roulette)", targetMuscle: "Abdos" },
  { name: "Woodchopper (Poulie)", targetMuscle: "Abdos" },

  // --- CARDIO ---
  { name: "Tapis de Course", targetMuscle: "Cardio" },
  { name: "Vélo Elliptique", targetMuscle: "Cardio" },
  { name: "Vélo Stationnaire", targetMuscle: "Cardio" },
  { name: "Rameur", targetMuscle: "Cardio" },
  { name: "Escaliers (Stairmaster)", targetMuscle: "Cardio" },
  { name: "Corde à Sauter", targetMuscle: "Cardio" },
];

async function main() {
  console.log("Début du seeding massif...");

  try {
    console.log("Nettoyage des anciens exercices officiels...");
    await db.delete(exercises).where(eq(exercises.isSystem, true));

    const dataToInsert = SYSTEM_EXERCISES.map((exo) => ({
      ...exo,
      isSystem: true,
      userId: null,
    }));

    console.log(`Insertion de ${dataToInsert.length} exercices...`);
    await db.insert(exercises).values(dataToInsert);

    console.log("Base de données mise à jour avec succès !");
  } catch (error) {
    console.error("Erreur lors du seeding :", error);
  }

  process.exit(0);
}

main();
