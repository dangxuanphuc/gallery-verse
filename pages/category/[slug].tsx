import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { BlurhashCanvas } from 'react-blurhash'
import InfiniteScroll from 'react-infinite-scroll-component'
import Masonry from 'react-masonry-component'
import ImageCard from '../../components/ImageCard'
import Topics from '../../components/Topics'
import { IAPIResponse } from '../../types/ApiResponse'
import {
  ICurrentTopicResponse,
  ITopicsResponse,
} from '../../types/TopicsResponse'

type CategorySlugProps = InferGetStaticPropsType<typeof getStaticProps>

const CategorySlug = ({ images, topics, currentTopic }: CategorySlugProps) => {
  const router = useRouter()
  const [page, setPage] = useState(3)
  const categoriesWrapper = useRef(null)

  const fetchNextData = () => {
    fetch(
      `https://api.unsplash.com/topics/${router?.query?.slug}/photos/?client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=15&page=${page}&order_by=popular`
    )
      .then((data) => data.json())
      .then((imgData: IAPIResponse[]) => {
        ;(images as IAPIResponse[])?.push(...imgData)
        setPage(page + 1)
      })
      .catch((err) => console.log(err))
  }

  return (
    <div className="category" ref={categoriesWrapper}>
      {router.isFallback && <h1>Loading...</h1>}
      {images.length !== 0 ? (
        <>
          <div className="random-img">
            {currentTopic && (
              <>
                <BlurhashCanvas
                  hash={currentTopic.cover_photo.blur_hash!}
                  punch={1}
                  height={32}
                  width={32}
                />
                <Image
                  src={`${
                    currentTopic.cover_photo.urls!.raw
                  }&w=1500&fm=webp&q=75`}
                  alt={
                    currentTopic.cover_photo.alt_description ||
                    'Image of the day'
                  }
                  unoptimized={true}
                  layout="fill"
                  objectFit="cover"
                />
                <div className="category-info">
                  <h1>{currentTopic.title}</h1>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: currentTopic.description,
                    }}
                  />
                </div>
                <div className="credits">
                  Photo by{' '}
                  <a
                    target="_blank"
                    rel="noreferrer noopener"
                    href={`${
                      currentTopic.cover_photo.user!.links!.html
                    }&utm_source=gallery_verse&utm_medium=referral`}
                  >
                    {`${currentTopic.cover_photo.user!.first_name || null} ${
                      currentTopic.cover_photo.user!.last_name || null
                    }`}
                  </a>
                </div>
              </>
            )}
          </div>
          <Topics items={topics} wrapper={categoriesWrapper} />
          <div className="infinite-scroll-wrapper">
            <InfiniteScroll
              dataLength={images.length}
              next={fetchNextData}
              scrollThreshold={0.7}
              hasMore={true}
              loader={
                <h1 className="loading-msg">
                  <Image
                    src="/loading.gif"
                    loading="eager"
                    width={32}
                    height={32}
                    alt="Loading"
                  />
                  <span className="ml-2">Loading</span>
                </h1>
              }
              className="infinite-scroll"
              endMessage={
                <h1 className="end-msg">
                  We don&quot;t have more images to show
                </h1>
              }
            >
              <Masonry
                disableImagesLoaded={false}
                updateOnEachImageLoad={false}
                className="masonry"
              >
                {images?.map((image) => (
                  <ImageCard key={image.id} data={image} />
                ))}
              </Masonry>
            </InfiniteScroll>
          </div>
        </>
      ) : (
        <div className="error">
          <h1>API Limited exceed</h1>
          <h1>Sorry Unsplash has some API limitations</h1>
          <h1>Try again after an hour</h1>
          <h1>API access limit is 50 requests per hour</h1>
        </div>
      )}
    </div>
  )
}

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  type ErrorResponse = { errors: string }

  let images: IAPIResponse[] = []

  await fetch(
    `https://api.unsplash.com/topics/${params?.slug}/photos/?client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=30&order_by=popular`
  )
    .then((imgRes) => imgRes.json())
    .then((imgData: IAPIResponse[] | ErrorResponse) => {
      if ((imgData as ErrorResponse).errors) return (images = [])
      images = imgData as IAPIResponse[]
    })
    .catch((err) => console.log(err))

  let topics: ITopicsResponse[] = []

  await fetch(
    `https://api.unsplash.com/topics/?client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=20`
  )
    .then((topicRes) => topicRes.json())
    .then((topicRes: ITopicsResponse[] | ErrorResponse) => {
      if ((topicRes as ErrorResponse).errors) return (topicRes = [])
      topics.push(...(topicRes as ITopicsResponse[]))
    })
    .catch((err) => console.log(err))

  let currentTopic: ICurrentTopicResponse[] = []

  await fetch(
    `https://api.unsplash.com/topics/${params?.slug}?client_id=${process.env.NEXT_PUBLIC_API_KEY}`
  )
    .then((data) => data.json())
    .then((currentTopicData: ICurrentTopicResponse | ErrorResponse) => {
      if ((currentTopicData as ErrorResponse).errors) return (currentTopic = [])
      currentTopic.push(currentTopicData as ICurrentTopicResponse)
    })
    .catch((err) => console.log(err))

  if (images === null) return { props: { images: [], topics, notFound: true } }

  return {
    props: { images, topics, currentTopic: currentTopic[0] },
    revalidate: 10 * 60,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  let topics: ITopicsResponse[] = await fetch(
    `https://api.unsplash.com/topics/?client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=35`
  )
    .then((data) => data.json())
    .catch((err) => console.log(err))

  const topicPaths = topics.map(({ slug }) => ({
    params: { slug },
  }))

  return { paths: topicPaths, fallback: false }
}

export default CategorySlug
