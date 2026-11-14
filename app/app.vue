<script setup>
const { t } = useI18n()

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: '#0b0622' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
    { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png', sizes: '32x32' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/site.webmanifest' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  title: () => t('app.name'),
  description: () => t('app.tagline'),
  ogTitle: () => t('app.name'),
  ogDescription: () => t('app.tagline'),
  twitterCard: 'summary'
})
</script>

<template>
  <UApp>
    <header>
      <UContainer class="grid h-16 grid-cols-[1fr_auto_1fr] items-center">
        <div class="col-start-2">
          <Navigation />
        </div>
      </UContainer>
    </header>

    <UMain>
      <NuxtPage />
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          {{ $t('app.tagline') }}
        </p>
      </template>
    </UFooter>
  </UApp>
</template>
