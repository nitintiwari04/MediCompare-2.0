import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/hospitals")
      .then((response) => {
        setHospitals(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load hospitals");
        setLoading(false);
      });
  }, []);

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">
          Medi<span>Compare</span>
        </div>

        <nav>
          <a href="#hospitals">Hospitals</a>
          <a href="#treatments">Treatments</a>
          <a href="#about">About</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">HEALTHCARE PRICE TRANSPARENCY</p>

            <h1>
              Compare healthcare.
              <br />
              <span>Choose smarter.</span>
            </h1>

            <p className="hero-description">
              Compare hospitals, treatments, facilities and prices in one
              simple platform.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                document
                  .getElementById("hospitals")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Hospitals
            </button>
          </div>
        </section>

        <section id="hospitals" className="hospitals-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">FIND THE RIGHT HOSPITAL</p>
              <h2>Hospitals</h2>
            </div>

            <p>
              Explore healthcare providers available on MediCompare.
            </p>
          </div>

          {loading && <p className="status">Loading hospitals...</p>}

          {error && <p className="status error">{error}</p>}

          {!loading && !error && hospitals.length === 0 && (
            <p className="status">No hospitals found.</p>
          )}

          <div className="hospital-grid">
            {hospitals.map((hospital) => (
              <article className="hospital-card" key={hospital._id}>
                <div className="card-top">
                  <div className="hospital-icon">+</div>

                  <div className="rating">
                    ★ {hospital.rating ?? "N/A"}
                  </div>
                </div>

                <h3>{hospital.name}</h3>

                <p className="location">
                  📍 {hospital.address}, {hospital.city}
                </p>

                <p className="description">{hospital.description}</p>

                <div className="specialties">
                  {hospital.specialties?.slice(0, 4).map((specialty) => (
                    <span key={specialty}>{specialty}</span>
                  ))}
                </div>

                <div className="card-footer">
                  <span>
                    {hospital.facilities?.length ?? 0} facilities
                  </span>

                  <button>View Details →</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;