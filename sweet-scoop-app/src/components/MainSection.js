// MainSection.js
import { useEffect, useState } from "react";
import { fetchFlavors, fetchReviews } from "../api";
import DisplayStatus from "./DisplayStatus";

function MainSection() {
  const [featuredFlavors, setFeaturedFlavors] = useState([]);
  const [featuredReviews, setFeaturedReviews] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const getRandomItems = (array, count) => {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const getStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  useEffect(() => {
    let isCancelled = false;

    const loadHomepageData = async () => {
      try {
        const [flavors, reviews] = await Promise.all([fetchFlavors(), fetchReviews()]);

        if (isCancelled) {
          return;
        }

        setFeaturedFlavors(getRandomItems(flavors, 3));
        setFeaturedReviews(getRandomItems(reviews, 2));
        setMessage("");
      } catch (error) {
        if (!isCancelled) {
          setMessageType("error");
          setMessage(error instanceof Error ? error.message : "Unable to load homepage data.");
        }
      }
    };

    loadHomepageData();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="mainsection">
      <section>
        <h2>About Sweet Scoop Ice Cream</h2>
        <p>
          Sweet Scoop is an ice cream shop that offers a variety of rich, creamy,
          and refreshing flavours made with quality ingredients. Explore our
          featured flavours, read what customers are saying, and discover your
          next favourite scoop.
        </p>
      </section>

      <section>
        <h2>Featured Flavors</h2>
        {message ? <DisplayStatus type={messageType} message={message} /> : null}
        <div className="flavorgrid">
          {featuredFlavors.map((flavor) => (
            <div key={flavor.id} className="flavor-card">
              <h3>{flavor.name}</h3>
              <p>{flavor.description}</p>
              <p>
                <strong>Price:</strong> {flavor.price}
              </p>
              <img src={flavor.image} alt={flavor.name} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Customer Reviews</h2>
        {featuredReviews.map((review, index) => (
          <div key={index} className="review-card">
            <h3>{review.customerName}</h3>
            <p>{review.review}</p>
            <p>{getStars(review.rating)}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default MainSection;