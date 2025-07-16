export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      events: {
        Row: {
          created_at: string
          date: string
          description: string | null
          id: string
          location: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          id?: string
          location: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          location?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      finances: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string
          event_id: string
          id: string
          status: string
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date: string
          description: string
          event_id: string
          id?: string
          status: string
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string
          event_id?: string
          id?: string
          status?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finances_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      guests: {
        Row: {
          check_in_time: string | null
          checked_in: boolean
          companions: number
          created_at: string
          email: string | null
          event_id: string
          group_type: string
          id: string
          name: string
          notes: string | null
          user_id: string | null
        }
        Insert: {
          check_in_time?: string | null
          checked_in?: boolean
          companions?: number
          created_at?: string
          email?: string | null
          event_id: string
          group_type: string
          id?: string
          name: string
          notes?: string | null
          user_id?: string | null
        }
        Update: {
          check_in_time?: string | null
          checked_in?: boolean
          companions?: number
          created_at?: string
          email?: string | null
          event_id?: string
          group_type?: string
          id?: string
          name?: string
          notes?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guests_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      leju_events: {
        Row: {
          contractor_cpf: string | null
          contractor_name: string | null
          cover_image: string | null
          created_at: string
          date: string
          description: string | null
          id: string
          location: string
          status: string
          title: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          contractor_cpf?: string | null
          contractor_name?: string | null
          cover_image?: string | null
          created_at?: string
          date: string
          description?: string | null
          id?: string
          location: string
          status?: string
          title: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          contractor_cpf?: string | null
          contractor_name?: string | null
          cover_image?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          location?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      leju_finances: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string
          event_id: string | null
          id: string
          status: string
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date: string
          description: string
          event_id?: string | null
          id?: string
          status: string
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string
          event_id?: string | null
          id?: string
          status?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leju_finances_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "leju_events"
            referencedColumns: ["id"]
          },
        ]
      }
      leju_gift_items: {
        Row: {
          created_at: string
          description: string | null
          gift_list_id: string
          id: string
          image_url: string | null
          is_available: boolean
          name: string
          price: number | null
          purchased_quantity: number
          quantity: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          gift_list_id: string
          id?: string
          image_url?: string | null
          is_available?: boolean
          name: string
          price?: number | null
          purchased_quantity?: number
          quantity?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          gift_list_id?: string
          id?: string
          image_url?: string | null
          is_available?: boolean
          name?: string
          price?: number | null
          purchased_quantity?: number
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leju_gift_items_gift_list_id_fkey"
            columns: ["gift_list_id"]
            isOneToOne: false
            referencedRelation: "leju_gift_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      leju_gift_lists: {
        Row: {
          created_at: string
          description: string | null
          event_id: string
          id: string
          is_active: boolean
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_id: string
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_id?: string
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leju_gift_lists_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "leju_events"
            referencedColumns: ["id"]
          },
        ]
      }
      leju_gift_selections: {
        Row: {
          gift_item_id: string
          guest_email: string | null
          guest_name: string
          guest_phone: string | null
          id: string
          message: string | null
          quantity: number
          selected_at: string
        }
        Insert: {
          gift_item_id: string
          guest_email?: string | null
          guest_name: string
          guest_phone?: string | null
          id?: string
          message?: string | null
          quantity?: number
          selected_at?: string
        }
        Update: {
          gift_item_id?: string
          guest_email?: string | null
          guest_name?: string
          guest_phone?: string | null
          id?: string
          message?: string | null
          quantity?: number
          selected_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leju_gift_selections_gift_item_id_fkey"
            columns: ["gift_item_id"]
            isOneToOne: false
            referencedRelation: "leju_gift_items"
            referencedColumns: ["id"]
          },
        ]
      }
      leju_guests: {
        Row: {
          check_in_time: string | null
          checked_in: boolean
          companions: number
          created_at: string
          email: string | null
          event_id: string | null
          group_type: string
          id: string
          name: string
          notes: string | null
          user_id: string | null
        }
        Insert: {
          check_in_time?: string | null
          checked_in?: boolean
          companions?: number
          created_at?: string
          email?: string | null
          event_id?: string | null
          group_type: string
          id?: string
          name: string
          notes?: string | null
          user_id?: string | null
        }
        Update: {
          check_in_time?: string | null
          checked_in?: boolean
          companions?: number
          created_at?: string
          email?: string | null
          event_id?: string | null
          group_type?: string
          id?: string
          name?: string
          notes?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leju_guests_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "leju_events"
            referencedColumns: ["id"]
          },
        ]
      }
      leju_invitations: {
        Row: {
          created_at: string
          event_id: string | null
          id: string
          image_url: string | null
          message: string
          sent_count: number
          template: string
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          id?: string
          image_url?: string | null
          message: string
          sent_count?: number
          template: string
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string | null
          id?: string
          image_url?: string | null
          message?: string
          sent_count?: number
          template?: string
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leju_invitations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "leju_events"
            referencedColumns: ["id"]
          },
        ]
      }
      leju_tasks: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string | null
          due_date: string
          event_id: string | null
          id: string
          priority: string
          status: string
          title: string
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          due_date: string
          event_id?: string | null
          id?: string
          priority: string
          status: string
          title: string
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          due_date?: string
          event_id?: string | null
          id?: string
          priority?: string
          status?: string
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leju_tasks_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "leju_events"
            referencedColumns: ["id"]
          },
        ]
      }
      leju_vendors: {
        Row: {
          category: string
          contact_name: string
          created_at: string
          email: string | null
          event_id: string | null
          id: string
          name: string
          notes: string | null
          phone: string
          status: string
          user_id: string | null
        }
        Insert: {
          category: string
          contact_name: string
          created_at?: string
          email?: string | null
          event_id?: string | null
          id?: string
          name: string
          notes?: string | null
          phone: string
          status: string
          user_id?: string | null
        }
        Update: {
          category?: string
          contact_name?: string
          created_at?: string
          email?: string | null
          event_id?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leju_vendors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "leju_events"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
