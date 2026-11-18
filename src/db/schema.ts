import {
  boolean,
  check,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').default('admin').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  order: integer('order').default(0).notNull(),
  visible: boolean('visible').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  salePrice: numeric('sale_price', { precision: 10, scale: 2 }),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
  images: jsonb('images')
    .$type<Array<{ id: string; url: string; alt?: string }>>()
    .default([])
    .notNull(),
  availability: text('availability').default('available').notNull(), // 'available' | 'low' | 'unavailable'
  featured: boolean('featured').default(false).notNull(),
  badge: text('badge').default('none').notNull(), // 'none' | 'best-seller' | 'new' | 'highlight' | 'offer'
  variants: jsonb('variants')
    .$type<Array<{ id?: string; name: string; color?: string }>>()
    .default([])
    .notNull(),
  details: text('details'),
  usage: text('usage'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const financialEntries = pgTable(
  'financial_entries',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    kind: text('kind').$type<'income' | 'expense'>().notNull(),
    title: text('title').notNull(),
    amountCents: integer('amount_cents').notNull(),
    occurredOn: date('occurred_on', { mode: 'string' }).notNull(),
    productId: uuid('product_id').references(() => products.id, { onDelete: 'set null' }),
    categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true, precision: 3 }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, precision: 3 }).defaultNow().notNull(),
  },
  (table) => [
    check('financial_entries_kind_check', sql`${table.kind} in ('income', 'expense')`),
    check('financial_entries_amount_check', sql`${table.amountCents} between 1 and 999999999`),
    check(
      'financial_entries_title_check',
      sql`char_length(trim(${table.title})) between 1 and 200`,
    ),
    index('financial_entries_date_idx').on(table.occurredOn, table.id),
    index('financial_entries_category_idx').on(table.categoryId, table.occurredOn),
    index('financial_entries_product_idx').on(table.productId, table.occurredOn),
  ],
).enableRLS()

export type FinancialEntry = typeof financialEntries.$inferSelect

export const banners = pgTable('banners', {
  id: uuid('id').defaultRandom().primaryKey(),
  placement: text('placement').notNull(), // 'hero' | 'campaign' | 'institutional'
  eyebrow: text('eyebrow'),
  title: text('title').notNull(),
  description: text('description'),
  buttonLabel: text('button_label'),
  link: text('link'),
  desktopImageUrl: text('desktop_image_url'),
  mobileImageUrl: text('mobile_image_url'),
  order: integer('order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const testimonials = pgTable('testimonials', {
  id: uuid('id').defaultRandom().primaryKey(),
  displayName: text('display_name').notNull(),
  text: text('text').notNull(),
  rating: integer('rating').default(5),
  order: integer('order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const storeSettings = pgTable('store_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  storeName: text('store_name').default('Bem Me Quero Maquiagens').notNull(),
  whatsapp: text('whatsapp'),
  instagram: text('instagram'),
  shortText: text('short_text'),
  contactMessage: text('contact_message'),
  benefits: jsonb('benefits').$type<{
    shippingTitle?: string
    shippingText?: string
    supportTitle?: string
    supportText?: string
    paymentTitle?: string
    paymentText?: string
  }>(),
  usefulLinks: jsonb('useful_links').$type<Array<{ id: string; label: string; url: string }>>(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}))

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert
export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
export type Banner = typeof banners.$inferSelect
export type Testimonial = typeof testimonials.$inferSelect
export type StoreSettingsRecord = typeof storeSettings.$inferSelect
