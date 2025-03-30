import type { DBGetQueryFilter } from '../@types/account.interface'
import type { AxiosError } from 'axios'

const getApiErrors = (error: AxiosError, title = '') => {
  const errorMessage = 'backend.errors.http500'

  if ('Fetch User' === error.name) {
    return errorMessage
  }
  if (!error.response) {
    if (error && error.config) console.error(title, `API ${error.config.url} not found`)
    else console.error(title, `API ${error} not found`)
    return errorMessage
  }
  if (import.meta.env.MODE === 'development') {
    console.error(title, error.response.data)
    console.error(title, error.response.status)
    console.error(title, error.response.headers)
  }
  // @ts-expect-error nested laravel model resource objects data errors
  if (error.response.data && error.response.data.errors) {
    // @ts-expect-error nested laravel model resource objects data errors
    return error.response.data.errors
  }

  //@ts-expect-error data is of type unknown
  return error.response.data.message
}

function getImageSrc(url: string) {
  const imgUrl = `${import.meta.env.VITE_API_BASE_URL}`
  return `${imgUrl}/${url}`
}

function getQueryFromFilter(filter: DBGetQueryFilter): string {
  let query = '?'
  if (filter && filter.itemsPerPage) {
    query += `itemsPerPage=${filter.itemsPerPage}`
  }
  if (filter && filter.page) {
    query += `&page=${filter.page}`
  }
  if (filter && filter.sortBy) {
    const sortBy = filter.sortBy
    for (let index = 0; index < sortBy.length; index++) {
      if (index === 0) {
        query += `&sortBy=${sortBy[index]}`
      } else {
        query += `,${sortBy[index]}`
      }
    }
  }
  if (filter && filter.sortDesc) {
    const filterBy = filter.sortDesc
    for (let index = 0; index < filterBy.length; index++) {
      if (index === 0) {
        query += `&sortDesc=${filterBy[index]}`
      } else {
        query += `,${filterBy[index]}`
      }
    }
  }
  return query
}

export { getApiErrors, getImageSrc, getQueryFromFilter }
