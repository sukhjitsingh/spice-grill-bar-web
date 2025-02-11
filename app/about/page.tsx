import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="font-serif text-4xl text-center mb-12">About Us</h1>

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
          <h2 className="font-serif text-3xl mb-6">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Welcome to Spice Grill & Bar, where traditional Punjabi flavors meet modern culinary excellence. Established
            in 2024, we have been serving authentic Punjabi cuisine made with the finest ingredients and time-honored
            recipes passed down through generations.
          </p>
          <p className="text-gray-600">
            Our chefs bring decades of experience from various regions of India, ensuring that each dish captures the
            essence of authentic Punjabi cooking while adding their own creative touch to present a unique dining
            experience.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="font-serif text-xl mb-4">Our Mission</h3>
            <p className="text-gray-600">
              To serve authentic Indian cuisine while providing an exceptional dining experience that celebrates the
              rich culinary heritage of India.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="font-serif text-xl mb-4">Our Vision</h3>
            <p className="text-gray-600">
              To be the premier destination for Indian cuisine, known for our exceptional food, warm hospitality, and
              inviting atmosphere.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="font-serif text-xl mb-4">Our Values</h3>
            <p className="text-gray-600">
              Quality, authenticity, and customer satisfaction are at the heart of everything we do, from ingredient
              selection to service delivery.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
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
                <h3 className="font-serif text-xl mb-2">Chef Name</h3>
                <p className="text-gray-600">Master Chef</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

