<script setup lang="ts">
import type {
  NavigationItem,
  NavigationSection,
  NavigationTileItem
} from '~/types/navigation'

const props = defineProps<{
  tiles: NavigationTileItem[]
  sections: NavigationSection[]
}>()

const query = ref('')

function matches(item: NavigationItem) {
  return item.label.toLocaleLowerCase().includes(
    query.value.trim().toLocaleLowerCase()
  )
}

const filteredTiles = computed(() => props.tiles.filter(matches))
const filteredSections = computed(() => props.sections
  .map(section => ({
    ...section,
    items: section.items.filter(matches)
  }))
  .filter(section => section.items.length))
</script>

<template>
  <UInput
    v-model="query"
    :placeholder="$t('navigation.filter')"
    icon="i-tabler-search"
    autofocus
    class="mb-2 w-full"
  />

  <div
    v-if="filteredTiles.length"
    class="grid grid-cols-3 gap-2"
  >
    <NavigationTile
      v-for="item in filteredTiles"
      :key="item.label"
      :to="item.to"
      :icon="item.icon"
      :label="item.label"
      @click="item.onClick?.()"
    />
  </div>

  <NavigationSection
    v-for="section in filteredSections"
    :key="section.title"
    :title="section.title"
    :items="section.items"
  />

  <p
    v-if="!filteredTiles.length && !filteredSections.length"
    class="px-2 py-4 text-center text-sm text-muted"
  >
    {{ $t('navigation.noResults') }}
  </p>
</template>
