<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { authClient } from '~~/lib/auth-client'

const { t } = useI18n()
const session = authClient.useSession()

const items = computed<NavigationMenuItem[]>(() => {
  if (!session.value.data) {
    return [
      {
        label: t('auth.account'),
        icon: 'i-tabler-user',
        children: [
          {
            label: t('auth.login.submit'),
            icon: 'i-tabler-login',
            to: '/login'
          },
          {
            label: t('auth.register.submit'),
            icon: 'i-tabler-user-plus',
            to: '/register'
          }
        ]
      }
    ]
  }

  return [
    {
      label: t('auth.account'),
      icon: 'i-tabler-user',
      children: [
        {
          label: session.value.data.user.name
        },
        {
          label: t('auth.logout.submit'),
          icon: 'i-tabler-logout',
          onSelect: async () => {
            await authClient.signOut()
            await navigateTo('/')
          }
        }

      ]
    }
  ]
})
</script>

<template>
  <UNavigationMenu
    :items="items"
    content-orientation="vertical"
    :ui="{
      viewport: 'shrink-0'
    }"
  />
</template>
