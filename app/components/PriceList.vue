<script setup lang="ts">
const tiers = ref([
  {
    id: "beginner",
    title: "Beginner",
    price: "£25.00",
    description: "Perfect for those starting their judo journey.",
    billingCycle: "/week",
  },
  {
    id: "intermediate",
    title: "Intermediate",
    price: "£30.00",
    description: "For athletes ready to compete.",
    billingCycle: "/week",
    highlight: true, // Often the standard choice
  },
  {
    id: "elite",
    title: "Elite",
    price: "£35.00",
    description: "Intensive training for serious competitors.",
    billingCycle: "/week",
  },
]);

const sections = ref([
  {
    title: "Training Details",
    features: [
      {
        title: "Sessions Per Week",
        tiers: {
          beginner: "2 Sessions",
          intermediate: "3 Sessions",
          elite: "5 Sessions",
        },
      },
      {
        title: "Monthly Cost (4 Weeks)",
        tiers: {
          beginner: "£100.00",
          intermediate: "£120.00",
          elite: "£140.00",
        },
      },
    ],
  },
  {
    title: "Competition & Extras",
    features: [
      {
        title: "Competition Eligibility",
        // Only Intermediate and Elite can enter competitions
        tiers: {
          beginner: false,
          intermediate: "£22.00+",
          elite: "£22.00+",
        },
      },
      {
        title: "Private Tuition Limit",
        // Max 5 hours/week applies to everyone
        tiers: {
          beginner: "Max 5 hrs/week",
          intermediate: "Max 5 hrs/week",
          elite: "Max 5 hrs/week",
        },
      },
    ],
  },
]);
</script>

<template>
  <UPricingTable :tiers="tiers" :sections="sections" />
  <UAlert
    title="Add Private Tuitions!"
    description="Max 5 hours of private tuition per week. £9.50/Hour"
    icon="hugeicons:body-part-muscle"
    color="neutral"
  />
</template>
