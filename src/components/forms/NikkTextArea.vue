<script setup lang="ts">
import PrimeFloatLabel from 'primevue/floatlabel'
import PrimeTextArea from 'primevue/textarea'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const model: any = defineModel()
const props = defineProps<{
  id: string
  disabled?: boolean
  errorHelpLabel: string | undefined
  filled?: boolean
  hint?: string
  label?: string
  literalLabel?: string
  name?: string
  readonly?: boolean
  rows?: number
  isError: boolean | undefined
}>()
</script>

<template>
  <div>
    <PrimeFloatLabel variant="on">
      <PrimeTextArea
        v-model="model"
        class="w-full border shadow-none"
        :disabled="props.disabled"
        :invalid="props.isError"
        :id="props.id"
        :name="props.name"
        :readonly="props.readonly"
        :rows="props.rows"
        :variant="props.filled ? 'filled' : 'outlined'"
      />
      <label v-if="!props.literalLabel" :for="props.id">{{ $t(`${props.label}`) }}</label>
      <label v-else :for="props.id">{{ props.literalLabel }}</label>
    </PrimeFloatLabel>
    <PrimeMessage v-if="props.isError" severity="error" size="small" variant="simple">
      {{ $t(`${props.errorHelpLabel}`) }}
    </PrimeMessage>
    <PrimeMessage
      v-else-if="!props.isError && props.hint"
      size="small"
      severity="secondary"
      variant="simple"
    >
      {{ $t(`${props.hint}`) }}
    </PrimeMessage>
  </div>
</template>
