export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      body_logs: {
        Row: {
          created_at: string
          id: number
          logged_at: string
          user_id: string
          weight_kg: number
        }
        Insert: {
          created_at?: string
          id?: never
          logged_at: string
          user_id: string
          weight_kg: number
        }
        Update: {
          created_at?: string
          id?: never
          logged_at?: string
          user_id?: string
          weight_kg?: number
        }
        Relationships: [
          {
            foreignKeyName: "body_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_intake_logs: {
        Row: {
          calories: number
          carbs_g: number | null
          created_at: string
          fat_g: number | null
          id: number
          logged_date: string
          meal_type: string | null
          name: string | null
          protein_g: number | null
          user_id: string
        }
        Insert: {
          calories: number
          carbs_g?: number | null
          created_at?: string
          fat_g?: number | null
          id?: never
          logged_date: string
          meal_type?: string | null
          name?: string | null
          protein_g?: number | null
          user_id: string
        }
        Update: {
          calories?: number
          carbs_g?: number | null
          created_at?: string
          fat_g?: number | null
          id?: never
          logged_date?: string
          meal_type?: string | null
          name?: string | null
          protein_g?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_intake_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      entitlements: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          id: number
          module: string
          status: string
          stripe_subscription_id: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          id?: never
          module: string
          status: string
          stripe_subscription_id?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          id?: never
          module?: string
          status?: string
          stripe_subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entitlements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          created_at: string
          equipment: string | null
          id: number
          muscle_group: string
          name: string
        }
        Insert: {
          created_at?: string
          equipment?: string | null
          id?: never
          muscle_group: string
          name: string
        }
        Update: {
          created_at?: string
          equipment?: string | null
          id?: never
          muscle_group?: string
          name?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          age: string | null
          contacted: boolean
          created_at: string
          email: string | null
          gender: string | null
          goal: string | null
          id: number
          instagram: string | null
          instagram_installed: string | null
          ip: string | null
          motivation: string | null
          name: string | null
        }
        Insert: {
          age?: string | null
          contacted?: boolean
          created_at?: string
          email?: string | null
          gender?: string | null
          goal?: string | null
          id?: never
          instagram?: string | null
          instagram_installed?: string | null
          ip?: string | null
          motivation?: string | null
          name?: string | null
        }
        Update: {
          age?: string | null
          contacted?: boolean
          created_at?: string
          email?: string | null
          gender?: string | null
          goal?: string | null
          id?: never
          instagram?: string | null
          instagram_installed?: string | null
          ip?: string | null
          motivation?: string | null
          name?: string | null
        }
        Relationships: []
      }
      nutrition_targets: {
        Row: {
          accounts_for_training: boolean
          calories: number
          carbs_g: number
          created_at: string
          fat_g: number
          id: number
          protein_g: number
          user_id: string
          week_number: number
        }
        Insert: {
          accounts_for_training: boolean
          calories: number
          carbs_g: number
          created_at?: string
          fat_g: number
          id?: never
          protein_g: number
          user_id: string
          week_number: number
        }
        Update: {
          accounts_for_training?: boolean
          calories?: number
          carbs_g?: number
          created_at?: string
          fat_g?: number
          id?: never
          protein_g?: number
          user_id?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_targets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_exercises: {
        Row: {
          day_of_week: number
          exercise_id: number
          id: number
          order_index: number
          target_reps: number
          target_sets: number
          target_weight_kg: number | null
          training_plan_id: number
        }
        Insert: {
          day_of_week: number
          exercise_id: number
          id?: never
          order_index: number
          target_reps: number
          target_sets: number
          target_weight_kg?: number | null
          training_plan_id: number
        }
        Update: {
          day_of_week?: number
          exercise_id?: number
          id?: never
          order_index?: number
          target_reps?: number
          target_sets?: number
          target_weight_kg?: number | null
          training_plan_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_exercises_training_plan_id_fkey"
            columns: ["training_plan_id"]
            isOneToOne: false
            referencedRelation: "training_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          billing_interval: string | null
          created_at: string
          description: string
          download_url: string | null
          grants_module: string | null
          id: number
          image: string
          is_subscription: boolean
          name: string
          price: number
          sort_order: number
          stripe_price_id: string | null
        }
        Insert: {
          billing_interval?: string | null
          created_at?: string
          description: string
          download_url?: string | null
          grants_module?: string | null
          id?: never
          image: string
          is_subscription?: boolean
          name: string
          price: number
          sort_order?: number
          stripe_price_id?: string | null
        }
        Update: {
          billing_interval?: string | null
          created_at?: string
          description?: string
          download_url?: string | null
          grants_module?: string | null
          id?: never
          image?: string
          is_subscription?: boolean
          name?: string
          price?: number
          sort_order?: number
          stripe_price_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activity_level: string | null
          age: number | null
          created_at: string
          days_per_week: string | null
          equipment: string | null
          experience: string | null
          full_name: string | null
          gender: string | null
          goal: string | null
          height_cm: number | null
          id: string
          trains_with_program: boolean
          updated_at: string
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          created_at?: string
          days_per_week?: string | null
          equipment?: string | null
          experience?: string | null
          full_name?: string | null
          gender?: string | null
          goal?: string | null
          height_cm?: number | null
          id: string
          trains_with_program?: boolean
          updated_at?: string
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          created_at?: string
          days_per_week?: string | null
          equipment?: string | null
          experience?: string | null
          full_name?: string | null
          gender?: string | null
          goal?: string | null
          height_cm?: number | null
          id?: string
          trains_with_program?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      progress_photos: {
        Row: {
          created_at: string
          id: number
          label: string
          storage_path: string
          taken_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: never
          label: string
          storage_path: string
          taken_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: never
          label?: string
          storage_path?: string
          taken_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "progress_photos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      purchases: {
        Row: {
          amount: number | null
          created_at: string
          currency: string | null
          email: string | null
          id: number
          product_id: number | null
          product_name: string | null
          revealed_at: string | null
          session_id: string
          terms_accepted: boolean
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          email?: string | null
          id?: never
          product_id?: number | null
          product_name?: string | null
          revealed_at?: string | null
          session_id: string
          terms_accepted?: boolean
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          email?: string | null
          id?: never
          product_id?: number | null
          product_name?: string | null
          revealed_at?: string | null
          session_id?: string
          terms_accepted?: boolean
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchases_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      training_plans: {
        Row: {
          created_at: string
          id: number
          template_name: string
          user_id: string
          week_number: number
        }
        Insert: {
          created_at?: string
          id?: never
          template_name: string
          user_id: string
          week_number: number
        }
        Update: {
          created_at?: string
          id?: never
          template_name?: string
          user_id?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "training_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_set_logs: {
        Row: {
          actual_reps: number
          actual_weight_kg: number
          created_at: string
          effort: string
          id: number
          performed_at: string
          plan_exercise_id: number
          set_number: number
          user_id: string
        }
        Insert: {
          actual_reps: number
          actual_weight_kg: number
          created_at?: string
          effort: string
          id?: never
          performed_at?: string
          plan_exercise_id: number
          set_number: number
          user_id: string
        }
        Update: {
          actual_reps?: number
          actual_weight_kg?: number
          created_at?: string
          effort?: string
          id?: never
          performed_at?: string
          plan_exercise_id?: number
          set_number?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_set_logs_plan_exercise_id_fkey"
            columns: ["plan_exercise_id"]
            isOneToOne: false
            referencedRelation: "plan_exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_set_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
