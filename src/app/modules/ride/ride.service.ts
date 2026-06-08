import { QueryBuilder } from '../../utils/queryBuilder'
import { Ride } from './ride.model'

const getAllRides = async (query: Record<string, string>) => {
  const searchableFields = ['pickupAddress', 'dropoffAddress', 'status']
  const queryBuilder = new QueryBuilder(Ride.find(), query)
  const rides = await queryBuilder
    .search(searchableFields)
    .filter()
    .sort()
    .fields()
    .pagination()

  const queryRun = await Promise.all([rides.build(), queryBuilder.getMeta()])
  return { rides: queryRun[0], meta: queryRun[1] }
}

const getRideDetails = async (rideId: string) => {
  const ride = await Ride.findById(rideId)
  return ride
}

export const RideService = {
  getAllRides,
  getRideDetails
}
