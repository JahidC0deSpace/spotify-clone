import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMusicStore } from "@/stores/useMusicStore";
import { Plus, Upload } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

interface NewSong {
  title: string;
  artist: string;
  album: string;
  duration: string;
}

const AddSongDialog = () => {
  const { albums, addSong } = useMusicStore();
  const [songDialogOpen, setSongDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [newSong, setNewSong] = useState<NewSong>({
    title: "",
    artist: "",
    album: "",
    duration: "0",
  });

  const [files, setFiles] = useState<{
    audio: File | null;
    image: File | null;
  }>({
    audio: null,
    image: null,
  });

  const audiioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!files.audio || !files.image) {
        setIsLoading(false);
        return toast.error("Please upload both audio and image files.");
      }
      const formData = new FormData();
      formData.append("title", newSong.title);
      formData.append("artist", newSong.artist);
      formData.append("duration", newSong.duration);
      if (newSong.album && newSong.album !== "none") {
        formData.append("albumId", newSong.album);
      }
      // formData.append("album", newSong.album);
      formData.append("audioFile", files.audio);
      formData.append("imageFile", files.image);
      await addSong(formData);

      setNewSong({
        title: "",
        artist: "",
        album: "",
        duration: "0",
      });
      setFiles({ audio: null, image: null });
      setSongDialogOpen(false);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-black">
          <Plus className="mr-2 size-4" />
          Add Song
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto">
        {/* Dialog content for adding a new song goes here */}
        <DialogHeader>
          <DialogTitle>Add New Song</DialogTitle>
          <DialogDescription>
            Add a new song to your music library
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <input
            type="file"
            accept="audio/*"
            ref={audiioInputRef}
            hidden
            onChange={(e) =>
              setFiles((prev) => ({ ...prev, audio: e.target.files![0] }))
            }
          />
          <input
            type="file"
            accept="image/*"
            ref={imageInputRef}
            hidden
            onChange={(e) =>
              setFiles((prev) => ({ ...prev, image: e.target.files![0] }))
            }
          />
          {/* image upload area */}
          <div
            className="flex items-center justify-center p-6 border-2 border-dashed borderzi70
          rounded-lg cursor-pointer"
            onClick={() => imageInputRef.current?.click()}
          >
            <div className="text-center">
              {files.image ? (
                <div className="space-y-2">
                  <div className="text-sm text-emerald-500">
                    Image selected:
                  </div>
                  <div className="text-xs text-zinc-400">
                    {files.image.name.slice(0, 20)}
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
                    <Upload className="size-6 text-zinc-400" />
                  </div>
                  <div className="text-sm text-zinc-400 mb-2">
                    Upload Artwork
                  </div>
                  <Button variant={"outline"} size={"sm"} className="text-xs">
                    Choose File
                  </Button>
                </>
              )}
            </div>
          </div>
          {/* audio upload area */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Audio File</label>
            <div className="flex items-center gap-2">
              <Button
                variant={"outline"}
                onClick={() => audiioInputRef.current?.click()}
                className="w-full"
              >
                {files.audio
                  ? files.audio.name.slice(0, 30)
                  : "Choose Audio File"}
              </Button>
            </div>
          </div>

          {/* other fields */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={newSong.title}
              onChange={(e) =>
                setNewSong({ ...newSong, title: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Artist</label>
            <Input
              value={newSong.artist}
              onChange={(e) =>
                setNewSong({ ...newSong, artist: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Duration(seconds)</label>
            <Input
              type="number"
              min="0"
              value={newSong.duration}
              onChange={(e) =>
                setNewSong({
                  ...newSong,
                  duration: e.target.value || "0",
                })
              }
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          {/* select album */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Album(Optional)</label>
            <Select
              value={newSong.album}
              onValueChange={(value) =>
                setNewSong({ ...newSong, album: value })
              }
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select an album" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Album(Single)</SelectItem>
                {albums.map((album) => (
                  <SelectItem key={album._id} value={album._id}>
                    {album.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant={"outline"}
            disabled={isLoading}
            onClick={() => setSongDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleSubmit}>
            {isLoading ? "Adding..." : "Add Song"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSongDialog;
