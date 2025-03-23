<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Form as PrimeForm, type FormSubmitEvent } from '@primevue/forms'
import { useI18n } from 'vue-i18n'
import { useListingStore } from '@/stores/listing.store'
import { useToast } from 'primevue'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'

import NikkToast from '@/app/utils/NikkToast'
import Obj from '@/app/models/spaceListing.model'

import airlines from '@/assets/data/airlines.json'

import NikkInputText from '@/components/forms/NikkInputText.vue'
import NikkSelect from '@/components/forms/NikkSelect.vue'
import NikkDatePicker from '@/components/forms/NikkDatePicker.vue'

const emit = defineEmits(['next'])

const listingStore = useListingStore()
const toast = useToast()
const { t } = useI18n()

const nikkToast = new NikkToast(toast, t)
const spaceListing = ref(listingStore.spaceListing)

const resolver = zodResolver(
  z.object({
    flightAirline: z.string().min(1, { message: 'errors.validation.requiredField' }),
    flightArrival: z.string().min(1, { message: 'errors.validation.requiredField' }),
    flightArrivalDate: z.date({ message: 'errors.validation.requiredField' }),
    flightDeparture: z.string().min(1, { message: 'errors.validation.requiredField' }),
    flightDepartureDate: z.date({ message: 'errors.validation.requiredField' }),
    flightBookingReference: z.string().min(1, { message: 'errors.validation.requiredField' }),
    flightNumber: z.string().min(1, { message: 'errors.validation.requiredField' }),
    passengerLastName: z.string().min(1, { message: 'errors.validation.requiredField' }),
  }),
)

onMounted(() => {
  listingStore.setSpaceListing(Obj.initEmpty())
})

function onFormSubmit(e: FormSubmitEvent) {
  const isFormCorrect = e.valid
  if (isFormCorrect) {
    listingStore.setSpaceListing(spaceListing.value)
    emit('next')
  } else {
    nikkToast.error('errors.validation.form', 'labels.invalidForm')
  }
}
</script>

<template>
  <div>
    <PrimeMessage severity="info">
      <h6 class="text-lg font-medium">
        <span class="pi pi-info-circle me-3"></span>
        {{ $t('features.listings.create.howVerificationWorks') }}
      </h6>
      <ul class="ps-8 text-sm font-light">
        <li>{{ $t('features.listings.create.flightVerificationProcess.realTimeValidation') }}</li>
        <li>
          {{
            $t(
              'features.listings.create.flightVerificationProcess.crossReferenceWithPassengerDetails',
            )
          }}
        </li>
        <li>
          {{
            $t('features.listings.create.flightVerificationProcess.multiPointVerificationChecks')
          }}
        </li>
        <li>
          {{ $t('features.listings.create.flightVerificationProcess.duplicateBookingPrevention') }}
        </li>
      </ul>
    </PrimeMessage>

    <PrimeForm
      class="mt-8 grid grid-cols-2 gap-4"
      :initialValues="spaceListing"
      @submit="onFormSubmit"
      :resolver
      v-slot="$form"
      :validateOnBlur="true"
      :validateOnSubmit="true"
    >
      <NikkInputText
        v-model="spaceListing.flightDeparture"
        class="col-span-2 md:col-span-1"
        :errorHelpLabel="$form.flightDeparture?.error?.message"
        id="flightDeparture"
        :isError="$form.flightDeparture?.invalid"
        label="labels.departure"
        name="flightDeparture"
        type="text"
      />

      <NikkInputText
        v-model="spaceListing.flightArrival"
        class="col-span-2 md:col-span-1"
        :errorHelpLabel="$form.flightArrival?.error?.message"
        id="flightArrival"
        :isError="$form.flightArrival?.invalid"
        label="labels.arrival"
        name="flightArrival"
        type="text"
      />

      <NikkDatePicker
        v-model="spaceListing.flightDepartureDate"
        class="col-span-2 md:col-span-1"
        :errorHelpLabel="$form.flightDepartureDate?.error?.message"
        id="flightDepartureDate"
        :isError="$form.flightDepartureDate?.invalid"
        label="labels.departureDate"
        name="flightDepartureDate"
        selectionMode="single"
      />

      <NikkDatePicker
        v-model="spaceListing.flightArrivalDate"
        class="col-span-2 md:col-span-1"
        :errorHelpLabel="$form.flightArrivalDate?.error?.message"
        id="flightArrivalDate"
        :isError="$form.flightArrivalDate?.invalid"
        label="labels.arrivalDate"
        name="flightArrivalDate"
        selectionMode="single"
      />

      <NikkSelect
        v-model="spaceListing.flightAirline"
        class="col-span-2 md:col-span-1"
        id="flightAirline"
        error-help-label="errors.validation.requiredField"
        hint="labels.selectAirline"
        :is-error="$form.flightAirline?.invalid"
        name="flightAirline"
        :options="airlines"
        placeholder="labels.selectAirline"
      />

      <NikkInputText
        v-model="spaceListing.flightBookingReference"
        class="col-span-2 md:col-span-1"
        :errorHelpLabel="$form.flightBookingReference?.error?.message"
        id="flightBookingReference"
        :isError="$form.flightBookingReference?.invalid"
        label="labels.bookingReference"
        name="flightBookingReference"
        type="text"
      />

      <NikkInputText
        v-model="spaceListing.flightNumber"
        class="col-span-2 md:col-span-1"
        :errorHelpLabel="$form.flightNumber?.error?.message"
        id="flightNumber"
        :isError="$form.flightNumber?.invalid"
        label="labels.flightNumber"
        name="flightNumber"
        type="text"
      />

      <NikkInputText
        class="col-span-2 md:col-span-1"
        :errorHelpLabel="$form.passengerLastName?.error?.message"
        id="passengerLastName"
        :isError="$form.passengerLastName?.invalid"
        label="labels.passengerLastName"
        name="passengerLastName"
        type="text"
      />

      <PrimeMessage class="col-span-2" severity="warn">
        {{ $t('features.listings.create.falseInformationWarning') }}
      </PrimeMessage>

      <div class="flex justify-between mt-6 col-span-2">
        <PrimeButton
          icon="pi pi-check-circle"
          fluid
          type="submit"
          :label="$t('labels.verifyFlight')"
        />
      </div>
    </PrimeForm>
  </div>
</template>
