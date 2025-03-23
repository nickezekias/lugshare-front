import { defineStore } from 'pinia'
import { ref } from 'vue'

import SpaceListing from '@/app/models/spaceListing.model'
import objService from '@/app/features/listing/adapters/listing.service'
import { useDataTableUtil } from '@/app/composables/useDataTableUtil'

import type { DBGetQueryFilter } from '@/app/@types/common.interface'
import type SpaceRequestListing from '@/app/models/spaceRequestListing.model'

export const useListingStore = defineStore('listingStore', () => {
  const spaceListing = ref<SpaceListing>(SpaceListing.initEmpty())
  const spaceListings = ref<SpaceListing[]>([])

  const spaceRequests = ref<SpaceRequestListing[]>([])

  const { updateObjectsList } = useDataTableUtil()

  function setSpaceListing(data: SpaceListing) {
    spaceListing.value = SpaceListing.fromObject(data)
  }

  async function createSpaceOfferListing(data: SpaceListing) {
    return await objService.createSpaceOfferListing(data)
  }

  async function createSpaceRequestListing(data: SpaceRequestListing) {
    return await objService.createSpaceRequestListing(data)
  }

  async function getSpaceOfferListing(id: string) {
    const response = await objService.getSpaceOfferListing(id)
    spaceListing.value = SpaceListing.fromObject(response.data.data)
    return response.data.data
  }

  async function getSpaceRequestListing(id: string) {
    const response = await objService.getSpaceRequestListing(id)
    return response.data.data
  }

  async function getAllSpaceOfferListings(filter?: DBGetQueryFilter) {
    const response = await objService.getAllSpaceOfferListings(filter)
    spaceListings.value = response.data.data
  }

  async function getAllSpaceRequestListings(filter?: DBGetQueryFilter) {
    const response = await objService.getAllSpaceRequestListings(filter)
    spaceRequests.value = response.data.data
  }

  async function updateSpaceOfferListing(data: SpaceListing) {
    const response = await objService.updateSpaceOfferListing(data)
    return response.data.data
  }

  async function updateSpaceRequestListing(data: SpaceRequestListing) {
    const response = await objService.updateSpaceRequestListing(data)
    return response.data.data
  }

  async function destroySpaceOfferListing(id: string) {
    const response = await objService.deleteSpaceOfferListing(id)
    updateObjectsList({ deleteId: ref(id), objects: spaceListings })
    return response
  }

  async function destroySpaceRequestListing(id: string) {
    const response = await objService.deleteSpaceRequestListing(id)
    updateObjectsList({ deleteId: ref(id), objects: spaceRequests })
    return response
  }

  return {
    spaceListing,
    spaceListings,
    createSpaceOfferListing,
    getSpaceOfferListing,
    getAllSpaceOfferListings,
    updateSpaceOfferListing,
    destroySpaceOfferListing,

    spaceRequests,
    createSpaceRequestListing,
    getSpaceRequestListing,
    getAllSpaceRequestListings,
    updateSpaceRequestListing,
    destroySpaceRequestListing,

    setSpaceListing,
  }
})
