"use client";

import { getClientsWithPamphletsByUserId } from "@jamphlet/database";
import { useQuery } from "@tanstack/react-query";
import { useClient, useSetClient } from "lib/use-client";
import { cn } from "lib/utils";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

// type ClientPreviewProps = {
//   id: number;
//   name: string;
//   email: string;
//   status: string;
//   body: string;
//   lastModified: string;
// };

// TODO: change type
export function ClientPreview(inputData: any) {
  const client = inputData.client;
  const [clientAtom, setClientAtom] = useClient();

  if (!client) return null;
  return (
    <div>
      <button
        key={client.id}
        className={cn(
          "flex flex-col items-start w-full gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
          clientAtom === client.id && "bg-muted"
        )}
        onClick={() => setClientAtom(client.id)}
      >
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="font-semibold">{client.name}</div>
              {!client.pamphlets.at(0)?.itemsOnPamphlets.at(0)
                ?.seenByClient && (
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
    </div>
  );
}
