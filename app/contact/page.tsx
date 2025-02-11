"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Mail, MapPin, Phone } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon possible.",
    })

    setIsSubmitting(false)
      ; (e.target as HTMLFormElement).reset()
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="font-serif text-4xl text-center mb-12">Contact Us</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="space-y-8">
            <Card>
              <CardContent className="flex items-start space-x-4 p-6">
                <MapPin className="h-6 w-6 text-brand-orange" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Location</h3>
                  <p>
                    123 Spice Street
                    <br />
                    Foodville, FV 12345
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-start space-x-4 p-6">
                <Phone className="h-6 w-6 text-brand-orange" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Phone</h3>
                  <p>(555) 123-4567</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-start space-x-4 p-6">
                <Mail className="h-6 w-6 text-brand-orange" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Email</h3>
                  <p>info@spicegrillbar.com</p>
                </div>
              </CardContent>
            </Card>

            <div className="h-[300px] bg-gray-200 rounded-lg">
              {/* Replace with actual map component */}
              <div className="w-full h-full flex items-center justify-center text-gray-500">Map placeholder</div>
            </div>
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" required />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-brand-orange hover:bg-brand-orange/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

