'use client'
import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Clock, MapPin, Phone } from "lucide-react"
import { motion } from 'framer-motion'
import Image from "next/image"
import Link from "next/link"
import menu from "@/data/menu.json"
import { MenuData } from "@/types/menu"

export default function Home() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px]">
        <Image
          src="/HomePageBackground.jpg?height=800&width=1920"
          alt="Delicious Indian cuisine spread"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="space-y-6 max-w-4xl px-4">
            <h1 className="font-serif text-5xl md:text-7xl text-white mb-4 leading-tight">
              Experience Authentic
              <br />
              Punjabi Cuisine
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Discover the rich flavors and aromatic spices of traditional Punjabi cooking at Spice Grill & Bar
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-brand-orange hover:bg-brand-orange/90 text-lg">
                <Link href="/menu">View Our Menu</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 bg-gradient-to-b from-amber-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl mb-4">Popular Dishes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Savor our most beloved dishes, crafted with care using traditional recipes and the finest ingredients
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(menu as MenuData)
              .flatMap((category) => category.items)
              .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
              .slice(0, 6)
              .map((item, index) => (
                <Card 
                  key={index}
                  className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow"
                >
                <div className="relative h-48">
                  <Image
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                 </div>
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl mb-2">{item.name.toString()}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <Button variant="link" className="text-brand-orange hover:text-brand-orange/90 p-0">
                    Order Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px]">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Restaurant ambiance"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="space-y-6">
              <h2 className="font-serif text-4xl">Our Story</h2>
              <p className="text-gray-600">
                Welcome to Spice Grill & Bar, where traditional Indian flavors meet modern culinary excellence. For over a decade, we&apos;ve been serving authentic Indian cuisine made with the finest ingredients and time-honored recipes passed down through generations.
              </p>
              <p className="text-gray-600">
                Our chefs bring decades of experience from various regions of India, ensuring that each dish captures
                the essence of authentic Indian cooking while adding their own creative touch to present a unique dining
                experience.
              </p>
              {/* <Button
                asChild
                variant="outline"
                className="border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white"
              >
                <Link href="/about">Learn More About Us</Link>
              </Button> */}
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="py-20 bg-gradient-to-b from-amber-50/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg">
              <CardContent className="flex items-start space-x-4 p-6">
                <MapPin className="h-6 w-6 text-brand-orange" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Location</h3>
                  <p className="text-gray-600">
                    <Link href="https://www.google.com/maps/search/?api=1&query=33+Lewis+Ave,+Ash+Fork,+AZ+86320" target="_blank" rel="noopener noreferrer">
                      33 Lewis Ave.
                      <br />
                      Ash Fork, AZ 86320
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg">
              <CardContent className="flex items-start space-x-4 p-6">
                <Phone className="h-6 w-6 text-brand-orange" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Contact</h3>
                  <p className="text-gray-600">
                    (928) 277-1292
                    <br />
                    info@spicegrillbar.com
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg">
              <CardContent className="flex items-start space-x-4 p-6">
                <Clock className="h-6 w-6 text-brand-orange" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Hours</h3>
                  <p className="text-gray-600">
                    Mon-Fri: 7:00 AM - 10:00 PM
                    <br />
                    Sat-Sun: 7:00 PM - 10:00 PM
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
    </motion.div>
  )
}