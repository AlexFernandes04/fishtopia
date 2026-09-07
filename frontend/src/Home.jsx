import { useState } from 'react'
import { useNavigate } from 'react-router'
import { FileUploader } from "react-drag-drop-files";
import "./app.css"
const fileTypes = ["JPG", "PNG"];

function Home() {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  let navigate = useNavigate();

  function handleDrop(e) {
    e.preventDefault()
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles)
      setFile(newFiles[0])
    }
  }

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleFileChange(e) {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name) {
      alert("Please enter your name");
    } else if (!file) {
      alert("Please select a file");
    } else {
      console.log("making api call")
      const formData = new FormData();
      formData.append("name", name);
      formData.append("file", file);

      const backendURL = "/api/initial-upload"
      try {
        const response = await fetch(backendURL, { method: "POST", body: formData })
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`)
        }

        const blob = await response.blob();

        // const url = URL.createObjectURL(blob);

        console.log('nagivating to editor')
        navigate("/editor", { state: { blob: blob, name: name } })
      } catch (e) {
        console.log(e);
      }
    }
  }

  return (
    // <div className='text-center p-8 bg-[url(../public/underwater.png)] h-screen text-gray'>

    <div className='text-center md:p-8 p-4 h-screen w-screen text-gray-800'>
      <h1 className='md:text-7xl text-5xl font-bold text-black'>WELCOME TO FISHTOPIA</h1>
      <div className='lg:text-lg md:px-16 px-4 md:py-8 py-4 font-semibold'>
        Fishtopia is the future. To join Fishtopia, enter your name, draw a picture of your fish or other aquatic creature on a piece of paper, take a picture, and upload it below. Your drawing will be transported to Fishtopia where it will join the ranks of other people's drawings
      </div>
      <div className='text-lg'>
        <h2 className='text-xl'>Here are some tips to help get your fish into Fishtopia</h2>
        <ul className='text-left px-8 py-4'>
          <li>- Make sure your fish is facing right</li>
          <li>- Ensure your drawing is a continuous closed shape. The thicker the outline, the better the extraction will be</li>
          <li>- Make your drawing on a blank piece of paper and take a photo with nothing else in frame except for the drawing (Don't include the outline of the paper, etc)</li>
          <li>- Avoid shadows in your picture by taking it next to a bright light source or using flash in dim lighting</li>
          <l1>- If it still isn't working just call Alex</l1>
        </ul>
      </div>
      <div>
        <form id="initial-form" onSubmit={handleSubmit}>
          <input type="text" value={name} onChange={handleNameChange} placeholder="Enter your name" className='bg-slate-200 rounded-xl text-1xl px-4 py-2 my-2 border border-slate-400' />
          {/* <input type="file" value="" onChange={handleFileChange}></input> */}
        </form>
        <div className={`py-4 m-4 rounded-4xl text-lg lg:w-1/3 w-5/6 place-self-center border border-dashed border-slate-400 ${file == null ? "bg-gray-100" : "bg-emerald-100 "}`} onDrop={handleDrop} onDragOver={(event) => event.preventDefault()}>
          <div className='m-4 bg-blue-500 text-white rounded-full border font-bold w-38 place-self-center p-4'>
            <input type="file" hidden id="browse" name="file" onChange={handleFileChange} accept=".png, .jpg, .jpeg" />
            <label htmlFor="browse" >Browse Files</label>
          </div>
          <div>
            {file == null ? <div>or drag and drop your picture<p>Supported files: .JPG, .PNG, .JPEG</p></div> : (
              <div>
                <p>{file.name}</p>
                <button onClick={() => setFile(null)}> Delete </button>
              </div>
            )}
          </div>
        </div>
        <button type="submit" form="initial-form" className='text-xl p-4 px-8 rounded-lg bg-slate-200 place-self-center md:my-0 my-4'>Continue</button>
      </div>
    </div>

  )
}

export default Home
