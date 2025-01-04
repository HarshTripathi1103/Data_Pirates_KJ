import JsCompiler from "./Compiler/JsCompiler"
import { SpeedInsights } from '@vercel/speed-insights/react';
function App() {

  return (
    <>
      <JsCompiler/>
      <SpeedInsights/>
      </>
  )
}

export default App
