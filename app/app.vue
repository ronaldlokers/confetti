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
    <UHeader>
      <template #left>
        <NuxtLink
          to="/"
          class="flex items-center gap-2 font-semibold"
        >
          <img
            src="/brand/confetti-icon-128.png"
            alt=""
            width="32"
            height="32"
          >
          {{ $t('app.name') }}
        </NuxtLink>
      </template>

      <template #right>
        <UColorModeButton />
      </template>
    </UHeader>

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
