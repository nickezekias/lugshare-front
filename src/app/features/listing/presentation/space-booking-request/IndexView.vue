<script setup lang="ts">
import { onMounted, ref } from 'vue'
import NikkToast from '@/app/utils/NikkToast'
import { useSpaceBookingRequestStore } from '@/stores/space-booking-request.store'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue'

import Obj from '@/app/models/spaceBookingRequest.model'
import type { AxiosError } from 'axios'

// import NikkInputNumber from '@/components/forms/NikkInputNumber.vue'
import NikkDatePicker from '@/components/forms/NikkDatePicker.vue'
import NikkTextArea from '@/components/forms/NikkTextArea.vue'

const emit = defineEmits(['acceptedBooking'])
const objStore = useSpaceBookingRequestStore()
const { t } = useI18n()
const toast = useToast()

const nikkToast = new NikkToast(toast, t)

const acceptBookingLoading = ref(false)
const loading = ref(false)
const rejectBookingLoading = ref(false)

const objects = ref<Obj[]>([])

onMounted(async () => {
  loading.value = true
  try {
    await objStore.getAll()
    objects.value = objStore.objList
  } catch (e) {
    nikkToast.httpError(e as AxiosError)
  } finally {
    loading.value = false
  }
})

async function onAcceptBookingLoading(obj: Obj) {
  acceptBookingLoading.value = true
  try {
    const response = await objStore.acceptBooking(obj.id)
    objects.value = [Obj.fromObject(response.data.data)]
    emit('acceptedBooking')
  } catch (e) {
    nikkToast.httpError(e as AxiosError)
  } finally {
    acceptBookingLoading.value = false
  }
}

async function onRejectBookingLoading(obj: Obj) {
  try {
    rejectBookingLoading.value = true
    await objStore.rejectBooking(obj.id)
  } catch (e) {
    nikkToast.httpError(e as AxiosError)
  } finally {
    rejectBookingLoading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <PrimeCard v-if="!loading && objStore.objList.length < 1">
      <template #content>
        <div class="flex flex-col items-center justify-center h-full py-6 gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" stroke-width="1.5">
              <path
                d="M3 10.911v-.18a6 6 0 0 1 4.618-5.757l.176-.04l.167-.036a19 19 0 0 1 8.078 0l.167.037l.176.04A6 6 0 0 1 21 10.91v5.464a4.52 4.52 0 0 1-3.538 4.411c-3.598.8-7.326.8-10.923 0A4.52 4.52 0 0 1 3 16.376z"
              />
              <path
                stroke-linecap="round"
                d="M17.5 15.5V17M15.959 4.5A3 3 0 0 0 13 2h-2a3 3 0 0 0-2.959 2.5"
                opacity="0.5"
              />
              <path stroke-linecap="round" d="M3 14a22.16 22.16 0 0 0 18 0" />
              <path stroke-linecap="round" d="M10 13h4" opacity="0.5" />
            </g>
          </svg>
          <h1 class="text-center font-medium text-xl text-gray-400">
            {{ $t('labels.noSpaceBookingRequests') }}
          </h1>
        </div>
      </template>
    </PrimeCard>
    <PrimeCard class="w-full border" v-for="obj in objStore.objList" :key="obj.id">
      <template #content>
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <div>
              <PrimeAvatar :label="obj.user?.initials" shape="circle" class="h-8 w-8 text-sm" />
            </div>

            <div class="text-sm text-nowrap text-gray-500 dark:text-gray-400">
              {{ obj.user?.fullName }}
            </div>
          </div>

          <!-- <NikkInputNumber
            v-model="obj.desiredWeight"
            id="desiredWeight"
            error-help-label="''"
            :is-error="false"
            label="labels.desiredWeight"
            :min="1"
            name="desiredWeight"
            :readonly="true"
            :show-buttons="true"
          /> -->

          <NikkTextArea
            v-model="obj.shipmentItems"
            class="w-full"
            :errorHelpLabel="''"
            id="shipmentItems"
            :isError="false"
            label="labels.shipmentItems"
            name="shipmentItems"
            :readonly="true"
            :rows="2"
          />

          <NikkDatePicker
            v-model="obj.itemsPickupDate"
            :errorHelpLabel="''"
            id="requestShipmentDate"
            :isError="false"
            label="labels.shipmentItemsPickupDate"
            name="itemsPickupDate"
            :readonly="true"
            selectionMode="single"
          />

          <NikkTextArea
            v-model="obj.itemsPickupLocation"
            :errorHelpLabel="''"
            id="itemsPickupLocation"
            :isError="false"
            label="labels.shipmentItemsPickupLocation(s)"
            name="itemsPickupLocation"
            :readonly="true"
            type="text"
          />

          <div class="flex flex-col gap-2">
            <PrimeButton
              @click="onAcceptBookingLoading(obj)"
              icon="pi pi-check-circle"
              class="w-full"
              :label="$t('labels.accept')"
              :loading="acceptBookingLoading"
              size="small"
              type="submit"
            />

            <PrimeButton
              @click="onRejectBookingLoading(obj)"
              icon="pi pi-times"
              class="w-full"
              :label="$t('labels.reject')"
              :loading="rejectBookingLoading"
              severity="danger"
              size="small"
              type="submit"
            />
          </div>
        </div>
      </template>
    </PrimeCard>
  </div>
</template>
