import { Album } from "../models/album.model.js";

export const getAllAlbums = async (req, res, next) => {
  try {
    const albums = await Album.find();
    res.status(200).json(albums);
  } catch (error) {
    console.log("Error in getAllAlbums", error);
    next(error);
  }
};

export const getAlbumById = async (req, res, next) => {
  try {
    const { albumId } = req.params;

    const album = Album.findById(albumId).populate("songs");

    if (!album) {
      return res.status(400).json({ message: "Album not found" });
    }

    res.status(200).json(album);
  } catch (error) {
    console.log("error in getAlbumbyId", error);
    next(error);
  }
};
