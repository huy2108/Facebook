import User from "../models/User.js"

/* READ */
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById({ _id: id })
        res.status(200).json(user)
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        const friends = await Promise.all(
            user.friend.map(id => User.findById(id))
        )
        const formarttedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath }
            }
        );
        res.status(200).json(formarttedFriends)
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
    // console.log(123)
    try {
        const { id, friendId } = req.params;
        console.log(id)
        const user = await User.findById(id)
        const friend = await User.findById(friendId)

        if (user.friend.includes(friendId)) {
            user.friend = user.friend.filter(id => id !== friendId)
            friend.friend = friend.friend.filter(fid => fid !== id)
        } else {
            user.friend.push(friendId)
            friend.friend.push(id)
        }

        await user.save()
        await friend.save()

        const friends = await Promise.all(
            user.friend.map(id => User.findById(id))
        )
        const formarttedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath }
            }
        );

        res.status(200).json(formarttedFriends)

    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}