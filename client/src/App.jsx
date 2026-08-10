import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [hospitals, setHospitals] = useState([]);
  const [treatments, setTreatments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [treatmentLoading, setTreatmentLoading] = useState(true);

  const [error, setError] = useState("");
  const [treatmentError, setTreatmentError] = useState("");

  const [selectedTreatmentName, setSelectedTreatmentName] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [comparisonSort, setComparisonSort] = useState("price-asc");

  // Fetch hospitals
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

  // Fetch treatments
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/treatments")
      .then((response) => {
        setTreatments(response.data.data);
        setTreatmentLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setTreatmentError("Unable to load treatments");
        setTreatmentLoading(false);
      });
  }, []);

    const comparisonTreatments = selectedTreatmentName
     ? treatments.filter(
      (treatment) =>
        treatment.name === selectedTreatmentName
    )
  : [];

      const sortedComparisonTreatments = [
  ...comparisonTreatments,
].sort((a, b) => {
  if (comparisonSort === "price-asc") {
    return a.price - b.price;
  }

  if (comparisonSort === "price-desc") {
    return b.price - a.price;
  }

  if (comparisonSort === "hospital") {
    return (a.hospital?.name || "").localeCompare(
      b.hospital?.name || ""
    );
  }

  return 0;
});

   const hospitalTreatments = selectedHospital
  ? treatments.filter(
      (treatment) =>
        treatment.hospital?._id === selectedHospital._id
    )
  : [];

      const filteredTreatments = treatments.filter((treatment) => {
  const search = searchTerm.toLowerCase();

  return (
    treatment.name?.toLowerCase().includes(search) ||
    treatment.category?.toLowerCase().includes(search) ||
    treatment.hospital?.name?.toLowerCase().includes(search)
  );
});

    const cheapestPrice =
     comparisonTreatments.length > 0
      ? Math.min(
        ...comparisonTreatments.map(
          (treatment) => treatment.price
        )
      )
    : null;

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
        {/* Hero */}
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

        {/* Hospitals */}
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

          {loading && (
            <p className="status">Loading hospitals...</p>
          )}

          {error && (
            <p className="status error">{error}</p>
          )}

          {!loading && !error && hospitals.length === 0 && (
            <p className="status">No hospitals found.</p>
          )}

          <div className="hospital-grid">
            {hospitals.map((hospital) => (
              <article
                className="hospital-card"
                key={hospital._id}
              >
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

                <p className="description">
                  {hospital.description}
                </p>

                <div className="specialties">
                  {hospital.specialties
                    ?.slice(0, 4)
                    .map((specialty) => (
                      <span key={specialty}>
                        {specialty}
                      </span>
                    ))}
                </div>

                <div className="card-footer">
                  <span>
                    {hospital.facilities?.length ?? 0} facilities
                  </span>

                   <button
                     onClick={() => setSelectedHospital(hospital)}
                              >
                      View Details →
                    </button>
                </div>
              </article>
            ))}
          </div>
        </section>

         {selectedHospital && (
  <section className="hospital-details-section">
    <div className="section-heading">
      <div>
        <p className="eyebrow">
          HOSPITAL DETAILS
        </p>

        <h2>{selectedHospital.name}</h2>

        <p>
          Complete information about this healthcare provider.
        </p>
      </div>

      <button
        className="close-button"
        onClick={() => setSelectedHospital(null)}
      >
        Close
      </button>
    </div>

    <div className="hospital-details-card">
      <div className="hospital-details-header">
        <div className="hospital-large-icon">
          +
        </div>

        <div>
          <h3>{selectedHospital.name}</h3>

          <div className="detail-rating">
            ★ {selectedHospital.rating ?? "N/A"}
          </div>
        </div>
      </div>

      <p className="hospital-detail-description">
        {selectedHospital.description}
      </p>

      <div className="hospital-info-grid">
        <div>
          <p className="comparison-label">
            Location
          </p>

          <strong>
            {selectedHospital.address},{" "}
            {selectedHospital.city}
          </strong>
        </div>

        <div>
          <p className="comparison-label">
            Phone
          </p>

          <strong>
            {selectedHospital.phone || "Not available"}
          </strong>
        </div>

        <div>
          <p className="comparison-label">
            Email
          </p>

          <strong>
            {selectedHospital.email || "Not available"}
          </strong>
        </div>
      </div>

      <div className="hospital-detail-group">
        <p className="comparison-label">
          Specialties
        </p>

        <div className="specialties">
          {selectedHospital.specialties?.map(
            (specialty) => (
              <span key={specialty}>
                {specialty}
              </span>
            )
          )}
        </div>
      </div>

      <div className="hospital-detail-group">
        <p className="comparison-label">
          Facilities
        </p>

        <div className="specialties">
          {selectedHospital.facilities?.map(
            (facility) => (
              <span key={facility}>
                {facility}
              </span>
            )
          )}
        </div>
      </div>
           <div className="hospital-treatments">
  <div className="hospital-treatments-heading">
    <div>
      <p className="comparison-label">
        AVAILABLE TREATMENTS
      </p>

      <h3>
        Treatments at {selectedHospital.name}
      </h3>
    </div>
  </div>

  {hospitalTreatments.length === 0 ? (
    <p className="status">
      No treatments available.
    </p>
  ) : (
    <div className="hospital-treatment-grid">
      {hospitalTreatments.map((treatment) => (
        <article
          className="hospital-treatment-card"
          key={treatment._id}
        >
          <div>
            <p className="treatment-category">
              {treatment.category}
            </p>

            <h4>{treatment.name}</h4>

            <p>
              {treatment.description}
            </p>
          </div>

          <div className="hospital-treatment-footer">
            <div>
              <span>Price</span>

              <strong>
                ₹
                {treatment.price?.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

            <div>
              <span>Duration</span>

              <strong>
                {treatment.duration}
              </strong>
            </div>

            <button
              className="compare-button"
              onClick={() =>
                setSelectedTreatmentName(
                  treatment.name
                )
              }
            >
              Compare
            </button>
          </div>
        </article>
      ))}
    </div>
  )}
</div>
    </div>
  </section>
)}

        {/* Treatments */}
        <section
          id="treatments"
          className="treatments-section"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                COMPARE HEALTHCARE PRICES
              </p>

              <h2>Treatments</h2>
            </div>

              <div className="treatment-search">
            <input
              type="text"
              placeholder="Search treatment..."
              value={searchTerm}
              onChange={(event) =>
              setSearchTerm(event.target.value)
    }
  />
</div>

            <p>
              Compare treatment prices and details across
              hospitals.
            </p>
          </div>

          {treatmentLoading && (
            <p className="status">
              Loading treatments...
            </p>
          )}

          {treatmentError && (
            <p className="status error">
              {treatmentError}
            </p>
          )}

          {!treatmentLoading &&
            !treatmentError &&
            treatments.length === 0 && (
              <p className="status">
                No treatments found.
              </p>
            )}

          <div className="treatment-grid">
            {filteredTreatments.map((treatment) => (
              <article
                className="treatment-card"
                key={treatment._id}
              >
                <div className="treatment-header">
                  <span className="category">
                    {treatment.category}
                  </span>

                  <span className="price">
                    ₹
                    {treatment.price?.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <h3>{treatment.name}</h3>

                <p className="description">
                  {treatment.description}
                </p>

                <div className="treatment-details">
                  <span>
                    Hospital:{" "}
                    <strong>
                      {treatment.hospital?.name}
                    </strong>
                  </span>

                  <span>
                    Duration:{" "}
                    <strong>
                      {treatment.duration}
                    </strong>
                  </span>
                </div>

                <button
                  className="compare-button"
                   onClick={() =>
                     setSelectedTreatmentName(treatment.name)
                  }
                >
                  Compare
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* Comparison */}
        {selectedTreatmentName && (
  <section className="comparison-section">
     <div className="section-heading">
  <div>
    <p className="eyebrow">TREATMENT COMPARISON</p>

    <h2>{selectedTreatmentName}</h2>

    <div className="comparison-sort">
      <label htmlFor="comparison-sort">
        Sort by:
      </label>

      <select
        id="comparison-sort"
        value={comparisonSort}
        onChange={(event) =>
          setComparisonSort(event.target.value)
        }
      >
        <option value="price-asc">
          Lowest Price
        </option>

        <option value="price-desc">
          Highest Price
        </option>

        <option value="hospital">
          Hospital Name
        </option>
      </select>
    </div>
  </div>

  <button
    className="close-button"
    onClick={() => setSelectedTreatmentName(null)}
  >
    Clear
  </button>
</div>

    <div className="comparison-table-wrapper">
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Hospital</th>
            <th>Price</th>
            <th>Duration</th>
            <th>Location</th>
            <th>Value</th>
          </tr>
        </thead>

        <tbody>
           {sortedComparisonTreatments.map((treatment) => {
            const isCheapest =
              treatment.price === cheapestPrice;

            return (
              <tr
                key={treatment._id}
                className={
                  isCheapest ? "cheapest-row" : ""
                }
              >
                <td>
                  <strong>
                    {treatment.hospital?.name}
                  </strong>
                </td>

                <td>
                  <strong className="table-price">
                    ₹
                    {treatment.price?.toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </td>

                <td>{treatment.duration}</td>

                <td>
                  {treatment.hospital?.city}
                </td>

                <td>
                  {isCheapest && (
                    <span className="best-price">
                      🏆 Cheapest
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </section>
)}

      </main>
    </div>
  );
}

export default App;