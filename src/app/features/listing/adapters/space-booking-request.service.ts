import axios from '@/lib/axios'
import { getQueryFromFilter } from '@/app/utils/helpers'

import type { DBGetQueryFilter } from '@/app/@types/common.interface'
import type Obj from '@/app/models/spaceBookingRequest.model'

const url = '/api/v1/space-booking-requests'
const tableSort = 'space_booking_requests.created_at'

const create = async function (payload: Obj) {
  return await axios.post(url, payload)
}

const get = async function (id: string) {
  return await axios.get(`${url}/${id}`)
}

const getAll = async function (filter?: DBGetQueryFilter) {
  if (!filter) {
    filter = {
      itemsPerPage: -1,
      sortBy: [tableSort],
      sortDesc: ['true'],
    }
  }
  const query = getQueryFromFilter(filter)
  return await axios.get(`${url}${query}`)
}

const update = async function (payload: Obj) {
  return await axios.post(`${url}/${payload.id}?_method=PUT`, payload)
}

const destroy = async function (id: string) {
  return await axios.delete(`${url}/${id}`)
}

const accept = async function (id: string) {
  return await axios.post(`${url}/${id}/accept?_method=PUT`)
}

const reject = async function (id: string) {
  return await axios.post(`${url}/${id}/reject?_method=PUT`)
}

export default { create, get, getAll, update, destroy, accept, reject }
