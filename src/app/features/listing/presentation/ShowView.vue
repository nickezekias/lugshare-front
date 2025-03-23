<script setup lang="ts">
import { onMounted, ref } from 'vue'

import NikkToast from '@/app/utils/NikkToast'
import Obj from '@/app/models/spaceListing.model'
import { useAccountStore } from '@/stores/account.store'
import { useListingStore } from '@/stores/listing.store'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue'

import type { AxiosError } from 'axios'

import AppPageTitle from '@/components/pages/AppPageTitle.vue'
import ShowSpaceOfferComponent from '@/components/listings/ShowSpaceOfferComponent.vue'
import SpaceBookingCreateView from '@/app/features/listing/presentation/space-booking-request/CreateView.vue'
import SpaceBookingIndexView from '@/app/features/listing/presentation/space-booking-request/IndexView.vue'

const accountStore = useAccountStore()
const objStore = useListingStore()
const router = useRouter()
const toast = useToast()
const { t } = useI18n()

const nikkToast = new NikkToast(toast, t)

const obj = ref(Obj.initEmpty())
const pageLoading = ref(false)

onMounted(async () => {
  try {
    pageLoading.value = true
    await objStore.getSpaceOfferListing(router.currentRoute.value.params.id as string)
    obj.value = objStore.spaceListing
  } catch (e) {
    nikkToast.httpError(e as AxiosError)
  } finally {
    pageLoading.value = false
  }
})
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
          <div>
            <SpaceBookingCreateView
              v-if="!objStore.spaceListing.isOwner(accountStore.user?.id)"
              class="mt-4"
            />
            <SpaceBookingIndexView v-else class="mt-4" />
          </div>
        </template>
      </PrimeCard>
    </div>
  </div>
</template>
