export interface ITopicsResponse {
  id?: string
  slug?: string
  title?: string
  description?: string
  published_at?: Date
  updated_at?: Date
  starts_at?: Date
  ends_at?: Date | null
  promoted_at: string | null
  only_submissions_after?: null
  visibility?: string
  featured?: boolean
  total_photos?: number
  current_user_contributions?: any[]
  total_current_user_submissions?: number | null
  links?: ITopicsResponseLinks
  status?: Status
  owners?: User[]
  cover_photo?: CoverPhoto
  preview_photos?: PreviewPhoto[]
}

export interface ITopicsResponseLinks {
  self: string
  html: string
  photos: string
}

export interface User {
  id: string
  updated_at: Date
  username: string
  name: string
  first_name: string
  last_name: string | null
  twitter_username: string
  portfolio_url: string
  bio: string
  location: string
  links: UserLinks
  profile_image: ProfileImage
  instagram_username: string
  total_collections: number
  total_likes: number
  total_photos: number
  accepted_tos: boolean
  for_hire: boolean
  social: Social
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
  instagram_username: string
  portfolio_url: string
  twitter_user: string
  paypal_email: string | null
}

export interface CoverPhoto {
  id: string
  created_at: Date
  updated_at: Date
  promoted_at: Date | null
  width: number
  height: number
  color: string
  blur_hash: string | null
  description: string | null
  alt_description: string | null
  urls: Urls
  links: CoverPhotoLinks
  likes: number
  liked_by_user: boolean
  current_user_collections: any[]
  sponsorship: null
  topic_submissions: any
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

export interface CoverPhotoLinks {
  self: string
  html: string
  download: string
  download_location: string
}

export interface PreviewPhoto {
  id: string
  created_at: Date
  updated_at: Date
  blur_hash: string | null
  urls: Urls
}

export enum Status {
  Open = "open"
}
