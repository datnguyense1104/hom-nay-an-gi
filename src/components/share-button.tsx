import { useState } from "react";
import { Share2, Check } from "lucide-react";

interface ShareButtonProps {
  onGetUrl: () => string;
  dishName: string;
}

export function ShareButton({ onGetUrl, dishName }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = onGetUrl();
    const shareData = {
      title: `Hôm nay ăn ${dishName}!`,
      text: `Gợi ý hôm nay: ${dishName} 🍜`,
      url,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        return;
      }
    } catch (err) {
      // Swallow AbortError (user cancelled); fall through to clipboard
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Share failed:", err);
      }
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (e.g., non-secure context)
    }
  };

  return (
    <button
      onClick={handleShare}
      className="group flex items-center gap-2 px-6 py-2 bg-[#F5F5F0] hover:bg-[#FF632111] text-[#A6998F] hover:text-[#FF6321] rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
      title="Chia sẻ món này"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 text-green-500" />
          <span className="text-green-500">Đã sao chép link</span>
        </>
      ) : (
        <>
          <Share2 className="w-3 h-3 transition-transform group-hover:scale-110" />
          Chia sẻ
        </>
      )}
    </button>
  );
}
