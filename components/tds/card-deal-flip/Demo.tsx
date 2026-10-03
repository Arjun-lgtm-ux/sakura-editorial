import { CardDealFlip, type DealCard } from "./CardDealFlip";

export function CardDealFlipDemo({
  onLaunch,
}: {
  onLaunch?: (title: string) => void;
} = {}) {
  const cards: DealCard[] = [
    {
      title: "Highwall Instability & Rockfall Mapping",
      number: "01",
      color: "#3d5a80",
      textColor: "#ffffff",
      tag: "Geological Risk",
      description:
        "Augmented reality LiDAR mesh mapping highwall micro-fractures, rockfall velocity trajectories, and automated safety exclusion perimeters.",
      items: [
        "Highwall slope angle scan",
        "Fracture displacement tracking",
        "Exclusion zone establishment",
        "99.2% LiDAR Accuracy Target",
      ],
      onLaunch: () => onLaunch?.("Highwall Instability & Rockfall Mapping"),
    },
    {
      title: "Heavy Haul Truck Blind-Spot Simulation",
      number: "02",
      color: "#f5b09a",
      textColor: "#ffffff",
      tag: "Fleet Safety",
      description:
        "360-degree cockpit view overlaying dynamic blind-zone cones, pedestrian proximity alerts, and haul road intersection right-of-way protocols.",
      items: [
        "Pre-ignition 3D walkaround",
        "Blind spot radar calibration",
        "Dump area reversing guidance",
        "98.7% Operational Score",
      ],
      onLaunch: () => onLaunch?.("Heavy Haul Truck Blind-Spot Simulation"),
    },
    {
      title: "Zero-Visibility Evacuation & Toxic Gas Drill",
      number: "03",
      color: "#f5e08a",
      textColor: "#ffffff",
      tag: "Life Safety",
      description:
        "Spatial AR pathfinding through dense smoke toward primary refuge chambers with real-time toxic gas threshold HUD simulation.",
      items: [
        "SCBA mask seal verification",
        "Refuge chamber beacon lock",
        "Atmospheric air testing HUD",
        "99.8% Evacuation Success",
      ],
      onLaunch: () => onLaunch?.("Zero-Visibility Evacuation & Toxic Gas Drill"),
    },
    {
      title: "Smart PPE & Thermal Fatigue Audit",
      number: "04",
      color: "#800020",
      textColor: "#ffffff",
      tag: "Worker Vitals",
      description:
        "Automated edge-AI verification of chin straps, high-visibility vest retro-reflectivity, and wearable core thermal strain monitoring.",
      items: [
        "Biometric heart-rate check",
        "Helmet harness lock test",
        "Dust particulate filter rating",
        "99.5% Compliance Index",
      ],
      onLaunch: () => onLaunch?.("Smart PPE & Thermal Fatigue Audit"),
    },
  ];

  return (
    <>
      <CardDealFlip
        name="OUR AR MODULES"
        intro="Immersive 3D and spatial augmented reality simulations engineered for open-pit mining hazards, heavy equipment pre-operation drills, and emergency evacuation protocols."
        tags={["Spatial Computing", "Vocational Safety"]}
        cards={cards}
        heading="Interactive AR Safety Drills"
        bars={["Vocational Training", "[ DGMS Compliant ]"]}
      >
        <section className="tds-dealdemo__about">
          <div className="tds-dealdemo__col1">
            <span />
            <div className="tds-dealdemo__head">
              <p className="tds-deal__mono">
                <span aria-hidden>&#9654;</span> Standard Procedures
              </p>
              <h3>Protocols We Have Practised For Mine Safety</h3>
            </div>
          </div>
          <div className="tds-dealdemo__col2">
            {[
              {
                a: "01",
                b: "Hazard Scan",
                imgA: "/images/protocols/protocol-01-hazard-scan.png",
                c: "02",
                d: "3D Inspection",
                imgB: "/images/protocols/protocol-02-3d-inspection.png",
              },
              {
                a: "03",
                b: "AR Drill",
                imgA: "/images/protocols/protocol-03-ar-drill.jpg",
                c: "04",
                d: "Safe Evacuation",
                imgB: "/images/protocols/protocol-04-safe-evacuation.png",
              },
            ].map((row, idx) => (
              <div key={idx} className="tds-dealdemo__row">
                <div className="tds-dealdemo__card group">
                  <div
                    className="tds-dealdemo__card-img"
                    style={{ backgroundImage: `url(${row.imgA})` }}
                  />
                  <div className="tds-dealdemo__card-overlay" />
                  <div className="tds-dealdemo__card-inner">
                    <p className="tds-deal__mono">[ Protocol {row.a} ]</p>
                    <h4>{row.b}</h4>
                  </div>
                </div>
                <div className="tds-dealdemo__card group">
                  <div
                    className="tds-dealdemo__card-img"
                    style={{ backgroundImage: `url(${row.imgB})` }}
                  />
                  <div className="tds-dealdemo__card-overlay" />
                  <div className="tds-dealdemo__card-inner">
                    <p className="tds-deal__mono">[ Protocol {row.c} ]</p>
                    <h4>{row.d}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </CardDealFlip>
      <div className="tds-deal">
        <section className="tds-dealdemo__outro">
          <div className="tds-dealdemo__outro-header">
            <h3>
              {"Empower Frontline Workers".split(" ").map((word, wIdx) => (
                <span
                  key={wIdx}
                  className="inline-block whitespace-nowrap mr-[0.25em] last:mr-0"
                >
                  {word.split("").map((letter, lIdx) => (
                    <span key={lIdx} className="tds-dealdemo__letter">
                      {letter}
                    </span>
                  ))}
                </span>
              ))}
            </h3>
          </div>

          <div className="tds-dealdemo__footer">
            <div className="tds-dealdemo__footer-grid">
              {/* PLATFORM column */}
              <div className="tds-dealdemo__footer-col">
                <h4 className="tds-dealdemo__footer-title">PLATFORM</h4>
                <ul className="tds-dealdemo__footer-links">
                  <li>
                    <a
                      href="#hero"
                      onClick={(e) => {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      Know About Ad Marsal
                    </a>
                  </li>
                  <li>
                    <a
                      href="#ar-training"
                      onClick={(e) => {
                        e.preventDefault();
                        document
                          .getElementById("ar-training")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      Safety Tips
                    </a>
                  </li>
                  <li>
                    <a href="mailto:pkranti280@gmail.com">Contact Us</a>
                  </li>
                  <li>
                    <a
                      href="#privacy"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#terms"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Terms &amp; Conditions
                    </a>
                  </li>
                  <li>
                    <a
                      href="#copyright"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Copyright Policy
                    </a>
                  </li>
                </ul>
              </div>

              {/* CONNECT column */}
              <div className="tds-dealdemo__footer-col">
                <h4 className="tds-dealdemo__footer-title">CONNECT</h4>
                <div className="tds-dealdemo__connect-list">
                  <a
                    href="https://www.instagram.com/krantipatil_?stkn=MWQ3dnRxMWd0bDJ5YQ=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tds-dealdemo__connect-link group"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="tds-dealdemo__icon"
                      aria-hidden="true"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                    <span>Instagram: Krantipatil_</span>
                    <span className="tds-dealdemo__arrow opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                      ↗
                    </span>
                  </a>

                  <a
                    href="mailto:pkranti280@gmail.com"
                    className="tds-dealdemo__connect-link group"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="tds-dealdemo__icon"
                      aria-hidden="true"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <span>pkranti280@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="tds-dealdemo__footer-bottom">
              <p className="tds-deal__mono">
                © 2026 AD MARSAL · VOCATIONAL SPATIAL AR INTELLIGENCE
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
