<script setup lang="ts">
import type { NavigationItem } from '~/types/navigation'

defineProps<{
  title: string
  items: NavigationItem[]
}>()
</script>

<template>
  <section>
    <USeparator class="my-2" />

    <h2 class="px-2 py-1 text-xs font-medium text-muted">
      {{ title }}
    </h2>

    <UButton
      v-for="item in items"
      :key="item.label"
      :label="item.label"
      :icon="item.icon"
      :to="item.to"
      color="neutral"
      variant="ghost"
      block
      class="justify-start"
      @click="item.onClick?.()"
    />
  </section>
</template>
