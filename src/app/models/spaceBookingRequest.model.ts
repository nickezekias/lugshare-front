import type ListingOwner from './listingOwner.interface'

export default class SpaceBookingRequest {
  createdAt: string
  desiredWeight: number
  id: string
  itemsPickupDate: Date | string
  itemsPickupLocation: string
  spaceOfferId: string
  shipmentItems: string
  status: string
  updatedAt: string
  userId: string
  user: ListingOwner | null

  public static readonly STATUSES = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
  }

  public constructor(
    createdAt: string,
    desiredWeight: number,
    id: string,
    itemsPickupDate: Date | string,
    itemsPickupLocation: string,
    spaceOfferId: string,
    shipmentItems: string,
    status: string,
    updatedAt: string,
    userId: string,
    user: ListingOwner | null,
  ) {
    this.createdAt = createdAt
    this.desiredWeight = desiredWeight
    this.id = id
    this.itemsPickupDate = itemsPickupDate
    this.itemsPickupLocation = itemsPickupLocation
    this.spaceOfferId = spaceOfferId
    this.shipmentItems = shipmentItems
    this.status = status
    this.updatedAt = updatedAt
    this.userId = userId
    this.user = user
  }

  static fromObject(data: {
    createdAt: string
    desiredWeight: number
    id: string
    itemsPickupDate: Date | string
    itemsPickupLocation: string
    spaceOfferId: string
    shipmentItems: string
    status: string
    updatedAt: string
    userId: string
    user: ListingOwner | null
  }): SpaceBookingRequest {
    return new SpaceBookingRequest(
      data.createdAt,
      data.desiredWeight,
      data.id,
      data.itemsPickupDate,
      data.itemsPickupLocation,
      data.spaceOfferId,
      data.shipmentItems,
      data.status,
      data.updatedAt,
      data.userId,
      data.user,
    )
  }

  static initEmpty(): SpaceBookingRequest {
    return new SpaceBookingRequest(
      '',
      0,
      '',
      '',
      '',
      '',
      '',
      SpaceBookingRequest.STATUSES.PENDING,
      '',
      '',
      null,
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

  public getStatusTagSeverity() {
    switch (this.status) {
      case SpaceBookingRequest.STATUSES.PENDING:
        return 'warn'
      case SpaceBookingRequest.STATUSES.ACCEPTED:
        return 'success'
      case SpaceBookingRequest.STATUSES.REJECTED:
        return 'danger'
      default:
        return 'info'
    }
  }
}
