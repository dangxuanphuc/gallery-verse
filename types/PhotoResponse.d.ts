export interface IPhotoResponse {
  id: string
  created_at: Date
  updated_at: Date
  promoted_at: Date | null
  width: number
  height: number
  color: string
  blur_hash?: string
  description: string
  alt_description: string
  urls: Urls
  links: ITopicsResponseLinks
  categories: any[]
  likes: number
  liked_by_user: boolean
  current_user_collections: any[]
  sponsorship: null
  user: User
  exif: Exif
  location: Location
  meta: Meta
  tags: Tag[]
  tags_preview: TagsPreview[]
  related_collections: RelatedCollections
  views: number
  downloads: number
  topics: any[]
}

export interface Exif {
  make: string
  model: string
  exposure_time: string
  aperture: string
  focal_length: string
  iso: number
}

export interface ITopicsResponseLinks {
  self: string
  html: string
  download: string
  download_location: string
}

export interface Location {
  title: string
  name: string
  city: string
  country: string
  position: Position
}

export interface Position {
  latitude: number
  longitude: number
}

export interface Meta {
  index: boolean
}

export interface RelatedCollections {
  total: number
  type: string
  results: Result[]
}

export interface Result {
  id: string
  title: string
  description: null
  blur_hash: string
  description: string
  alt_description: string
  width: number
  height: number
  published_at: Date
  last_collected_at: Date
  updated_at: Date
  curated: boolean
  featured: boolean
  total_photos: number
  private: boolean
  share_key: string
  tags: Tag[]
  links: ResultLinks
  user: User
  urls: Urls
  cover_photo: ResultCoverPhoto
  preview_photos: PreviewPhoto[]
}

export interface ResultCoverPhoto {
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
  links: ITopicsResponseLinks
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

export interface ResultLinks {
  self: string
  html: string
  photos: string
  related: string
  download: string
}

export interface PreviewPhoto {
  id: string
  created_at: Date
  updated_at: Date
  blur_hash: string
  urls: Urls
}

export interface Tag {
  type: Type
  title: string
  source?: TagSource
}

export interface TagSource {
  ancestry: Ancestry
  title: string
  subtitle: string
  description: string
  meta_title: string
  meta_description: string
  cover_photo: ResultCoverPhoto
}

export interface Ancestry {
  type: Category
  category?: Category
  subcategory?: Category
}

export interface Category {
  slug: string
  pretty_slug: string
}

export enum Type {
  LandingPage = "landing_page",
  Search = "search"
}

export interface TagsPreview {
  type: Type
  title: string
  source?: TagsPreviewSource
}

export interface TagsPreviewSource {
  ancestry: Ancestry
  title: string
  subtitle: string
  description: string
  meta_title: string
  meta_description: string
  cover_photo: PurpleCoverPhoto
}

export interface PurpleCoverPhoto {
  id: string
  created_at: Date
  updated_at: Date
  promoted_at: Date | null
  width: number
  height: number
  color: string
  blur_hash: string
  description: string
  alt_description: string
  urls: Urls
  links: ITopicsResponseLinks
  categories: any[]
  likes: number
  liked_by_user: boolean
  current_user_collections: any[]
  sponsorship: null
  user: User
}
