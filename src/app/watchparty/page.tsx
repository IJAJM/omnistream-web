"use client";

import { Users, Radio } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Ganti dengan `api.getWatchPartyRooms()`.
const rooms = [
  { id: "r1", hostName: "Dinda", mediaTitle: "Senja di Kota Tua", memberCount: 12, isLive: true },
  { id: "r2", hostName: "Bagas", mediaTitle: "Cahaya Kota (Album)", memberCount: 4, isLive: true },
  { id: "r3", hostName: "Reza", mediaTitle: "Ombak Terakhir", memberCount: 0, isLive: false },
];

export default function WatchPartyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Watch Party</h1>
          <p className="mt-1 text-muted">Nonton film atau dengerin album bareng temen, real-time.</p>
        </div>
        <Button variant="marquee">+ Buat Room</Button>
      </div>
      <div className="divider-strip divider-strip--marquee my-8 w-32" />

      <div className="grid gap-4 sm:grid-cols-2">
        {rooms.map((room) => (
          <div key={room.id} className="card-surface flex items-center justify-between p-4">
            <div>
              <div className="flex items-center gap-2">
                {room.isLive && (
                  <span className="flex items-center gap-1 text-xs font-medium text-marquee">
                    <Radio size={12} className="animate-pulse" /> LIVE
                  </span>
                )}
                <p className="font-medium text-paper">{room.mediaTitle}</p>
              </div>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted">
                Dihost oleh {room.hostName} <Users size={14} className="ml-2" /> {room.memberCount}
              </p>
            </div>
            <Button variant={room.isLive ? "frequency" : "outline"} disabled={!room.isLive}>
              {room.isLive ? "Gabung" : "Belum Mulai"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
