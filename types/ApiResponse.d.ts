export interface IAPIResponse {
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
  links: IAPIResponseLinks
  likes: number
  liked_by_user: boolean
  current_user_collections: any[]
  sponsorship: Sponsorship | null
  // topic_submissions: any
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

export interface IAPIResponseLinks {
  self: string
  html: string
  download: string
  download_location: string
}

export interface Sponsorship {
  impression_urls: any[]
  tagline: string
  tagline_url: string
  sponsor: User
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
  paypal_email: string | null
}
