// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Set initial state - hide elements
    gsap.set('.timeline-item', { opacity: 0 });
    gsap.set('.timeline-connector', { scale: 0 });
    gsap.set('.number-box', { scale: 0, opacity: 0 });
    gsap.set('.connector-line', { width: 0 });
    gsap.set('.content', { opacity: 0, y: 30 });
    
    // Animate the heading first
    gsap.from('h1', {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: 'power3.out'
    });
    
    // Animate each timeline item with scroll trigger
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        const isOdd = (index + 1) % 2 === 1;
        const numberBox = item.querySelector('.number-box');
        const connectorLine = item.querySelector('.connector-line');
        const content = item.querySelector('.content');
        const timelineConnector = item.querySelector('.timeline-connector');
        
        // Create timeline for this item
        const itemTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
        
        // Set initial positions for content based on odd/even
        if (isOdd) {
            gsap.set(content, { x: -50 });
        } else {
            gsap.set(content, { x: 50 });
        }
        
        // Animate the timeline item
        itemTimeline
            .to(item, { 
                opacity: 1, 
                duration: 0.3 
            })
            .to(numberBox, { 
                scale: 1, 
                opacity: 1, 
                duration: 0.1,
                ease: 'back.out(1.7)'
            }, '-=0.1')
            .to(timelineConnector, { 
                scale: 1, 
                duration: 0.2,
                ease: 'back.out(1.7)'
            }, '-=0.3')
            .to(connectorLine, { 
                width: '32%', 
                duration: 0.5,
                ease: 'power2.out'
            }, '-=0.2')
            .to(content, { 
                opacity: 1, 
                y: 0, 
                x: 0,
                duration: 0.3,
                ease: 'power2.out'
            }, '-=0.3');
    });
    
    // Add hover animations for number boxes
    const numberBoxes = document.querySelectorAll('.number-box');
    
    numberBoxes.forEach(box => {
        const number = box.querySelector('.number');
        
        box.addEventListener('mouseenter', () => {
            gsap.to(box, { 
                scale: 1.1, 
                duration: 0.3,
                ease: 'power1.out'
            });
            gsap.to(number, { 
                scale: 1.1, 
                color: '#1a4a46', 
                duration: 0.3 
            });
        });
        
        box.addEventListener('mouseleave', () => {
            gsap.to(box, { 
                scale: 1, 
                duration: 0.3,
                ease: 'power2.out'
            });
            gsap.to(number, { 
                scale: 1, 
                color: '#2c7873', 
                duration: 0.3 
            });
        });
    });
    
    // Add hover animations for content boxes
    const contentBoxes = document.querySelectorAll('.content');
    
    contentBoxes.forEach(box => {
        box.addEventListener('mouseenter', () => {
            gsap.to(box, { 
                y: -8, 
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)', 
                duration: 0.3,
                ease: 'power1.inOut'
            });
        });
        
        box.addEventListener('mouseleave', () => {
            gsap.to(box, { 
                y: 0, 
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)', 
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // Add a subtle continuous animation to the timeline line
    gsap.to('.timeline::before', {
        scaleY: 1,
        transformOrigin: 'top',
        duration: 2,
        ease: 'power2.out',
        delay: 0.5
    });
    
    // Set initial scale for timeline line
    gsap.set('.timeline::before', { scaleY: 0 });
}); 