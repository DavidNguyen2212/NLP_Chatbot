import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import Fade from 'embla-carousel-fade'
import im1 from "../assets/im1.jpg"
import im2 from "../assets/im2.jpg"
import im3 from "../assets/im3.jpg"
import im4 from "../assets/im4.jpg"
import im5 from "../assets/im5.jpg"
import im6 from "../assets/im6.jpg"
import im7 from "../assets/im7.jpg"

import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'

type PropType = {
  slide_count: number
  options?: EmblaOptionsType
}

const images: string[] = [im1, im2, im3, im4, im5, im6, im7]

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slide_count, options } = props
  const required_images = images.slice(0, slide_count);
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Fade()])

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {required_images.map((img, index) => (
            <div className="embla__slide" key={index}>
              <img
                className="embla__slide__img"
                src={img}
                alt="Your alt text"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="embla__dots">
          {scrollSnaps.map((_: any, index: number) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={'embla__dot'.concat(
                index === selectedIndex ? ' embla__dot--selected' : ''
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default EmblaCarousel
