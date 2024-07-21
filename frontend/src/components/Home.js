import React from "react";
import { Link } from "react-router-dom";
import "pure-react-carousel/dist/react-carousel.es.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Footer from "./Footer";

function Home({ showAlert }) {
  const carouselContainerStyle = {
    width: "100%",
    minHeight: "50vh",
    position: "relative",
    overflow: "hidden",
    marginTop: "13rem",
    color: "rgba(255, 255, 255, 0.87)",
  };

  const carouselSlideStyle = {
    width: "100%",
    minHeight: "50vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "50px",
    textAlign: "center",
    fontSize: "20px",
  };

  const carouselButtonStyle = {
    position: "absolute",
    bottom: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: "2",
    backgroundColor: "#fff", 
    color: "#333", 
    borderRadius: "5px", 
    padding: "10px 20px", 
  };

  return (
    <div>
      <section className=" home-banner"></section>
      <section
        className="text-center d-flex justify-content-center align-items-center flex-column"
        style={{ height: "65vh" }}
      >
        <div
          className="text-white d-flex justify-content-center align-items-center flex-column"
          style={{ marginTop: "50vh" }}
        >
          <h1 style={{ fontSize: "70px" }}>Welcome to ShopperStop</h1>
          <p style={{ fontSize: "25px" }}>
            Uncover a world of options with our product range
          </p>
          <Link to="/products" className="custom-btn">
            Discover Our Collection
          </Link>
        </div>
      </section>

      <div style={carouselContainerStyle}>
        <Carousel
          className="carousel"
          autoPlay={true}
          animation="slide"
          indicators={true}
          timeout={1000}
          navButtonsAlwaysVisible={true}
          navButtonsProps={{
            style: carouselButtonStyle,
          }}
          infiniteLoop={true}
          showStatus={false}
          showThumbs={false}
        >
          <div style={carouselSlideStyle}>
            <h3>Easy Shopping Experience</h3>
            <p>Shop hassle-free with our intuitive interface.</p>
          </div>
          <div style={carouselSlideStyle}>
            <h3>Wide Range of Products</h3>
            <p>Explore thousands of products from various categories.</p>
          </div>
          <div style={carouselSlideStyle}>
            <h3>Secure Payment Options</h3>
            <p>
              Enjoy secure payment methods for a worry free shopping experience.
            </p>
          </div>
        </Carousel>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
