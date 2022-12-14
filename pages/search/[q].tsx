import { InferGetServerSidePropsType, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Masonry from 'react-masonry-component'
import ImageCard from '../../components/ImageCard'
import Topics from '../../components/Topics'
import { ISearchResponse } from '../../types/SearchResponse'

const Search = ({
  images,
  topics,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const categoriesWrapper = useRef(null)
  const [page, setPage] = useState(2)
  const router = useRouter()

  const fetchNextData = () => {
    fetch(
      `https://api.unsplash.com/search/photos?query=${router.query.q}&client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=24&order_by=popular&page=${page}`
    )
      .then((data) => data.json())
      .then((imgData: ISearchResponse) => {
        images?.results?.push(...imgData.results)
        setPage(page + 1)
      })
      .catch((err) => console.log(err))
  }

  return (
    <>
      <Head>
        <title>
          {(router.query.q as string).split('-').join(' ')} | Gallery Verse
        </title>
      </Head>
      <div className="search" ref={categoriesWrapper}>
        {images ? (
          <>
            <div className="heading">
              <p>
                Search result for:{' '}
                <b>{(router.query.q as string).split('-').join(' ')}</b>
              </p>
            </div>

            {/* @ts-ignore:next-line */}
            <Topics asLink items={topics} wrapper={categoriesWrapper} />

            <div className="infinite-scroll-wrapper">
              <InfiniteScroll
                dataLength={images.results.length}
                next={fetchNextData}
                scrollThreshold={0.7}
                hasMore={images.total_pages >= page}
                loader={
                  <h1 className="loading-msg">
                    <Image
                      src="/loading.gif"
                      loading="eager"
                      width={32}
                      height={32}
                      alt="1"
                    />
                    <span className="ml-2">Loading</span>
                  </h1>
                }
                className="infinite-scroll"
                endMessage={
                  <h1 className="end-msg">
                    We don&rsquo;t have more images to show
                  </h1>
                }
              >
                {/* @ts-ignore:next-line */}
                <Masonry
                  disableImagesLoaded={false}
                  updateOnEachImageLoad={false}
                  className="masonry"
                >
                  {images?.results?.map((image) => (
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
    </>
  )
}

export const getServerSideProps = async ({
  params,
  res,
}: GetServerSidePropsContext) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=540, stale-while-revalidate=59'
  )

  let images: ISearchResponse = { total: 0, total_pages: 0, results: [] }
  const query = (params!.q as string).split('-').join(' ')

  await fetch(
    `https://api.unsplash.com/search/photos?query=${query}&client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=15&order_by=popular`
  )
    .then((imgRes) => imgRes.json())
    .then((imgRes: ISearchResponse) => {
      images = imgRes
    })
    .catch((err) => console.log(err))

  let topics: {
    id: string
    title: string
  }[] = []

  images.results.map((img) =>
    img.tags.map((tag) =>
      topics.push({ id: `${img.id}-${tag.title}`, title: tag.title })
    )
  )

  topics = [...new Map(topics.map((item) => [item['title'], item])).values()]

  if (!images) return { props: { images: null, topics } }

  return { props: { images, topics } }
}

export default Search
