import { User } from './user.modal'

const getAllUsers = async () => {
  const users = await User.find().select('-password -__v')
  return users
}

const updateUser = async (id: string, userData: any) => {
  const isUserExist = await User.findById(id)
  if (!isUserExist) {
    throw new Error('User not found')
  }
  if (userData.password) {
    throw new Error('Password cannot be updated through this route')
  }

  const updatedUser = await User.findByIdAndUpdate(id, userData, {
    new: true,
    runValidators: true
  }).select('-password -__v')
  return updatedUser
}

export const UserService = {
  getAllUsers,
  updateUser
}
