<script setup lang="ts">
import { onMounted, ref } from 'vue'

import NikkToast from '@/app/utils/NikkToast'
import Obj from '@/app/models/spaceListing.model'
import SpaceBookingRequest from '@/app/models/spaceBookingRequest.model'
import { useAccountStore } from '@/stores/account.store'
import { useListingStore } from '@/stores/listing.store'
import { useSpaceBookingRequestStore } from '@/stores/space-booking-request.store'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue'

import type { AxiosError } from 'axios'

import PrimeSelectButton, { type SelectButtonChangeEvent } from 'primevue/selectbutton'

import AppPageTitle from '@/components/pages/AppPageTitle.vue'
import ShowSpaceOfferComponent from '@/components/listings/ShowSpaceOfferComponent.vue'
import SpaceBookingCreateView from '@/app/features/listing/presentation/space-booking-request/CreateView.vue'
import SpaceBookingIndexView from '@/app/features/listing/presentation/space-booking-request/IndexView.vue'
import SpaceBookingRequestCard from '@/components/listings/SpaceBookingRequestCard.vue'

const accountStore = useAccountStore()
const objStore = useListingStore()
const router = useRouter()
const spaceBookingRequestStore = useSpaceBookingRequestStore()
const toast = useToast()
const { t } = useI18n()

const nikkToast = new NikkToast(toast, t)

const existingSbrForAuthUser = ref<SpaceBookingRequest | null>(null)
const obj = ref(Obj.initEmpty())
const pageLoading = ref(false)
const sbrStatusFilter = ref(SpaceBookingRequest.STATUSES.PENDING)
const sbrListFilterOptions = ref([
  SpaceBookingRequest.STATUSES.PENDING,
  SpaceBookingRequest.STATUSES.REJECTED,
])

onMounted(async () => {
  try {
    pageLoading.value = true
    await objStore.getSpaceOfferListing(router.currentRoute.value.params.id as string)
    obj.value = objStore.spaceListing
    existingSbrForAuthUser.value = await spaceBookingRequestStore.getByCurrentUserAndSpaceOffer(
      obj.value.id,
    )
  } catch (e) {
    if ((e as AxiosError).response?.status === 404) {
      //@ts-expect-error - AxiosError type does not have response.data.message
      if ((e as AxiosError).response?.data?.message.includes('SpaceBookingRequest')) {
        return
        //@ts-expect-error - AxiosError type does not have response.data.message
      } else if ((e as AxiosError).response?.data?.message.includes('SpaceOfferListing')) {
        router.push({
          name: 'notFound',
          query: { redirect: 'listings.index', name: 'features.listings.show.backToListings' },
        })
      }
    } else {
      nikkToast.httpError(e as AxiosError)
    }
  } finally {
    pageLoading.value = false
  }
})

function onSbrListFilterChange(event: SelectButtonChangeEvent) {
  sbrStatusFilter.value = event.value
  const filteredList = spaceBookingRequestStore.filterObjectsByStatus(event.value)
  spaceBookingRequestStore.setFilteredOjbList(filteredList)
}
</script>

<template>
  <div class="nikk-container">
    <AppPageTitle title="features.listings.show.title" subtitle="features.listings.show.titleDesc">
    </AppPageTitle>

    <div class="flex">
      <PrimeCard class="w-full md:w-7/12 lg:w-6/12 nikk-card">
        <template #content>
          <PrimeSkeleton width="100%" height="32rem" v-if="pageLoading" />
          <ShowSpaceOfferComponent v-else :data="obj" />
        </template>
      </PrimeCard>

      <div v-if="pageLoading" class="w-full md:w-4/12 lg:w-3/12 ms-auto">
        <PrimeSkeleton width="100%" height="32rem" />
      </div>
      <PrimeCard v-else class="w-full md:w-4/12 lg:w-3/12 ms-auto shadow-md">
        <template #title>
          <h3 v-if="objStore.spaceListing.isOwner(accountStore.user?.id)">
            {{ $t('labels.spaceBookingRequest', 2) }}
          </h3>

          <h3 v-else>{{ $t('labels.bookSpace') }}</h3>
        </template>

        <template #content>
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <PrimeSelectButton
                @change="onSbrListFilterChange"
                v-model="sbrStatusFilter"
                class="ms-auto"
                :multiple="false"
                :options="sbrListFilterOptions"
              >
                <template #option="slotProps">
                  <span>{{ $t(`constants.statuses.${slotProps.option}`) }}</span>
                </template>
              </PrimeSelectButton>

              <p class="capitalize text-right text-muted-color text-sm">
                {{ $t('labels.pending') }}
                {{
                  spaceBookingRequestStore.filterObjectsByStatus(
                    SpaceBookingRequest.STATUSES.PENDING,
                  ).length
                }}
                <span class="mx-1">|</span>
                {{ $t('labels.rejected') }}
                {{
                  spaceBookingRequestStore.filterObjectsByStatus(
                    SpaceBookingRequest.STATUSES.REJECTED,
                  ).length
                }}
              </p>
            </div>

            <SpaceBookingCreateView
              v-if="
                !objStore.spaceListing.isOwner(accountStore.user?.id) && !existingSbrForAuthUser
              "
              @created="
                (sbr: SpaceBookingRequest) => {
                  existingSbrForAuthUser = sbr
                }
              "
            />

            <SpaceBookingRequestCard
              v-else-if="
                !objStore.spaceListing.isOwner(accountStore.user?.id) && existingSbrForAuthUser
              "
              @cancel="existingSbrForAuthUser = null"
              :obj="SpaceBookingRequest.fromObject(existingSbrForAuthUser)"
            />

            <SpaceBookingIndexView v-else />
          </div>
        </template>
      </PrimeCard>
    </div>
  </div>
</template>
