<script setup lang="ts">
defineProps<{
  icon: string
  label: string
  to: string
}>()
</script>

<template>
  <UButton
    :to="to"
    color="neutral"
    variant="soft"
    class="flex-col p-2"
  >
    <UIcon
      :name="icon"
      class="size-8"
    />
    <span class="text-base">
      {{ label }}
    </span>
  </UButton>
</template>
