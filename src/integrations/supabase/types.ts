export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      analysis_results: {
        Row: {
          id: string
          user_id: string
          document_id: string
          analysis_type: string
          results: Json
          summary: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          document_id: string
          analysis_type?: string
          results?: Json
          summary?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          document_id?: string
          analysis_type?: string
          results?: Json
          summary?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_results_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "parsed_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      brds: {
        Row: {
          accuracy: number | null
          content: Json | null
          created_at: string
          f1_score: number | null
          id: string
          precision_score: number | null
          project_id: string | null
          recall: number | null
          status: string
          user_id: string
          version: number
        }
        Insert: {
          accuracy?: number | null
          content?: Json | null
          created_at?: string
          f1_score?: number | null
          id?: string
          precision_score?: number | null
          project_id?: string | null
          recall?: number | null
          status?: string
          user_id: string
          version?: number
        }
        Update: {
          accuracy?: number | null
          content?: Json | null
          created_at?: string
          f1_score?: number | null
          id?: string
          precision_score?: number | null
          project_id?: string | null
          recall?: number | null
          status?: string
          user_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "brds_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_history: {
        Row: {
          id: string
          user_id: string
          role: string
          content: string
          session_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: string
          content: string
          session_id?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: string
          content?: string
          session_id?: string
          created_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          created_at: string
          id: string
          name: string
          project_id: string
          size_bytes: number | null
          status: string
          type: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          name: string
          project_id: string
          size_bytes?: number | null
          status?: string
          type: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          name?: string
          project_id?: string
          size_bytes?: number | null
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      metrics: {
        Row: {
          brd_id: string | null
          created_at: string
          id: string
          metric_type: string
          user_id: string
          value: number
        }
        Insert: {
          brd_id?: string | null
          created_at?: string
          id?: string
          metric_type: string
          user_id: string
          value: number
        }
        Update: {
          brd_id?: string | null
          created_at?: string
          id?: string
          metric_type?: string
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "metrics_brd_id_fkey"
            columns: ["brd_id"]
            isOneToOne: false
            referencedRelation: "brds"
            referencedColumns: ["id"]
          },
        ]
      }
      parsed_documents: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string | null
          source_type: string
          parsed_data: Json
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content?: string | null
          source_type?: string
          parsed_data?: Json
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string | null
          source_type?: string
          parsed_data?: Json
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      pipeline_logs: {
        Row: {
          created_at: string
          id: string
          message: string | null
          project_id: string | null
          status: string
          step: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          project_id?: string | null
          status?: string
          step: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          project_id?: string | null
          status?: string
          step?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          accuracy: number | null
          created_at: string
          id: string
          name: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          accuracy?: number | null
          created_at?: string
          id?: string
          name: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          accuracy?: number | null
          created_at?: string
          id?: string
          name?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
