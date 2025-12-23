<script setup lang="ts">
const user = useState<{ name: string } | null>("user");

const calculatorForm = reactive({
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

const weightCategoryLimits: Record<string, number | null> = {
  Flyweight: 66,
  Lightweight: 73,
  "Light-Middleweight": 81,
  Middleweight: 90,
  "Light-Heavyweight": 100,
  Heavyweight: null, // Unlimited
};

const trainingPlanCosts: Record<string, number> = {
  Beginner: 25.0,
  Intermediate: 30.0,
  Elite: 35.0,
};

const PRIVATE_TUITION_RATE = 9.5;
const COMPETITION_FEE = 22.0;
const WEEKS_PER_MONTH = 4;

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

function getWeightStatus(weight: number | null, category: string): string {
  if (weight === null) return "No weight entered";

  const limit = weightCategoryLimits[category];

  if (limit === null || limit === undefined) {
    // Heavyweight - unlimited
    return weight > 100 ? "In Category" : "Under Category Minimum";
  }

  if (weight <= limit) {
    return "In Category";
  }

  return "Over Weight Limit";
}

function calculateCosts() {
  const {
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

  // Calculate costs
  const planCostPerWeek = trainingPlanCosts[trainingPlan] || 0;
  const planCost = planCostPerWeek * WEEKS_PER_MONTH;
  const tuitionCost = (privateHours || 0) * PRIVATE_TUITION_RATE;
  const competitionCost = (competitionCount || 0) * COMPETITION_FEE;
  const totalCost = planCost + tuitionCost + competitionCost;

  // Get weight status
  const weightStatus = getWeightStatus(currentWeight, weightCategory);

  // Build cost breakdown string
  const costBreakdown = `Plan: ${formatCurrency(planCost)} / Tuition: ${formatCurrency(tuitionCost)} / Comps: ${formatCurrency(competitionCost)}`;

  // Add result to table
  results.value = {
    id: (results.value?.id ?? 0) + 1,
    athleteName: user.value?.name || "Unknown Athlete",
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
        <h1 class="font-bold text-2xl">Welcome, {{ user?.name }}</h1>
      </template>

      <UForm class="flex flex-col flex-1 gap-5">
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

      <!-- <UTable :data="results" class="flex-1" /> -->
      <UCard v-if="results" class="flex-1 p-4">
        <template #header>
          <h2 class="font-bold text-lg">{{ user?.name }}</h2>
        </template>
        <ul>
          <!-- "costBreakdown":"Plan: £120.00 / Tuition: £9.50 / Comps: £22.00","totalCost":"£151.50","weightStatus":"In Category"} -->
          <li>
            {{ results.costBreakdown }}
          </li>
          <li>
            Total Cost: <UBadge color="success">{{ results.totalCost }}</UBadge>
          </li>
          <li>
            Weight Status:
            <UBadge :color="results.weightStatus === 'In Category' ? 'success' : 'warning'">{{ results.weightStatus }}</UBadge>
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
