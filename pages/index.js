import { useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

const stations = [
  {
    title: "Ehemalige Synagoge Ulm",
    description:
      "Hier stand bis 1938 die Synagoge der jüdischen Gemeinde Ulm. In der Pogromnacht wurde sie zerstört.",
    location: "Weinhofberg 6, 89073 Ulm",
    coordinates: [48.3992, 9.9936],
    image: "/images/synagoge.jpg",
    audio: "/audio/synagoge.mp3"
  },
  {
    title: "KZ-Außenlager Oberer Kuhberg",
    description:
      "Das Konzentrationslager am Oberen Kuhberg war ein Ort von Leid und Angst. Hier wurden Gegner des NS-Regimes eingesperrt.",
    location: "Oberer Kuhberg 2, 89077 Ulm",
    coordinates: [48.3825, 9.9818],
    image: "/images/kuhberg.jpg",
    audio: "/audio/kuhberg.mp3"
  },
  {
    title: "Stolpersteine Ulm",
    description:
      "Diese kleinen Steine erinnern an Menschen, die von den Nazis verfolgt wurden. Sie liegen vor ihren letzten Wohnungen.",
    location: "verschiedene Orte in Ulm",
    coordinates: [48.4011, 9.9876],
    image: "/images/stolpersteine.jpg",
    audio: "/audio/stolpersteine.mp3"
  }
];

const quizQuestions = [
  {
    question: "Wann wurde die Synagoge in Ulm zerstört?",
    options: ["1945", "1938", "1933", "1920"],
    answer: "1938"
  },
  {
    question: "Was war das Lager am Oberen Kuhberg?",
    options: [
      "Ein Krankenhaus",
      "Ein Kino",
      "Ein Gefängnis für Gegner der Nazis",
      "Ein Park"
    ],
    answer: "Ein Gefängnis für Gegner der Nazis"
  }
];

export default function Home() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (option) => {
    if (option === quizQuestions[currentQuestion].answer) {
      setScore(score + 1);
    }
    const next = currentQuestion + 1;
    if (next < quizQuestions.length) {
      setCurrentQuestion(next);
    } else {
      setShowResult(true);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Virtueller Rundgang durch Ulm</h1>
      <p>Erkunde historische Orte aus der NS-Zeit in Ulm – mit Karte, Bildern, Audio und Quiz.</p>

      <Map stations={stations} />

      {stations.map((s, i) => (
        <div key={i} style={{ border: "1px solid #ccc", borderRadius: 10, padding: 16, marginBottom: 20 }}>
          <h2>{s.title}</h2>
          <img src={s.image} alt={s.title} style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 8 }} />
          <p>{s.description}</p>
          <audio controls src={s.audio} style={{ width: "100%" }} />
          <small>{s.location}</small>
        </div>
      ))}

      {!quizStarted && (
        <button onClick={() => setQuizStarted(true)} style={{ padding: 10, background: "#444", color: "white", borderRadius: 8 }}>
          Quiz starten
        </button>
      )}

      {quizStarted && !showResult && (
        <div style={{ marginTop: 20 }}>
          <h3>{quizQuestions[currentQuestion].question}</h3>
          {quizQuestions[currentQuestion].options.map((opt, idx) => (
            <button key={idx} onClick={() => handleAnswer(opt)} style={{ display: "block", margin: "8px 0", padding: 8 }}>
              {opt}
            </button>
          ))}
        </div>
      )}

      {showResult && (
        <div style={{ marginTop: 20 }}>
          <h3>Ergebnis</h3>
          <p>Du hast {score} von {quizQuestions.length} Fragen richtig beantwortet.</p>
        </div>
      )}
    </div>
  );
}
