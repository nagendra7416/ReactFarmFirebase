import React, { useEffect, useRef, useState } from 'react';

function Slider() {
    const sliderRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const images = [
        'https://img.freepik.com/free-vector/realistic-honey-bees-poster-with-editable-ornate-text-glass-can-with-flowers-flying-bee-vector-illustration_1284-83396.jpg',
        'https://img.freepik.com/free-vector/realistic-honey-bees-poster-with-editable-ornate-text-glass-can-with-flowers-flying-bee-vector-illustration_1284-83396.jpg',
        'https://img.freepik.com/free-vector/realistic-honey-bees-poster-with-editable-ornate-text-glass-can-with-flowers-flying-bee-vector-illustration_1284-83396.jpg',
        'https://img.freepik.com/free-vector/realistic-honey-bees-poster-with-editable-ornate-text-glass-can-with-flowers-flying-bee-vector-illustration_1284-83396.jpg',
        'https://img.freepik.com/free-vector/realistic-honey-bees-poster-with-editable-ornate-text-glass-can-with-flowers-flying-bee-vector-illustration_1284-83396.jpg',
    ];

    useEffect(() => {
        const slider = sliderRef.current;

        if (slider) {
            // const slides = slider.querySelectorAll('.img');

            const nextSlide = () => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
                updateSlider();
            };

            const updateSlider = () => {
                const offset = -currentIndex * 100;
                slider.style.transform = `translateX(${offset}%)`;
            };

            const intervalId = setInterval(nextSlide, 4000);

            return () => {
                clearInterval(intervalId); // Cleanup interval on component unmount
            };
        }
    }, [currentIndex, images.length]); // Re-run effect when currentIndex changes

    return (
        <section className="slider-container">
            <div className="slider" ref={sliderRef}>
                {images.map((imageUrl, index) => (
                    <div key={index} className="img" style={{ backgroundImage: `url(${imageUrl})`}}></div>
                ))}
            </div>
        </section>
    );
}

export default Slider;










