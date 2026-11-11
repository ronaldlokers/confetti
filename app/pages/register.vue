<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'
import { authClient } from '../../lib/auth-client'

const { t } = useI18n()

const schema = z.object({
  name: z.string().trim().min(1, t('auth.register.nameRequired')),
  email: z.email(t('auth.register.emailInvalid')),
  password: z
    .string()
    .min(8, t('auth.register.passwordTooShort'))
    .max(128, t('auth.register.passwordTooLong'))
})

type Schema = z.output<typeof schema>

const state = reactive<Schema>({
  name: '',
  email: '',
  password: ''
})

const pending = ref(false)
const error = ref('')

async function register(event: FormSubmitEvent<Schema>) {
  pending.value = true
  error.value = ''

  try {
    const registration = await authClient.signUp.email(event.data)

    if (registration.error) {
      error.value = t('auth.register.error')
      return
    }

    const signIn = await authClient.signIn.email({
      email: event.data.email,
      password: event.data.password
    })

    if (signIn.error) {
      error.value = t('auth.register.error')
      return
    }

    const session = await authClient.getSession()

    if (!session.data) {
      error.value = t('auth.register.error')
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
            {{ $t('auth.register.title') }}
          </h1>
          <p class="mt-1 text-sm text-muted">
            {{ $t('auth.register.description') }}
          </p>
        </div>
      </template>

      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="register"
      >
        <UFormField
          :label="$t('auth.register.name')"
          name="name"
        >
          <UInput
            v-model="state.name"
            autocomplete="name"
            class="w-full"
          />
        </UFormField>

        <UFormField
          :label="$t('auth.register.email')"
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
          :label="$t('auth.register.password')"
          name="password"
        >
          <UInput
            v-model="state.password"
            type="password"
            autocomplete="new-password"
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
          {{ $t('auth.register.submit') }}
        </UButton>
      </UForm>
    </UCard>
  </UContainer>
</template>
