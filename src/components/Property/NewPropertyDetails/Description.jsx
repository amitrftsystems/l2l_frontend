import React, { useState } from "react";

const Description = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="max-w-7xl mx-auto px py-6">
      <h2 className="text-2xl font-semibold text-blue-900">About Project</h2>
      <p className="text-base text-gray-700 mt-2">
        Discover a spacious and fully furnished 1 BHK house available for rent
        in a prime location. Situated in a sought-after and well-connected
        neighborhood, this beautiful property is a perfect choice for those
        looking for comfort, convenience, and value. The house is a relatively
        new construction, being just 1 to 3 years old, which ensures that it has
        been well-maintained and features modern fixtures and finishes.The
        property is located on the ground floor of a two-story building,
        offering the convenience of easy access without the need for climbing
        stairs. This is particularly beneficial for individuals or families who
        prefer or require ground-level accommodation. The building is situated
        in a peaceful and serene neighborhood, providing a quiet living
        environment that is ideal for relaxation after a long day of work or
        study. This 1 BHK house boasts a spacious layout, carefully designed to
        maximize every square foot of space. The living area is expansive and
        can easily accommodate a range of furniture options, making it perfect
        for both relaxation and entertaining guests. It features large windows
        that allow ample natural light to flood the room, creating a bright and
        airy atmosphere that enhances the feeling of space and openness. The
        bedroom is well-sized and provides a cozy, private retreat for
        residents. It is large enough to comfortably fit a queen-sized bed,
        wardrobe, and additional furniture. The north-west facing direction of
        the house allows for excellent sunlight during the day while also
        ensuring a cool breeze flows through the room, providing a naturally
        comfortable climate inside. The room is designed to promote relaxation,
        offering a peaceful haven for rest.
      </p>
      {isExpanded && (
        <p className="text-base text-gray-700 mt-2">
          The kitchen is modern and fully equipped with the necessary appliances
          and ample cabinet space to store all your essentials. Whether you
          enjoy cooking elaborate meals or simple snacks, the kitchen will meet
          all your needs. It is also connected to the living area, providing a
          seamless flow between spaces, which is perfect for when you entertain
          guests or host family gatherings. The bathroom is modern, clean, and
          functional, featuring contemporary fixtures and fittings. It is
          designed for maximum comfort and convenience, with a shower area, a
          western-style toilet, and a washbasin. Like the rest of the house, the
          bathroom is well-lit and ventilated, ensuring a fresh and clean
          environment. One of the key highlights of this property is the ample
          natural light and ventilation it receives. The north-west facing
          aspect of the home ensures that sunlight floods the living room and
          bedroom throughout the day, brightening the space and creating a warm,
          inviting atmosphere. At the same time, the layout of the property
          allows for excellent air circulation, keeping the house
          well-ventilated and comfortable year-round. The location of this house
          is another major selling point. It is situated close to a wide range
          of amenities, including shopping centers, supermarkets, cafes,
          restaurants, and healthcare facilities. Public transport options are
          easily accessible, making commuting a breeze. The house is also near
          schools and parks, making it an ideal choice for families with
          children. Whether you need to run errands, meet friends, or enjoy some
          leisure time, everything you need is just a short distance away.This
          fully furnished 1 BHK house is ready for immediate move-in. All the
          furniture and appliances provided are of high quality, ensuring that
          you can enjoy a comfortable and hassle-free living experience from day
          one. The property is an excellent choice for anyone seeking a
          convenient, well-maintained, and comfortable living space in a
          desirable location. Don't miss out on the opportunity to rent this
          charming home and experience a perfect blend of modern living,
          practicality, and comfort." This version provides detailed insights
          into the space, its features, and the surrounding amenities, making it
          a complete description for prospective tenants.
        </p>
      )}
      <button onClick={handleToggle} className="text-blue-600 mt-4 underline">
        {isExpanded ? "Show Less" : "Show More"}
      </button>
    </div>
  );
};

export default Description;
