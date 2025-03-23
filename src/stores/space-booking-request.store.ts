import { defineStore } from 'pinia'
import { ref } from 'vue'

import Obj from '@/app/models/spaceBookingRequest.model'
import objService from '@/app/features/listing/adapters/space-booking-request.service'
import { useDataTableUtil } from '@/app/composables/useDataTableUtil'

import type { DBGetQueryFilter } from '@/app/@types/common.interface'

export const useSpaceBookingRequestStore = defineStore('spaceBookingRequestStore', () => {
  const objList = ref<Obj[]>([])
  const obj = ref(Obj.initEmpty())

  const { updateObjectsList } = useDataTableUtil()

  async function create(data: Obj) {
    const response = await objService.create(data)
    updateObjectsList({ newData: ref(response.data.data), objects: objList })
  }

  async function get(id: string) {
    const response = await objService.get(id)
    return response.data.data
  }

  async function getAll(filter?: DBGetQueryFilter) {
    const response = await objService.getAll(filter)
    objList.value = response.data.data
  }

  async function update(data: Obj) {
    const response = await objService.update(data)
    return response.data.data
  }

  async function destroy(id: string) {
    const response = await objService.destroy(id)
    updateObjectsList({ deleteId: ref(id), objects: objList })
    return response
  }

  async function acceptBooking(id: string) {
    const response = await objService.accept(id)
    return response.data.data
  }

  async function rejectBooking(id: string) {
    const response = await objService.reject(id)
    updateObjectsList({ deleteId: ref(id), objects: objList })
    return response.data.data
  }

  return {
    obj,
    objList,

    create,
    get,
    getAll,
    update,
    destroy,
    acceptBooking,
    rejectBooking,
  }
})
