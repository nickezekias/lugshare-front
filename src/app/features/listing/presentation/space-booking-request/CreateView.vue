<script setup lang="ts">
import { ref } from 'vue'
import { Form as PrimeForm, type FormSubmitEvent } from '@primevue/forms'
import { useAccountStore } from '@/stores/account.store'
import { useI18n } from 'vue-i18n'
import { useListingStore } from '@/stores/listing.store'
import { useSpaceBookingRequestStore } from '@/stores/space-booking-request.store'
import { useToast } from 'primevue'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'

import NikkToast from '@/app/utils/NikkToast'
import Obj from '@/app/models/spaceBookingRequest.model'

import type { AxiosError } from 'axios'

import NikkDatePicker from '@/components/forms/NikkDatePicker.vue'
import NikkInputNumber from '@/components/forms/NikkInputNumber.vue'
import NikkTextArea from '@/components/forms/NikkTextArea.vue'

const accountStore = useAccountStore()
const listingStore = useListingStore()
const objStore = useSpaceBookingRequestStore()
const toast = useToast()
const { t } = useI18n()
const nikkToast = new NikkToast(toast, t)

const loading = ref(false)
const obj = ref(Obj.initEmpty())
const resolver = zodResolver(
  z.object({
    desiredWeight: z.union([
      z.number().min(1, { message: 'errors.validation.requiredField' }),
      z.string().min(1, { message: 'errors.validation.requiredField' }),
    ]),
    itemsPickupDate: z.date({ message: 'errors.validation.requiredField' }),
    itemsPickupLocation: z.string().min(1, { message: 'errors.validation.requiredField' }),
    shipmentItems: z.string().min(1, { message: 'errors.validation.requiredField' }),
  }),
)

function clearForm() {
  obj.value = Obj.initEmpty()
}

async function onFormSubmit(e: FormSubmitEvent) {
  const isFormCorrect = e.valid
  if (isFormCorrect) {
    loading.value = true

    if (accountStore.user) {
      obj.value.userId = accountStore.user.id
    }

    const payload: Obj = obj.value
    payload.spaceOfferId = listingStore.spaceListing.id
    try {
      await objStore.create(payload)
      nikkToast.success('features.spaceBookingRequests.create.successDesc')
      clearForm()
    } catch (e) {
      nikkToast.httpError(e as AxiosError)
    } finally {
      loading.value = false
    }
  } else {
    nikkToast.error('errors.validation.form', 'labels.invalidForm')
  }
}
</script>

<template>
  <PrimeForm
    :initialValues="obj"
    :resolver
    @submit="onFormSubmit"
    v-slot="$form"
    :validateOnBlur="true"
    :validateOnSubmit="true"
    class="flex flex-col gap-4"
  >
    <NikkInputNumber
      v-model="obj.desiredWeight"
      id="desiredWeight"
      error-help-label="errors.validation.requiredField"
      :is-error="$form.weight?.invalid"
      :literalLabel="
        $t('labels.desiredWeightForUnit', { unit: listingStore.spaceListing.weightUnit })
      "
      :min="1"
      :max="Number(listingStore.spaceListing.availableWeight)"
      name="desiredWeight"
      :show-buttons="true"
    />

    <NikkTextArea
      v-model="obj.shipmentItems"
      :errorHelpLabel="$form.shipmentItems?.error?.message"
      hint="features.spaceBookingRequests.create.shipmentItemsHint"
      id="shipmentItems"
      :isError="$form.shipmentItems?.invalid"
      label="labels.shipmentItems"
      name="shipmentItems"
      :rows="6"
    />

    <NikkDatePicker
      v-model="obj.itemsPickupDate"
      :errorHelpLabel="$form.itemsPickupDate?.error?.message"
      hint="features.spaceBookingRequests.create.itemsPickupDateHint"
      id="requestShipmentDate"
      :isError="$form.itemsPickupDate?.invalid"
      label="labels.shipmentItemsPickupDate"
      name="itemsPickupDate"
      selectionMode="single"
    />

    <NikkTextArea
      v-model="obj.itemsPickupLocation"
      :errorHelpLabel="$form.itemsPickupLocation?.error?.message"
      hint="features.spaceBookingRequests.create.itemsPickupLocationHint"
      id="itemsPickupLocation"
      :isError="$form.itemsPickupLocation?.invalid"
      label="labels.shipmentItemsPickupLocation(s)"
      name="itemsPickupLocation"
      type="text"
    />

    <PrimeButton
      icon="pi pi-check-circle"
      :loading="loading"
      type="submit"
      :label="$t('labels.bookSpace')"
    />
  </PrimeForm>
</template>
