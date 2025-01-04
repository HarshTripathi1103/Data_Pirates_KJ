import JsCompiler from "./Compiler/JsCompiler"
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
function App() {

  return (
    <>
      <JsCompiler/>
      <SpeedInsights/>
      <Analytics/>
      </>
  )
}

export default App
