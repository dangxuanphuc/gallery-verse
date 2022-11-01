import { AnimatePresence, motion } from 'framer-motion'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { BlurhashCanvas } from 'react-blurhash'
import InfiniteScroll from 'react-infinite-scroll-component'
import Masonry from 'react-masonry-component'
import { DownloadSVG } from '../../assets/svg'
import ImageCard from '../../components/ImageCard'
import Topics from '../../components/Topics'
import useOnClickOutside from '../../components/useOnClickOutside'
import { IAPIResponse } from '../../types/ApiResponse'
import { IPhotoResponse } from '../../types/PhotoResponse'

const ImageDetail = ({
  currentImage,
  images,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const wrapper = useRef(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const [isDropDownActive, setIsDropDownActive] = useState(false)
  useOnClickOutside(dropdownRef, () => setIsDropDownActive(false))

  return (
    <>
      <Head>
        <title>Gallery Verse</title>
      </Head>
      <div className="image-page">
        {currentImage ? (
          <>
            <div className="image">
              <figure>
                <BlurhashCanvas
                  hash={currentImage.blur_hash || ''}
                  punch={1}
                  className="h-full w-full inset-0 absolute"
                  height={32}
                  width={32}
                />
                <Image
                  src={`${currentImage.urls.raw}&fm=webp&w=1500&fit=max&q=75`}
                  alt={currentImage.alt_description || 'Placeholder image'}
                  width={currentImage.width}
                  height={currentImage.height}
                  objectFit="cover"
                  unoptimized={true}
                />
                <p className="credits">
                  Photo by{' '}
                  <a
                    target="_blank"
                    rel="noreferrer noopener"
                    href={`${currentImage.user.links.html}?utm_source=gallery_verse&utm_medium=referral`}
                  >
                    {`${currentImage.user.first_name || null} ${
                      currentImage.user.last_name || null
                    }`}
                  </a>
                </p>
                <motion.div
                  initial={{ y: '-100%' }}
                  animate={{ y: '0%' }}
                  exit={{ y: '-130%' }}
                  className="dropdown"
                  onBlur={() => console.log('blur')}
                  ref={dropdownRef}
                >
                  <motion.button
                    onClick={() => setIsDropDownActive(!isDropDownActive)}
                    whileTap={{ scale: 0.9 }}
                  >
                    <DownloadSVG />
                  </motion.button>
                  <AnimatePresence>
                    {isDropDownActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          default: { type: 'spring' },
                          scale: { type: 'spring', stiffness: 350 },
                        }}
                      >
                        {[
                          { w: 640, name: 'Small' },
                          { w: 1920, name: 'Medium' },
                          { w: 2400, name: 'Large' },
                        ].map((imgSrc, index) => (
                          <a
                            target="_blank"
                            rel="noreferrer noopener"
                            href={`${currentImage.links.download}?force=true&w=${imgSrc.w}`}
                            key={`dl-${currentImage.id}-${index}`}
                            onClick={() => setIsDropDownActive(false)}
                          >
                            <span>{imgSrc.name}</span>{' '}
                            <span className="text-xs">
                              ({imgSrc.w}x
                              {Math.round(
                                currentImage.height / currentImage.width
                              ) * imgSrc.w}
                              )
                            </span>
                          </a>
                        ))}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`${currentImage.links.download}?force=true`}
                          onClick={() => setIsDropDownActive(false)}
                        >
                          <span className="mr-3">Original</span>{' '}
                          <span className="text-xs">
                            ({currentImage.width}x{currentImage.height})
                          </span>
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </figure>
            </div>

            <div className="w-full" ref={wrapper}>
              <h1 className="heading">Explore More</h1>
              <Topics
                items={currentImage.tags}
                wrapper={wrapper}
                asLink={true}
              />
              <div className="infinite-scroll-wrapper">
                <InfiniteScroll
                  dataLength={30}
                  next={() => null}
                  scrollThreshold={0.7}
                  hasMore={false}
                  loader={
                    <h1 className="loading-msg">
                      <Image
                        src="/loading.gif"
                        loading="eager"
                        width={32}
                        height={32}
                        alt="loading"
                      />
                    </h1>
                  }
                  className="infinite-scroll"
                >
                  {/* @ts-ignore:next-line */}
                  <Masonry
                    disableImagesLoaded={false}
                    updateOnEachImageLoad={false}
                    className="masonry"
                  >
                    {images?.map((image) => (
                      <ImageCard data={image} key={image.id} />
                    ))}
                  </Masonry>
                </InfiniteScroll>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  )
}

export const getServerSideProps = async ({
  query,
  res,
}: GetServerSidePropsContext) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=540, stale-while-revalidate=59'
  )

  const currentImage: IPhotoResponse[] = []

  await fetch(
    `https://api.unsplash.com/photos/${query?.id}?client_id=${process.env.NEXT_PUBLIC_API_KEY}`
  )
    .then((data) => data.json())
    .then((imgData: IPhotoResponse) => {
      currentImage.push(imgData)
    })
    .catch((err) => console.log(err))

  const images: IAPIResponse[] = []
  const queryTags = currentImage[0].tags.map((tag) => tag.title).join(',')

  await fetch(
    `https://api.unsplash.com/photos/random?query=${queryTags}&client_id=${process.env.NEXT_PUBLIC_API_KEY}&count=30`
  )
    .then((imgRes) => imgRes.json())
    .then((imgData: IAPIResponse[]) => {
      images.push(...imgData)
    })
    .catch((err) => console.log(err))

  if (currentImage.length === 0)
    return { props: { currentImage: null, images: null } }

  return { props: { currentImage: currentImage[0], images } }
}

export default ImageDetail
