<script setup lang="ts">
import PrimeDatePicker from 'primevue/datepicker'
import PrimeFloatLabel from 'primevue/floatlabel'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const model: any = defineModel()
const props = defineProps<{
  id: string
  dateFormat?: string
  disabled?: boolean
  errorHelpLabel: string | undefined
  hint?: string | undefined
  isError: boolean | undefined
  label: string
  manualInput?: boolean
  maxDate?: Date
  minDate?: Date
  name?: string
  readonly?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectionMode: any
  showButtonBar?: boolean
}>()
</script>

<template>
  <div>
    <PrimeFloatLabel variant="on">
      <PrimeDatePicker
        v-model="model"
        class="w-full shadow-none"
        :dateFormat="props.dateFormat"
        :disabled="props.disabled"
        :invalid="props.isError"
        :id="props.id"
        :manualInput="props.manualInput"
        :maxDate="props.maxDate"
        :minDate="props.minDate"
        :name="props.name"
        :readonly="props.readonly"
        :selectionMode="props.selectionMode"
        :showButtonBar="props.showButtonBar"
      />
      <label :class="props.isError ? 'nikk-invalid' : ''" :for="props.id">{{
        $t(`${props.label}`)
      }}</label>
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
