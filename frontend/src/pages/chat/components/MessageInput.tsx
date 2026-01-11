import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { Send } from "lucide-react";
import { useState } from "react";

const MessageInput = () => {
  const { selectedUser, sendMessage } = useChatStore();
  const { user } = useUser();
  const [newMessage, setNewMessage] = useState("");

  const handleSent = () => {
    if (!selectedUser || !user || !newMessage) return;

    sendMessage(selectedUser.clerkId, user.id, newMessage.trim());
    setNewMessage("");
  };

  return (
    <div className="p-4 mt-auto border-t border-zinc-800">
      <div className="flex gap-2">
        <Input
          placeholder="Type a message"
          onChange={(e) => setNewMessage(e.target.value)}
          className="bg-zinc-800 border-none"
          onKeyDown={(e) => e.key === "Enter" && handleSent()}
        />
        <Button
          size={"icon"}
          onClick={handleSent}
          disabled={!newMessage.trim()}
        >
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
