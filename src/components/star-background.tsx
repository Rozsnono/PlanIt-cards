"use client";
import React, { useEffect } from "react";

export default function StarBackground() {

    const [stars, setStars] = React.useState<Array<number>>([]);
    const [shootingStar, setShootingStar] = React.useState<Array<number>>([]);
    useEffect(() => {
        setStars(Array.from({ length: 500 }, (_, i) => i + 1));
        setShootingStar(Array.from({ length: 10 }, (_, i) => i + 1));
    }, []);

    function randomPositionForStars(index: number) {
        const size = (Math.random() * 10) % 9 == 0 ? 12 : Math.random() * 4;

        const colors = ['#96aad4', '#d3dae9', '#dadfe8', '#eaecf0', '#f7eed3', '#f7dbb4', '#f5ba9e']

        return { left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, width: `${size}px`, height: `${size}px`, background: colors[Math.floor(Math.random() * colors.length)] };
    }


    function getPlanetPos() {
        return { saturn: new Date().getMinutes() * (100 / 60), uranus: new Date().getDate() * (100 / 30), neptun: new Date().getHours() * 2.5 * (100 / 60), redgiant: new Date().getMonth() * (100 / 12), moon: new Date().getSeconds() * (200 / 60) - 50 };
    }

    return (
        <main className="absolute top-0 left-0 w-[100%] h-screen overflow-hidden z-[-1]">
            {
                stars.map((_, i) => (
                    <div key={i} className={`${i % 5 ? 'star' : 'star'}`} style={randomPositionForStars(i)}></div>
                ))
            }

            {
                shootingStar.map((_, i) => (
                    <React.Fragment key={i + 999}>
                        <div className={`shooting-star sh-star-anim${Math.floor(Math.random() * 2) + 1}`} style={{ left: `100%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 20}s` }}></div>
                        <div className={`shooting-star sh-star-anim${Math.floor(Math.random() * 2) + 3}`} style={{ right: `100%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 20}s` }}></div>

                    </React.Fragment>
                ))
            }

            <div className="dipper">
                <div className="star1"></div>
                <div className="star2"></div>
                <div className="star3"></div>
                <div className="star4"></div>
                <div className="star5"></div>
                <div className="star6"></div>
                <div className="star7"></div>
            </div>

            <div className="swan">
                <div className="star1"></div>
                <div className="star2"></div>
                <div className="star3"></div>
                <div className="star4"></div>
                <div className="star5"></div>
                <div className="star6"></div>
                <div className="star7"></div>
                <div className="star8"></div>
                <div className="star9"></div>
                <div className="star10"></div>
            </div>

            <div className="fish">
                <div className="star1"></div>
                <div className="star2"></div>
                <div className="star3"></div>
                <div className="star4"></div>
                <div className="star5"></div>
                <div className="star6"></div>
                <div className="star7"></div>
                <div className="star8"></div>
                <div className="star9"></div>
                <div className="star10"></div>
                <div className="star11"></div>
                <div className="star12"></div>
                <div className="star13"></div>
                <div className="star14"></div>
                <div className="star15"></div>
                <div className="star16"></div>
                <div className="star17"></div>
            </div>

            <div className="neptun" style={{ left: getPlanetPos().neptun + "%" }}></div>
            <div className="mars" style={{ left: getPlanetPos().redgiant + "%" }}>
                <div className="moon" style={{ left: getPlanetPos().moon + "%", top: ((getPlanetPos().moon) / 10 + 45) + "%" }}></div>
            </div>
            <div className="uranus" style={{ left: getPlanetPos().uranus + "%" }}>
                <div className="ring1"></div>
                <div className="ring2"></div>
                <div className="hover-ring"></div>
            </div>

            <div className="saturn" style={{ left: getPlanetPos().saturn + "%" }}>
                <div className="ring1"></div>
                <div className="ring2"></div>
                <div className="ring3"></div>
                <div className="ring4"></div>
                <div className="hover-ring"></div>
            </div>







            {/* <div className="planet" style={{ width: "150px", height: "150px", right: "10%", bottom: "10%", background: "radial-gradient(circle at 30% 30%, #59b667, #000000)" }}></div>
            <div className="planet" style={{ width: "350px", height: "350px", left: "4%", bottom: "4%", background: "radial-gradient(circle at 50% 30%, #9c0f00, #000000)" }}></div> */}
        </main>
    )
}