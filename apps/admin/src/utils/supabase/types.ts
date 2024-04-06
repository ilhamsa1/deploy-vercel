export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

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
            foreignKeyName: 'org_tier_fkey'
            columns: ['tier']
            isOneToOne: false
            referencedRelation: 'usage_tier'
            referencedColumns: ['id']
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
            foreignKeyName: 'fk_inviter_user'
            columns: ['created_by', 'org_id']
            isOneToOne: false
            referencedRelation: 'user_orgs'
            referencedColumns: ['user_id', 'org_id']
          },
          {
            foreignKeyName: 'org_invite_org_id_fkey'
            columns: ['org_id']
            isOneToOne: false
            referencedRelation: 'org'
            referencedColumns: ['id']
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
            foreignKeyName: 'fk_approved_by_user'
            columns: ['approved_by', 'org_id']
            isOneToOne: false
            referencedRelation: 'user_orgs'
            referencedColumns: ['user_id', 'org_id']
          },
          {
            foreignKeyName: 'fk_request_user'
            columns: ['user_id', 'org_id']
            isOneToOne: false
            referencedRelation: 'user_orgs'
            referencedColumns: ['user_id', 'org_id']
          },
          {
            foreignKeyName: 'org_join_request_org_id_fkey'
            columns: ['org_id']
            isOneToOne: false
            referencedRelation: 'org'
            referencedColumns: ['id']
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
            foreignKeyName: 'user_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
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
            foreignKeyName: 'user_orgs_org_id_fkey'
            columns: ['org_id']
            isOneToOne: false
            referencedRelation: 'org'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_orgs_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
            foreignKeyName: 'objects_bucketId_fkey'
            columns: ['bucket_id']
            isOneToOne: false
            referencedRelation: 'buckets'
            referencedColumns: ['id']
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

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never
