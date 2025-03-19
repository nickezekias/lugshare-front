import { ref } from 'vue'
import { defineStore } from 'pinia'

import objService from '@/app/features/product/adapters/product.service'
import Obj from '@/app/models/product.model'

import type { DBGetQueryFilter } from '@/app/@types/account.interface'

export const useProductStore = defineStore('productStore', () => {
  const objects = ref<Obj[]>([])

  async function getAll(filter?: DBGetQueryFilter) {
    const response = await objService.getAll(filter)
    objects.value = response.data.data
  }

  async function get(id: string) {
    const response = await objService.get(id)
    return response.data.data
  }

  async function create(payload: Obj, businessId: string) {
    const response = await objService.create(payload, businessId)
    return response.data.data
  }

  async function update(payload: Obj) {
    const response = await objService.update(payload)
    return response.data.data
  }

  async function destroy(id: string) {
    const response = await objService.destroy(id)
    return response
  }

  return {
    objects,
    getAll,
    get,
    create,
    update,
    destroy,
  }
})
