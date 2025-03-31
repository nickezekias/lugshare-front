<script setup lang="ts">
const emit = defineEmits(['close', 'deleted'])
const model = defineModel({ type: Boolean })
const props = defineProps<{ loading: boolean; message?: string; title?: string }>()

import PrimeDialog from 'primevue/dialog'
</script>

<template>
  <PrimeDialog v-model:visible="model" modal>
    <template #container>
      <div class="p-4">
        <div class="mb-4">
          <span class="text-lg md:text-xl font-bold">
            <slot name="title">
              {{ $t(`${props.title}`) }}
            </slot>
          </span>
        </div>

        <PrimeMessage severity="error">
          <slot name="message">
            {{ $t(`${props.message}`) }}
          </slot>
        </PrimeMessage>

        <div class="col-12 mt-5">
          <div class="flex justify-content-end gap-4">
            <PrimeButton
              @click="emit('close')"
              size="large"
              severity="secondary"
              :label="$t('labels.cancel')"
            />
            <PrimeButton
              @click="emit('deleted')"
              :label="$t('labels.delete')"
              :loading="props.loading"
              size="large"
              severity="danger"
            />
          </div>
        </div>
      </div>
    </template>
  </PrimeDialog>
</template>
