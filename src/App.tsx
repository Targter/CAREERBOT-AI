
import './App.css'
import { BrowserRouter  as Router,Route,Routes} from 'react-router-dom'
import Home from './component/UploadResume'
import SkillTracker from './component/CareerTrack'
import RoadmapGenerator from './component/RoadMap'
// import VisualRoadmap from './component/RoadMapChart'
import Community from './Page.tsx/Community'
import Navbar from './component/Navbar'
import InteractiveRoadmap from './component/RoadMapInformative'
import SkillCosmosNavigator from './component/PersonalizedRoadMap'
import JobBoard from './component/JobSearch'
import Login from './component/Login'
function App() {

  return (
    <Router>
      <div className='relative'>
        <Navbar />
        <div className="pt-16">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/Login' element={<Login/>}/>
      <Route path="/SkillTracker" element={<SkillTracker />} />
      {/* <Route path="/VisualRoadmap" element={<VisualRoadmap />} /> */}
      <Route path="/RoadmapGenerator" element={<RoadmapGenerator />} />
      <Route path="/InteractiveRoadmap" element={<InteractiveRoadmap />} />
      <Route path="/Community" element={<Community />} />
      <Route path="/Roadmap" element={<SkillCosmosNavigator />} />
      <Route path='/job-tracking' element={<JobBoard/>}/>
      
    </Routes>
    </div>
    </div>
  </Router>
  )
}

export default App
