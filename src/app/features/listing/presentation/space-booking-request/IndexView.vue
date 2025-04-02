<script setup lang="ts">
import { onMounted, ref } from 'vue'
import NikkToast from '@/app/utils/NikkToast'
import { useListingStore } from '@/stores/listing.store'
import { useSpaceBookingRequestStore } from '@/stores/space-booking-request.store'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue'

import Obj from '@/app/models/spaceBookingRequest.model'
import type { AxiosError } from 'axios'

import SpaceBookingRequestCard from '@/components/listings/SpaceBookingRequestCard.vue'

const listingStore = useListingStore()
const objStore = useSpaceBookingRequestStore()
const { t } = useI18n()
const toast = useToast()

const nikkToast = new NikkToast(toast, t)

const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    await objStore.getAllForSpaceOffer(listingStore.spaceListing.id)
    const pendingObjList = objStore.filterObjectsByStatus(Obj.STATUSES.PENDING)
    objStore.setFilteredOjbList(pendingObjList)
  } catch (e) {
    nikkToast.httpError(e as AxiosError)
  } finally {
    loading.value = false
  }
})
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

    <SpaceBookingRequestCard
      v-for="obj in objStore.filteredObjList"
      :key="obj.id"
      :obj="Obj.fromObject(obj)"
    />
  </div>
</template>
