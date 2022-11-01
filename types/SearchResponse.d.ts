export interface ISearchResponse {
  total: number
  total_pages: number
  results: Result[]
}

export interface Result {
  id: string
  created_at: Date
  updated_at: Date
  promoted_at: Date | null
  width: number
  height: number
  color: string
  blur_hash: string
  description: string | null
  alt_description: string
  urls: Urls
  links: ResultLinks
  categories: any[]
  likes: number
  liked_by_user: boolean
  current_user_collections: any[]
  sponsorship: null
  user: User
  tags: Tag[]
}

export interface ResultLinks {
  self: string
  html: string
  download: string
  download_location: string
}

export interface Tag {
  type: Type
  title: string
  source?: Source
}

export interface Source {
  ancestry: Ancestry
  title: string
  subtitle: string
  description: string
  meta_title: string
  meta_description: string
  cover_photo: CoverPhoto
}

export interface Ancestry {
  type: Category
  category: Category
  subcategory?: Category
}

export interface Category {
  slug: string
  pretty_slug: string
}

export interface CoverPhoto {
  id: string
  created_at: Date
  updated_at: Date
  promoted_at: Date | null
  width: number
  height: number
  color: string
  blur_hash: string
  description: string | null
  alt_description: string | null
  urls: Urls
  links: ResultLinks
  categories: any[]
  likes: number
  liked_by_user: boolean
  current_user_collections: any[]
  sponsorship: null
  user: User
}

export interface Urls {
  raw: string
  full: string
  regular: string
  small: string
  thumb: string
  small_s3: string
}

export interface User {
  id: string
  updated_at: Date
  username: string
  name: string
  first_name: string
  last_name: string | null
  twitter_username: string | null
  portfolio_url: string | null
  bio: string | null
  location: string | null
  links: UserLinks
  profile_image: ProfileImage
  instagram_username: string | null
  total_collections: number
  total_likes: number
  total_photos: number
  accepted_tos: boolean
  for_hire: boolean
  social?: Social | null
}

export interface UserLinks {
  self: string
  html: string
  photos: string
  likes: string
  portfolio: string
  following: string
  followers: string
}

export interface ProfileImage {
  small: string
  medium: string
  large: string
}

export interface Social {
  instagram_username: string | null
  portfolio_url: string | null
  twitter_username: string | null
  paypal_email: null
}

export enum Type {
  LandingPage = "landing_page",
  Search = "search"
}
