document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slider .img');
    const slideCount = slides.length;
    let currentIndex = 0;

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slideCount;
        updateSlider();
    }

    function updateSlider() {
        const offset = -currentIndex * 100; // Calculate offset based on currentIndex
        slider.style.transform = `translateX(${offset}%)`;
    }

    // Automatically advance to the next slide every 3 seconds
    setInterval(nextSlide, 4000);
});
