/**
 * Mock data seeder — categories + products (with specifications & stock images).
 * Run: npm run seed
 * Additive & idempotent: upserts categories by name and products by SKU,
 * so existing data is left alone and re-running won't create duplicates.
 */
import mongoose from 'mongoose';
import connectDB from '../db';
import categoryModel from '../models/category.model';
import productModel from '../models/product.model';

const categories = [
  { name: 'Rings', description: 'Handcrafted gold & diamond rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800' },
  { name: 'Necklaces', description: 'Traditional and contemporary necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800' },
  { name: 'Earrings', description: 'Studs, jhumkas and danglers', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800' },
  { name: 'Bangles', description: 'Gold bangles and kadas', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800' },
];

const img = (id: string) => `https://images.unsplash.com/${id}?w=900`;

// products are keyed by category name; categoryId is filled in after categories are created
const productsByCategory: Record<string, any[]> = {
  Rings: [
    {
      name: 'Classic Solitaire Ring', sku: 'RING-001', weight: 4.2, purity: '18K', makingChargesPerGram: 650,
      description: 'A timeless single-diamond solitaire set in 18K gold.',
      images: [img('photo-1605100804763-247f67b3557e'), img('photo-1515562141207-7a88fb7ce338')],
      specifications: [
        { label: 'Metal', value: '18K Yellow Gold' },
        { label: 'Diamond', value: '0.50 ct, VS clarity' },
        { label: 'Setting', value: 'Prong' },
        { label: 'Occasion', value: 'Engagement' },
      ],
    },
    {
      name: 'Floral Band Ring', sku: 'RING-002', weight: 3.1, purity: '22K', makingChargesPerGram: 500,
      description: 'Delicate floral motif band for everyday elegance.',
      images: [img('photo-1603561591411-07134e71a2a9')],
      specifications: [
        { label: 'Metal', value: '22K Gold' },
        { label: 'Style', value: 'Floral' },
        { label: 'Gender', value: 'Women' },
      ],
    },
  ],
  Necklaces: [
    {
      name: 'Temple Gold Necklace', sku: 'NECK-001', weight: 32.5, purity: '22K', makingChargesPerGram: 800,
      description: 'Antique temple-design bridal necklace with intricate carving.',
      images: [img('photo-1599643478518-a784e5dc4c8f'), img('photo-1611652022419-a9419f74343d')],
      specifications: [
        { label: 'Metal', value: '22K Gold' },
        { label: 'Style', value: 'Temple / Antique' },
        { label: 'Length', value: '16 inches' },
        { label: 'Occasion', value: 'Bridal' },
      ],
    },
    {
      name: 'Diamond Pendant Chain', sku: 'NECK-002', weight: 8.4, purity: '18K', makingChargesPerGram: 700,
      description: 'Minimal diamond pendant on a fine cable chain.',
      images: [img('photo-1602173574767-37ac01994b2a')],
      specifications: [
        { label: 'Metal', value: '18K White Gold' },
        { label: 'Diamond', value: '0.25 ct' },
        { label: 'Chain Length', value: '18 inches' },
      ],
    },
  ],
  Earrings: [
    {
      name: 'Jhumka Earrings', sku: 'EAR-001', weight: 12.0, purity: '22K', makingChargesPerGram: 600,
      description: 'Classic dome jhumkas with bead drops.',
      images: [img('photo-1535632066927-ab7c9ab60908')],
      specifications: [
        { label: 'Metal', value: '22K Gold' },
        { label: 'Type', value: 'Jhumka' },
        { label: 'Back', value: 'Push-back' },
      ],
    },
    {
      name: 'Diamond Stud Earrings', sku: 'EAR-002', weight: 2.6, purity: '18K', makingChargesPerGram: 750,
      description: 'A pair of round brilliant diamond studs.',
      images: [img('photo-1629224316810-9d8805b95e76')],
      specifications: [
        { label: 'Metal', value: '18K Gold' },
        { label: 'Diamond', value: '0.30 ct total' },
      ],
    },
  ],
  Bangles: [
    {
      name: 'Plain Gold Kada', sku: 'BANG-001', weight: 24.0, purity: '22K', makingChargesPerGram: 450,
      description: 'Solid polished gold kada, sold as a single piece.',
      images: [img('photo-1611591437281-460bfbe1220a')],
      specifications: [
        { label: 'Metal', value: '22K Gold' },
        { label: 'Size', value: '2.6 inch diameter' },
        { label: 'Finish', value: 'High polish' },
      ],
    },
  ],
};

// ── Generate ~30 more products so the catalogue feels full ──
const imagePool: Record<string, string[]> = {
  Rings: ['photo-1605100804763-247f67b3557e', 'photo-1515562141207-7a88fb7ce338', 'photo-1603561591411-07134e71a2a9'],
  Necklaces: ['photo-1599643478518-a784e5dc4c8f', 'photo-1611652022419-a9419f74343d', 'photo-1602173574767-37ac01994b2a'],
  Earrings: ['photo-1535632066927-ab7c9ab60908', 'photo-1629224316810-9d8805b95e76'],
  Bangles: ['photo-1611591437281-460bfbe1220a', 'photo-1515562141207-7a88fb7ce338'],
};

const styles = ['Classic', 'Antique', 'Bridal', 'Minimal', 'Royal', 'Floral', 'Filigree', 'Contemporary'];
const metals = ['22K Yellow Gold', '18K Yellow Gold', '18K White Gold', '22K Rose Gold'];
const occasions = ['Wedding', 'Daily Wear', 'Festive', 'Gifting', 'Party'];
const skuPrefix: Record<string, string> = { Rings: 'RING', Necklaces: 'NECK', Earrings: 'EAR', Bangles: 'BANG' };

// how many extra per category (8+8+7+7 = 30)
const extraCounts: Record<string, number> = { Rings: 8, Necklaces: 8, Earrings: 7, Bangles: 7 };

for (const catName of Object.keys(extraCounts)) {
  const pool = imagePool[catName];
  for (let n = 0; n < extraCounts[catName]; n++) {
    const style = styles[n % styles.length];
    const metal = metals[n % metals.length];
    const weight = Math.round((3 + Math.random() * 25) * 10) / 10;
    const purity = metal.startsWith('22K') ? '22K' : '18K';
    productsByCategory[catName].push({
      name: `${style} ${catName.replace(/s$/, '')} ${101 + n}`,
      sku: `${skuPrefix[catName]}-${101 + n}`,
      weight,
      purity,
      makingChargesPerGram: 400 + ((n * 50) % 500),
      description: `${style} ${catName.toLowerCase().replace(/s$/, '')} crafted in ${metal}.`,
      images: [img(pool[n % pool.length]), img(pool[(n + 1) % pool.length])],
      specifications: [
        { label: 'Metal', value: metal },
        { label: 'Style', value: style },
        { label: 'Occasion', value: occasions[n % occasions.length] },
        { label: 'Weight', value: `${weight} g` },
      ],
    });
  }
}

async function seed() {
  await connectDB();
  console.log('Connected. Upserting mock data (existing data is preserved)…');

  for (const cat of categories) {
    const savedCat = await categoryModel.findOneAndUpdate(
      { name: cat.name },
      { $set: cat },
      { upsert: true, new: true }
    );

    for (const p of productsByCategory[cat.name] || []) {
      await productModel.findOneAndUpdate(
        { sku: p.sku },
        { $set: { ...p, categoryId: String(savedCat._id), isActive: true } },
        { upsert: true, new: true }
      );
    }
  }

  const [catCount, prodCount] = await Promise.all([
    categoryModel.countDocuments({}),
    productModel.countDocuments({}),
  ]);
  console.log(`Done. Totals now: categories=${catCount} products=${prodCount}.`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
