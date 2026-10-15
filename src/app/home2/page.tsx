'use client'

import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import CharacterEdgeFilter, { characterEdgeStyle } from "./CharacterEdgeFilter"

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger)
}

type Pose = {
    x: number
    y: number
    scale: number
}

const sections = [
    {
        video: "/images/home/alpha/1.webm",
        pose: { x: 0, y: -8, scale: 0.98 },
    },
    {
        video: "/images/home/alpha/2.webm",
        pose: { x: -18, y: -8, scale: 1 },
    },
    {
        video: "/images/home/alpha/3.webm",
        pose: { x: 18, y: -10, scale: 1.02 },
    },
    {
        video: "/images/home/alpha/4.webm",
        pose: { x: 0, y: -10, scale: 1.04 },
    },
]

const VIDEO_FRAME_SIZE = 1440
const MAX_CHARACTER_SCALE = Math.max(...sections.map(({ pose }) => pose.scale))

const setVideoTime = (video: HTMLVideoElement | null | undefined, progress: number) => {
    if (!video || !Number.isFinite(video.duration)) return

    const targetTime = progress >= 0.998
        ? video.duration
        : Math.max(0, video.duration * progress)

    if (Math.abs(video.currentTime - targetTime) > 0.015) {
        video.currentTime = targetTime
    }
}

const setCharacterPose = (character: HTMLDivElement, from: Pose, to: Pose, progress: number) => {
    gsap.set(character, {
        x: gsap.utils.interpolate(from.x, to.x, progress),
        y: gsap.utils.interpolate(from.y, to.y, progress),
        scale: gsap.utils.interpolate(from.scale, to.scale, progress),
        force3D: false,
    })
}

export default function Home2() {
    const pageRef = useRef<HTMLDivElement>(null)
    const characterRef = useRef<HTMLDivElement>(null)
    const finalFrameRef = useRef<HTMLImageElement>(null)
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

    useLayoutEffect(() => {
        const page = pageRef.current
        const character = characterRef.current
        if (!page || !character) return

        document.body.classList.add("home2-clean-page")

        // Keep even the largest pose within the video's native resolution on Retina screens.
        const updateCharacterSize = () => {
            const pixelRatio = Math.max(1, window.devicePixelRatio || 1)
            character.style.setProperty(
                "--character-size-limit",
                `${VIDEO_FRAME_SIZE / (pixelRatio * MAX_CHARACTER_SCALE)}px`,
            )
        }
        updateCharacterSize()
        window.addEventListener("resize", updateCharacterSize)

        const ctx = gsap.context(() => {
            gsap.set(character, {
                x: sections[0].pose.x,
                y: sections[0].pose.y,
                scale: sections[0].pose.scale,
                force3D: false,
            })

            gsap.set(videoRefs.current, { opacity: 0 })
            gsap.set(videoRefs.current[0], { opacity: 1 })
            gsap.set(finalFrameRef.current, { opacity: 0 })

            sections.forEach((section, index) => {
                const node = page.querySelector<HTMLElement>(`[data-home2-section="${index}"]`)
                if (!node) return

                ScrollTrigger.create({
                    trigger: node,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                    onUpdate: (self) => {
                        setVideoTime(videoRefs.current[index], self.progress)

                        if (index === sections.length - 1) {
                            const finalProgress = gsap.utils.clamp(0, 1, (self.progress - 0.88) / 0.08)

                            gsap.set(videoRefs.current[index], { opacity: 1 - finalProgress })
                            gsap.set(finalFrameRef.current, { opacity: finalProgress })
                        }
                    },
                })

                if (index > 0) {
                    const previousPose = sections[index - 1].pose
                    const previousVideoIndex = index - 1

                    ScrollTrigger.create({
                        trigger: node,
                        start: "top 12%",
                        end: "top top",
                        scrub: true,
                        onUpdate: (self) => {
                            gsap.set(videoRefs.current[previousVideoIndex], { opacity: 1 - self.progress })
                            gsap.set(videoRefs.current[index], { opacity: self.progress })
                        },
                        onLeave: () => {
                            gsap.set(videoRefs.current[previousVideoIndex], { opacity: 0 })
                            gsap.set(videoRefs.current[index], { opacity: 1 })
                        },
                        onLeaveBack: () => {
                            gsap.set(videoRefs.current[previousVideoIndex], { opacity: 1 })
                            gsap.set(videoRefs.current[index], { opacity: 0 })
                        },
                    })

                    ScrollTrigger.create({
                        trigger: node,
                        start: "top top",
                        end: "bottom top",
                        scrub: true,
                        onUpdate: (self) => {
                            setCharacterPose(character, previousPose, section.pose, self.progress)
                        },
                        onEnter: () => {
                            setCharacterPose(character, previousPose, section.pose, 0)
                        },
                        onLeave: () => {
                            setCharacterPose(character, previousPose, section.pose, 1)
                        },
                        onEnterBack: () => {
                            setCharacterPose(character, previousPose, section.pose, 1)
                        },
                        onLeaveBack: () => {
                            setCharacterPose(character, previousPose, section.pose, 0)
                        },
                    })
                }
            })
        }, page)

        return () => {
            window.removeEventListener("resize", updateCharacterSize)
            ctx.revert()
            document.body.classList.remove("home2-clean-page")
        }
    }, [])

    return (
        <div ref={pageRef} className="relative overflow-hidden bg-white">
            <CharacterEdgeFilter />
            <div data-home2-fixed className="pointer-events-none fixed inset-x-0 top-0 bottom-[-8rem] z-20 flex items-center justify-center sm:bottom-[-9rem]" aria-hidden="true">
                <div
                    ref={characterRef}
                    className="relative h-[min(100%,100vw,var(--character-size-limit,1440px))] w-[min(100%,100vw,var(--character-size-limit,1440px))]"
                >
                    {sections.map((section, index) => (
                        <video
                            key={section.video}
                            ref={(node) => {
                                videoRefs.current[index] = node
                            }}
                            className="absolute inset-0 h-full w-full object-contain opacity-0 first:opacity-100"
                            style={characterEdgeStyle}
                            src={section.video}
                            width={VIDEO_FRAME_SIZE}
                            height={VIDEO_FRAME_SIZE}
                            preload="auto"
                            muted
                            playsInline
                            onLoadedMetadata={(event) => {
                                event.currentTarget.pause()
                                event.currentTarget.currentTime = 0
                                ScrollTrigger.refresh()
                            }}
                        />
                    ))}
                    <img
                        ref={finalFrameRef}
                        className="absolute inset-0 h-full w-full object-contain opacity-0"
                        style={characterEdgeStyle}
                        src="/images/home/alpha/4-final.png"
                        width={1692}
                        height={1692}
                        alt=""
                        aria-hidden="true"
                        loading="eager"
                    />
                </div>
            </div>

            {sections.map((section, index) => (
                <section
                    key={section.video}
                    id={`home2-section-${index + 1}`}
                    data-home2-section={index}
                    className="relative min-h-[220svh] bg-white"
                />
            ))}
            <div className="h-screen bg-white" aria-hidden="true" />
        </div>
    )
}
