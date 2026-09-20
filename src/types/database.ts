export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          base_price: number
          status: 'draft' | 'published' | 'archived'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          size: string | null
          color: string | null
          material: string | null
          price: number
          stock: number
          sku: string | null
        }
        Insert: Omit<Database['public']['Tables']['product_variants']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['product_variants']['Insert']>
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          cloudinary_url: string
          is_primary: boolean
          display_order: number
        }
        Insert: Omit<Database['public']['Tables']['product_images']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['product_images']['Insert']>
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      collections: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          banner_url: string | null
        }
        Insert: Omit<Database['public']['Tables']['collections']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['collections']['Insert']>
      }
      homepage_blocks: {
        Row: {
          id: string
          type: 'hero' | 'featured_collection' | 'testimonials' | 'story'
          content: Json
          display_order: number
          is_active: boolean
        }
        Insert: Omit<Database['public']['Tables']['homepage_blocks']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['homepage_blocks']['Insert']>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
