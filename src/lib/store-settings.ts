import { asc, eq, sql } from 'drizzle-orm'
import { db } from '@/db'
import { storeSettings } from '@/db/schema'
import type { StoreSocialSettings } from './store-settings-input'

export async function readStoreSettings() {
  const [settings] = await db.select().from(storeSettings).orderBy(asc(storeSettings.id)).limit(1)
  return settings ?? null
}

export async function saveStoreSocialSettings(settings: StoreSocialSettings) {
  await db.transaction(async (transaction) => {
    // Serialize first-time saves so concurrent requests cannot create duplicate settings.
    await transaction.execute(
      sql`SELECT pg_advisory_xact_lock(hashtext('bem_me_quero_store_settings'))`,
    )
    const [current] = await transaction
      .select({ id: storeSettings.id })
      .from(storeSettings)
      .orderBy(asc(storeSettings.id))
      .limit(1)

    if (current) {
      await transaction
        .update(storeSettings)
        .set({ ...settings, updatedAt: new Date() })
        .where(eq(storeSettings.id, current.id))
    } else {
      await transaction.insert(storeSettings).values(settings)
    }
  })
}
