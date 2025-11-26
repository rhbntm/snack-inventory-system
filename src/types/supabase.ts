export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      inventory_items: {
        Row: {
          id: string;
          name: string;
          image: string;
          quantity: number;
          threshold: number;
          cost: number;
          price: number;
          category: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          image: string;
          quantity: number;
          threshold: number;
          cost: number;
          price: number;
          category: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          image?: string;
          quantity?: number;
          threshold?: number;
          cost?: number;
          price?: number;
          category?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      ingredients: {
        Row: {
          id: string;
          name: string;
          quantity: number;
          threshold: number;
          cost: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          quantity: number;
          threshold: number;
          cost: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          quantity?: number;
          threshold?: number;
          cost?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_ingredients: {
        Row: {
          id: string;
          product_id: string;
          ingredient_id: string;
          quantity_used: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          ingredient_id: string;
          quantity_used: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          ingredient_id?: string;
          quantity_used?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
