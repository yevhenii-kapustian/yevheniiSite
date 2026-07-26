'use client'

import { Suspense, useEffect, useLayoutEffect, useRef, type RefObject } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useGLTF, Center, OrbitControls, Bounds, useBounds } from "@react-three/drei"
import * as THREE from "three"
import type { Gender } from "@/utils/bodyGoal"

const MODEL_PATHS: Record<Gender, string> = {
    male: "/models/transform/body-male.glb",
    female: "/models/transform/body-female.glb",
}

type BodyModelProps = {
    sliderValue: number
    gender: Gender
    hasIntroPlayedRef: RefObject<boolean>
}

const BodyModel = ({ sliderValue, gender, hasIntroPlayedRef }: BodyModelProps) => {
    const { scene } = useGLTF(MODEL_PATHS[gender])
    const bounds = useBounds()
    const size = useThree(state => state.size)
    const targetInfluences = useRef({ average: 0, bulky: 0 })
    const morphKeysRef = useRef<{ average?: string; bulky?: string }>({})
    const groupRef = useRef<THREE.Group>(null)
    const wireframeMeshRef = useRef<THREE.Mesh | null>(null)
    const introStart = useRef<number | null>(null)

    useEffect(() => {
        const meshesWithMorphTargets: THREE.Mesh[] = []
        scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.morphTargetInfluences) {
                meshesWithMorphTargets.push(child)
            }
        })
        const mainMesh = meshesWithMorphTargets[0]
        if (!mainMesh) return

        const dict = mainMesh.morphTargetDictionary ?? {}
        const keys = Object.keys(dict)
        morphKeysRef.current = {
            average: keys.find(key => key.toLowerCase().includes("average")),
            bulky: keys.find(key => key.toLowerCase().includes("bulky")),
        }

        const wireMaterial = new THREE.MeshBasicMaterial({
            color: "#1a1a1a",
            wireframe: true,
            transparent: true,
            opacity: 1,
            depthWrite: false,
        })
        const wireMesh = new THREE.Mesh(mainMesh.geometry, wireMaterial)
        wireMesh.morphTargetDictionary = mainMesh.morphTargetDictionary
        wireMesh.morphTargetInfluences = mainMesh.morphTargetInfluences
        wireMesh.position.copy(mainMesh.position)
        wireMesh.rotation.copy(mainMesh.rotation)
        wireMesh.scale.copy(mainMesh.scale)
        mainMesh.parent?.add(wireMesh)
        wireframeMeshRef.current = wireMesh

        return () => {
            wireMesh.parent?.remove(wireMesh)
            wireMaterial.dispose()
        }
    }, [scene])

    useLayoutEffect(() => {
        const group = groupRef.current
        if (!group) {
            bounds.refresh().reset().fit()
            return
        }

        const liveScale = group.scale.x
        group.scale.setScalar(1)
        bounds.refresh().reset().fit()
        group.scale.setScalar(liveScale)
    }, [scene, bounds, size.width, size.height])

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

    useFrame((state, delta) => {
        if (introStart.current === null) introStart.current = state.clock.elapsedTime
        const elapsed = state.clock.elapsedTime - introStart.current
        const progress = hasIntroPlayedRef.current ? 1 : Math.min(elapsed / 1.6, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        if (progress >= 1) hasIntroPlayedRef.current = true

        if (groupRef.current) {
            groupRef.current.scale.setScalar(THREE.MathUtils.lerp(0.05, 1, eased))
        }
        if (wireframeMeshRef.current) {
            const wireMaterial = wireframeMeshRef.current.material as THREE.MeshBasicMaterial
            wireMaterial.opacity = THREE.MathUtils.lerp(1, 0, eased)
            wireframeMeshRef.current.visible = progress < 1
        }

        const lerpSpeed = 1 - Math.pow(0.001, delta)
        const { average: averageKey, bulky: bulkyKey } = morphKeysRef.current

        scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.morphTargetDictionary && child.morphTargetInfluences) {
                const dict = child.morphTargetDictionary
                const influences = child.morphTargetInfluences

                if (averageKey && dict[averageKey] !== undefined) {
                    const idx = dict[averageKey]
                    influences[idx] = THREE.MathUtils.lerp(influences[idx], targetInfluences.current.average, lerpSpeed)
                }
                if (bulkyKey && dict[bulkyKey] !== undefined) {
                    const idx = dict[bulkyKey]
                    influences[idx] = THREE.MathUtils.lerp(influences[idx], targetInfluences.current.bulky, lerpSpeed)
                }
            }
        })
    })

    return (
        <group ref={groupRef}>
            <Center>
                <primitive object={scene} />
            </Center>
        </group>
    )
}

useGLTF.preload(MODEL_PATHS.male)
useGLTF.preload(MODEL_PATHS.female)

const BodyAvatar = ({ sliderValue, gender }: Omit<BodyModelProps, "hasIntroPlayedRef">) => {
    const hasIntroPlayedRef = useRef(false)

    return (
        <Canvas camera={{ fov: 35 }} dpr={[1, 2]}>
            <ambientLight intensity={0.85} />
            <directionalLight position={[3, 5, 2]} intensity={1.3} />
            <directionalLight position={[-3, 2, -2]} intensity={0.4} />
            <directionalLight position={[0, -2, 3]} intensity={0.2} />
            <pointLight position={[-2.5, 2, -2.5]} intensity={4} color="#ffffff" />
            <Suspense fallback={null}>
                <Bounds fit clip margin={0.9} maxDuration={0.001}>
                    <BodyModel sliderValue={sliderValue} gender={gender} hasIntroPlayedRef={hasIntroPlayedRef} />
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
