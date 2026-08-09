"use client";

import { Download, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { formatBytes } from "@/lib/format";
import type { Message } from "@/lib/types/models";

interface ImageLightboxProps {
  /** The image being previewed, or null when the lightbox is closed. */
  message: Message | null;
  onClose: () => void;
}

export function ImageLightbox({ message, onClose }: ImageLightboxProps) {
  const open = Boolean(message?.attachment_url);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        className="max-w-[95vw] gap-0 border-0 bg-transparent p-0 shadow-none sm:max-w-4xl"
      >
        {message && (
          <>
            <div className="mb-2 flex items-center gap-3 rounded-lg bg-background/95 px-3 py-2 backdrop-blur">
              <div className="min-w-0 flex-1">
                <DialogTitle className="truncate text-sm font-medium">
                  {message.attachment_name ?? "Image"}
                </DialogTitle>
                {message.attachment_size !== null && (
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(message.attachment_size)}
                  </p>
                )}
              </div>

              <a
                href={message.attachment_url ?? undefined}
                download={message.attachment_name ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Download image"
                title="Download"
              >
                <Download className="h-4 w-4" />
              </a>

              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Close preview"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Signed, expiring remote URL — outside next/image's reach. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={message.attachment_url ?? ""}
              alt={message.attachment_name ?? "Image preview"}
              className="mx-auto max-h-[80vh] w-auto max-w-full rounded-lg object-contain"
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
