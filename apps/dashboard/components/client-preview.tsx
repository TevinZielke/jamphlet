"use client";

import { ClientWithPamphlet } from "@jamphlet/database";
import { useClientAtom } from "lib/use-client";
import { cn } from "lib/utils";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import Link from "next/link";
import { UserCheck } from "lucide-react";

type ClientPreviewProps = {
  inputData: ClientWithPamphlet;
};

export function ClientPreview({ inputData }: ClientPreviewProps) {
  const client = inputData;
  const [clientAtom, setClientAtom] = useClientAtom();

  if (!client) return null;
  return (
    <Link href={`/clients/${client.id}`} className=" w-full py-1">
      <button
        key={client.id}
        className={cn(
          "flex flex-col items-start w-full gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent ",
          clientAtom === client.id && "bg-muted"
        )}
        onClick={() => setClientAtom(client.id)}
      >
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="font-semibold">{client.name}</div>
              <UserCheck color="grey" className={cn("h-4 w-4 mb-1")} />
              {client.pamphlets.at(0)?.itemsOnPamphlets.at(0)?.seenByClient && (
                <span className="flex h-2 w-2 rounded-full bg-blue-600" />
              )}
            </div>
            <div
              className={cn(
                "ml-auto text-xs",
                clientAtom === client.id
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {formatDistanceToNow(new Date(client.lastModified!))}
            </div>
          </div>
          <div className="text-xs font-medium text-gray-500">
            {client.email}
          </div>
        </div>
        <div className="line-clamp-2 text-xs text-muted-foreground">
          {client.pamphlets.at(0)?.personalMessage?.substring(0, 300)}
        </div>
      </button>
    </Link>
  );
}
