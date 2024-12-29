import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {List} from './pages/List/list.module';
import {Detail} from './pages/Detail/detail.module';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/show-detail/:imdbID" element={<Detail />} />
      </Routes>
    </Router>
  );
}

export default App;
