/**
 * Pinecone Vector Database Sync Script
 * =====================================
 * Run this script to index all products and store policies into Pinecone.
 * Usage: node backend/scripts/syncPinecone.js
 */

import 'dotenv/config'
import mongoose from 'mongoose'
import { Pinecone } from '@pinecone-database/pinecone'

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const PINECONE_API_KEY  = process.env.PINECONE_API_KEY
const PINECONE_INDEX    = process.env.PINECONE_INDEX || 'e-commerce'
const MONGODB_URI       = process.env.MONGODB_URI
const VECTOR_DIMENSIONS = 384

// ─── STORE POLICIES KNOWLEDGE BASE ────────────────────────────────────────────
const STORE_POLICIES = [
  {
    id: 'policy-0',
    title: 'Return & Exchange Policy',
    content: 'We offer a 7-day easy return and exchange policy. Items must be unused, in original packaging with tags intact. Refund will be processed to original payment method or store credit within 5-7 business days.'
  },
  {
    id: 'policy-1',
    title: 'Shipping & Delivery Policy',
    content: 'Standard delivery charge is $10 across all orders. Delivery usually takes 3 to 5 business days depending on location. Free shipping promotions may apply during special store events.'
  },
  {
    id: 'policy-2',
    title: 'Payment Methods',
    content: 'We accept Cash on Delivery (COD), Stripe (Credit/Debit Card), and Razorpay payments. All transactions are 100% secure and encrypted.'
  },
  {
    id: 'policy-3',
    title: 'Customer Support & Contact',
    content: 'Customer support is available Monday through Friday, 9 AM to 6 PM EST. You can contact us via the Contact page or email support@forevercommerce.com.'
  }
]

// ─── VECTOR EMBEDDING GENERATOR ───────────────────────────────────────────────
function generateEmbedding(text, dimensions = VECTOR_DIMENSIONS) {
  const vector = new Array(dimensions).fill(0)
  if (!text || typeof text !== 'string') return vector

  const cleaned = text.toLowerCase().replace(/[^a-z0-9\s]/g, '')
  const words   = cleaned.split(/\s+/).filter(Boolean)
  if (words.length === 0) return vector

  for (let i = 0; i < words.length; i++) {
    const word = words[i]

    // Feature hashing
    let hash = 0
    for (let j = 0; j < word.length; j++) {
      hash = (hash << 5) - hash + word.charCodeAt(j)
      hash |= 0
    }
    vector[Math.abs(hash) % dimensions] += 1.0 / Math.sqrt(i + 1)

    // Character 3-gram encoding
    if (word.length >= 3) {
      for (let k = 0; k < word.length - 2; k++) {
        const ngram = word.substring(k, k + 3)
        let nHash = 0
        for (let n = 0; n < ngram.length; n++) {
          nHash = (nHash << 5) - nHash + ngram.charCodeAt(n)
          nHash |= 0
        }
        vector[Math.abs(nHash) % dimensions] += 0.25
      }
    }
  }

  // L2 Normalization
  let norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0))
  if (norm > 0) {
    for (let i = 0; i < dimensions; i++) vector[i] /= norm
  }

  return vector
}

// ─── MAIN SYNC FUNCTION ────────────────────────────────────────────────────────
async function syncPinecone() {
  console.log('\n🚀 ====== Pinecone Sync Script ======')
  console.log(`📌 Target Index : ${PINECONE_INDEX}`)
  console.log(`📐 Dimensions   : ${VECTOR_DIMENSIONS}\n`)

  // 1. Validate env vars
  if (!PINECONE_API_KEY || PINECONE_API_KEY === 'your_pinecone_api_key') {
    console.error('❌ Error: PINECONE_API_KEY is missing in backend/.env')
    process.exit(1)
  }
  if (!MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI is missing in backend/.env')
    process.exit(1)
  }

  // 2. Connect to MongoDB
  console.log('🔌 Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI)
  console.log('✅ MongoDB connected!\n')

  // 3. Load product schema (inline to avoid import issues)
  const productSchema = new mongoose.Schema({
    name:        { type: String },
    description: { type: String },
    price:       { type: Number },
    image:       { type: Array },
    category:    { type: String },
    subCategory: { type: String },
    sizes:       { type: Array },
    bestseller:  { type: Boolean },
    date:        { type: Number }
  })
  const Product = mongoose.models.product || mongoose.model('product', productSchema)

  // 4. Fetch all products
  console.log('📦 Fetching products from MongoDB...')
  const products = await Product.find({})
  console.log(`✅ Found ${products.length} products.\n`)

  // 5. Build document list
  const documents = []

  // Policy documents
  for (const policy of STORE_POLICIES) {
    const text = `Policy Title: ${policy.title}\nContent: ${policy.content}`
    documents.push({
      id:       policy.id,
      text,
      metadata: { type: 'policy', name: policy.title, text }
    })
  }

  // Product documents
  for (const p of products) {
    const sizes   = Array.isArray(p.sizes) ? p.sizes.join(', ') : p.sizes
    const imgUrl  = Array.isArray(p.image) && p.image.length > 0 ? p.image[0] : ''
    const text    = `Product Name: ${p.name}\nID: ${p._id}\nCategory: ${p.category} -> ${p.subCategory}\nPrice: $${p.price}\nAvailable Sizes: ${sizes}\nDescription: ${p.description}\nBestseller: ${p.bestseller ? 'Yes' : 'No'}`

    documents.push({
      id:       `product-${p._id}`,
      text,
      metadata: {
        type:        'product',
        name:        p.name,
        productId:   p._id.toString(),
        price:       p.price,
        category:    p.category,
        subCategory: p.subCategory,
        image:       imgUrl,
        bestseller:  p.bestseller || false,
        text:        text.substring(0, 1000)
      }
    })
  }

  console.log(`📝 Total documents to index: ${documents.length}`)
  console.log(`   - Policies : ${STORE_POLICIES.length}`)
  console.log(`   - Products : ${products.length}\n`)

  // 6. Generate vector embeddings
  console.log('🧮 Generating vector embeddings...')
  const records = documents.map((doc) => ({
    id:       doc.id,
    values:   generateEmbedding(doc.text),
    metadata: doc.metadata
  }))
  console.log(`✅ ${records.length} embeddings generated.\n`)

  // 7. Connect to Pinecone and upsert
  console.log('🌲 Connecting to Pinecone...')
  const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY.trim() })
  const index    = pinecone.index(PINECONE_INDEX.trim())
  console.log(`✅ Connected to Pinecone index: '${PINECONE_INDEX}'\n`)

  // Upsert in batches of 100
  const BATCH_SIZE = 100
  let totalUpserted = 0

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch       = records.slice(i, i + BATCH_SIZE)
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(records.length / BATCH_SIZE)

    process.stdout.write(`⬆️  Upserting batch ${batchNumber}/${totalBatches} (${batch.length} records)... `)
    await index.upsert({ records: batch })
    totalUpserted += batch.length
    console.log('✅ Done')
  }

  console.log(`\n🎉 Sync complete! ${totalUpserted} records indexed into Pinecone.`)
  console.log(`   Go to app.pinecone.io and check index '${PINECONE_INDEX}' → Record count: ${totalUpserted}\n`)

  await mongoose.disconnect()
  process.exit(0)
}

// ─── RUN ──────────────────────────────────────────────────────────────────────
syncPinecone().catch((err) => {
  console.error('\n❌ Sync failed with error:', err.message)
  console.error(err)
  process.exit(1)
})
