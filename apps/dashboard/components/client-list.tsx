"use client";

import { getClientsWithPamphletsByUserId } from "@jamphlet/database";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "./ui/scroll-area";
import { useClient, useSetClient } from "lib/use-client";
import { cn } from "lib/utils";

export function ClientList() {
  const [clientAtom, setClientAtom] = useClient();

  const testUserId = 3;

  const { data } = useQuery({
    queryKey: ["clientsWithPamphlets", testUserId],
    queryFn: () => getClientsWithPamphletsByUserId(testUserId),
  });

  if (!data) return null;
  return (
    <div>
      Client List
      {/* <ScrollArea>
        {data.map((client) => (
          <div
            key={client.id}
            className=" bg-red-600"
            onClick={() => setClientAtom(client.id)}
          >
            <p>
              Name: {client.name}, Id: {client.id}
            </p>
          </div>
        ))}
      </ScrollArea> */}
      <ScrollArea className="h-screen">
        <div className="flex flex-col gap-2 p-4 pt-0">
          {data.map((client) => (
            <button
              key={client.id}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
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
                    {/* {formatDistanceToNow(new Date(item.date), {
                      addSuffix: true,
                    })} */}
                  </div>
                </div>
                {/* <div className="text-xs font-medium">{item.subject}</div> */}
              </div>
              <div className="line-clamp-2 text-xs text-muted-foreground">
                {client.pamphlets.at(0)?.personalMessage?.substring(0, 300)}
              </div>
              {/* {item.labels.length ? (
                <div className="flex items-center gap-2">
                  {item.labels.map((label) => (
                    <Badge
                      key={label}
                      variant={getBadgeVariantFromLabel(label)}
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
              ) : null} */}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
