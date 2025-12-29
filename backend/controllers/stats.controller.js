import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { User } from "../models/user.model.js";

export const getStats = async (req, res, next) => {
  try {
    // const totalSongs = await Song.countDocuments();
    // const totalUsers = await User.countDocuments();
    // const totalAlbum = await Album.countDocuments();

    const [totalSongs, totalAlbum, totalUsers, uniaueArtists] =
      await Promise.all([
        Song.countDocuments(),
        Album.countDocuments(),
        User.countDocuments(),

        Song.aggregate([
          // The $group stage collapses documents so that only one document exists
          // for each unique 'artists' identifier (e.g., if multiple items
          //   share the exact same artist name or list of names).
          {
            $unionWith: {
              coll: "albums",
              pipeline: [],
            },
          },
          // The $group stage collapses documents so that only one document exists
          // for each unique 'artists' identifier (e.g., if multiple items share
          // the exact same artist name or list of names).
          {
            $group: {
              _id: "$artists",
            },
          },
          // The $count stage counts the total number of unique artist entries
          // remaining after deduplication and names the result field 'count'.
          {
            $count: "count",
          },
        ]),
      ]);

    res.status(200).json({
      totalSongs,
      totalAlbum,
      totalUsers,
      totalArtists: uniaueArtists[0]?.count || 0,
    });
  } catch (error) {
    console.log("error in getStats", error);
    next(error);
  }
};
