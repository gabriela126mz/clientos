export interface Profile {
  id: string
  business_name: string
  owner_name: string
  trade: string
  phone: string
  email: string
  city: string
  address: string
  nif: string
  iban: string
  hero_image: string
  avatar_url: string
  slug: string
  plan: string
  created_at: string
}

export interface Client {
  id: string
  user_id: string
  name: string
  phone: string
  email: string
  address: string
  local: string | null
  tags: string
  notes: string
  estado: string
  avatar_url: string
  created_at: string

}

export interface Quote {
  id: string
  user_id: string
  client_id: string
  work_number: string
  number: string
  type: string
  status: string
  date: string
  notes: string
  is_external: boolean
  external_client: any
  created_at: string
  quote_lines?: QuoteLine[]
}

export interface QuoteLine {
  id: string
  quote_id: string
  line_number: string
  description: string
  detail: string
  quantity: number
  unit: string
  price: number
  tax: number
  total: number
}

export interface Appointment {
  id: string
  user_id: string
  client_id: string
  title: string
  date: string
  time: string
  notes: string
  created_at: string
}