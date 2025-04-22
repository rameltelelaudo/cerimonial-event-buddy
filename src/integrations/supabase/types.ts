export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_chat_history: {
        Row: {
          ai_settings_id: string | null
          content: string
          conversation_id: string
          created_at: string
          id: string
          metadata: Json | null
          role: string
          timestamp: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          ai_settings_id?: string | null
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role: string
          timestamp?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          ai_settings_id?: string | null
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
          timestamp?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_history_ai_settings_id_fkey"
            columns: ["ai_settings_id"]
            isOneToOne: false
            referencedRelation: "ai_settings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_chat_history_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_conversations: {
        Row: {
          ai_settings_id: string | null
          created_at: string
          id: string
          is_active: boolean | null
          last_message_at: string | null
          title: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          ai_settings_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_message_at?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          ai_settings_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_message_at?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_conversations_ai_settings_id_fkey"
            columns: ["ai_settings_id"]
            isOneToOne: false
            referencedRelation: "ai_settings"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_knowledge_base: {
        Row: {
          ai_settings_id: string | null
          content: string
          created_at: string
          id: string
          metadata: Json | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          ai_settings_id?: string | null
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          ai_settings_id?: string | null
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_knowledge_base_ai_settings_id_fkey"
            columns: ["ai_settings_id"]
            isOneToOne: false
            referencedRelation: "ai_settings"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_settings: {
        Row: {
          created_at: string
          id: string
          max_tokens: number
          model: string
          openai_api_key: string
          system_prompt: string
          temperature: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          max_tokens?: number
          model?: string
          openai_api_key: string
          system_prompt: string
          temperature?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          max_tokens?: number
          model?: string
          openai_api_key?: string
          system_prompt?: string
          temperature?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      appointment_reminders: {
        Row: {
          appointment_id: string
          created_at: string
          id: string
          scheduled_message_ids: string[]
          updated_at: string
        }
        Insert: {
          appointment_id: string
          created_at?: string
          id?: string
          scheduled_message_ids: string[]
          updated_at?: string
        }
        Update: {
          appointment_id?: string
          created_at?: string
          id?: string
          scheduled_message_ids?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_reminders_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string
          appointment_datetime: string
          appointment_time: string
          attendant_id: string
          attendant_name: string
          client_name: string
          client_phone: string
          created_at: string | null
          id: string
          notes: string | null
          service_duration: number
          service_id: string
          service_name: string
          service_price: number
          status: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_date: string
          appointment_datetime: string
          appointment_time: string
          attendant_id: string
          attendant_name: string
          client_name: string
          client_phone: string
          created_at?: string | null
          id?: string
          notes?: string | null
          service_duration: number
          service_id: string
          service_name: string
          service_price: number
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_datetime?: string
          appointment_time?: string
          attendant_id?: string
          attendant_name?: string
          client_name?: string
          client_phone?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          service_duration?: number
          service_id?: string
          service_name?: string
          service_price?: number
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      attendants: {
        Row: {
          available: boolean | null
          created_at: string | null
          id: string
          name: string
          position: string
          updated_at: string | null
          work_days: string[] | null
        }
        Insert: {
          available?: boolean | null
          created_at?: string | null
          id?: string
          name: string
          position: string
          updated_at?: string | null
          work_days?: string[] | null
        }
        Update: {
          available?: boolean | null
          created_at?: string | null
          id?: string
          name?: string
          position?: string
          updated_at?: string | null
          work_days?: string[] | null
        }
        Relationships: []
      }
      business_data: {
        Row: {
          address: string
          city: string
          complement: string | null
          created_at: string | null
          document_number: string
          document_type: string
          email: string
          id: string
          legal_name: string
          logo_url: string | null
          neighborhood: string
          number: string
          phone: string
          state: string
          trading_name: string
          updated_at: string | null
          zip_code: string
        }
        Insert: {
          address: string
          city: string
          complement?: string | null
          created_at?: string | null
          document_number: string
          document_type: string
          email: string
          id?: string
          legal_name: string
          logo_url?: string | null
          neighborhood: string
          number: string
          phone: string
          state: string
          trading_name: string
          updated_at?: string | null
          zip_code: string
        }
        Update: {
          address?: string
          city?: string
          complement?: string | null
          created_at?: string | null
          document_number?: string
          document_type?: string
          email?: string
          id?: string
          legal_name?: string
          logo_url?: string | null
          neighborhood?: string
          number?: string
          phone?: string
          state?: string
          trading_name?: string
          updated_at?: string | null
          zip_code?: string
        }
        Relationships: []
      }
      business_hours: {
        Row: {
          close_time: string | null
          created_at: string | null
          day_of_week: string
          id: string
          is_closed: boolean | null
          open_time: string | null
          updated_at: string | null
        }
        Insert: {
          close_time?: string | null
          created_at?: string | null
          day_of_week: string
          id?: string
          is_closed?: boolean | null
          open_time?: string | null
          updated_at?: string | null
        }
        Update: {
          close_time?: string | null
          created_at?: string | null
          day_of_week?: string
          id?: string
          is_closed?: boolean | null
          open_time?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          complement: string | null
          created_at: string
          id: string
          name: string
          neighborhood: string | null
          phone: string
          street: string | null
          updated_at: string
          user_id: string | null
          zip_code: string | null
        }
        Insert: {
          complement?: string | null
          created_at?: string
          id?: string
          name: string
          neighborhood?: string | null
          phone: string
          street?: string | null
          updated_at?: string
          user_id?: string | null
          zip_code?: string | null
        }
        Update: {
          complement?: string | null
          created_at?: string
          id?: string
          name?: string
          neighborhood?: string | null
          phone?: string
          street?: string | null
          updated_at?: string
          user_id?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      custom_messages: {
        Row: {
          category: string
          created_at: string
          id: string
          message_name: string
          template: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          message_name: string
          template: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          message_name?: string
          template?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      customization: {
        Row: {
          action_button_color: string | null
          action_button_hover_color: string | null
          button_text_color: string | null
          created_at: string | null
          dashboard_logo: string | null
          favicon: string | null
          font_family: string | null
          font_size: string | null
          footer_text: string | null
          heading_font_family: string | null
          hover_color: string | null
          id: string
          login_logo: string | null
          menu_logo: string | null
          menu_text_color: string | null
          navbar_color: string | null
          primary_color: string | null
          secondary_color: string | null
          site_title: string | null
          updated_at: string | null
          welcome_text: string | null
        }
        Insert: {
          action_button_color?: string | null
          action_button_hover_color?: string | null
          button_text_color?: string | null
          created_at?: string | null
          dashboard_logo?: string | null
          favicon?: string | null
          font_family?: string | null
          font_size?: string | null
          footer_text?: string | null
          heading_font_family?: string | null
          hover_color?: string | null
          id?: string
          login_logo?: string | null
          menu_logo?: string | null
          menu_text_color?: string | null
          navbar_color?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          site_title?: string | null
          updated_at?: string | null
          welcome_text?: string | null
        }
        Update: {
          action_button_color?: string | null
          action_button_hover_color?: string | null
          button_text_color?: string | null
          created_at?: string | null
          dashboard_logo?: string | null
          favicon?: string | null
          font_family?: string | null
          font_size?: string | null
          footer_text?: string | null
          heading_font_family?: string | null
          hover_color?: string | null
          id?: string
          login_logo?: string | null
          menu_logo?: string | null
          menu_text_color?: string | null
          navbar_color?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          site_title?: string | null
          updated_at?: string | null
          welcome_text?: string | null
        }
        Relationships: []
      }
      evolution_api_chats: {
        Row: {
          created_at: string
          id: string
          instance_id: string | null
          is_group: boolean
          jid: string
          name: string | null
          raw_data: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          instance_id?: string | null
          is_group?: boolean
          jid: string
          name?: string | null
          raw_data?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          instance_id?: string | null
          is_group?: boolean
          jid?: string
          name?: string | null
          raw_data?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "evolution_api_chats_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "evolution_api_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      evolution_api_contacts: {
        Row: {
          created_at: string
          id: string
          instance_id: string | null
          jid: string
          name: string | null
          push_name: string | null
          raw_data: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          instance_id?: string | null
          jid: string
          name?: string | null
          push_name?: string | null
          raw_data?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          instance_id?: string | null
          jid?: string
          name?: string | null
          push_name?: string | null
          raw_data?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "evolution_api_contacts_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "evolution_api_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      evolution_api_instances: {
        Row: {
          business_id: string | null
          client_name: string
          connection_status: string
          created_at: string
          disconnection_at: string | null
          disconnection_object: Json | null
          disconnection_reason_code: string | null
          id: string
          instance_id: string
          instance_name: string
          integration: string
          owner_jid: string | null
          phone_number: string | null
          profile_name: string | null
          profile_pic_url: string | null
          qr_code: Json | null
          settings: Json
          token: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          business_id?: string | null
          client_name?: string
          connection_status?: string
          created_at?: string
          disconnection_at?: string | null
          disconnection_object?: Json | null
          disconnection_reason_code?: string | null
          id?: string
          instance_id: string
          instance_name: string
          integration?: string
          owner_jid?: string | null
          phone_number?: string | null
          profile_name?: string | null
          profile_pic_url?: string | null
          qr_code?: Json | null
          settings?: Json
          token: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          business_id?: string | null
          client_name?: string
          connection_status?: string
          created_at?: string
          disconnection_at?: string | null
          disconnection_object?: Json | null
          disconnection_reason_code?: string | null
          id?: string
          instance_id?: string
          instance_name?: string
          integration?: string
          owner_jid?: string | null
          phone_number?: string | null
          profile_name?: string | null
          profile_pic_url?: string | null
          qr_code?: Json | null
          settings?: Json
          token?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      evolution_api_messages: {
        Row: {
          content: string | null
          created_at: string
          from_me: boolean
          id: string
          instance_id: string | null
          message_id: string
          message_type: string | null
          raw_data: Json | null
          to_jid: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          from_me?: boolean
          id?: string
          instance_id?: string | null
          message_id: string
          message_type?: string | null
          raw_data?: Json | null
          to_jid: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          from_me?: boolean
          id?: string
          instance_id?: string | null
          message_id?: string
          message_type?: string | null
          raw_data?: Json | null
          to_jid?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "evolution_api_messages_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "evolution_api_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      evolution_api_settings: {
        Row: {
          api_key: string
          base_url: string
          created_at: string
          id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          api_key: string
          base_url: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          api_key?: string
          base_url?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      licenses: {
        Row: {
          activation_date: string | null
          client_name: string
          created_at: string | null
          current_installations: number | null
          expiration_date: string | null
          id: string
          is_active: boolean | null
          last_check: string | null
          last_ip: string | null
          license_key: string
          license_type: string | null
          max_installations: number | null
          metadata: Json | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          activation_date?: string | null
          client_name: string
          created_at?: string | null
          current_installations?: number | null
          expiration_date?: string | null
          id?: string
          is_active?: boolean | null
          last_check?: string | null
          last_ip?: string | null
          license_key: string
          license_type?: string | null
          max_installations?: number | null
          metadata?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          activation_date?: string | null
          client_name?: string
          created_at?: string | null
          current_installations?: number | null
          expiration_date?: string | null
          id?: string
          is_active?: boolean | null
          last_check?: string | null
          last_ip?: string | null
          license_key?: string
          license_type?: string | null
          max_installations?: number | null
          metadata?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "licenses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_progress: {
        Row: {
          appointments_count: number | null
          client_id: string
          created_at: string | null
          id: string
          last_appointment_date: string | null
          rewards_earned: number | null
          rewards_used: number | null
          updated_at: string | null
        }
        Insert: {
          appointments_count?: number | null
          client_id: string
          created_at?: string | null
          id?: string
          last_appointment_date?: string | null
          rewards_earned?: number | null
          rewards_used?: number | null
          updated_at?: string | null
        }
        Update: {
          appointments_count?: number | null
          client_id?: string
          created_at?: string | null
          id?: string
          last_appointment_date?: string | null
          rewards_earned?: number | null
          rewards_used?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_progress_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_rewards: {
        Row: {
          appointment_id: string | null
          client_id: string
          created_at: string | null
          expires_at: string | null
          id: string
          rule_id: string
          status: string
          updated_at: string | null
          used_at: string | null
        }
        Insert: {
          appointment_id?: string | null
          client_id: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          rule_id: string
          status?: string
          updated_at?: string | null
          used_at?: string | null
        }
        Update: {
          appointment_id?: string | null
          client_id?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          rule_id?: string
          status?: string
          updated_at?: string | null
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_rewards_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_rewards_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_rewards_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "loyalty_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_rules: {
        Row: {
          appointments_required: number
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          reward_type: string
          reward_value: number | null
          updated_at: string | null
        }
        Insert: {
          appointments_required: number
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          reward_type: string
          reward_value?: number | null
          updated_at?: string | null
        }
        Update: {
          appointments_required?: number
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          reward_type?: string
          reward_value?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      schedule_assignments: {
        Row: {
          attendant_id: string
          attendant_name: string
          created_at: string | null
          id: string
          schedule_id: string
          schedule_info: string
          updated_at: string | null
        }
        Insert: {
          attendant_id: string
          attendant_name: string
          created_at?: string | null
          id?: string
          schedule_id: string
          schedule_info: string
          updated_at?: string | null
        }
        Update: {
          attendant_id?: string
          attendant_name?: string
          created_at?: string | null
          id?: string
          schedule_id?: string
          schedule_info?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      scheduled_messages: {
        Row: {
          created_at: string
          error: string | null
          id: string
          instance_id: string
          instance_name: string
          payload: Json
          scheduled_at: string
          status: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          error?: string | null
          id?: string
          instance_id: string
          instance_name: string
          payload: Json
          scheduled_at: string
          status?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          error?: string | null
          id?: string
          instance_id?: string
          instance_name?: string
          payload?: Json
          scheduled_at?: string
          status?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_messages_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "evolution_api_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      schedules: {
        Row: {
          available: boolean | null
          created_at: string | null
          day: string
          days: string[] | null
          duration: number
          id: string
          start_time: string
          updated_at: string | null
        }
        Insert: {
          available?: boolean | null
          created_at?: string | null
          day: string
          days?: string[] | null
          duration: number
          id?: string
          start_time: string
          updated_at?: string | null
        }
        Update: {
          available?: boolean | null
          created_at?: string | null
          day?: string
          days?: string[] | null
          duration?: number
          id?: string
          start_time?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      service_assignments: {
        Row: {
          attendant_id: string
          attendant_name: string
          attendant_position: string
          created_at: string | null
          id: string
          service_duration: number
          service_id: string
          service_name: string
          service_price: number
          updated_at: string | null
        }
        Insert: {
          attendant_id: string
          attendant_name: string
          attendant_position: string
          created_at?: string | null
          id?: string
          service_duration: number
          service_id: string
          service_name: string
          service_price: number
          updated_at?: string | null
        }
        Update: {
          attendant_id?: string
          attendant_name?: string
          attendant_position?: string
          created_at?: string | null
          id?: string
          service_duration?: number
          service_id?: string
          service_name?: string
          service_price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          available: boolean | null
          created_at: string | null
          duration: number
          id: string
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          available?: boolean | null
          created_at?: string | null
          duration: number
          id?: string
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          available?: boolean | null
          created_at?: string | null
          duration?: number
          id?: string
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string | null
          id: string
          registration_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          registration_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          registration_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar: string | null
          created_at: string | null
          email: string
          id: string
          last_login: string | null
          name: string
          password: string
          permissions: string[] | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          email: string
          id?: string
          last_login?: string | null
          name: string
          password: string
          permissions?: string[] | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          email?: string
          id?: string
          last_login?: string | null
          name?: string
          password?: string
          permissions?: string[] | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      whatsapp_instances: {
        Row: {
          api_url: string | null
          created_at: string
          id: number
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          api_url?: string | null
          created_at?: string
          id?: number
          name: string
          status: string
          updated_at?: string
        }
        Update: {
          api_url?: string | null
          created_at?: string
          id?: number
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      activate_license: {
        Args: { license_key: string }
        Returns: boolean
      }
      check_license_validity: {
        Args: { license_key: string }
        Returns: boolean
      }
      create_appointments_table_if_not_exists: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_owner: {
        Args: { resource_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
