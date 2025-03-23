import { WEIGHT_UNITS_LIST } from '@/app/constants'

import type ListingOwner from './listingOwner.interface'
export default class SpaceListing {
  public static readonly DELIVERY_PREFERENCES = {
    AIRPORT_DROP_OFF: 'airportDropOff',
    HOTEL_DROP_OFF: 'hotelDropOff',
    CITY_CENTER_DROP_OFF: 'cityCenterDropOff',
    FLEXIBLE_MEETING_POINT: 'flexibleMeetingPoint',
  }

  public static readonly ITEM_RESTRICTIONS = {
    ELECTRONIC: 'electronic',
    FRAGILE: 'fragile',
    HAZARDOUS: 'hazardous',
    LIQUID: 'liquid',
    PERISHABLE: 'perishable',
  }

  public static readonly STATUSES = {
    AVAILABLE: 'available',
    UNAVAILABLE: 'unavailable',
    INACTIVE: 'inactive',
  }

  public static readonly WEIGHT_UNITS = WEIGHT_UNITS_LIST

  availableSpaceDimensions: string
  availableWeight: number
  createdAt: string
  deliveryPreferences: Array<string>
  description: string
  flightAirline: string
  flightArrival: string
  flightArrivalDate: Date | string
  flightBookingReference: string
  flightDeparture: string
  flightDepartureDate: Date | string
  flightNumber: string
  id: string
  isActive: boolean
  itemRestrictions: Array<string>
  pricePerUnit: string
  specialInstructions: string
  status: string
  updatedAt: string
  user: ListingOwner | null
  userId: string
  weightUnit: string

  public constructor(
    createdAt: string,
    flightAirline: string,
    flightArrival: string,
    flightArrivalDate: Date | string,
    flightBookingReference: string,
    flightDeparture: string,
    flightDepartureDate: Date | string,
    flightNumber: string,
    id: string,
    availableWeight: number,
    weightUnit: string,
    pricePerUnit: string,
    itemRestrictions: Array<string>,
    availableSpaceDimensions: string,
    deliveryPreferences: Array<string>,
    description: string,
    specialInstructions: string,
    status: string,
    isActive: boolean,
    user: ListingOwner | null,
    userId: string,
    updatedAt: string,
  ) {
    this.createdAt = createdAt
    this.flightAirline = flightAirline
    this.flightArrival = flightArrival
    this.flightArrivalDate = flightArrivalDate
    this.flightBookingReference = flightBookingReference
    this.flightDeparture = flightDeparture
    this.flightDepartureDate = flightDepartureDate
    this.flightNumber = flightNumber
    this.id = id
    this.availableWeight = availableWeight
    this.weightUnit = weightUnit
    this.pricePerUnit = pricePerUnit
    this.itemRestrictions = itemRestrictions
    this.availableSpaceDimensions = availableSpaceDimensions
    this.deliveryPreferences = deliveryPreferences
    this.description = description
    this.specialInstructions = specialInstructions
    this.status = status
    this.isActive = isActive
    this.user = user
    this.userId = userId
    this.updatedAt = updatedAt
  }

  static fromObject(data: {
    createdAt: string
    flightAirline: string
    flightArrival: string
    flightArrivalDate: Date | string
    flightBookingReference: string
    flightDeparture: string
    flightDepartureDate: Date | string
    flightNumber: string
    id: string
    availableWeight: number
    weightUnit: string
    pricePerUnit: string
    itemRestrictions: Array<string>
    availableSpaceDimensions: string
    deliveryPreferences: Array<string>
    description: string
    specialInstructions: string
    status: string
    isActive: boolean
    user: ListingOwner | null
    userId: string
    updatedAt: string
  }): SpaceListing {
    return new SpaceListing(
      data.createdAt,
      data.flightAirline,
      data.flightArrival,
      data.flightArrivalDate,
      data.flightBookingReference,
      data.flightDeparture,
      data.flightDepartureDate,
      data.flightNumber,
      data.id,
      data.availableWeight,
      data.weightUnit,
      data.pricePerUnit,
      data.itemRestrictions,
      data.availableSpaceDimensions,
      data.deliveryPreferences,
      data.description,
      data.specialInstructions,
      data.status,
      data.isActive,
      data.user,
      data.userId,
      data.updatedAt,
    )
  }

  static initEmpty(): SpaceListing {
    return new SpaceListing(
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      0,
      SpaceListing.WEIGHT_UNITS.KILOGRAMS,
      '',
      [],
      '',
      [],
      '',
      '',
      SpaceListing.STATUSES.AVAILABLE,
      true,
      null,
      '',
      '',
    )
  }

  /*
   * Returns the owner's first name and the first letter of his last name
   */
  public ownerShortName() {
    if (this.user) {
      return `${this.user.firstName} ${this.user.lastName.charAt(0)}.`
    }
    return ''
  }

  /**
   * Check if user with userId is the owner of this resource
   */
  public isOwner(userId: string | undefined): boolean {
    return userId == this.userId
  }
}
