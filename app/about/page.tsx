import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About Spice Grill & Bar: Authentic Punjabi Restaurant in Ash Fork",
  description: "Learn about the story of Spice Grill & Bar, an authentic Punjabi restaurant in Ash Fork, AZ, serving time-honored recipes and unique dishes.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 py-12">
      <h1 className="font-serif text-4xl text-center mb-12">About Spice Grill & Bar</h1>
      <h1 className="font-serif text-3xl text-center mb-12">Our Story</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div className="relative h-[400px]">
          <Image
            src="/placeholder.svg?height=400&width=600"
            alt="Restaurant interior"
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div>
          <p className="text-gray-600 mb-4">
            Welcome to Spice Grill & Bar, your destination for authentic Punjabi cuisine in Ash Fork. Established
            in 2024, we have been serving authentic Punjabi cuisine made with the finest ingredients and time-honored
            recipes passed down through generations.
          </p>
          <p className="text-gray-600">
            Our chefs bring decades of experience from various regions of India, ensuring that each dish captures the
            essence of authentic Punjabi cooking while adding their own creative touch to present a unique dining
            experience.
          </p>        
          <p className="text-gray-600">
            Our head chef, has over 10 years of experience crafting authentic Punjabi dishes. He&apos;s passionate about sharing the flavors of our heritage with the community.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 py-12">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="font-serif text-xl mb-4">Our Mission</h2>
            <p className="text-gray-600">
              To serve authentic Punjabi Indian cuisine while providing an exceptional dining experience that celebrates the
              rich culinary heritage of Punjab.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="font-serif text-xl mb-4">Our Vision</h2>
            <p className="text-gray-600">
              To be the premier destination in Ash Fork for Punjabi cuisine, known for our exceptional food, warm hospitality, and
              inviting atmosphere.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="font-serif text-xl mb-4">Our Values</h2>
            <p className="text-gray-600">
              Quality, authenticity, and customer satisfaction are at the heart of everything we do at our Indian Restaurant, from ingredient
              selection to service delivery.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* <div className="text-center">
        <h2 className="font-serif text-3xl mb-8">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((member) => (
            <Card key={member}>
              <CardContent className="p-6">
                <div className="relative h-48 w-48 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={`/placeholder.svg?height=200&width=200`}
                    alt={`Team member ${member}`}
                    fill
                    className="object-cover"
                  />
                </div>                
                <h2 className="font-serif text-xl mb-2">Chef Name</h2>
                <p className="text-gray-600">Master Chef</p>
              </CardContent>
            </Card>
          ))}
        </div>
      <div className='mt-8 flex justify-center'>
        <Button asChild size="lg" className="bg-brand-orange hover:bg-brand-orange/90 text-lg sm:text-lg">
          <Link href="/menu">View Our Menu</Link>
        </Button>
      </div>
      </div> */}
    </div>
  )
}

