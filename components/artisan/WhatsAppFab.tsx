import { WHATSAPP_URL } from "@/lib/contact";
import { Icon } from "./Icon";

export function WhatsAppFab() {
  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-ah-primary text-white shadow-xl transition hover:scale-105 active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        <Icon name="chat_bubble" className="text-3xl" />
      </a>
    </div>
  );
}
