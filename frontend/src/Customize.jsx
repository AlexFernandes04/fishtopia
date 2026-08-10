import { useLocation, useNavigate } from "react-router"
import { useState, useEffect } from 'react';
import "./App.css"
import "../public/underwater.PNG"

function App() {
    const { state } = useLocation()
    const [imageUrl, setImageUrl] = useState(null)
    const [name, setName] = useState("")
    const [blob, setBlob] = useState(null)

    const [inputs, setInputs] = useState({});
    const navigate = useNavigate();

    const radioStyle = "mx-2"
    const rangeStyle = "m-2"

    useEffect(() => {
        if (state == null) {
            console.log("state is null!!")
            navigate("/")
        } else {
            setName(state.name)
            const extractedBlob = state.blob
            setBlob(extractedBlob)

            const url = URL.createObjectURL(extractedBlob)
            setImageUrl(url)
        }
        return () => {
            if (imageUrl) URL.revokeObjectURL(imageUrl);
        };
    }, [])

    async function submitForm(e) {
        e.preventDefault();

        inputs["size"] = inputs["size"] || e.target.size.value
        inputs["sociallvl"] = inputs["sociallvl"] || e.target.sociallvl.value
        inputs["anxietylvl"] = inputs["anxietylvl"] || e.target.anxietylvl.value
        inputs["speed"] = inputs["speed"] || e.target.speed.value
        inputs["sleeplength"] = inputs["sleeplength"] || e.target.sleeplength.value
        inputs["sleephabits"] = inputs["sleephabits"] || e.target.sleephabits.value
        inputs["philosophy"] = inputs["philosophy"] || e.target.sleephabits.value

        const formData = new FormData();
        formData.append("name", name);
        formData.append("image", blob);
        formData.append("size", inputs["size"]);
        formData.append("sociallvl", inputs["sociallvl"]);
        formData.append("anxietylvl", inputs["anxietylvl"]);
        formData.append("speed", inputs["speed"]);
        formData.append("sleeplength", inputs["sleeplength"]);
        formData.append("sleephabits", inputs["sleephabits"]);
        formData.append("philosophy", inputs["philosophy"]);
        console.log("form submitted: ", inputs)

        try {
            const response = await fetch("http://127.0.0.1:5000/final-upload", { method: "POST", body: formData })
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`)
            }

            if (response.data = "ok") {
                console.log("success")
            }
        } catch (e) {
            console.log(e)
        }

    }

    function goBack(e) {
        navigate("/")
    }

    function handleChange(e) {
        const name = e.target.name;
        const value = e.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    return (<div className="w-full h-screen">
        <h1 className="md:p-8 p-4 text-4xl lg:text-6xl font-bold text-center">{state ? name : ""}'s fish</h1>
        <div className="lg:grid lg:grid-cols-2">
            <div className="lg:px-8 px-4">
                <div className="bg-[url(../public/underwater.PNG)] bg-cover rounded-4xl border-8 border-gray-100 p-16 w-full h-full bg-center">
                    <div className="floating place-self-center">
                        <img src={imageUrl}></img>
                    </div>
                </div>
            </div>
            <div className="lg:m-0 m-4 md:px-8 px-4 font-semibold text-gray-900 bg-gray-100 border border-gray-300 rounded-4xl">
                <form id="customize-form" onSubmit={submitForm}>
                    <h1 className="text-2xl font-bold pt-4">Fish Editor</h1>
                    <div className="my-2">
                        <label className="text-xl">Size</label>
                        <div>
                            Small<input className={rangeStyle} type="range" name="size" min="1" max="5" value={inputs.size} onChange={handleChange} />Large
                        </div>
                    </div>
                    <div className="my-2 ">
                        <label className="text-xl">Fish Social Level</label>
                        <div className="mt-2">
                            <input id="introvert" className={radioStyle} type="radio" name="sociallvl" value="introvert" onChange={handleChange} />
                            <label for="introvert" className="">Introvert</label>
                            <input id="inbetween" className={radioStyle} type="radio" name="sociallvl" value="inbetween" onChange={handleChange} defaultChecked />
                            <label for="inbetween" className="">In Between</label>
                            <input id="extrovert" className={radioStyle} type="radio" name="sociallvl" value="extrovert" onChange={handleChange} />
                            <label for="extrovert" className="">Extovert</label>
                        </div>
                    </div>
                    <div className="my-2 ">
                        <label className="text-xl">Fish Anxiety Level</label>
                        <div>
                            Frantic<input className={rangeStyle} type="range" name="anxietylvl" min="1" max="5" value={inputs.anxietylvl} onChange={handleChange} />Calm
                        </div>
                    </div>
                    <div className="my-2">
                        <label className="text-xl">Speed</label>
                        <div>
                            Slow<input className={rangeStyle} type="range" name="speed" min="1" max="5" value={inputs.speed} onChange={handleChange} />Fast
                        </div>

                    </div>
                    <div className="my-2">
                        <label className="text-xl">Amount of Sleep Needed</label>
                        <div>
                            None<input className={rangeStyle} type="range" name="sleeplength" min="1" max="5" value={inputs.sleeplength} onChange={handleChange} />A Lot
                        </div>
                    </div>
                    <div className="my-2 ">
                        <label className="text-xl">Fish Sleep Habits</label>
                        <div className="mt-2">
                            <input id="morning" className={radioStyle} type="radio" name="sleephabits" value="21" onChange={handleChange} />
                            <label for="morning" className="">Morning Fish</label>
                            <input id="inbetween" className={radioStyle} type="radio" name="sleephabits" value="23" onChange={handleChange} defaultChecked />
                            <label for="inbetween" className="">In Between</label>
                            <input id="night" className={radioStyle} type="radio" name="sleephabits" value="1" onChange={handleChange} />
                            <label for="night" className="">Night Fish</label>
                        </div>
                    </div>
                    <div className="my-2">
                        <label className="text-xl">Fish Philosophy</label>
                        <div className="mt-2">
                            <input id="stoicism" className={radioStyle} type="radio" name="philosophy" value="stoicism" onChange={handleChange} />
                            <label for="stoicism" className="">Stoicism</label>
                            <input id="utilitarianism" className={radioStyle} type="radio" name="philosophy" value="utilitarianism" onChange={handleChange} />
                            <label for="utilitarianism" className="">Utilitarianism</label>
                            <input id="hedonism" className={radioStyle} type="radio" name="philosophy" value="hedonism" onChange={handleChange} defaultChecked />
                            <label for="hedonism" className="">Hedonism</label>
                            <input id="existentialism" className={radioStyle} type="radio" name="philosophy" value="existentialism" onChange={handleChange} />
                            <label for="existentialism" className="">Existentialism</label>
                            <input id="nihilism" className={radioStyle} type="radio" name="philosophy" value="nihilism" onChange={handleChange} />
                            <label for="nihilism" className="">Nihilism</label>
                        </div>
                    </div>
                </form>
            </div>

        </div>
        <div>
            <button onClick={goBack} className="rounded-lg md:m-8 m-4 md:p-4 p-2 font-bold text-lg md:text-2xl text-white bg-sky-500">Go Back</button>
            <button type="submit" form="customize-form" className="absolute right-0 rounded-lg md:m-8 m-4 md:p-4 p-2 font-bold text-lg md:text-2xl text-white bg-sky-500">Submit</button>

        </div>
    </div>)
}

export default App

