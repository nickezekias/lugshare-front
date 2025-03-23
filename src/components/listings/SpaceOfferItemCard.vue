<script setup lang="ts">
import { ref } from 'vue'

import { useAccountStore } from '@/stores/account.store'

import SpaceListing from '@/app/models/spaceListing.model'
import NikkDeleteDialog from '../crud/NikkDeleteDialog.vue'
import { useListingStore } from '@/stores/listing.store'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue'
import NikkToast from '@/app/utils/NikkToast'
import type { AxiosError } from 'axios'

const props = defineProps<{
  data: SpaceListing
}>()
const { t } = useI18n()
const toast = useToast()
const nikkToast = new NikkToast(toast, t)

const accountStore = useAccountStore()
const objStore = useListingStore()
const deleteDialogLoading = ref(false)
const isDeleteDialog = ref(false)

async function onDeleteItem() {
  try {
    deleteDialogLoading.value = true
    await objStore.destroySpaceOfferListing(props.data.id)
    nikkToast.success('features.listings.delete.successDesc')
  } catch (e) {
    nikkToast.httpError(e as AxiosError)
  } finally {
    deleteDialogLoading.value = false
    isDeleteDialog.value = false
  }
}
</script>

<template>
  <div>
    <PrimeCard class="border bg-inherit min-h-48 w-full">
      <template #title>
        <div class="flex justify-between">
          <div class="flex gap-1">
            <!-- <i class="pi pi-send text-primary me-2"></i> -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-primary"
              viewBox="0 0 256 256"
            >
              <g fill="currentColor">
                <path
                  d="M240 136v24H61.06a32 32 0 0 1-30.65-22.8L16.34 90.3A8 8 0 0 1 24 80h8l24 24h36.91L80.42 66.53A8 8 0 0 1 88 56h8l48 48h64a32 32 0 0 1 32 32"
                  opacity="0.2"
                />
                <path
                  d="M224 216a8 8 0 0 1-8 8H72a8 8 0 1 1 0-16h144a8 8 0 0 1 8 8m24-80v24a8 8 0 0 1-8 8H61.07a39.75 39.75 0 0 1-38.31-28.51L8.69 92.6A16 16 0 0 1 24 72h8a8 8 0 0 1 5.65 2.34L59.32 96h22.49l-9-26.94A16 16 0 0 1 88 48h8a8 8 0 0 1 5.66 2.34L147.32 96H208a40 40 0 0 1 40 40m-16 0a24 24 0 0 0-24-24h-64a8 8 0 0 1-5.65-2.34L92.69 64H88l12.49 37.47A8 8 0 0 1 92.91 112H56a8 8 0 0 1-5.66-2.34L28.69 88H24l14.07 46.9a23.85 23.85 0 0 0 23 17.1H232Z"
                />
              </g>
            </svg>
            <span>
              {{ props.data.flightDeparture }}
              <i class="pi pi-arrow-right text-gray-300 text-sm mx-1"></i>
              {{ props.data.flightArrival }}
            </span>
          </div>

          <div class="flex gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-green-600"
              viewBox="0 0 24 24"
            >
              <g fill="none" stroke="currentColor" stroke-width="1.5">
                <path
                  d="M3 10.417c0-3.198 0-4.797.378-5.335c.377-.537 1.88-1.052 4.887-2.081l.573-.196C10.405 2.268 11.188 2 12 2s1.595.268 3.162.805l.573.196c3.007 1.029 4.51 1.544 4.887 2.081C21 5.62 21 7.22 21 10.417v1.574c0 5.638-4.239 8.375-6.899 9.536C13.38 21.842 13.02 22 12 22s-1.38-.158-2.101-.473C7.239 20.365 3 17.63 3 11.991z"
                  opacity="0.5"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m9.5 12.4l1.429 1.6l3.571-4"
                />
              </g>
            </svg>
          </div>
        </div>
      </template>
      <template #content>
        <div class="flex flex-col gap-2">
          <div class="flex justify-between">
            <div>
              <span class="pi pi-calendar me-2"></span>
              <span>{{ props.data.flightDepartureDate }}</span>
            </div>

            <span class="text-xl font-medium text-primary me-2"
              >${{ props.data.pricePerUnit }} / {{ props.data.weightUnit }}</span
            >

            <!-- <div>
              <span class="pi pi-user me-2"></span>
              <span>2/3</span>
            </div> -->
          </div>

          <div class="flex justify-between items-center">
            <div>
              <span class="pi pi-shopping-bag me-2"></span>
              {{ props.data.availableWeight }}{{ props.data.weightUnit }}
            </div>

            <div>
              <PrimeRating :value="0" readonly />
            </div>
          </div>

          <div class="flex justify-between items-center text-sm">
            <span>{{ props.data.flightAirline }}</span>

            <span>0 {{ $t('labels.review', 2) }}</span>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-sm">
              {{ props.data.description }}
            </span>

            <div class="flex justify-end items-center ms-auto gap-2">
              <div>
                <PrimeAvatar
                  image="https://images.pexels.com/photos/3761264/pexels-photo-3761264.jpeg?auto=compress&cs=tinysrgb&w=600"
                  shape="circle"
                  class="h-8 w-8"
                />
              </div>

              <div class="text-sm text-nowrap">{{ props.data.ownerShortName() }}</div>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex gap-2">
          <PrimeButton
            v-if="!props.data.isOwner(accountStore.user?.id)"
            size="small"
            :label="$t('labels.bookSpace')"
            class="w-full flex-grow"
          />

          <div class="flex ms-auto gap-2">
            <router-link
              v-if="accountStore.user?.id == props.data.user?.id"
              :to="`/listings/edit/${props.data.id}`"
            >
              <PrimeButton text severity="info" icon="pi pi-pencil" />
            </router-link>
            <PrimeButton @click="isDeleteDialog = true" severity="danger" text icon="pi pi-trash" />
          </div>
        </div>
      </template>
    </PrimeCard>

    <NikkDeleteDialog
      v-model="isDeleteDialog"
      class="md:w-[26rem]"
      @close="isDeleteDialog = false"
      @deleted="onDeleteItem"
      :loading="deleteDialogLoading"
    >
      <template #title>
        {{ $t('features.listings.delete.title') }}
      </template>

      <template #message>
        {{ $t('features.listings.delete.confirmMessage') }}
      </template>
    </NikkDeleteDialog>
  </div>
</template>

<style>
:deep(.p-card-title) {
  @apply text-lg;
}

:deep(.p-card-content) {
  @apply text-sm;
}

:deep(.p-rating) {
  @apply text-sm;
  .p-rating-icon {
    @apply text-green-600;
  }
}

:deep(.p-rating-icon-on, .p-rating) {
  @apply text-green-500 !important;
}

:deep(.p-rating-icon-off) {
  @apply text-gray-300;
}
</style>
