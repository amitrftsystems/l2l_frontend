import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const faqs = [
  {
    question: "What types of properties does HL City offer?",
    answer:
      "HL City offers a diverse range of properties, including luxury apartments, villas, townhouses, and commercial spaces across prime locations.",
  },
  {
    question: "Can I buy property in HL City as a foreign investor?",
    answer:
      "Yes, foreign investors can purchase property in designated freehold areas with full ownership rights.",
  },
  {
    question:
      "What are the financing options available for property purchases?",
    answer:
      "We provide multiple financing options, including mortgage loans, installment plans, and flexible payment schemes.",
  },
  {
    question:
      "Does HL City offer assistance with home loans and mortgage approvals?",
    answer:
      "Yes, we assist buyers in securing mortgage financing through leading banks and financial institutions.",
  },
  {
    question: "What is the process of booking a property in HL City?",
    answer:
      "The booking process is simple: select your desired property, submit the booking amount, and complete the required documentation.",
  },
  {
    question: "Are there any hidden costs associated with property purchases?",
    answer:
      "No hidden costs. However, buyers should consider registration fees, service charges, maintenance fees, and potential agency commissions.",
  },
  {
    question: "Can I get a residency visa through property investment?",
    answer:
      "Yes, if the property value meets the UAE government's residency visa threshold, you may be eligible for a residency visa.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  // const [faqs, setFaqs] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchFaqs = async () => {
  //     try {
  //       const response = await fetch("/api/faqs"); // Replace with your API endpoint
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       // setFaqs(data);
  //     } catch (err) {
  //       setError(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchFaqs();
  // }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // if (loading) {
  //   return <div>Loading FAQs...</div>; // Display a loading message
  // }

  // if (error) {
  //   return <div>Error: {error.message}</div>; // Display an error message
  // }

  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center px-6 md:px-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 w-full">
        {/* Left Side: Title & Description */}
        <div className="md:w-1/3 md:-ml-22">
          {" "}
          {/* Shift slightly left */}
          <h3 className="text-lg text-gray-600">• Explore Our Advantages</h3>
          <h2 className="text-5xl font-bold mt-3 leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 mt-4 text-lg">
            At HL City, we offer more than just real estate services, we provide
            an unparalleled experience tailored to meet your needs and exceed
            your expectations.
          </p>
        </div>

        {/* Right Side: FAQ List */}
        <div className="md:w-2/3 bg-[#F9F8F6] p-8 rounded-2xl shadow-lg w-full">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b last:border-none">
              <button
                className="flex justify-between items-center w-full py-5 text-left text-lg font-medium"
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                {openIndex === index ? (
                  <FaMinus className="text-gray-500 text-xl" />
                ) : (
                  <FaPlus className="text-gray-500 text-xl" />
                )}
              </button>

              {/* Answer - Expands when clicked */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index
                    ? "max-h-40 opacity-100 py-2"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-gray-600 text-lg">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
        <div class="mb-4">
 
</div>
      </div>
    </div>
  );
};

export default FAQSection;
