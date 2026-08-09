"use client";

import { Download, FileText } from "lucide-react";
import { formatBytes } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Message } from "@/lib/types/models";

interface MessageAttachmentProps {
  message: Message;
  /** Own messages sit on the brand background, so their text inverts. */
  mine: boolean;
  /** Opens the full-size preview. */
  onPreview: (message: Message) => void;
}

export function MessageAttachment({ message, mine, onPreview }: MessageAttachmentProps) {
  if (!message.attachment_url) return null;

  if (message.attachment_is_image) {
    return (
      <button
        type="button"
        onClick={() => onPreview(message)}
        className="block cursor-zoom-in overflow-hidden rounded-xl"
        aria-label={`Preview ${message.attachment_name ?? "image"}`}
      >
        {/* Remote, signed, expiring URL — next/image cannot optimise it. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={message.attachment_url}
          alt={message.attachment_name ?? "Attachment"}
          className="max-h-72 w-auto max-w-full object-cover transition-opacity hover:opacity-90"
        />
      </button>
    );
  }

  return (
    <a
      href={message.attachment_url}
      target="_blank"
      rel="noopener noreferrer"
      download={message.attachment_name ?? undefined}
      className={cn(
        "flex items-center gap-3 rounded-xl border p-2.5 transition-colors",
        mine
          ? "border-brand-foreground/25 hover:bg-brand-foreground/10"
          : "border-border bg-background/60 hover:bg-background"
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          mine ? "bg-brand-foreground/20" : "bg-muted"
        )}
      >
        <FileText className="h-4 w-4" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">
          {message.attachment_name}
        </span>
        <span className={cn("block text-xs", mine ? "opacity-75" : "text-muted-foreground")}>
          {formatBytes(message.attachment_size)}
        </span>
      </span>

      <Download className="h-4 w-4 shrink-0 opacity-70" />
    </a>
  );
}
