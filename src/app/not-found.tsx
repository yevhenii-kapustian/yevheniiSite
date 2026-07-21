import { babes } from "./fonts"
import Button from "@/components/Button"

export default function NotFound() {
  return (
    <section className="h-full pt-10 px-3 flex flex-col items-center justify-center gap-4">
        <h1 className={`${babes.className} text-4xl sm:text-5xl text-center`}>Page not found</h1>
        <p className="text-center text-sm sm:text-base text-ink-strong/70">But that doesn't mean we can't help you find what you're looking for!</p>
        <Button href="/" variant="solid" className="mt-2">Back to home</Button>
    </section>
  );
}