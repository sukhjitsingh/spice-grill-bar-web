import { Clock, Mail, MapPin, Phone } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-xl text-white mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-brand-orange mr-2 mt-1" />
                <p>
                  <Link href="https://www.google.com/maps/search/?api=1&query=33+Lewis+Ave,+Ash+Fork,+AZ+86320" target="_blank" rel="noopener noreferrer">
                    33 Lewis Ave.
                    <br />
                    Ash Fork, AZ 86320
                  </Link>
                </p>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-brand-orange mr-2" />
                <p>(928) 277-1292</p>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-brand-orange mr-2" />
                <p>info@spicegrillbar.com</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-serif text-xl text-white mb-4">Hours</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-brand-orange mr-2" />
                <div>
                  <p>Monday - Friday: 7:00 AM - 10:00 PM</p>
                  <p>Saturday - Sunday: 7:00 PM - 10:00 PM</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-serif text-xl text-white mb-4">Quick Links</h3>
            <div className="space-y-3">
              <Link href="/menu" className="block hover:text-brand-orange">
                Menu
              </Link>
              <Link href="/about" className="block hover:text-brand-orange">
                About Us
              </Link>
              {/* <Link href="/contact" className="block hover:text-brand-orange">
                Contact
              </Link> */}
              <Link href="#" className="block hover:text-brand-orange">
                Order Online
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} Spice Grill & Bar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

