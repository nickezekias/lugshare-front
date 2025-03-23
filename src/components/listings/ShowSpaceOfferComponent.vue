<script setup lang="ts">
import { computed } from 'vue'

import Obj from '@/app/models/spaceListing.model'
import NikkTextArea from '../forms/NikkTextArea.vue'

const props = defineProps<{
  data: Obj
}>()

const obj = computed(() => props.data)
</script>

<template>
  <div>
    <div class="flex flex-col gap-8">
      <!-- HEADER -->
      <header class="flex justify-between">
        <div class="flex gap-1">
          <!-- <i class="pi pi-send text-primary me-2"></i> -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 md:h-6 md:w-6 text-primary me-2"
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
          <span class="text-sm font-semibold md:text-2xl">
            {{ obj.flightDeparture }}
            <i class="pi pi-arrow-right text-gray-300 text-sm mx-1"></i>
            {{ obj.flightArrival }}
          </span>
        </div>

        <div class="flex gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 md:h-8 md:w-8 text-green-600"
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
      </header>

      <div class="flex justify-between text-2xl text-medium">
        <span>
          <i class="pi pi-shopping-bag me-2"></i>
          {{ obj.availableWeight }} {{ obj.weightUnit }}
        </span>

        <span class="font-bold text-primary me-2"
          >${{ obj.pricePerUnit }} / {{ obj.weightUnit }}
        </span>
      </div>

      <div class="grid grid-cols-1 gap-3 justify-between">
        <!-- Status -->
        <div class="flex items-center">
          <span class="me-auto">
            <span class="pi pi-bullseye me-2"></span>
            <span>{{ $t('labels.status') }}</span>
          </span>

          <span>
            <PrimeTag
              class="uppercase"
              severity="secondary"
              :value="$t(`constants.statuses.${obj.status}`)"
            />
          </span>
        </div>

        <!-- Traveler -->
        <div class="flex items-center">
          <span class="me-auto">
            <span class="pi pi-user me-2"></span>
            <span>{{ $t('labels.traveler') }}</span>
          </span>

          <div class="flex items-center gap-2">
            <div>
              <PrimeAvatar :label="obj.user?.initials" shape="circle" class="h-8 w-8 text-sm" />
            </div>

            <div class="text-sm text-nowrap text-gray-500 dark:text-gray-400">
              {{ obj.user?.fullName }}
            </div>
          </div>
        </div>

        <!-- Dates -->
        <div class="flex items-center text-xs md:text-sm">
          <span class="">
            <span class="pi pi-calendar me-2"></span>
            <span class="text-base">{{ $t('labels.date', 2) }}</span>
          </span>

          <div class="flex items-center ms-auto gap-2">
            <span>
              <i class="pi pi-calendar me-1"></i>
              {{ obj.flightDepartureDate }}
            </span>

            <i class="pi pi-arrow-right text-gray-300 text-xs"></i>

            <span>
              <i class="pi pi-calendar-minus me-1"></i>
              {{ obj.flightArrivalDate }}
            </span>
          </div>
        </div>
      </div>

      <div>
        <NikkTextArea
          v-model="obj.description"
          class="w-full"
          errorHelpLabel=""
          :filled="true"
          id="bookingRequestDescription"
          :isError="false"
          label="labels.description"
          name="description"
          :readonly="true"
          :rows="6"
        />
      </div>

      <NikkTextArea
        v-model="obj.specialInstructions"
        class="w-full"
        errorHelpLabel=""
        :filled="true"
        id="specialInstructions"
        :isError="false"
        label="labels.specialInstructions"
        name="specialInstructions"
        :readonly="true"
        :rows="2"
      />
    </div>
  </div>
</template>
