<script setup lang="ts">
import { authClient } from '~~/lib/auth-client'

const { t } = useI18n()
const colorMode = useColorMode()
const session = authClient.useSession()
const menuOpen = ref(false)

defineShortcuts({
  j: () => {
    menuOpen.value = !menuOpen.value
  }
})

function closeMenu() {
  menuOpen.value = false
}

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  closeMenu()
}

async function logout() {
  await authClient.signOut()
  closeMenu()
  await navigateTo('/')
}

const navigation = computed(() => ({
  tiles: [
    {
      label: t('navigation.home'),
      icon: 'i-tabler-home-filled',
      to: '/',
      onClick: closeMenu
    }
  ],
  sections: [
    {
      title: t('navigation.settings'),
      items: [
        {
          label: colorMode.value === 'dark'
            ? t('appearance.useLightMode')
            : t('appearance.useDarkMode'),
          icon: colorMode.value === 'dark'
            ? 'i-tabler-sun'
            : 'i-tabler-moon',
          onClick: toggleColorMode
        },
        ...(session.value.data
          ? [
              {
                label: t('auth.logout.submit'),
                icon: 'i-tabler-logout',
                onClick: logout
              }
            ]
          : [
              {
                label: t('auth.login.submit'),
                icon: 'i-tabler-login',
                to: '/login',
                onClick: closeMenu
              },
              {
                label: t('auth.register.submit'),
                icon: 'i-tabler-user-plus',
                to: '/register',
                onClick: closeMenu
              }
            ])
      ]
    }
  ]
}))
</script>

<template>
  <UPopover
    v-model:open="menuOpen"
    :content="{
      align: 'center'
    }"
    :ui="{
      content: 'w-128 p-2'
    }"
    arrow
  >
    <UButton
      :aria-label="$t('navigation.open')"
      aria-keyshortcuts="J"
      color="neutral"
      variant="ghost"
      class="gap-2 px-3 rounded-full mt-2"
    >
      <img
        src="/brand/confetti-icon-128.png"
        alt=""
        width="48"
        height="48"
      >
      <span class="font-semibold text-lg">
        {{ $t('app.name') }}
      </span>
      <UKbd
        value="J"
        size="md"
        class="hidden md:inline-flex"
      />
      <UIcon
        name="i-tabler-chevron-down"
        class="transition-transform"
        :class="{ 'rotate-180': menuOpen }"
      />
    </UButton>

    <template #content>
      <nav :aria-label="$t('navigation.open')">
        <NavigationMenu
          :tiles="navigation.tiles"
          :sections="navigation.sections"
        />
      </nav>
    </template>
  </UPopover>
</template>
