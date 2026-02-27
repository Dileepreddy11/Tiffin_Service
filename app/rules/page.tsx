'use client'

import { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import { AlertCircle, CheckCircle, Clock, MapPin, Gift, DollarSign } from 'lucide-react'

export default function RulesPage() {
  const [loggedInPhone, setLoggedInPhone] = useState<string>('')

  useEffect(() => {
    const stored = localStorage.getItem('loggedInPhone')
    if (stored) setLoggedInPhone(stored)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('loggedInPhone')
    setLoggedInPhone('')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-red-50 to-background">
      <Navigation isLoggedIn={!!loggedInPhone} customerPhone={loggedInPhone} onLogout={handleLogout} />

      <section className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-12 text-center">
          Important Rules & Information
        </h1>

        {/* Order Rules */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-accent p-8 mb-8">
          <h2 className="text-2xl font-playfair font-bold text-primary mb-6 flex items-center gap-3">
            <Clock size={28} />
            Order Placement Rules
          </h2>

          <div className="space-y-6">
            <div className="p-6 bg-red-50 border-2 border-red-300 rounded-lg">
              <h3 className="font-bold text-red-700 text-lg mb-2 flex items-center gap-2">
                <AlertCircle size={24} />
                Order Cutoff Time
              </h3>
              <p className="text-foreground mb-3">
                All orders must be placed <span className="font-bold">by 8:00 PM</span> for next-day delivery.
              </p>
              <ul className="space-y-2 text-sm text-foreground ml-6">
                <li>• Orders placed after 8:00 PM will be considered for the following day</li>
                <li>• Last-minute orders (after 8 PM) cannot be guaranteed</li>
                <li>• Plan ahead and pre-order to ensure availability</li>
              </ul>
            </div>

            <div className="p-6 bg-orange-50 border-2 border-secondary rounded-lg">
              <h3 className="font-bold text-foreground text-lg mb-2 flex items-center gap-2">
                <CheckCircle size={24} />
                Order Confirmation & Cancellation
              </h3>
              <ul className="space-y-2 text-sm text-foreground ml-6">
                <li>• Once your order is confirmed, <span className="font-bold">NO CANCELLATION</span> is allowed</li>
                <li>• Your order cannot be modified after confirmation</li>
                <li>• In case of genuine emergencies, contact us immediately</li>
                <li>• Cancellation charges may apply (to be discussed)</li>
              </ul>
            </div>

            <div className="p-6 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
              <h3 className="font-bold text-foreground text-lg mb-2 flex items-center gap-2">
                <Clock size={24} />
                Delivery Time Slots
              </h3>
              <p className="text-sm text-foreground mb-3 ml-6">Choose your preferred delivery time:</p>
              <ul className="space-y-2 text-sm text-foreground ml-6">
                <li>• 7:00 AM - 7:30 AM</li>
                <li>• 7:30 AM - 8:00 AM</li>
                <li>• 8:00 AM - 8:30 AM</li>
                <li>• 8:30 AM - 9:00 AM</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-3 ml-6">
                Deliveries are guaranteed within your selected time slot
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Rules */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-accent p-8 mb-8">
          <h2 className="text-2xl font-playfair font-bold text-primary mb-6 flex items-center gap-3">
            <MapPin size={28} />
            Delivery Rules
          </h2>

          <div className="space-y-6">
            <div className="p-6 bg-blue-50 border-2 border-blue-300 rounded-lg">
              <h3 className="font-bold text-foreground text-lg mb-3">Delivery Coverage Area</h3>
              <p className="text-sm text-foreground mb-3">
                We deliver only within <span className="font-bold">selected areas in Telangana</span>.
              </p>
              <div className="bg-white p-4 rounded-lg border border-blue-300">
                <p className="font-semibold text-foreground mb-2">Covered Areas:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Hyderabad (selected localities)</li>
                  <li>• Secunderabad</li>
                  <li>• Begumpet and surrounding areas</li>
                  <li>Please verify your address during order placement</li>
                </ul>
              </div>
            </div>

            <div className="p-6 bg-green-50 border-2 border-green-400 rounded-lg">
              <h3 className="font-bold text-foreground text-lg mb-3 flex items-center gap-2">
                <CheckCircle size={24} />
                Fresh & Quality Guarantee
              </h3>
              <ul className="space-y-2 text-sm text-foreground ml-6">
                <li>• All items are prepared fresh on the day of delivery</li>
                <li>• Made in a hygienic home kitchen with quality ingredients</li>
                <li>• Packed in food-safe containers</li>
                <li>• Delivered hot and fresh in your time slot</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Payment Rules */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-accent p-8 mb-8">
          <h2 className="text-2xl font-playfair font-bold text-primary mb-6 flex items-center gap-3">
            <DollarSign size={28} />
            Payment Options
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-purple-50 border-2 border-purple-300 rounded-lg">
              <h3 className="font-bold text-foreground text-lg mb-3">Cash on Delivery (COD)</h3>
              <ul className="space-y-2 text-sm text-foreground ml-4">
                <li>• Pay during delivery</li>
                <li>• Exact amount recommended</li>
                <li>• No additional charges</li>
              </ul>
            </div>

            <div className="p-6 bg-green-50 border-2 border-green-400 rounded-lg">
              <h3 className="font-bold text-foreground text-lg mb-3">UPI Payment</h3>
              <ul className="space-y-2 text-sm text-foreground ml-4">
                <li>• Quick and secure payment</li>
                <li>• Pay before or during delivery</li>
                <li>• Receipt confirmation</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-6 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
            <p className="text-sm text-foreground">
              <span className="font-bold">Important:</span> Please have the exact amount ready. We do not accept partial payments or external payment apps.
            </p>
          </div>
        </div>

        {/* Rewards Rules */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-accent p-8 mb-8">
          <h2 className="text-2xl font-playfair font-bold text-primary mb-6 flex items-center gap-3">
            <Gift size={28} />
            Reward Points System
          </h2>

          <div className="space-y-6">
            <div className="p-6 bg-pink-50 border-2 border-pink-400 rounded-lg">
              <h3 className="font-bold text-foreground text-lg mb-3">How Rewards Work</h3>
              <ul className="space-y-2 text-sm text-foreground ml-6">
                <li>• Every order earns <span className="font-bold">5-9 random reward points</span></li>
                <li>• Random points make every order exciting!</li>
                <li>• Points are added instantly after order confirmation</li>
                <li>• No cash discount - only gifts based on points</li>
              </ul>
            </div>

            <div className="p-6 bg-orange-50 border-2 border-secondary rounded-lg">
              <h3 className="font-bold text-foreground text-lg mb-3">Reward Tiers</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-orange-200">
                  <div>
                    <p className="font-bold text-primary">100 Points</p>
                    <p className="text-xs text-muted-foreground">Free Keychain 🔑</p>
                  </div>
                  <div className="text-lg">🔓</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-orange-200">
                  <div>
                    <p className="font-bold text-primary">200 Points</p>
                    <p className="text-xs text-muted-foreground">Free Tiffin Combo 🎁</p>
                  </div>
                  <div className="text-lg">🔓</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-orange-200">
                  <div>
                    <p className="font-bold text-primary">400 Points</p>
                    <p className="text-xs text-muted-foreground">Special Festival Gift 🎊</p>
                  </div>
                  <div className="text-lg">🔓</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-green-50 border-2 border-green-400 rounded-lg">
              <h3 className="font-bold text-foreground text-lg mb-3">Why This System?</h3>
              <ul className="space-y-2 text-sm text-foreground ml-6">
                <li>• <span className="font-bold">Achievable:</span> First gift in 1-2 months of regular orders</li>
                <li>• <span className="font-bold">Exciting:</span> Random points make every order a surprise</li>
                <li>• <span className="font-bold">Fair:</span> No subscription needed - just order what you want</li>
                <li>• <span className="font-bold">Transparent:</span> See your progress on the dashboard</li>
              </ul>
            </div>

            <div className="p-6 bg-blue-50 border-2 border-blue-300 rounded-lg">
              <h3 className="font-bold text-foreground text-lg mb-3">Claiming Rewards</h3>
              <ul className="space-y-2 text-sm text-foreground ml-6">
                <li>• Contact us via WhatsApp when you reach a reward tier</li>
                <li>• Provide your mobile number and customer ID</li>
                <li>• Gift will be included in your next delivery</li>
                <li>• Points are deducted after reward is claimed</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact & Support */}
        <div className="bg-primary text-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-playfair font-bold mb-6">Have Questions?</h2>
          <p className="mb-4">For any queries, issues, or special requests, please contact us:</p>
          <div className="space-y-3 text-sm">
            <p>📱 <span className="font-bold">WhatsApp:</span> Available for messages and queries</p>
            <p>🕐 <span className="font-bold">Support Hours:</span> 9 AM - 8 PM (Monday to Sunday)</p>
            <p>🏠 <span className="font-bold">Area:</span> Selected areas in Telangana, Hyderabad region</p>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-8 border-2 border-primary/30">
          <h2 className="text-2xl font-playfair font-bold text-primary mb-6 text-center">Quick Summary</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white rounded-lg p-4 border-2 border-accent">
              <p className="font-bold text-primary mb-2">⏰ Order Cutoff</p>
              <p className="text-foreground">8:00 PM daily</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-accent">
              <p className="font-bold text-primary mb-2">🚫 Cancellation</p>
              <p className="text-foreground">Not allowed after confirmation</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-accent">
              <p className="font-bold text-primary mb-2">🎁 First Reward</p>
              <p className="text-foreground">In 1-2 months of ordering</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white mt-16 py-8 text-center">
        <p className="mb-2">Fresh Telugu Inti Tiffins</p>
        <p className="text-sm opacity-90">Authentic Telugu Breakfast | Homemade Quality | Daily Delivery</p>
        <p className="text-xs opacity-75 mt-4">Delivery within selected areas in Telangana</p>
      </footer>
    </main>
  )
}
