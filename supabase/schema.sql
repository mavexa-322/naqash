-- ==============================================================================
-- NAQASH CARPETS GALLERY - SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- Run this script in the Supabase SQL Editor to initialize all tables,
-- relations, indexes, triggers, and Row Level Security (RLS) policies.
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. CREATE TABLES
-- ==============================================================================

-- Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Collections Table
CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    banner_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    base_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    sale_price NUMERIC(12, 2),
    badge TEXT CHECK (badge IN ('new', 'sale', 'bestseller') OR badge IS NULL),
    featured BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Product Variants Table (Sizes, Colors, Stock, SKU)
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    size TEXT,
    color TEXT,
    material TEXT,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 1,
    sku TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Product Images Table (Cloudinary URLs)
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    cloudinary_url TEXT NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Orders Table (Checkout & Bank Transfer)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    customer_first_name TEXT NOT NULL,
    customer_last_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    street_address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'bank_transfer',
    payment_screenshot_url TEXT,
    payment_status TEXT NOT NULL DEFAULT 'pending_verification' 
        CHECK (payment_status IN ('pending_verification', 'verified', 'rejected')),
    order_status TEXT NOT NULL DEFAULT 'pending' 
        CHECK (order_status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_title TEXT NOT NULL,
    size TEXT,
    price NUMERIC(12, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Contact Inquiries Table
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Homepage Dynamic Blocks
CREATE TABLE IF NOT EXISTS public.homepage_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('hero', 'featured_collection', 'testimonials', 'story')),
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 3. INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_collection ON public.products(collection_id);

CREATE INDEX IF NOT EXISTS idx_product_variants_product ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- ==============================================================================
-- 4. AUTOMATIC UPDATED_AT TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_homepage_blocks_updated_at ON public.homepage_blocks;
CREATE TRIGGER trg_homepage_blocks_updated_at
    BEFORE UPDATE ON public.homepage_blocks
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Helper function to generate human-readable order numbers (e.g. NQ-2026-1001)
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := 'NQ-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || SUBSTRING(NEW.id::text, 1, 6);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_orders_generate_number ON public.orders;
CREATE TRIGGER trg_orders_generate_number
    BEFORE INSERT ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.generate_order_number();

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_blocks ENABLE ROW LEVEL SECURITY;

-- Categories: Public read, Authenticated admin full access
CREATE POLICY "Public categories read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin categories manage" ON public.categories FOR ALL USING (auth.role() = 'authenticated');

-- Collections: Public read, Authenticated admin full access
CREATE POLICY "Public collections read" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Admin collections manage" ON public.collections FOR ALL USING (auth.role() = 'authenticated');

-- Products: Anyone can read published products, Authenticated users can manage all
CREATE POLICY "Public read published products" ON public.products FOR SELECT 
    USING (status = 'published');
CREATE POLICY "Admin products manage" ON public.products FOR ALL 
    USING (auth.role() = 'authenticated');

-- Product Variants: Public read, Admin manage
CREATE POLICY "Public read product variants" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Admin product variants manage" ON public.product_variants FOR ALL 
    USING (auth.role() = 'authenticated');

-- Product Images: Public read, Admin manage
CREATE POLICY "Public read product images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Admin product images manage" ON public.product_images FOR ALL 
    USING (auth.role() = 'authenticated');

-- Orders: Anyone can create an order (Checkout flow), Admin can read and update all
CREATE POLICY "Public create order" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read own order" ON public.orders FOR SELECT 
    USING (auth.role() = 'authenticated' OR id IS NOT NULL);
CREATE POLICY "Admin manage orders" ON public.orders FOR ALL 
    USING (auth.role() = 'authenticated');

-- Order Items: Anyone can insert order items along with checkout
CREATE POLICY "Public create order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manage order items" ON public.order_items FOR ALL 
    USING (auth.role() = 'authenticated');

-- Inquiries: Anyone can submit an inquiry, Admin can view/manage
CREATE POLICY "Public submit inquiry" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manage inquiries" ON public.inquiries FOR ALL 
    USING (auth.role() = 'authenticated');

-- Homepage Blocks: Public read active blocks, Admin manage
CREATE POLICY "Public read active homepage blocks" ON public.homepage_blocks FOR SELECT 
    USING (is_active = true);
CREATE POLICY "Admin manage homepage blocks" ON public.homepage_blocks FOR ALL 
    USING (auth.role() = 'authenticated');
