<script setup lang="ts">
const items = computed(() => [
  {
    label: "Home",
    to: "/",
  },
  {
    label: "Classes",
    to: "/classes",
  },
  {
    label: "Pricing",
    to: "/pricing",
  },
]);

const user = useState<{ name: string; email: string; password: string }>(
  "user",
);
const userListItems = [
  { label: "settings", icon: "i-lucide-settings" },
  { label: "logout", icon: "i-lucide-log-out", onSelect: () => (user.value = null) },
];
</script>

<template>
  <UHeader title="NSJC">
    <!-- <template #left>
      <NuxtLink to="/">
        <AppLogo class="w-auto h-6 shrink-0" />
      </NuxtLink>
      <TemplateMenu />
    </template> -->

    <UNavigationMenu :items="items" variant="link" />

    <template #right>
      <UColorModeButton />

      <template v-if="!user">
        <UButton
          icon="i-lucide-log-in"
          color="neutral"
          variant="ghost"
          to="/login"
          class="lg:hidden"
        />

        <UButton
          label="Sign in"
          color="neutral"
          variant="outline"
          to="/login"
          class="hidden lg:inline-flex"
        />

        <UButton
          label="Sign up"
          color="neutral"
          trailing-icon="i-lucide-arrow-right"
          class="hidden lg:inline-flex"
          to="/signup"
        />
      </template>
      <UDropdownMenu
        v-else
        :items="userListItems"
        :content="{
          align: 'end',
          side: 'bottom',
          sideOffset: 8,
        }"
        :ui="{
          content: 'w-48',
        }"
      >
        <UButton
          :label="user.name"
          icon="i-lucide-user"
          color="neutral"
          variant="outline"
        />
      </UDropdownMenu>
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />

      <USeparator class="my-6" />

      <UButton
        label="Sign in"
        color="neutral"
        variant="subtle"
        to="/login"
        block
        class="mb-3"
      />
      <UButton label="Sign up" color="neutral" to="/signup" block />
    </template>
  </UHeader>
</template>
