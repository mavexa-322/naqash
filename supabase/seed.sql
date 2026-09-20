-- ==============================================================================
-- NAQASH CARPETS GALLERY - SEED DATA SCRIPT
-- ==============================================================================
-- Inserts collections, demo products, variants, and product images
-- matching the shop catalog (20 products).
-- ==============================================================================

-- 1. SEED COLLECTIONS
INSERT INTO public.collections (id, name, slug, description, banner_url)
VALUES
    ('11111111-1111-1111-1111-111111111101', 'Persian Heritage', 'persian-heritage', 'Classic Persian designs hand-knotted by generational artisans.', '/rugs/persian-heritage.jpg'),
    ('11111111-1111-1111-1111-111111111102', 'Modern Minimal', 'modern-minimal', 'Contemporary and minimalist area rugs crafted for modern interiors.', '/rugs/modern-minimal.jpg'),
    ('11111111-1111-1111-1111-111111111103', 'Vintage & Overdyed', 'vintage-overdyed', 'Reclaimed vintage heirloom rugs renewed with vibrant overdyed hues.', '/rugs/vintage-overdyed.jpg'),
    ('11111111-1111-1111-1111-111111111104', 'Bokhara', 'bokhara', 'Timeless geometric Turkmen gul motifs hand-knotted in premium wool.', '/rugs/bokhara-red.jpg')
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description, banner_url = EXCLUDED.banner_url;

-- 2. SEED CATEGORIES
INSERT INTO public.categories (id, name, slug, description, image_url)
VALUES
    ('22222222-2222-2222-2222-222222222201', 'Hand-Knotted Rugs', 'hand-knotted', 'Authentic wool and silk hand-knotted collector rugs.', '/rugs/persian-heritage.jpg'),
    ('22222222-2222-2222-2222-222222222202', 'Modern & Contemporary', 'modern-contemporary', 'Abstract, geometric, and minimalist area rugs.', '/rugs/modern-geometric.jpg'),
    ('22222222-2222-2222-2222-222222222203', 'Runners', 'runners', 'Long runners suited for hallways, stairs, and entryways.', '/rugs/tabriz-floral.jpg'),
    ('22222222-2222-2222-2222-222222222204', 'Vintage & Distressed', 'vintage-distressed', 'Antiqued and overdyed wool rugs with authentic patina.', '/rugs/overdyed-teal.jpg')
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url;

-- 3. SEED PRODUCTS
INSERT INTO public.products (id, title, slug, description, base_price, sale_price, badge, featured, status, collection_id)
VALUES
    ('33333333-3333-3333-3333-333333333301', 'Royal Bokhara Classic', 'royal-bokhara-classic', 
     'A masterpiece of Turkmen weaving tradition, this Bokhara rug features repeating elephant foot (gul) motifs in deep crimson red. Hand-knotted with premium New Zealand wool on a cotton foundation.',
     185000, NULL, 'bestseller', true, 'published', '11111111-1111-1111-1111-111111111104'),

    ('33333333-3333-3333-3333-333333333302', 'Isfahan Silk Medallion', 'isfahan-silk-medallion', 
     'An exquisite Isfahan rug crafted from pure silk with an intricate floral medallion design in sapphire blue and gold. Museum-quality craftsmanship with over 400 knots per square inch.',
     450000, NULL, 'new', true, 'published', '11111111-1111-1111-1111-111111111101'),

    ('33333333-3333-3333-3333-333333333303', 'Geo Lines Contemporary', 'geo-lines-contemporary', 
     'Bold geometric patterns meet modern minimalism in this hand-tufted area rug. Charcoal grey and mustard yellow create a striking contrast that elevates any contemporary space.',
     78000, NULL, NULL, true, 'published', '11111111-1111-1111-1111-111111111102'),

    ('33333333-3333-3333-3333-333333333304', 'Emerald Overdyed Vintage', 'emerald-overdyed-vintage', 
     'A reclaimed vintage Turkish rug reborn through the overdyeing process in stunning emerald teal. Each piece is unique with its own character and perfectly imperfect charm.',
     125000, 95000, 'sale', true, 'published', '11111111-1111-1111-1111-111111111103'),

    ('33333333-3333-3333-3333-333333333305', 'Coastal Diamond Jute', 'coastal-diamond-jute', 
     'An eco-friendly handwoven jute rug with diamond pattern in warm natural tones. Perfect for coastal, bohemian, or farmhouse-inspired interiors. Durable and sustainable.',
     42000, NULL, NULL, false, 'published', '11111111-1111-1111-1111-111111111102'),

    ('33333333-3333-3333-3333-333333333306', 'Tabriz Garden of Eden', 'tabriz-garden-of-eden', 
     'An heirloom-quality Tabriz rug with exquisite all-over floral design in soft ivory, rose pink, and sage green. Hand-knotted with a blend of fine wool and silk for an unmatched sheen.',
     320000, NULL, 'new', true, 'published', '11111111-1111-1111-1111-111111111101'),

    ('33333333-3333-3333-3333-333333333307', 'Heriz Medallion Runner', 'heriz-medallion-runner', 
     'A striking Heriz runner with a bold geometric medallion in terracotta, navy, and ivory. Perfect for hallways and entryways. Hand-knotted with durable highland wool.',
     68000, NULL, NULL, false, 'published', '11111111-1111-1111-1111-111111111101'),

    ('33333333-3333-3333-3333-333333333308', 'Kazak Tribal Wool', 'kazak-tribal-wool', 
     'A vibrant Kazak rug with bold tribal motifs in jewel tones — ruby red, emerald green, and sapphire blue. Hand-knotted with vegetable-dyed highland wool for exceptional durability.',
     195000, NULL, 'bestseller', true, 'published', '11111111-1111-1111-1111-111111111101'),

    ('33333333-3333-3333-3333-333333333309', 'Minimalist Loom Weave', 'minimalist-loom-weave', 
     'A handwoven flat-weave rug in soothing neutral tones with subtle textural stripes. Made from premium New Zealand wool, ideal for layering or as a standalone piece in modern interiors.',
     55000, NULL, NULL, false, 'published', '11111111-1111-1111-1111-111111111102'),

    ('33333333-3333-3333-3333-333333333310', 'Sunset Overdyed Kilim', 'sunset-overdyed-kilim', 
     'A vintage kilim reborn in warm sunset hues of terracotta, coral, and burnt orange. The flat-weave construction makes it lightweight and versatile. A true conversation piece.',
     88000, 72000, 'sale', false, 'published', '11111111-1111-1111-1111-111111111103'),

    ('33333333-3333-3333-3333-333333333311', 'Pure Silk Qom', 'pure-silk-qom', 
     'An ultra-fine pure silk Qom rug featuring a Tree of Life design in rich burgundy and gold. With over 600 knots per square inch, this is truly a collector piece and art for your floor.',
     480000, NULL, NULL, false, 'published', '11111111-1111-1111-1111-111111111101'),

    ('33333333-3333-3333-3333-333333333312', 'Bokhara Princess', 'bokhara-princess', 
     'A fine Bokhara rug with smaller, more intricate gul patterns in traditional crimson and navy. Hand-knotted with a wool pile on a cotton foundation for everyday luxury.',
     145000, NULL, NULL, false, 'published', '11111111-1111-1111-1111-111111111104'),

    ('33333333-3333-3333-3333-333333333313', 'Scandinavian Blend', 'scandinavian-blend', 
     'A luxuriously soft area rug crafted from a blend of wool and cotton in cool grey tones with subtle geometric texturing. Designed for modern Nordic-inspired living spaces.',
     62000, NULL, 'new', false, 'published', '11111111-1111-1111-1111-111111111102'),

    ('33333333-3333-3333-3333-333333333314', 'Heritage Wool Runner', 'heritage-wool-runner', 
     'A timeless hand-knotted runner featuring classic Persian palmette motifs in warm ivory and soft terracotta. Perfect for adding heritage charm to hallways and corridors.',
     52000, NULL, NULL, false, 'published', '11111111-1111-1111-1111-111111111101'),

    ('33333333-3333-3333-3333-333333333315', 'Overdyed Amethyst', 'overdyed-amethyst', 
     'A stunning vintage rug overdyed in deep amethyst purple with undertones of the original traditional pattern. A bold statement piece for eclectic and contemporary interiors.',
     135000, 110000, 'sale', false, 'published', '11111111-1111-1111-1111-111111111103'),

    ('33333333-3333-3333-3333-333333333316', 'Natural Sisal Weave', 'natural-sisal-weave', 
     'A tightly woven natural sisal and jute blend rug with a clean, minimalist appearance. Extremely durable and ideal for high-traffic areas. Available in oversized dimensions.',
     35000, NULL, NULL, false, 'published', '11111111-1111-1111-1111-111111111102'),

    ('33333333-3333-3333-3333-333333333317', 'Grand Bokhara Royal', 'grand-bokhara-royal', 
     'Our largest Bokhara offering — a grand 9x12 hand-knotted masterpiece with traditional elephant foot guls in deep burgundy and navy. A true investment piece for spacious rooms.',
     295000, NULL, 'bestseller', true, 'published', '11111111-1111-1111-1111-111111111104'),

    ('33333333-3333-3333-3333-333333333318', 'Silk & Wool Isfahan', 'silk-wool-isfahan', 
     'A magnificent Isfahan rug crafted from a luxurious blend of silk and fine wool. Features an elaborate central medallion with curvilinear arabesques in midnight blue and ivory.',
     380000, NULL, NULL, true, 'published', '11111111-1111-1111-1111-111111111101'),

    ('33333333-3333-3333-3333-333333333319', 'Abstract Brushstroke', 'abstract-brushstroke', 
     'A contemporary hand-tufted rug with abstract brushstroke patterns in charcoal, taupe, and subtle gold accents. Adds artistic flair to any modern living space.',
     92000, NULL, 'new', false, 'published', '11111111-1111-1111-1111-111111111102'),

    ('33333333-3333-3333-3333-333333333320', 'Vintage Kashan Rose', 'vintage-kashan-rose', 
     'A beautifully preserved vintage Kashan rug with a classic floral medallion in soft rose, ivory, and faded navy. Over 40 years old with patina that adds timeless character.',
     210000, NULL, NULL, false, 'published', '11111111-1111-1111-1111-111111111103')
ON CONFLICT (slug) DO UPDATE 
SET title = EXCLUDED.title, base_price = EXCLUDED.base_price, sale_price = EXCLUDED.sale_price, badge = EXCLUDED.badge, featured = EXCLUDED.featured;

-- 4. SEED PRODUCT IMAGES
INSERT INTO public.product_images (product_id, cloudinary_url, is_primary, display_order)
VALUES
    ('33333333-3333-3333-3333-333333333301', '/rugs/bokhara-red.jpg', true, 0),
    ('33333333-3333-3333-3333-333333333301', '/rugs/persian-heritage.jpg', false, 1),
    ('33333333-3333-3333-3333-333333333302', '/rugs/isfahan-blue.jpg', true, 0),
    ('33333333-3333-3333-3333-333333333303', '/rugs/modern-geometric.jpg', true, 0),
    ('33333333-3333-3333-3333-333333333303', '/rugs/modern-minimal.jpg', false, 1),
    ('33333333-3333-3333-3333-333333333304', '/rugs/overdyed-teal.jpg', true, 0),
    ('33333333-3333-3333-3333-333333333304', '/rugs/vintage-overdyed.jpg', false, 1),
    ('33333333-3333-3333-3333-333333333305', '/rugs/jute-natural.jpg', true, 0),
    ('33333333-3333-3333-3333-333333333306', '/rugs/tabriz-floral.jpg', true, 0),
    ('33333333-3333-3333-3333-333333333307', '/rugs/persian-heritage.jpg', true, 0),
    ('33333333-3333-3333-3333-333333333308', '/rugs/rug-showcase.jpg', true, 0),
    ('33333333-3333-3333-3333-333333333309', '/rugs/modern-minimal.jpg', true, 0),
    ('33333333-3333-3333-3333-333333333310', '/rugs/vintage-overdyed.jpg', true, 0),
    ('33333333-3333-3333-3333-333333333311', '/rugs/isfahan-blue.jpg', true, 0),
    ('33333333-3333-3333-3333-333333333312', '/rugs/bokhara-red.jpg', true, 0),
    ('33333333-3333-3333-3333-333333333313', '/rugs/modern-geometric.jpg', true, 0),
    ('33333333-3333-3333-3333-333333333314', '/rugs/tabriz-floral.jpg', true, 0),
    ('33333333-3333-3333-3333-333333333315', '/rugs/overdyed-teal.jpg', true, 0),
    ('33333333-3333-3333-3333-333333333316', '/rugs/jute-natural.jpg', true, 0),
    ('33333333-3333-3333-3333-333333333317', '/rugs/bokhara-red.jpg', true, 0),
    ('33333333-3333-3333-3333-333333333318', '/rugs/isfahan-blue.jpg', true, 0),
    ('33333333-3333-3333-3333-333333333319', '/rugs/modern-minimal.jpg', true, 0),
    ('33333333-3333-3333-3333-333333333320', '/rugs/tabriz-floral.jpg', true, 0)
ON CONFLICT DO NOTHING;

-- 5. SEED COMMON VARIANTS (Sizes, Colors, Materials)
INSERT INTO public.product_variants (product_id, size, color, material, price, stock)
VALUES
    ('33333333-3333-3333-3333-333333333301', '3x5', 'Red & Burgundy', 'Wool', 120000, 3),
    ('33333333-3333-3333-3333-333333333301', '5x8', 'Red & Burgundy', 'Wool', 185000, 2),
    ('33333333-3333-3333-3333-333333333301', '8x10', 'Red & Burgundy', 'Wool', 260000, 1),
    ('33333333-3333-3333-3333-333333333302', '3x5', 'Blue & Navy', 'Silk', 320000, 1),
    ('33333333-3333-3333-3333-333333333302', '5x8', 'Blue & Navy', 'Silk', 450000, 1),
    ('33333333-3333-3333-3333-333333333303', '5x8', 'Charcoal & Grey', 'Wool', 78000, 5),
    ('33333333-3333-3333-3333-333333333303', '8x10', 'Charcoal & Grey', 'Wool', 115000, 2),
    ('33333333-3333-3333-3333-333333333304', '5x8', 'Jewel Tones', 'Wool', 95000, 1),
    ('33333333-3333-3333-3333-333333333305', '5x8', 'Ivory & Cream', 'Jute', 42000, 8),
    ('33333333-3333-3333-3333-333333333306', '5x8', 'Ivory & Cream', 'Wool & Silk Blend', 320000, 2)
ON CONFLICT DO NOTHING;
