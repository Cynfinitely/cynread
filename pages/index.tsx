import { firestore } from "../lib/firebase";
import { useState } from "react";

const Home: React.FC = () => {
  const [page, setPage] = useState<number | null>(null);

  const getNextPage = async () => {
    const counterRef = firestore.collection("counters").doc("counter");

    try {
      // Firestore transaction to get the next page number
      await firestore.runTransaction(async (transaction) => {
        const doc = await transaction.get(counterRef);

        let currentValue = doc.exists ? doc.data()?.value : null;

        // If the counter doesn't exist or has reached 604, reset it to 1
        if (currentValue === null || currentValue >= 604) {
          currentValue = 1;
        } else {
          currentValue += 1;
        }

        // Update the counter in Firestore
        transaction.set(counterRef, { value: currentValue });
        setPage(currentValue); // Update the local page state
      });
    } catch (error) {
      console.error("Sayfa numarasını alırken hata oluştu:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Kuran Hatim Programı</h1>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        {page === null
          ? `Sayfa alarak başlaybilirsiniz`
          : `Şu an ki sayfa: ${page}`}
      </div>

      <button
        onClick={getNextPage}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}>
        {page === null ? "İlk Sayfayı Ver" : "Sonraki Sayfayı Ver"}
      </button>
      {page !== null && (
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingBottom: "75%", // Aspect ratio for responsiveness
            height: 0,
            overflow: "hidden",
          }}>
          {/* Iframe */}
          <iframe
            src={`https://kuran.hayrat.com.tr/icerik/kuran_hizmetlerimiz/kuran-oku.aspx?sayfa=${page}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
            title={`Kuran Sayfa ${page}`}></iframe>

          {/* Transparent Overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "transparent", // Make the overlay invisible
              zIndex: 1, // Ensure it is above the iframe
            }}></div>
        </div>
      )}
    </div>
  );
};

export default Home;
