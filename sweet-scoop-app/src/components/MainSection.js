import { useEffect, useState } from "react";
import flavors from "../data/flavors";
import reviews from "../data/reviews";

function MainSection() {
  const [featuredFlavors, setFeaturedFlavors] = useState([]);
  const [featuredReviews, setFeaturedReviews] = useState([]);

  const getRandomItems = (array, count) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const getStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  useEffect(() => {
    setFeaturedFlavors(getRandomItems(flavors, 3));
    setFeaturedReviews(getRandomItems(reviews, 2));
  }, []);

  return (
    <div className="mainsection">
      <section>
        <h2>About Sweet Scoop</h2>
        <p>
          Sweet Scoop Ice Cream is a family-owned business that has been serving delicious ice cream since 1990. We pride ourselves on using 
          only the freshest ingredients to create our unique flavors. Whether you're in the mood for a classic vanilla or something more adventurous 
          like our signature "Chocolate Explosion," we have something for everyone. Come visit us and treat yourself to a sweet scoop today!
        </p>
      </section>

      <section>
        <h2>Featured Flavors</h2>
        <div className="flavorgrid">
          {featuredFlavors.map((flavor) => (
            <div key={flavor.id}>
              <img
                src={flavor.image}
                alt={flavor.name}
                width="150"
              />
              <h3>{flavor.name}</h3>
              <p>{flavor.description}</p>
              <p>{flavor.price}</p>
              <p>Available for: {flavor.duration}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Customer Reviews</h2>
        {featuredReviews.map((review, index) => (
          <div key={index}>
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