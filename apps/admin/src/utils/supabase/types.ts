export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      bank: {
        Row: {
          id: number
          name: string | null
          tag: string | null
        }
        Insert: {
          id?: never
          name?: string | null
          tag?: string | null
        }
        Update: {
          id?: never
          name?: string | null
          tag?: string | null
        }
        Relationships: []
      }
      bank_account: {
        Row: {
          bank_id: number
          id: number
          name: string | null
          num: string | null
        }
        Insert: {
          bank_id: number
          id?: never
          name?: string | null
          num?: string | null
        }
        Update: {
          bank_id?: number
          id?: never
          name?: string | null
          num?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_account_bank_id_fkey"
            columns: ["bank_id"]
            isOneToOne: false
            referencedRelation: "bank"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_tx: {
        Row: {
          amount: number | null
          amount_e: number | null
          ba_id: number
          currency: string | null
          description: string | null
          id: string
          id2: string
          num: number | null
          posted_at: string | null
          ref_id: string | null
          remarks: string | null
          transacted_at: string | null
          type: string | null
        }
        Insert: {
          amount?: number | null
          amount_e?: number | null
          ba_id: number
          currency?: string | null
          description?: string | null
          id?: string
          id2?: string
          num?: number | null
          posted_at?: string | null
          ref_id?: string | null
          remarks?: string | null
          transacted_at?: string | null
          type?: string | null
        }
        Update: {
          amount?: number | null
          amount_e?: number | null
          ba_id?: number
          currency?: string | null
          description?: string | null
          id?: string
          id2?: string
          num?: number | null
          posted_at?: string | null
          ref_id?: string | null
          remarks?: string | null
          transacted_at?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_tx_ba_id_fkey"
            columns: ["ba_id"]
            isOneToOne: false
            referencedRelation: "bank_account"
            referencedColumns: ["id"]
          },
        ]
      }
      org: {
        Row: {
          display_name: string | null
          id: number
          tag: string | null
          tier: number
        }
        Insert: {
          display_name?: string | null
          id?: never
          tag?: string | null
          tier: number
        }
        Update: {
          display_name?: string | null
          id?: never
          tag?: string | null
          tier?: number
        }
        Relationships: [
          {
            foreignKeyName: "org_tier_fkey"
            columns: ["tier"]
            isOneToOne: false
            referencedRelation: "usage_tier"
            referencedColumns: ["id"]
          },
        ]
      }
      org_invite: {
        Row: {
          accepted_at: string | null
          code: string | null
          created_by: string
          id: number
          org_id: number
          role: string | null
          send_to: string | null
        }
        Insert: {
          accepted_at?: string | null
          code?: string | null
          created_by: string
          id?: never
          org_id: number
          role?: string | null
          send_to?: string | null
        }
        Update: {
          accepted_at?: string | null
          code?: string | null
          created_by?: string
          id?: never
          org_id?: number
          role?: string | null
          send_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_inviter_user"
            columns: ["created_by", "org_id"]
            isOneToOne: false
            referencedRelation: "user_orgs"
            referencedColumns: ["user_id", "org_id"]
          },
          {
            foreignKeyName: "org_invite_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "org"
            referencedColumns: ["id"]
          },
        ]
      }
      org_join_request: {
        Row: {
          approved_by: string | null
          id: number
          note: string | null
          org_id: number
          user_id: string
        }
        Insert: {
          approved_by?: string | null
          id?: never
          note?: string | null
          org_id: number
          user_id: string
        }
        Update: {
          approved_by?: string | null
          id?: never
          note?: string | null
          org_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_approved_by_user"
            columns: ["approved_by", "org_id"]
            isOneToOne: false
            referencedRelation: "user_orgs"
            referencedColumns: ["user_id", "org_id"]
          },
          {
            foreignKeyName: "fk_request_user"
            columns: ["user_id", "org_id"]
            isOneToOne: false
            referencedRelation: "user_orgs"
            referencedColumns: ["user_id", "org_id"]
          },
          {
            foreignKeyName: "org_join_request_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "org"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_intent: {
        Row: {
          amount: number | null
          amount_e: number | null
          client_secret: string | null
          confirmation_method: string | null
          currency: string | null
          customer: string | null
          description: string | null
          id: string
          id2: string
          last_payment_error: Json | null
          latest_charge: string | null
          metadata: Json | null
          next_action: Json | null
          org_id: number
          payment_method: string | null
          receipt_email: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          amount_e?: number | null
          client_secret?: string | null
          confirmation_method?: string | null
          currency?: string | null
          customer?: string | null
          description?: string | null
          id?: string
          id2?: string
          last_payment_error?: Json | null
          latest_charge?: string | null
          metadata?: Json | null
          next_action?: Json | null
          org_id: number
          payment_method?: string | null
          receipt_email?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          amount?: number | null
          amount_e?: number | null
          client_secret?: string | null
          confirmation_method?: string | null
          currency?: string | null
          customer?: string | null
          description?: string | null
          id?: string
          id2?: string
          last_payment_error?: Json | null
          latest_charge?: string | null
          metadata?: Json | null
          next_action?: Json | null
          org_id?: number
          payment_method?: string | null
          receipt_email?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_org"
            columns: ["user_id", "org_id"]
            isOneToOne: false
            referencedRelation: "user_orgs"
            referencedColumns: ["user_id", "org_id"]
          },
        ]
      }
      payment_tx: {
        Row: {
          amount: number | null
          amount_e: number | null
          amount_refunded: number | null
          currency: string | null
          id: string
          id2: string
          payment_method: string | null
          payment_method_details: Json | null
          pi_id: string
          refunds: Json | null
          status: string | null
        }
        Insert: {
          amount?: number | null
          amount_e?: number | null
          amount_refunded?: number | null
          currency?: string | null
          id?: string
          id2?: string
          payment_method?: string | null
          payment_method_details?: Json | null
          pi_id: string
          refunds?: Json | null
          status?: string | null
        }
        Update: {
          amount?: number | null
          amount_e?: number | null
          amount_refunded?: number | null
          currency?: string | null
          id?: string
          id2?: string
          payment_method?: string | null
          payment_method_details?: Json | null
          pi_id?: string
          refunds?: Json | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_tx_pi_id_fkey"
            columns: ["pi_id"]
            isOneToOne: false
            referencedRelation: "payment_intent"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_tier: {
        Row: {
          display_name: string | null
          id: number
        }
        Insert: {
          display_name?: string | null
          id?: never
        }
        Update: {
          display_name?: string | null
          id?: never
        }
        Relationships: []
      }
      user: {
        Row: {
          avatar_img: string | null
          display_name: string | null
          id: string
        }
        Insert: {
          avatar_img?: string | null
          display_name?: string | null
          id: string
        }
        Update: {
          avatar_img?: string | null
          display_name?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_orgs: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          org_id: number
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          org_id: number
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          org_id?: number
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_orgs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "org"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_orgs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_endpoint: {
        Row: {
          id: string
          created_at: string | null
          deleted_at: string | null
          org_id?: number
          account_id: number
          enabled_events?: Json | null
          status?: string | null
          url?: string | null
          description?: string | null
          api_version?: string | null
          metadata?: Json | null
          secret?: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          org_id?: number
          account_id: number
          enabled_events?: Json | null
          status?: string | null
          url?: string | null
          description?: string | null
          api_version?: string | null
          metadata?: Json | null
          secret?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          org_id?: number
          account_id?: number
          enabled_events?: Json | null
          status?: string | null
          url?: string | null
          description?: string | null
          api_version?: string | null
          metadata?: Json | null
          secret?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webhook_endpoint_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "org"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webhook_endpoint_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "business_account"
            referencedColumns: ["id"]
          },
        ]
      }
      business_account: {
        Row: {
          id: number
          org_id: number
          user_id: string
          display_name?: string | null
        }
        Insert: {
          id: number
          org_id: number
          user_id: string
          display_name?: string | null
        }
        Update: {
          id: number
          org_id: number
          user_id: string
          display_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_account_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "org"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_account_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      char26_ulid: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      char26_ulid_to_uuid: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      get_org_for_authenticated_user: {
        Args: {
          oid: number
        }
        Returns: boolean
      }
      get_role_based_orgid_for_authenticated_user: {
        Args: {
          oid: number
        }
        Returns: string
      }
      json_to_uuid_ulid: {
        Args: {
          "": Json
        }
        Returns: unknown
      }
      parse_ulid: {
        Args: {
          ulid: string
        }
        Returns: string
      }
      text_ulid: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      text_ulid_to_uuid: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      ulid_to_uuid: {
        Args: {
          ulid: string
        }
        Returns: string
      }
      uuid_generate_v7: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_to_ulid: {
        Args: {
          id: string
        }
        Returns: string
      }
      uuid_ulid_eq_operator: {
        Args: {
          lhs_id: unknown
          rhs_id: string
        }
        Returns: boolean
      }
      uuid_ulid_to_json: {
        Args: {
          "": unknown
        }
        Returns: Json
      }
      list_api_keys: {
        Args: {
          id_of_user: string
        }
        Returns: []
      }
      create_api_key: {
        Args: {
          id_of_user: string
          key_description: string
        }
        Returns: string
      }
      get_api_key: {
        Args: {
          id_of_user: string
          secret_id: string
        }
        Returns: string
      }
      revoke_api_key: {
        Args: {
          id_of_user: string
          key_secret_id: string
        }
        Returns: object
      }
      security_confirm: {
        Args: {
          id_of_user: string
          email_user: string
          password_user: string
        }
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
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

