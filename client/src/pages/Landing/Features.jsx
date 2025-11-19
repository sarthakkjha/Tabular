import React from 'react';
import { Calculator, Users, Zap, Shield, Download, Palette } from 'lucide-react';

const features = [
  {
    icon: Calculator,
    title: 'Formula Evaluation',
    description: 'Robust formula engine for calculations that reference other cells.',
    color: 'text-blue-400'
  },
  // {
  //   icon: Users,
  //   title: 'Real-time Collaboration',
  //   description: 'Work together seamlessly with live editing and instant synchronization.',
  //   color: 'text-green-400'
  // },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Highly optimized for large datasets with smooth, responsive interactions.',
    color: 'text-yellow-400'
  },
  // {
  //   icon: Shield,
  //   title: 'Secure & Private',
  //   description: 'Enterprise-grade security with end-to-end encryption for your data.',
  //   color: 'text-purple-400'
  // },
  {
    icon: Download,
    title: 'Save to Postgres',
    description: 'Effortlessly save your work to a PostgreSQL database via Supabase.',
    color: 'text-pink-400'
  },
  // {
  //   icon: Palette,
  //   title: 'Customizable',
  //   description: 'Personalize your workspace with themes, layouts, and custom functions.',
  //   color: 'text-indigo-400'
  // }
];


function Features() {
  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Choose Tabular?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Built from the ground up to deliver the most intuitive and powerful spreadsheet experience
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-slate-800/30 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className={`${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gray-100 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;