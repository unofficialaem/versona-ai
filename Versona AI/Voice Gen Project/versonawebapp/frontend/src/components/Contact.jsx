import React, { useState } from 'react'
import { motion } from 'framer-motion'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: ''
      })
    }, 3000)
  }

  const contactInfo = [
    {
      icon: "📧",
      title: "Email Us",
      description: "Get in touch with our team",
      value: "hello@versona.ai",
      color: "#D4AF37"
    },
    {
      icon: "💬",
      title: "Live Chat",
      description: "24/7 support available",
      value: "Start conversation",
      color: "#6C4DFF"
    },
    {
      icon: "📞",
      title: "Call Us",
      description: "Speak with our experts",
      value: "+1 (555) 123-4567",
      color: "#4ECDC4"
    },
    {
      icon: "🏢",
      title: "Visit Office",
      description: "Meet us in person",
      value: "San Francisco, CA",
      color: "#FF8A65"
    }
  ]

  return (
    <section id="contact" className="py-24 section-padding bg-gradient-to-b from-jet-black via-dark-gray to-jet-black relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full"
            style={{
              background: `radial-gradient(circle, ${['#D4AF37', '#6C4DFF', '#4ECDC4', '#FF8A65'][i % 4]}20 0%, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 100, -50, 0],
              y: [0, -100, 50, 0],
              scale: [1, 1.2, 0.8, 1],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-8">
            <span className="gradient-text">Get In Touch</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Ready to transform your voice projects? Let's discuss how VERSONA can elevate your audio experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="glass-effect p-8 rounded-3xl border border-white/10 relative overflow-hidden">
              {/* Form glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-metallic-gold/5 via-transparent to-electric-purple/5 opacity-0 hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-6">Send us a message</h3>
                
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        className="relative"
                      >
                        <label className="block text-white/80 text-sm font-medium mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-metallic-gold focus:ring-2 focus:ring-metallic-gold/20 outline-none transition-all duration-300 focus:bg-white/10"
                          placeholder="Enter your name"
                        />
                      </motion.div>
                      
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        className="relative"
                      >
                        <label className="block text-white/80 text-sm font-medium mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-metallic-gold focus:ring-2 focus:ring-metallic-gold/20 outline-none transition-all duration-300 focus:bg-white/10"
                          placeholder="Enter your email"
                        />
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        className="relative"
                      >
                        <label className="block text-white/80 text-sm font-medium mb-2">
                          Company
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-metallic-gold focus:ring-2 focus:ring-metallic-gold/20 outline-none transition-all duration-300 focus:bg-white/10"
                          placeholder="Your company"
                        />
                      </motion.div>
                      
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        className="relative"
                      >
                        <label className="block text-white/80 text-sm font-medium mb-2">
                          Subject *
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white focus:border-metallic-gold focus:ring-2 focus:ring-metallic-gold/20 outline-none transition-all duration-300 focus:bg-white/10"
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="sales">Sales & Pricing</option>
                          <option value="support">Technical Support</option>
                          <option value="partnership">Partnership</option>
                          <option value="api">API Integration</option>
                        </select>
                      </motion.div>
                    </div>

                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      className="relative"
                    >
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-metallic-gold focus:ring-2 focus:ring-metallic-gold/20 outline-none transition-all duration-300 focus:bg-white/10 resize-none"
                        placeholder="Tell us about your project..."
                      />
                    </motion.div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full btn-primary py-4 text-lg font-semibold relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-jet-black border-t-transparent rounded-full"
                          />
                          <span>Sending...</span>
                        </div>
                      ) : (
                        "Send Message"
                      )}
                    </motion.button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6 }}
                      className="text-6xl mb-4"
                    >
                      ✅
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-white/70">We'll get back to you within 24 hours.</p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">Let's Connect</h3>
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                Whether you're looking to integrate our API, need technical support, or want to explore partnership opportunities, we're here to help.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -5,
                    transition: { duration: 0.3 }
                  }}
                  className="glass-effect p-6 rounded-2xl border border-white/10 cursor-pointer group relative overflow-hidden"
                >
                  {/* Hover glow effect */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl"
                    style={{ backgroundColor: info.color }}
                  />
                  
                  <div className="relative z-10">
                    <div className="text-3xl mb-3 group-hover:animate-bounce">
                      {info.icon}
                    </div>
                    <h4 className="font-semibold text-white mb-2 group-hover:text-white transition-colors">
                      {info.title}
                    </h4>
                    <p className="text-white/60 text-sm mb-2 group-hover:text-white/80 transition-colors">
                      {info.description}
                    </p>
                    <p 
                      className="font-medium transition-colors"
                      style={{ color: info.color }}
                    >
                      {info.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Response time info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-effect p-6 rounded-2xl border border-white/10"
            >
              <h4 className="font-semibold text-white mb-4">Response Times</h4>
              <div className="space-y-3">
                {[
                  { type: "General Inquiries", time: "< 24 hours", color: "#4ECDC4" },
                  { type: "Technical Support", time: "< 4 hours", color: "#D4AF37" },
                  { type: "Sales & Partnerships", time: "< 2 hours", color: "#6C4DFF" }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-white/70">{item.type}</span>
                    <span 
                      className="font-semibold"
                      style={{ color: item.color }}
                    >
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
