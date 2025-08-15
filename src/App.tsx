import { GlobeScene } from './components/GlobeScene';
import { InfoPanel } from './components/InfoPanel';
import { TopHeader } from './components/TopHeader';
// import { SearchBox } from './components/SearchBox';
import './App.css';

export default function App() {
  return (
    <div className="layout">
      <TopHeader />
      <GlobeScene />
      <InfoPanel />
    </div>
  );
}
