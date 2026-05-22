import { useState } from "react";

interface PredictionResponse {
  predictedClass: string;
  confidence?: number;
}

function App() {
  const [showForm, setShowForm] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if(!image) {
      alert("Select an image");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("/api/infer", {
        method: "POST",
        body: formData,
      });

      if(!response.ok) {
        throw new Error("It was not possible to get an answear");
      }

      const data: PredictionResponse = await response.json();

      setResult(data);

    } catch (error) {
      console.error(error);
      alert("Fail to communicate");
    } finally {
      setLoading(false);
    }

  }

  return (
    <>
      <div className="bg-[#0F172A] w-screen min-h-screen flex flex-col items-center justify-between pt-5 gap">
        <div className="flex flex-row items-center justify-center gap-4">
          <img className="h-36 w-36" src="game-icons_blacksmith.png" alt="" />
          <h1 className="text-4xl underline decoration-double uppercase text-[#E4CCFF] font-bold">Appraiser of Arms</h1>
          <img className="h-36 w-36" src="game-icons_blacksmith(flip).png" alt="" />
        </div>
        <div className="flex flex-col items-center justify-center">
          <img className="h-60 w-60" src="game-icons_fire-gem.png" alt="" />
          <h2 className="text-3xl uppercase text-[#E4CCFF] font-bold">Present thine weapon, warrior</h2>
          <button className="w-64 h-12 text-3xl text-[#E4CCFF] capitalize outline-2 text-center mt-20 cursor-pointer font-semibold border rounded" onClick={() => setShowForm(!showForm)}>Present Weapon</button>
          
          {showForm && (
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-around mt-5">
              <h1 className="text-[#E4CCFF] text-3xl font-bold">Select your weapon of choice</h1>
              <input type="file" accept="image/*" onChange={(e) => {
                if (e.target.files?.[0]) {
                  setImage(e.target.files[0]);
                }
              }} className="w-full border p-2 rounded text-center text-[#E4CCFF] mt-2"/>
              <button type="submit" disabled={loading} className="text-[#E4CCFF] text-xl w-full border p-2 rounded mt-5">Submit</button>
            </form>
          )}

          {result && (
            <div>
              <h2 className="text-[#E4CCFF]">The appraiser says...</h2>
              <p className="text-[#E4CCFF]"><strong>your weapon is a</strong> {result.predictedClass}</p>
              {result.confidence !== undefined && (
                <p className="text-[#E4CCFF]"><strong>With a confidence of</strong> {" "}{(result.confidence * 100).toFixed(2)}%</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App
