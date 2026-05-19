import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-100 bg-white">
      {/* Service Highlights */}
      <div className="border-b border-slate-50 bg-emerald-50/20 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Truck className="h-5 w-5" />
              </span>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Free Delivery</h4>
                <p className="text-xs text-slate-500">On all orders above 1,000 BDT</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">100% Authentic</h4>
                <p className="text-xs text-slate-500">Directly sourced from trusted brands</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <RefreshCw className="h-5 w-5" />
              </span>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Easy Returns</h4>
                <p className="text-xs text-slate-500">7-day hassle-free exchange policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          
          {/* Column 1: About */}
          <div className="space-y-4">
            <span className="text-lg font-bold tracking-wider text-emerald-950">
              AURA<span className="text-emerald-600">GLOW</span>
            </span>
            <p className="text-sm text-slate-500 leading-relaxed">
              Premium curated skincare products tailored to reveal your skin\'s natural, organic glow. Dermatologist tested and certified.
            </p>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">Shop Categories</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-emerald-600">Gentle Facewashes</a></li>
              <li><a href="#" className="hover:text-emerald-600">Active Treatment Serums</a></li>
              <li><a href="#" className="hover:text-emerald-600">Barrier Creams & Gels</a></li>
              <li><a href="#" className="hover:text-emerald-600">Broad Spectrum Sunscreens</a></li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-600" />
                <span>+880 1712-345678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-600" />
                <span>support@auraglow.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-600" />
                <span>Gulshan-2, Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">Subscribe for Perks</h4>
            <p className="text-xs text-slate-500">Sign up to receive 10% off your first order and exclusive updates.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:bg-white"
              />
              <button className="rounded-lg bg-emerald-950 hover:bg-emerald-900 px-4 text-sm font-semibold text-white">
                Join
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright and payment icons */}
        <div className="mt-12 border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} AuraGlow Skincare. All rights reserved. Developed with modern Next.js.
          </p>
          {/* MOCK payment logos */}
          <div className="flex items-center gap-3">
            <span className="rounded bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">bKash</span>
            <span className="rounded bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">Nagad</span>
            <span className="rounded bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">SSLCommerz</span>
            <span className="rounded bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">Stripe</span>
            <span className="rounded bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
