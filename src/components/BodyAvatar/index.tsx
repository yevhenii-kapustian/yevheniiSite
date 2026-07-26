'use client'

import { Suspense, useEffect, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF, Center, OrbitControls, Bounds } from "@react-three/drei"
import * as THREE from "three"

type BodyModelProps = {
    sliderValue: number
}

const BodyModel = ({ sliderValue }: BodyModelProps) => {
    const { scene } = useGLTF("/models/body.glb")
    const targetInfluences = useRef({ average: 0, bulky: 0 })

    useEffect(() => {
        const t = sliderValue / 100
        if (t <= 0.5) {
            const local = t / 0.5
            targetInfluences.current = { average: local, bulky: 0 }
        } else {
            const local = (t - 0.5) / 0.5
            targetInfluences.current = { average: 1 - local, bulky: local }
        }
    }, [sliderValue])

    useFrame((_, delta) => {
        const lerpSpeed = 1 - Math.pow(0.001, delta)

        scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.morphTargetDictionary && child.morphTargetInfluences) {
                const dict = child.morphTargetDictionary
                const influences = child.morphTargetInfluences

                if (dict.average !== undefined) {
                    influences[dict.average] = THREE.MathUtils.lerp(influences[dict.average], targetInfluences.current.average, lerpSpeed)
                }
                if (dict.bulky !== undefined) {
                    influences[dict.bulky] = THREE.MathUtils.lerp(influences[dict.bulky], targetInfluences.current.bulky, lerpSpeed)
                }
            }
        })
    })

    return (
        <Center>
            <primitive object={scene} />
        </Center>
    )
}

useGLTF.preload("/models/body.glb")

const BodyAvatar = ({ sliderValue }: BodyModelProps) => {
    return (
        <Canvas camera={{ fov: 35 }} dpr={[1, 2]}>
            <ambientLight intensity={0.9} />
            <directionalLight position={[3, 5, 2]} intensity={1.6} />
            <directionalLight position={[-3, 2, -2]} intensity={0.6} />
            <directionalLight position={[0, -2, 3]} intensity={0.3} />
            <Suspense fallback={null}>
                <Bounds fit clip observe margin={0.9}>
                    <BodyModel sliderValue={sliderValue} />
                </Bounds>
            </Suspense>
            <OrbitControls
                autoRotate
                autoRotateSpeed={1.2}
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 2.5}
                maxPolarAngle={Math.PI / 1.8}
            />
        </Canvas>
    )
}

export default BodyAvatar
