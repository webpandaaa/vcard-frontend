import { useEffect, useState} from "react";
import Swiper from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import "./Home.css";
import { Autoplay } from 'swiper/modules';
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import LoginPopup from "../Components/LoginPopup";


const Home = () => {
   const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigate = useNavigate();
  
  
  const handleCreateCard = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/create");
    } else {
      setShowLoginPopup(true);
    }
  };

  const onLoginSuccess = () => {
    setShowLoginPopup(false);
    navigate("/create");
  };
  
  useEffect(() => {
    Swiper.use([Autoplay]);
  
    new Swiper(".templates-swiper", {
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      slidesPerView: 1,
      spaceBetween: 20,
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });
  }, []);

  return (
    <div id="main">
      {/* Navbar */}
      <Navbar/>

      {/* Hero Section */}
      <div id="hero">
        <div id="text">
          <h1>Go Beyond Paper – Make Your First Impression Digital</h1>
          <h2>Smart. Stylish. Shareable.</h2>
          <p>
            Create your digital business card in minutes and connect with clients like never
            before through customized, mobile-friendly, and shareable profiles.
          </p>
          <button className="button" onClick={()=>handleCreateCard()}>Create Your Digital Business Card</button>
        </div>
      </div>

      {/* Steps */}
      <section id="steps" className="steps-section">
        <div className="container">
          <h2 className="section-title">Build Your Smart Business Identity</h2>
          <p className="section-subtitle">
            Follow these simple steps to create your personalized smart card in minutes.
          </p>

          <div className="steps-grid">
            {[
              {
                step: "1",
                title: "Choose Your Design",
                desc: "Pick from a variety of modern, mobile-optimized layouts tailored to your profession.",
              },
              {
                step: "2",
                title: "Fill in Your Info",
                desc: "Add your name, photo, contact details, social links, and anything else that matters.",
              },
              {
                step: "3",
                title: "Go Live & Share",
                desc: "Instantly publish your card online and share it via QR code, link, or download.",
              },
            ].map((item, i) => (
              <div className="step-card" key={i}>
                <div className="step-icon step-orange">{item.step}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>

          <button className="button">Get Started</button>
        </div>
      </section>

      {/* Templates Slider */}
      <section id="demo" className="templates-section">
        <h2 className="section-title">Explore Our Templates</h2>
        <p className="section-subtitle">Swipe through some amazing card templates ready for you</p>

        <div className="swiper templates-swiper">
          <div className="swiper-wrapper">
            {["one", "two", "three", "four", "five"].map((img, idx) => (
              <div className="swiper-slide" key={idx}>
                <img src={`./images/${img}.png`} alt={`Template ${idx + 1}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="swiper-mobile">
          <img src="./images/one.png" alt="" />
        </div>

        <button className="button" onClick={()=>handleCreateCard()}>Create Your Card</button>
      </section>

      {/* Intro Section */}
      <section className="intro-section">
        <div className="intro-wrapper">
          <div className="intro-content">
            <h1 className="intro-title">Your Smartest Business Card for 2025</h1>
            <p className="intro-subtitle">
              Stand out with a professional digital card that’s always with you. Instantly share
              your info, build trust, and grow your network — no printing needed.
            </p>

            <h3 className="intro-heading">Why Go Digital?</h3>
            <p className="intro-description">
              A digital business card is more than just a contact card — it’s your personal brand,
              portfolio, and call-to-action all in one. Unlike paper cards, they never get lost or
              tossed away. You can update them anytime, share via QR or link, and track
              engagements. Going digital means going modern — and saving trees too 🌱
            </p>

            <a onClick={()=>handleCreateCard()} className="button">
              Create My Digital Card
            </a>
          </div>

          <div className="intro-image">
            <img
              src="./images/lower.png"
              alt="Digital Business Card Demo"
            />
          </div>
        </div>
      </section>

      {/* Feature Section 1 */}
      <section className="feature-section light-bg">
        <div className="feature-container reverse">
          <div id="maintain" className="feature-text">
            <h2 className="feature-title">Why a Smart Business Card Beats the Old Ones</h2>
            <p className="feature-description">
              Digital business cards are the future of networking. They’re sleek, dynamic, and
              instantly shareable. No more printing batches or worrying about outdated information —
              your digital card updates in real-time and fits right in your phone. <br />
              <br />
              Share your identity with a tap or scan, connect through your socials and websites, and
              impress clients with a modern first impression. Plus, it’s eco-friendly — because
              trees are better standing tall than printed on paper 🌳
            </p>
            <a onClick={()=>handleCreateCard()} className="button">
              Get My Digital Card
            </a>
          </div>
          <div className="feature-image">
            <img
              src="./images/middle.png"
              alt="Business Card Mockup"
            />
          </div>
        </div>
      </section>

      {/* Feature Section 2 */}
      <section className="feature-section dark-bg">
        <div className="feature-container">
          <div className="feature-text">
            <h2 className="feature-title">Need to Update Info? Edit Anytime!</h2>
            <p className="feature-description">
              Moved cities? Changed your job title? No problem. Your card evolves with you. Just log
              in, edit your details, and your contacts instantly see the updated version. No
              reprints. No hassle. <br />
              <br />
              You can customize your card on the go — update emails, numbers, addresses, even change
              your branding or profile photo in minutes. Now, staying professional is as easy as
              opening your browser.
            </p>
            <a onClick={()=>handleCreateCard()} className="button">
              Customize My Card Now
            </a>
          </div>
          <div className="feature-image">
            <img
              src="./images/upper.png"
              alt="Editable Card Image"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <h2 className="benefits-title">Why Go Digital with Your Business Card?</h2>
          <p className="benefits-subtitle">
            Elevate your first impression and make connections that matter — anytime, anywhere.
          </p>

          <div className="benefits-grid">
            {[
              {
                icon: "https://cdn-icons-png.flaticon.com/512/942/942748.png",
                title: "Create & Personalize",
                desc: "Design a card that reflects your brand — fonts, colors, logos, and more.",
              },
              {
                icon: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                title: "Instant Sharing",
                desc: "Send your card via QR, email, or link with just one click — no printing required.",
              },
              {
                icon: "https://cdn-icons-png.flaticon.com/512/2910/2910791.png",
                title: "Eco-Friendly & Cost-Saving",
                desc: "Reduce waste and save money by skipping traditional printing — it’s better for Earth 🌱",
              },
            ].map((b, i) => (
              <div className="benefit-item" key={i}>
                <img src={b.icon} alt="Benefit Icon" />
                <h4>{b.title}</h4>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <h2>Loved by Professionals Across Industries</h2>
        <p className="subtitle">
          Don’t just take our word for it — here’s what our happy users have to say.
        </p>

        <div className="testimonial-grid">
          {[
            {
              quote: "Smart, sleek, and super easy to use. Creating my business card took less than 5 minutes!",
              name: "Neha Kapoor",
              role: "Founder, BloomTech • 2 months ago",
              img: "1",
            },
            {
              quote: "Fantastic tool for networking. Love how fast and professional it feels.",
              name: "Raj Mehta",
              role: "CTO, StartBridge • 1 month ago",
              img: "2",
            },
            {
              quote: "Highly recommend for any startup founder. It’s a must-have!",
              name: "Anjali Verma",
              role: "Marketing Lead, Growly • 3 weeks ago",
              img: "3",
            },
            {
              quote: "Clean interface, intuitive features — it’s a joy to use.",
              name: "Suresh Nair",
              role: "Freelancer • 2 weeks ago",
              img: "4",
            },
            {
              quote: "This saved me so much time. Highly recommend for fast card creation.",
              name: "Aarti Sharma",
              role: "Designer • 4 weeks ago",
              img: "5",
            },
            {
              quote: "Everything worked perfectly, even on my phone. Great product!",
              name: "Vikram Joshi",
              role: "HR Head, WorkNest • 5 weeks ago",
              img: "6",
            },
          ].map((t, i) => (
            <div className="testimonial-card" key={i}>
              <p className="quote">“{t.quote}”</p>
              <div className="stars">★★★★★</div>
              <div className="user-info">
                <img src={`https://i.pravatar.cc/50?img=${t.img}`} alt="User" className="avatar" />
                <div>
                  <p className="name">{t.name}</p>
                  <p className="role">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h2>Digital vCard</h2>
            <p>Digital business cards that connect faster & smarter.</p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">Create a Card</a></li>
              <li><a href="#">Templates</a></li>
              <li><a href="#">Testimonials</a></li>
              <li><a href="#">Pricing</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Connect with Us</h4>
            <div className="social-icons">
              <a href="#"><i className="ri-linkedin-fill"></i></a>
              <a href="#"><i className="ri-twitter-x-fill"></i></a>
              <a href="#"><i className="ri-instagram-fill"></i></a>
              <a href="#"><i className="ri-behance-fill"></i></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 SmartCard. All rights reserved.</p>
        </div>
      </footer>

      <LoginPopup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        onSuccess={onLoginSuccess}
      />
      
    </div>
  );
};

export default Home;
