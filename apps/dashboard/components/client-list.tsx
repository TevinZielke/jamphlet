import {
  getClients,
  getClientsWithPamphletsByUserId,
} from "@jamphlet/database";
import { DataTable } from "./clientTable/data-table";

export async function ClientList() {
  const testUserId = 4;
  const data = await getClients(testUserId);

  if (!data) return null;
  return <DataTable data={data} />;
}
