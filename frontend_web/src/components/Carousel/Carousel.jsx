import React, { useState } from 'react';
                        import './Carousel.css';

                        const Carousel = () => {
                            const [currentIndex, setCurrentIndex] = useState(0);

                            const handlePrev = () => {
                                setCurrentIndex((prevIndex) => (prevIndex === 0 ? 2 : prevIndex - 1));
                            };

                            const handleNext = () => {
                                setCurrentIndex((prevIndex) => (prevIndex === 2 ? 0 : prevIndex + 1));
                            };

                            const handleDotClick = (index) => {
                                setCurrentIndex(index);
                            };

                            return (
                                <div className="carousel-container">
                                    <div className="carousel-slide" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                                        <div className="carousel-item">
                                            <div className="carousel-label">Pie Chart</div>
                                            <img src="/pie chart.jpg" alt="Chart Placeholder 1" />
                                        </div>
                                        <div className="carousel-item">
                                            <div className="carousel-label">Bar Graph</div>
                                            <img src="/bar chart.png" alt="Chart Placeholder 2" />
                                        </div>
                                        <div className="carousel-item">
                                            <div className="carousel-label">Regression</div>
                                            <img src="/regression.png" alt="Chart Placeholder 3" />
                                        </div>
                                    </div>
                                    <div className="carousel-buttons">
                                        <button className="carousel-button prev" onClick={handlePrev}>&#9664;</button>
                                        <button className="carousel-button next" onClick={handleNext}>&#9654;</button>
                                    </div>
                                    <div className="carousel-dots">
                                        {[0, 1, 2].map((index) => (
                                            <span
                                                key={index}
                                                className={`carousel-dot ${currentIndex === index ? 'active' : ''}`}
                                                onClick={() => handleDotClick(index)}
                                            ></span>
                                        ))}
                                    </div>
                                </div>
                            );
                        };

                        export default Carousel;