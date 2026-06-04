import rideAssignmentWorker from '../modules/ride/ride.worker'

export const startWorkers = () => {
  console.log('Worker started')
  return [rideAssignmentWorker]
}
