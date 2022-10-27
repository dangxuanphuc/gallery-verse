import type { InferGetStaticPropsType } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { BlurhashCanvas } from 'react-blurhash'
import Topics from '../components/Topics'
import type { IAPIResponse } from '../types/ApiResponse'
import { ITopicsResponse } from '../types/TopicsResponse'

type HomeProps = InferGetStaticPropsType<typeof getStaticProps> & {}

const SearchSVG = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
)

const Home = ({ images, topics, imgOfTheDay }: HomeProps) => {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')
  const catagoriesWrapper = useRef(null)

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (searchValue.length > 0) {
      router.push(`/search/${searchValue.split(' ').join('-')}`)
    }
  }

  useEffect(() => {
    if (router.isReady && router.asPath.includes('/search')) {
      const searchParams = router.asPath
        .replace('/search/', '')
        .split('-')
        .join(' ')
      setSearchValue(searchParams)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="home" ref={catagoriesWrapper}>
      {images ? (
        <>
          <div className="random-img">
            {imgOfTheDay && (
              <>
                <BlurhashCanvas
                  hash={imgOfTheDay.blur_hash}
                  punch={1}
                  height={32}
                  width={32}
                ></BlurhashCanvas>
                <Image
                  src={`${imgOfTheDay.urls.raw}&w=1500&fm=webp&q=75`}
                  alt={imgOfTheDay.alt_description || 'Image of the day'}
                  unoptimized={true}
                  layout="fill"
                  objectFit="cover"
                />
                <div className="form-wrapper">
                  <h1>Gallery Verse</h1>
                  <p>
                    A photo search app powered by{' '}
                    <a
                      target="_blank"
                      rel="noreferrer noopener"
                      href="https://unsplash.com/?utm_source=gallery_verse&utm_medium=referral"
                    >
                      Unsplash API
                    </a>
                  </p>
                  <form onSubmit={handleFormSubmit} className="form">
                    <input
                      type="text"
                      id="search"
                      name="search"
                      placeholder="Search anything..."
                      autoComplete="off"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <button type="submit">
                      <SearchSVG />
                    </button>
                  </form>
                </div>
                <div className="credits">
                  Photo by{' '}
                  <a
                    target="_blank"
                    rel="noreferrer noopener"
                    href={`${imgOfTheDay.user.links.html}?utm_source=gallery_verse&utm_medium=referral`}
                  >
                    {`${imgOfTheDay.user.first_name} ${imgOfTheDay.user.last_name}`}
                  </a>
                </div>
              </>
            )}
          </div>

          <Topics items={topics} wrapper={catagoriesWrapper} />
        </>
      ) : (
        <>
          <div className="error">
            <h1>API Limited exceed</h1>
            <h1>Sorry Unsplash has some API limitations</h1>
            <h1>Try again after an hour</h1>
            <h1>API access limit is 50 requests per hour</h1>
          </div>
        </>
      )}
    </div>
  )
}

export const getStaticProps = async () => {
  const images: IAPIResponse[] = []
  await fetch(
    `https://api.unsplash.com/photos/?client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=30&order_by=popular`
  )
    .then((data) => data.json())
    .then((imgData: IAPIResponse[]) => {
      images.push(...imgData)
    })
    .catch((error) => console.log(error))

  const topics: ITopicsResponse[] = []
  await fetch(
    `https://api.unsplash.com/topics/?client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=20`
  )
    .then((data) => data.json())
    .then((topicsData) => topics.push(...topicsData))
    .catch((error) => console.log(error))

  let imgOfTheDay: IAPIResponse | null = null
  await fetch(
    `https://api.unsplash.com/photos/random/?client_id=${process.env.NEXT_PUBLIC_API_KEY}`
  )
    .then((data) => data.json())
    .then((imgData: IAPIResponse) => (imgOfTheDay = imgData))
    .catch((error) => console.log(error))

  if (images.length === 0) {
    return { props: { images: null, topics: null, imgOfTheDay: null } }
  }

  return {
    props: { images, topics, imgOfTheDay: imgOfTheDay as IAPIResponse | null },
    revalidate: 10 * 60,
  }
}

export default Home
