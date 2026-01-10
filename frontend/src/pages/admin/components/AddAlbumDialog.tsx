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
import { useMusicStore } from "@/stores/useMusicStore";
import { Plus, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";

const AddAlbumDialog = () => {
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addAlbum } = useMusicStore();

  const [newAlbum, setNewAlbum] = useState({
    title: "",
    artist: "",
    releaseYear: new Date().getFullYear(),
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!imageFile) {
        setIsLoading(false);
        return toast.error("Please upload an image file.");
      }

      const formData = new FormData();
      formData.append("title", newAlbum.title);
      formData.append("artist", newAlbum.artist);
      formData.append("releaseYear", newAlbum.releaseYear.toString());
      formData.append("imageFile", imageFile);
      await addAlbum(formData);

      setNewAlbum({
        title: "",
        artist: "",
        releaseYear: new Date().getFullYear(),
      });
      setImageFile(null);
      setAlbumDialogOpen(false);
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-violet-500 hover:bg-violet-600 text-white">
          <Plus className="mr-2 size-4" />
          Add Album
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-700">
        <DialogHeader>
          <DialogTitle>Add New Album</DialogTitle>
          <DialogDescription>
            Add a new album to the collection
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          <div
            className="flex items-center justify-center p-6 border-2 border-dashed 
          border-zinc-700 rounded-lg cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-center">
              <div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
                <Upload className="size-6 text-zinc-400" />
              </div>
              <div className="text-sm text-zinc-400 mb-2">
                {imageFile
                  ? imageFile.name
                  : "Click to upload album cover image"}
              </div>
              <Button className="text-xs" size={"sm"} variant={"outline"}>
                Choose File
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Album Title</label>
            <Input
              value={newAlbum.title}
              onChange={(e) =>
                setNewAlbum({ ...newAlbum, title: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700"
              placeholder="Enter album title"
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">Artist</label>
              <Input
                value={newAlbum.artist}
                onChange={(e) =>
                  setNewAlbum({ ...newAlbum, artist: e.target.value })
                }
                className="bg-zinc-800 border-zinc-700"
                placeholder="Enter artist name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Release Year</label>
              <Input
                value={newAlbum.releaseYear}
                onChange={(e) =>
                  setNewAlbum({
                    ...newAlbum,
                    releaseYear:
                      parseInt(e.target.value) || new Date().getFullYear(),
                  })
                }
                className="bg-zinc-800 border-zinc-700"
                placeholder="Enter release year"
                min={1900}
                max={new Date().getFullYear()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAlbumDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-violet-500 hover:bg-violet-600"
              disabled={
                isLoading || !imageFile || !newAlbum.title || !newAlbum.artist
              }
            >
              {isLoading ? "Adding..." : "Add Album"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddAlbumDialog;
