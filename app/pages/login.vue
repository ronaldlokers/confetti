<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'
import { authClient } from '../../lib/auth-client'

const { t } = useI18n()

const schema = z.object({
  email: z.email(t('auth.login.emailInvalid')),
  password: z
    .string()
    .min(8, t('auth.login.passwordTooShort'))
    .max(128, t('auth.login.passwordTooLong'))
})

type Schema = z.output<typeof schema>

const state = reactive<Schema>({
  email: '',
  password: ''
})

const pending = ref(false)
const error = ref('')

async function login(event: FormSubmitEvent<Schema>) {
  pending.value = true
  error.value = ''

  try {
    const signIn = await authClient.signIn.email({
      email: event.data.email,
      password: event.data.password
    })

    if (signIn.error) {
      error.value = t('auth.login.error')
      return
    }

    const session = await authClient.getSession()

    if (!session.data) {
      error.value = t('auth.login.error')
      return
    }

    await navigateTo('/')
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <UContainer class="max-w-md py-16">
    <UCard>
      <template #header>
        <div>
          <h1 class="text-2xl font-semibold">
            {{ $t('auth.login.title') }}
          </h1>
          <p class="mt-1 text-sm text-muted">
            {{ $t('auth.login.description') }}
          </p>
        </div>
      </template>

      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="login"
      >
        <UFormField
          :label="$t('auth.login.email')"
          name="email"
        >
          <UInput
            v-model="state.email"
            type="email"
            autocomplete="email"
            class="w-full"
          />
        </UFormField>

        <UFormField
          :label="$t('auth.login.password')"
          name="password"
        >
          <UInput
            v-model="state.password"
            type="password"
            autocomplete="current-password"
            class="w-full"
          />
        </UFormField>

        <UAlert
          v-if="error"
          color="error"
          :description="error"
          role="alert"
        />

        <UButton
          type="submit"
          block
          :loading="pending"
        >
          {{ $t('auth.login.submit') }}
        </UButton>
      </UForm>
    </UCard>
  </UContainer>
</template>
