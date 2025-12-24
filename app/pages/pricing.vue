<script setup lang="ts">
import { user } from '#build/ui';

useHead({
  title: 'Pricing',
  meta: [
    { name: 'description', content: 'Calculate your costs for training plans, private coaching, and competitions at North Sussex Judo Club.' }
  ]
})

const calculatorForm = reactive({
  athleteName: "",
  trainingPlan: "",
  currentWeight: null as number | null,
  weightCategory: "",
  competitionCount: null as number | null,
  privateHours: null as number | null,
});

const trainingPlanOptions = ["Beginner", "Intermediate", "Elite"];

const weightCategoryOptions = [
  "Flyweight",
  "Lightweight",
  "Light-Middleweight",
  "Middleweight",
  "Light-Heavyweight",
  "Heavyweight",
];

const WEIGHT_CATEGORY_LIMITS: Record<string, number | null> = {
  Flyweight: 66,
  Lightweight: 73,
  "Light-Middleweight": 81,
  Middleweight: 90,
  "Light-Heavyweight": 100,
  Heavyweight: null, // Unlimited
};

const TRAINING_PLAN_COSTS: Record<string, number> = {
  Beginner: 25.0,
  Intermediate: 30.0,
  Elite: 35.0,
};

const PRIVATE_TUITION_RATE = 9.5;
const COMPETITION_FEE = 22.0;
const WEEKS_PER_MONTH = 4;

// Athlete Class (OOP)
class Athlete {
  name: string;
  plan: string;
  weight: number | null;
  category: string;
  competitionCount: number;
  privateHours: number;

  constructor(
    name: string,
    plan: string,
    weight: number | null,
    category: string,
    competitionCount: number,
    privateHours: number,
  ) {
    this.name = name;
    this.plan = plan;
    this.weight = weight;
    this.category = category;
    this.competitionCount = competitionCount;
    this.privateHours = privateHours;
  }

  calculateTrainingCost(): number {
    const planCostPerWeek = TRAINING_PLAN_COSTS[this.plan] || 0;
    return planCostPerWeek * WEEKS_PER_MONTH;
  }

  calculateTuitionCost(): number {
    return this.privateHours * PRIVATE_TUITION_RATE;
  }

  calculateCompetitionCost(): number {
    return this.competitionCount * COMPETITION_FEE;
  }

  getTotalCost(): number {
    return (
      this.calculateTrainingCost() +
      this.calculateTuitionCost() +
      this.calculateCompetitionCost()
    );
  }

  checkWeightStatus(): string {
    if (this.weight === null) return "No weight entered";

    const limit = WEIGHT_CATEGORY_LIMITS[this.category];

    if (limit === null || limit === undefined) {
      // Heavyweight - unlimited
      return this.weight > 100 ? "In Category" : "Under Category Minimum";
    }

    if (this.weight <= limit) {
      return "In Category";
    }

    return "Over Weight Limit";
  }
}

interface ResultRow {
  id: number;
  athleteName: string;
  costBreakdown: string;
  totalCost: string;
  weightStatus: string;
}

const results = ref<ResultRow | null>(null);

function formatCurrency(amount: number): string {
  return `£${amount.toFixed(2)}`;
}

function calculateCosts() {
  const {
    athleteName,
    trainingPlan,
    currentWeight,
    weightCategory,
    competitionCount,
    privateHours,
  } = calculatorForm;

  // Validation: Max 5 private coaching hours per week
  if (privateHours !== null && privateHours > 5) {
    alert("Error: Maximum 5 private coaching hours per week allowed.");
    return;
  }

  // Validation: Beginners cannot enter competitions
  if (
    trainingPlan === "Beginner" &&
    competitionCount !== null &&
    competitionCount > 0
  ) {
    alert("Error: Beginners cannot enter competitions.");
    return;
  }

  // Create Athlete instance
  const athlete = new Athlete(
    athleteName || "Unknown Athlete",
    trainingPlan,
    currentWeight,
    weightCategory,
    competitionCount || 0,
    privateHours || 0,
  );

  // Get costs using class methods
  const trainingCost = athlete.calculateTrainingCost();
  const tuitionCost = athlete.calculateTuitionCost();
  const competitionCost = athlete.calculateCompetitionCost();
  const totalCost = athlete.getTotalCost();
  const weightStatus = athlete.checkWeightStatus();

  // Build cost breakdown string
  const costBreakdown = `Plan: ${formatCurrency(trainingCost)} / Tuition: ${formatCurrency(tuitionCost)} / Comps: ${formatCurrency(competitionCost)}`;

  if (!athleteName) {
    alert("Error: Athlete name is required.");
    return;
  }

  // Update results
  results.value = {
    id: (results.value?.id ?? 0) + 1,
    athleteName: athlete.name,
    costBreakdown,
    totalCost: formatCurrency(totalCost),
    weightStatus,
  };
}
</script>

<template>
  <UPageSection>
    <UCard :ui="{ body: 'flex justify-between gap-5' }">
      <template #header>
        <h1 class="font-bold text-2xl">Judo Club Cost Calculator</h1>
      </template>

      <UForm class="flex flex-col flex-1 gap-5">
        <UFormField label="Athlete Name">
          <UInput
            v-model="calculatorForm.athleteName"
            class="w-full"
            placeholder="Enter your name"
          />
        </UFormField>

        <UFormField label="Training Plan">
          <USelect
            v-model="calculatorForm.trainingPlan"
            :items="trainingPlanOptions"
            class="w-full"
            placeholder="Select a training plan"
          />
        </UFormField>

        <UFormField label="Current Weight">
          <UInputNumber
            v-model="calculatorForm.currentWeight"
            class="w-full"
            placeholder="Enter your weight (Kilograms)"
          />
        </UFormField>

        <UFormField label="Competition Weight Category">
          <USelect
            v-model="calculatorForm.weightCategory"
            class="w-full"
            :items="weightCategoryOptions"
            placeholder="Select a weight category"
          />
        </UFormField>

        <UFormField label="Number of Competitions">
          <UInputNumber
            v-model="calculatorForm.competitionCount"
            class="w-full"
            :min="0"
            :max="2"
            placeholder="Enter number of competitions"
          />
        </UFormField>

        <UFormField label="Private Coaching Hours">
          <UInputNumber
            v-model="calculatorForm.privateHours"
            class="w-full"
            :min="0"
            :max="5"
            placeholder="Enter private coaching hours"
          />
        </UFormField>

        <UButton
          type="button"
          color="primary"
          class="mt-4"
          @click="calculateCosts"
        >
          Calculate Costs
        </UButton>
      </UForm>

      <USeparator orientation="vertical" class="my-auto h-72" />

      <UCard v-if="results" class="flex-1 p-4">
        <template #header>
          <h2 class="font-bold text-lg">{{ results.athleteName }}</h2>
        </template>
        <ul>
          <li>
            {{ results.costBreakdown }}
          </li>
          <li>
            Total Cost: <UBadge color="success">{{ results.totalCost }}</UBadge>
          </li>
          <li>
            Weight Status:
            <UBadge
              :color="
                results.weightStatus === 'In Category' ? 'success' : 'warning'
              "
              >{{ results.weightStatus }}</UBadge
            >
          </li>
        </ul>
      </UCard>

      <UEmpty
        v-else
        class="flex-1"
        title="Fill your information to see pricing"
      />
    </UCard>
  </UPageSection>
</template>
