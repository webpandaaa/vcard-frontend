import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import ShowCard from "./ShowCard";

const LiveCard = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true); // loading state

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const response = await axios.get(`https://vcard-backend.onrender.com/card/find/${id}`);
        console.log(response.data.card);
        setFormData(response.data.card);
      } catch (error) {
        console.error("Error fetching card data:", error);
      } finally {
        setLoading(false); // Set loading to false whether success or error
      }
    };

    fetchCardData();
  }, [id]);


  return (
    <div id="main">
      <Navbar />
      <div className="livecard">
        {loading ? (
          <div className="loading-state">Loading card...</div> // You can style this
        ) : formData ? (
          <ShowCard formData={formData} />
        ) : (
          <div className="error-message">Card not found or failed to load.</div>
        )}
      </div>
    </div>
  );
};

export default LiveCard;
