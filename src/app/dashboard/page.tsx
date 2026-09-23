import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const calls = await prisma.call.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            AI Receptionist
          </h1>
          <p className="mt-1 text-gray-500">
            Call activity dashboard
          </p>
        </div>

        <div className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Calls</p>
          <p className="mt-2 text-4xl font-bold text-gray-900">
            {calls.length}
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Calls
            </h2>
          </div>

          {calls.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No calls recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-sm text-gray-600">
                  <tr>
                    <th className="px-6 py-3 font-medium">Caller</th>
                    <th className="px-6 py-3 font-medium">Purpose</th>
                    <th className="px-6 py-3 font-medium">Callback</th>
                    <th className="px-6 py-3 font-medium">Called At</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {calls.map((call) => (
                    <tr key={call.id}>
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                        {call.name}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {call.purpose}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                        {call.callbackTime
                          ? call.callbackTime.toLocaleString("en-IN", {
                              timeZone: "Asia/Kolkata",
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "—"}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                        {call.createdAt.toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}