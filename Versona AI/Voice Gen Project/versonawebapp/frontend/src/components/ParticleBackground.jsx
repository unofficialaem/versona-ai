//Uses the canvas for drawing, requestAnimationFrame for animation, and event listeners for responsiveness.

import React, { useEffect, useRef } from 'react'  // Import React and hooks

// useEffect A hook that allows us to run code when the component is mounted (loaded) or updated.
// useRef A hook that allows us to reference an element in the DOM (in this case, the canvas).

const ParticleBackground = () => {
  const canvasRef = useRef(null) //null: Initially, the reference doesn’t point to anything. It will be set to the canvas element once it’s rendered.

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d') //The 2D rendering context of the canvas.
    let animationFrameId

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Particle system
    const particles = []
    const particleCount = 50 //The number of particles we want to create. You can change this number to create more or fewer particles.

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vx = (Math.random() - 0.5) * 0.5  
        this.vy = (Math.random() - 0.5) * 0.5
        this.size = Math.random() * 2 + 1
        this.opacity = Math.random() * 0.5 + 0.2
        this.color = Math.random() > 0.5 ? '#D4AF37' : '#6C4DFF'
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1  // Boundary Check: If the particle reaches the edges of the canvas, it bounces back by reversing its velocity
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1
      }

      draw() {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      // Draw connections
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {  //The line’s opacity depends on the distance. The closer the particles, the more visible the line.
            ctx.save()
            ctx.globalAlpha = (100 - distance) / 100 * 0.2
            ctx.strokeStyle = '#D4AF37'
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
            ctx.restore()
          }
        })
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()
    // This prevents memory leaks and keeps the browser from doing unnecessary work when the component is not visible.
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  //This is where everything is drawn (particles, lines, etc.).
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ background: 'radial-gradient(ellipse at center, rgba(108, 77, 255, 0.1) 0%, transparent 70%)' }}
    />
  )
}

export default ParticleBackground
